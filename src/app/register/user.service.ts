import { User } from './user.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: "root" })
export class UserService {

    constructor(private http: HttpClient,
        private router: Router) { }

    getUserById(userId: string) {
        return this.http.get(`http://localhost:3000/user/${userId}`);
    }

    getUsers() {
        return this.http.get<{ message: string; users: any }>(
            'http://localhost:3000/user'
        )
            .pipe(
                map(userData => {
                    return {
                        users: userData.users.map(user => {
                            return {
                                id: user._id,
                                userName: user.userName,
                                password: user.password,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                address: user.address,
                                role: user.role
                            };
                        })
                    };
                })
            );
    }

    updateUser(user: any) {
        let userData: User;
        userData = {
            id: user.id,
            userName: user.userName,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName,
            address: user.address,
            role: user.role
        };
        return this.http
            .put('http://localhost:3000/user/' + userData.id, userData);
    }

    deleteUser(userId: string) {
        return this.http
            .delete(`http://localhost:3000/user/${userId}`);
    }
}
