import { User } from './user.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: "root" })
export class RegisterService {
    private users: User[] = [];
    private usersUpdated = new Subject<User[]>();
    constructor(private http: HttpClient) {}

    createUser(userName: string, password: string) {
        const user: User = { id: null, userName: userName, password: password };
        this.http
        .post<{ message: string, userId: string}>('http://localhost:3000/register', user)
        .subscribe(responseData => {
            const id = responseData.userId;
            user.id = id;
            this.users.push(user);
            this.usersUpdated.next([...this.users]);
        });
    }
}
