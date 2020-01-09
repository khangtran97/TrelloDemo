import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Category } from './category.model';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryService {
    categories: Category[] = [];
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

    createCategory(title: string, callback) {
        const categ: Category = {id: null, title: title };
        this.http
        .post<{ message: string, category: Category}>('http://localhost:3000/category', categ)
        .subscribe(responseData => {
            callback();
        });
    }

    getCategUpdateListener() {
        return this.categoriesUpdated.asObservable();
    }

    deleteCategory(categId: string) {
        return this.http
          .delete('http://localhost:3000/category/' + categId);
    }

    updateCategory(Id: string, Title) {
        let categData: Category;
        categData = {
            id: Id,
            title: Title
        };
        this.http
            .put('http://localhost:3000/category/' + Id, categData)
            .subscribe(response => {});
    }
}
