import { Component, OnInit } from '@angular/core';
import { User } from './user.model';
import { RegisterService } from './register.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private registerService: RegisterService,
              private fb: FormBuilder,
              private authService: AuthService) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    const username = this.registerForm.controls.username.value;
    const password = this.registerForm.controls.password.value;
    this.authService.createUser(username, password);
  }
}
