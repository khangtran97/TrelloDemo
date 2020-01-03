import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../register/user.model';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Category } from './category.model';
import { Observable, of } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryService {
    categories: Category[] = [];
    // private categoriesUpdated = new Subject<Category[]>();
    public categoriesUpdated = new Subject<{ categories: Category[] }>();

    constructor(private http: HttpClient) {}

    getCategory() {
        this.http.get<{message: string; categories: any}>(
            'http://localhost:3000/category'
        )
        .pipe(
            map(categoryData => {
                return {
                    categories: categoryData.categories.map(categ => {
                        return {
                            id: categ._id,
                            title: categ.title
                        };
                    })
                };
            })
        )
        .subscribe(transformCategData => {
            this.categories = transformCategData.categories;
            this.categoriesUpdated.next({
                categories: [...this.categories]
            });
        });
    }

    createCategory(title: string) {
        const categ: Category = {id: null, title: title };
        this.http
        .post<{ message: string, category: Category}>('http://localhost:3000/category', categ)
        .subscribe(responseData => {
            alert('Thêm thành công!');
        });
    }

    deleteCategory(categId: string) {
        return this.http
          .delete('http://localhost:3000/category/' + categId);
    }
}
