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
    selectedRole: Role;
    roleList: Role[] = [
        {role: ''},
        {role: 'ADMIN'},
        {role: 'MEMBER'},
        {role: 'VIEW'}
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
    }

    selectionChange() {
        this.localData.role = this.selectedRole.role;
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

}
