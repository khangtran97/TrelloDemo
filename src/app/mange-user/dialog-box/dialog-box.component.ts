import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from 'src/app/register/user.model';
import { UserService } from 'src/app/register/user.service';
import { Role } from 'src/app/register/role.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector: 'app-dialog-box',
    templateUrl: './dialog-box.component.html',
    styleUrls: ['./dialog-box.component.scss']
})
export class DialogBoxComponent {
    selectedRole: number;
    roleList: Role[] = [
        {
            id: 0,
            role: ''
        },
        { id: 1, role: 'ADMIN' },
        { id: 2, role: 'MEMBER' },
        { id: 3, role: 'VIEW' }
    ];
    action: string;
    localData: any;
    isAdmin: boolean;

    constructor(
        public dialogRef: MatDialogRef<DialogBoxComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: User,
        private authService: AuthService) {
        this.localData = { ...data };
        this.action = this.localData.action;
        this.selectedRole = this.compareRole().id;
    }

    selectionChange() {
        const roles = this.roleList.find(role => role.id === this.selectedRole);
        this.localData.role = roles.role;
    }

    compareRole() {
        return this.roleList.find(role => role.role === this.localData.role);
    }

    checkIsAdmin() {
        const user: any = this.authService.decode();
        if (user.role === 'ADMIN') {
            return true;
        }
        return false;
    }

    doAction() {
        this.dialogRef.close({ event: this.action, data: this.localData });
    }

    closeDialog() {
        this.dialogRef.close({ event: 'Cancel' });
    }

    compareWithFn(role1: Role, role2: Role) {
        return (!role1 && !role2) || (role1 && role2 && role1.role === role2.role);
    }
}
