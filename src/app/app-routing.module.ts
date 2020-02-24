import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { CategoryComponent } from './category/category.component';
import { AuthGuard } from './auth/auth.guard';
import { ManageUserComponent } from './mange-user/mange-user.component';
import { PermissionGuard } from './auth/permission.guard';

const routes: Routes = [
    { path: '', redirectTo: 'register', pathMatch: 'full'},
    { path: 'register', component: RegisterComponent},
    { path: 'login', component: LoginComponent},
    { path: 'category', component: CategoryComponent, canActivate: [AuthGuard]},
    { path: 'manage-user/:id', component: ManageUserComponent, canActivate: [PermissionGuard]}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard, PermissionGuard]
})
export class AppRoutingModule {}
