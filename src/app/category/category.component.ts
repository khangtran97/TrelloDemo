import { Component } from '@angular/core';
import { Category } from './category.model';

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.css']
})
export class CategoryComponent {
    private categories: Category[] = [
        {title: 'To Do'},
        {title: 'Doing'},
        {title: 'Done'}
    ];

}