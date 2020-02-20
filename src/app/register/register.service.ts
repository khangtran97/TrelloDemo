import { User } from './user.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: "root" })
export class RegisterService {
    private users: User[] = [];
    private usersUpdated = new Subject<User[]>();
    constructor(private http: HttpClient,
                private router: Router) {}

    createUser(userName: string, password: string) {
        const user: User = {id: null, userName: userName, password: password, firstName: null, lastName: null, address: null, role: null};
        this.http
        .post<{ message: string}>('http://localhost:3000/register', user)
        .subscribe(responseData => {
            this.users.push(user);
            this.usersUpdated.next([...this.users]);
            alert('Đăng ký thành công!');
            this.router.navigate(['/login']);
        });
    }
}
