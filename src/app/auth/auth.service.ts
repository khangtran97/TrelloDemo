import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../register/user.model';
import { Subject, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root'})
export class AuthService {
    private isAuthenticated = false;
    private token: string;
    authStautusListener = new Subject<boolean>();
    userNameListener = new Subject<string>();
    private tokenTimer: any;
    private userId: string;
    private userName: string;
    // public role =  new BehaviorSubject<string>('');
    role: string;

    constructor(private http: HttpClient, private router: Router) {}

    createUser(email: string, password: string) {
      const authData: User = {id: null, userName: email, password: password, firstName: '', lastName: '', address: '', role: ''};
      this.http.post('http://localhost:3000/register', authData)
          .subscribe(response => {
            //   console.log(response);
          });
    }

    getToken() {
        return this.token;
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    getUserId() {
        return this.userId;
    }

    getUserName() {
        return this.userName;
    }

    getAuthStatusListener() {
        return this.authStautusListener.asObservable();
    }

    login(email: string, password: string) {
        const authData: User = {id: null, userName: email, password: password, firstName: null, lastName: null, address: null, role: null};
        this.http.post<{
            token: string,
            expiresIn: number,
            userId: string,
            userName: string,
            role: string}>('http://localhost:3000/login', authData)
            .subscribe(response => {
                const token = response.token;
                this.token = token;
                if (token) {
                    const expiresInduration = response.expiresIn;
                    this.setAuthTimer(expiresInduration);
                    this.isAuthenticated = true;
                    this.userId = response.userId;
                    this.userName = response.userName;
                    // this.role.next(response.role);
                    this.role = response.role;
                    this.authStautusListener.next(true);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresInduration * 1000);
                    this.saveAuthData(token, expirationDate, this.userId, this.userName);
                    this.router.navigate(['/category']);
                }
            });
    }

    autoAuthUser() {
        const authInformation = this.getAuthData();
        if (!authInformation) {
            return;
        }
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        if (expiresIn > 0) {
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.userId = authInformation.userId;
            this.setAuthTimer(expiresIn / 1000);
            this.authStautusListener.next(true);
        }
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStautusListener.next(false);
        this.userId = null;
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/login']);
    }

    getUserNameById(id) {
        this.http.get<{ message: string, user: User}>('http://localhost:3000/login/' + id).subscribe(userData => {
            this.userName = userData.user.userName;
            this.userNameListener.next(this.userName);
        });
    }

    getUsernameUpdateListener() {
        return this.userNameListener.asObservable();
    }

    private setAuthTimer(duration: number) {
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string, userName: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userId', userId);
        localStorage.setItem('userName', userName);
    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
    }

    private getAuthData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const userId = localStorage.getItem('userId');
        if (!token || !expirationDate) {
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate),
            userId: userId
        };
    }
}
