import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root'})

export class PermissionService {

    constructor(private authService: AuthService) {}

    IsAdmin() {
        const user: any = this.authService.decode();

        if (user && user.role === 'ADMIN') {
            return true;
        }
        return false;
    }

    IsMember() {
        const user: any = this.authService.decode();

        if (user && user.role === 'MEMBER') {
            return true;
        }
        return false;
    }

    IsView() {
        const user: any = this.authService.decode();

        if (user && user.role === 'VIEW') {
            return true;
        }
        return false;
    }
}