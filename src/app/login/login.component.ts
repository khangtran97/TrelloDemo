import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
  })
export class LoginComponent implements OnInit, AfterViewInit {
    loginForm: FormGroup;
    returnUrl: string;

    constructor(private fb: FormBuilder,
                private router: Router,
                private authService: AuthService,
                private elemetRef: ElementRef) {}

    ngOnInit() {
        this.loginForm = this.fb.group({
        username: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(10)]]
        });
        // this.returnUrl = '/dashboard';
        // this.authService.logout();
    }

    get f() { return this.loginForm.controls; }

    onSubmit() {
        const username = this.f.username.value;
        const password = this.f.password.value;
        this.authService.login(username, password);
    }

    ngAfterViewInit() {
        this.elemetRef.nativeElement.ownerDocument.body.style.backgroundColor = 'white';
    }
}
