import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material';
import { AutosizeModule } from 'ngx-autosize';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
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
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
    AutosizeModule,
    NgbModule,
    AppRoutingModule,
    NgxSpinnerModule,
    MatProgressSpinnerModule,
  ],
  providers: [LoaderService,
              {provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true},
              {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
              AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
