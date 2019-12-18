import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from '../register/user.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class LoginService {
    private user: User;
    constructor(private http: HttpClient) {}

    validateUser(loginUser: string, loginPass: string) {
        const user: User = ({ id: null, userName: loginUser, password: loginPass});
        this.http
        .post<{ err: string, user: User, status: string}>('http://localhost:3000/login', user)
        .subscribe(resonseData => {
            if (resonseData.status === 'success') {
                console.log('Login');
            }
        })
    }
}