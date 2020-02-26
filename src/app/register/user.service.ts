import { User } from './user.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';


const BACKEND_URL =  environment.apiUrl + '/user/';

@Injectable({ providedIn: 'root' })
export class UserService {

    constructor(private http: HttpClient,
                private router: Router) { }

    getUserById(userId: string) {
        return this.http.get(BACKEND_URL + userId);
    }

    getUsers() {
        return this.http.get<{ message: string; users: any }>(
            BACKEND_URL
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
            .put(BACKEND_URL + userData.id, userData);
    }

    deleteUser(userId: string) {
        return this.http
            .delete(BACKEND_URL + userId);
    }
}
