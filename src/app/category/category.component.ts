import { Component, OnInit } from '@angular/core';
import { Category } from './category.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

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
    private categories: Category[] = [
        {title: 'To Do'},
        {title: 'Doing'},
        {title: 'Done'}
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

    onEditCategory() {
        this.isEdit = true;
    }

    onSubmit() {
        const title1 = this.f.title.value;
        const categ: Category = { title: title1 };
        this.categories.push(categ);
        this.categUpdated.next([...this.categories]);
        this.onCancelCategory();
        console.log(this.categories.length);
    }

    onDelete(categ: Category) {
        this.categories.splice(this.categories.indexOf(categ), 1);
    }
}
