import { Component, OnInit, OnDestroy, OnChanges, ChangeDetectorRef, AfterViewInit, ElementRef } from '@angular/core';
import { Category } from './category.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subject, Subscription, Observable } from 'rxjs';
import { CategoryService } from './category.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { User } from '../register/user.model';
import { UserService } from '../register/user.service';
import { PermissionService } from '../auth/permission.service';
import { MatDialog } from '@angular/material';
import { DialogBoxComponent } from '../mange-user/dialog-box/dialog-box.component';

class ViewCategory implements Category {
    id: string;
    title: string;
    editing: boolean = false;
}

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnDestroy, AfterViewInit {
    userIsAuthenticated = false;
    userId: string;
    userRole: string;
    isLoading = false;
    isAdmin = false;
    isEditUserImage: boolean = false;
    public isEdit: boolean = false;
    public isShowAddList: boolean = false;
    categoriesData: Category[] = [];
    inputCategForm: FormGroup;
    categories: ViewCategory[] = [];
    private categoriesSub: Subscription;
    userInfo: User;


    constructor(private fb: FormBuilder,
                private categService: CategoryService,
                private ref: ChangeDetectorRef,
                private elemetRef: ElementRef,
                private authService: AuthService,
                private userService: UserService,
                private router: Router,
                private perService: PermissionService,
                public dialog: MatDialog) { }

    ngOnInit() {
        this.inputCategForm = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(3)]]
        });
        this.categService.getCategory();
        this.categoriesSub = this.categService.getCategUpdateListener().subscribe(item => {
            const items = item.categories;
            let arrayCategories = [];
            for (let i = 0; i < items.length; i++) {
                arrayCategories.push({ id: items[i].id, title: items[i].title, editing: false });
            }
            this.categories = arrayCategories;
        });
        this.userService.getUserById(localStorage.getItem('userId')).subscribe((user: User) => {
            const { role, userName } = user;
            if (role && role === 'ADMIN') {
                this.isAdmin = true;
            }
            this.userInfo = user;
        });
    }

    openDialog(action, obj, index?) {
        obj.action = action;
        obj.index = index;
        const dialogRef = this.dialog.open(DialogBoxComponent, {
            width: '587px',
            data: obj
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result.event === 'Edit') {
                result.data['id'] = result.data['_id'];
                delete result.data['_id'];
                this.editUser(result.data);
            }
        });
    }

    editUser(editData) {
        this.userService.updateUser(editData).subscribe(() => {
            this.userInfo['id'] = this.userInfo['_id'];
            delete this.userInfo['_id'];
            this.userService.getUserById(this.userInfo.id).subscribe((user: User) => {
                this.userInfo = user;
            });
        });
    }

    ngAfterViewInit() {
        this.elemetRef.nativeElement.ownerDocument.body.style.backgroundColor = 'darkgrey';
    }

    canReadWrite() {
        const isAdmin = this.perService.IsAdmin();
        const isMember = this.perService.IsMember();

        if (isAdmin || isMember) {
            return true;
        }

        return false;
    }

    onAddCategory() {
        this.isShowAddList = true;
    }

    onCancelCategory() {
        this.isShowAddList = false;
        this.inputCategForm.reset();
    }

    onEditingCategory(index) {
        this.categories[index].editing = true;
    }

    onEditCategory(index, newvalue) {
        this.categories[index].title = newvalue;
        this.categories[index].editing = false;
        this.categService.updateCategory(this.categories[index].id, newvalue).subscribe();
    }

    onCreate() {
        this.categService.createCategory(this.inputCategForm.get('title').value).subscribe(() => {
            this.categService.getCategory();
            this.onCancelCategory();
        });
    }

    onDelete(index, categId) {
        this.categories[index].id = categId;
        this.categService.deleteCategory(categId).subscribe(() => {
            this.categService.getCategory();
        });
    }

    logout() {
        this.authService.logout();
    }

    manageUser() {
        this.router.navigate(['/manage-user', localStorage.getItem('userId')]);
    }

    isEditUser() {
        this.isEditUserImage = !this.isEditUserImage;
    }

    ngOnDestroy() {
        this.categoriesSub.unsubscribe();
    }

    drop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
        }
    }
}
