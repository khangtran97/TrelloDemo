import { Component, OnInit } from '@angular/core';
import { Category } from './category.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { CategoryService } from './category.service';

class ViewCategory implements Category{
    id: string;
    title: string;
    editing: boolean = false;
}

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit{
    public isEdit: boolean = false;
    public isShow: boolean = false;
    categoriesData: Category[] = [];
    private categUpdated = new Subject<Category[]>();
    inputCategForm: FormGroup;
    private categories: ViewCategory[] = [];
    // private categories: ViewCategory[] = [
    //     {id: null, title: 'To Do', editing: false},
    //     {id: null, title: 'Doing', editing: false},
    //     {id: null, title: 'Done', editing: false}
    // ];

    constructor(private fb: FormBuilder,
                private categService: CategoryService) {}

    // constructor(private categService: CategoryService) {}

    ngOnInit() {
        this.inputCategForm = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(3)]]
        });
        let category: Category;
        this.categService.getCategory();
        this.categService.categoriesUpdated.subscribe(item => {
            const items = item.categories;
            for (let i = 0; i < items.length; i++) {
                category = { id: items[i].id, title: items[i].title };
                this.categories.push({ ...category, editing: false });
            }
        });
        console.log(this.categories);
    }

    onAddCategory() {
        this.isShow = true;
    }

    onCancelCategory() {
        this.isShow = false;
        this.inputCategForm.reset();
    }

    onEditingCategory(index) {
        this.categories[index].editing = true;
        // this.isEdit = true;
    }

    onEditCategory(index, newvalue) {
        this.categories[index].title = newvalue;
        this.categories[index].editing = false;
    }

    onCreate() {
        // const title1 = this.f.title.value;
        // const categ: Category = { id: null, title: title1 };
        // this.categories.push({...categ, editing: false});
        // this.categUpdated.next([...this.categories]);
        this.categService.createCategory(
            this.inputCategForm.get('title').value
        );
        this.onCancelCategory();
    }

    onDelete(categId: string) {
        this.categService.deleteCategory(categId);
    }
}
