import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../register/user.model';
import { Router } from '@angular/router';
import { Category } from './category.model';

@Injectable()
export class CategryService {
    private categ: Category[] = [];

    addCateg() {
        
    }
}
