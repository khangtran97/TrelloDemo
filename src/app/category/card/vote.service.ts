import { Vote } from './vote.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../category.model';
import { map } from 'rxjs/operators';
import { Card } from './card.model';

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
            .post('http://localhost:3000/vote', cardData)
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
        .put('http://localhost:3000/vote/' + Id, data);
    }
}
