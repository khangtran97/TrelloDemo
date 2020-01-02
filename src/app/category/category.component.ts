import { Component, OnInit } from '@angular/core';
import { Category } from './category.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

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
    private categUpdated = new Subject<Category[]>();
    inputCategForm: FormGroup;
    private categories: ViewCategory[] = [
        {id: null, title: 'To Do', editing: false},
        {id: null, title: 'Doing', editing: false},
        {id: null, title: 'Done', editing: false}
    ];

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.inputCategForm = this.fb.group({
            title: ['', [Validators.required]]
        });
    }

    get f() { return this.inputCategForm.controls; }

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
        const title1 = this.f.title.value;
        const categ: Category = { id: null, title: title1 };
        this.categories.push({...categ, editing: false});
        this.categUpdated.next([...this.categories]);
        this.onCancelCategory();
    }

    onDelete(categ: Category) {
        this.categories.splice(this.categories.indexOf({...categ, editing: false}), 1);
    }
}
