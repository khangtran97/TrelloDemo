import { Component, OnInit, OnDestroy, OnChanges, ChangeDetectorRef } from '@angular/core';
import { Category } from './category.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { CategoryService } from './category.service';

class ViewCategory implements Category {
    id: string;
    title: string;
    editing: boolean = false;
}

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit, OnDestroy, OnChanges {
    public isEdit: boolean = false;
    public isShowAddList: boolean = false;
    categoriesData: Category[] = [];
    private categUpdated = new Subject<Category[]>();
    inputCategForm: FormGroup;
    private categories: ViewCategory[] = [];
    private categoriesSub: Subscription;


    constructor(private fb: FormBuilder,
                private categService: CategoryService,
                private ref: ChangeDetectorRef) {}

    ngOnInit() {
        this.inputCategForm = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(3)]]
        });
        this.categService.getCategory();
        this.categoriesSub = this.categService.getPostUpdateListener().subscribe(item => {
            const items = item.categories;
            let arrayCategories = [];
            for (let i = 0; i < items.length; i++) {
                arrayCategories.push({ id: items[i].id, title: items[i].title, editing: false });
            }
            this.categories = arrayCategories;
            this.ref.detectChanges();
        });
    }

    ngOnChanges() {

    }

    onAddCategory() {
        this.isShowAddList = true;
    }

    onCancelCategory() {
        this.isShowAddList = false;
        this.inputCategForm.reset();
    }

    onEditingCategory(index) {
        this.categories[index].editing = true;
    }

    onEditCategory(index, newvalue) {
        this.categories[index].title = newvalue;
        this.categories[index].editing = false;
        this.categService.updateCategory(this.categories[index].id, newvalue);
    }

    onCreate() {
        this.categService.createCategory(
            this.inputCategForm.get('title').value,
            () => {
                this.categService.getCategory();
                this.onCancelCategory();
            });
    }

    onDelete(index, categId) {
        this.categories[index].id = categId;
        this.categService.deleteCategory(categId).subscribe(() => {
            this.categService.getCategory();
        });
    }

    ngOnDestroy() {
        this.categoriesSub.unsubscribe();
    }
}
