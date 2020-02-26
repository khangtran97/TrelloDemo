import { Vote } from './vote.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../category.model';
import { Card } from './card.model';
import { environment } from '../../../environments/environment';

const BACKEND_URL =  environment.apiUrl + '/vote/';

class ViewCard implements Card {
    id: string;
    title: string;
    description: string;
    comment: string;
    category: string;
    user: string;
}

@Injectable({ providedIn: 'root'})

export class VoteCardCommentService {
    votes: Vote[] = [];


    constructor(private http: HttpClient) {}

    addVote(Id: string, Title, category: Category, User: string, callback) {
        let cardData: ViewCard;
        cardData = {
            id: Id,
            title: Title,
            description: null,
            comment: null,
            category: category.id,
            user: User
        };
        this.http
            .post(BACKEND_URL, cardData)
            .subscribe(response => {
                callback();
            });
    }

    deleteVote(Id: string, userId: string) {
        let data: any;
        data = {
            id: Id,
            user: userId
        };
        return this.http
        .put(BACKEND_URL + Id, data);
    }
}
