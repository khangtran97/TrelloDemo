import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
  })
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    returnUrl: string;

    constructor(private fb: FormBuilder,
                private loginService: LoginService,
                private router: Router,
                private authService: AuthService) {}

    ngOnInit() {
        this.loginForm = this.fb.group({
        username: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(15)]]
        });
        this.returnUrl = '/dashboard';
        this.authService.logout();
    }

    get f() { return this.loginForm.controls; }

    onSubmit() {
        const username = this.f.username.value;
        const password = this.f.password.value;
        this.loginService.validateUser(username, password);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('token', this.f.username.value);
        this.router.navigate([this.returnUrl]);
    }
}