import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UserService } from '../register/user.service';
import { User } from '../register/user.model';

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router, private userService: UserService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        const user: any = this.authService.decode();

        if (user.role === 'ADMIN') {
            return true;
        }

        this.router.navigate(['/category']);
        return false;
    }

}
