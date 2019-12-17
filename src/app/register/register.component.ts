import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { User } from './user.model';
import { RegisterService } from './register.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  // @ViewChild('userNameInput', { static: false }) userNameInputRef: ElementRef;
  // @ViewChild('passwordInput', { static: false }) passwordInputRef: ElementRef;

  constructor(private registerService: RegisterService,
              private fb: FormBuilder) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(15)]]
    });
  }

  onSubmit() {
    // const ingUserName = this.userNameInputRef.nativeElement.vaue;
    // const ingPassword = this.passwordInputRef.nativeElement.vaue;
    // this.registerService.createUser(ingUserName, ingPassword);
    console.log(this.registerForm.value, this.registerForm.valid);
    const username = this.registerForm.controls.username.value;
    const password = this.registerForm.controls.password.value;
    this.registerService.createUser(username, password);
  }
}
