import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Category } from './category.model';
import { Subject } from 'rxjs';
import { HttpConnector } from '../http-connector';
import { environment } from '../../environments/environment';

const BACKEND_URL =  environment.apiUrl + '/category/';

@Injectable({ providedIn: 'root' })
export class CategoryService {
    categories: Category[] = [];
    public categoriesUpdated = new Subject<{ categories: Category[] }>();

    constructor( private http: HttpClient) {}

    getCategory() {

        this.http.get<{message: string; categories: any}>(
            BACKEND_URL
        )
        .pipe(
            map((data: any) => {
                return {
                    categories: data.categories.map(categ => {
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
        return this.http
        .post<{ message: string, category: Category}>(BACKEND_URL, categ);
    }

    getCategUpdateListener() {
        return this.categoriesUpdated.asObservable();
    }

    deleteCategory(categId: string) {
        return this.http
          .delete(BACKEND_URL + categId);
    }

    updateCategory(Id: string, Title) {
        let categData: Category;
        categData = {
            id: Id,
            title: Title
        };
        return this.http
            .put(BACKEND_URL + Id, categData);
    }
}
