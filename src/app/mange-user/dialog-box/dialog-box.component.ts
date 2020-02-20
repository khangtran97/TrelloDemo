import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from 'src/app/register/user.model';
import { UserService } from 'src/app/register/user.service';
import { Role } from 'src/app/register/role.model';

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
    local_data: any;

    constructor(
        public dialogRef: MatDialogRef<DialogBoxComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: User,
        private userService: UserService) {
        this.local_data = { ...data };
        this.action = this.local_data.action;
    }

    selectionChange() {
        this.local_data.role = this.selectedRole.role;
    }

    doAction() {
        this.dialogRef.close({ event: this.action, data: this.local_data });
    }

    closeDialog() {
        this.dialogRef.close({ event: 'Cancel' });
    }

}
