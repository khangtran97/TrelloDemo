import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../register/user.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class LoginService {
    private user: User;

    constructor(private http: HttpClient,
                private router: Router) {}

    validateUser(loginUser: string, loginPass: string) {
        const user: User = ({userName: loginUser, password: loginPass});
        this.http
        .post<{ err: string, user: User}>('http://localhost:3000/login', user)
        .subscribe(
            resonseData => {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('token', resonseData.user.userName);
                this.router.navigate(['/category']);
            },
            (err: HttpErrorResponse) => {
                alert(err.error.message);
        });
    }
}
