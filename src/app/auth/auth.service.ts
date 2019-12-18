import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })

export class AuthService {
  constructor() {}

  logout(): void {
      localStorage.setItem('isLoggedIn', 'false');
      localStorage.removeItem('token');
  }
}
