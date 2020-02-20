import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AutosizeModule } from 'ngx-autosize';
import {
  MatProgressSpinnerModule,
  MatButtonModule,
  MatCardModule,
  MatSelectModule,
  MatIconModule,
  MatMenuModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatCheckboxModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule
} from '@angular/material';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MaterialModule } from './material.module';
import { NgxSpinnerModule } from 'ngx-spinner';
// import { AuthGuardService as AuthGuard} from './auth/auth-guard.service';
import { AuthGuard } from './auth/auth.guard';
import { CategoryComponent } from './category/category.component';
import { HomeComponent } from './test/test.component';
import { CardComponent } from './category/card/card.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommentComponent } from './category/card/comment/comment.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './auth/auth.service';
import { LoaderComponent } from './loader/loader.component';
import { LoaderService } from './loader/loader.service';
import { LoaderInterceptor } from './loader/loader.interceptor';
import { ManageUserComponent } from './mange-user/mange-user.component';
import { DialogBoxComponent } from './mange-user/dialog-box/dialog-box.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    CategoryComponent,
    CardComponent,
    HomeComponent,
    CommentComponent,
    LoaderComponent,
    ManageUserComponent,
    DialogBoxComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AutosizeModule,
    NgbModule,
    AppRoutingModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    DragDropModule,
    MaterialModule,
    NgxSpinnerModule,
    MatCheckboxModule
  ],
  entryComponents: [
    DialogBoxComponent
  ],
  providers: [LoaderService,
              {provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true},
              {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
              AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
