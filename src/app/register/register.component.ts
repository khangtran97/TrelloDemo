import { Component } from '@angular/core';
import { User } from './user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent {
  private user: User;
  registerAcc() {
    console.log(this.email);
    console.log(this.password);
  }
}
