import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HttpConnector {
    constructor(private http: HttpClient) { }

    get<T>(url: string, option?: any) {
        return this.http.get(url);
    }

    post<T>(url: string, option?: any) {
        return this.http.post(url, option);
    }

    delete(url: string, option?: any) {
        return this.http.delete(url, option);
    }

    put<T>(url: string, option?: any) {
        return this.http.put(url, option);
    }
}
