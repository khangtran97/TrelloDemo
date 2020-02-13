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

    // getVote() {
    //     return this.http.get<{message: string; votes: any}>(
    //         'http://localhost:3000/vote'
    //     )
    //     .pipe(
    //         map(voteData => {
    //             return {
    //                 votes: voteData.votes.map(vote => {
    //                     return {
    //                         id: vote._id,
    //                         category: vote.category,
    //                         card: vote.card,
    //                         user: vote.user
    //                     };
    //                 })
    //             };
    //         })
    //     );
    // }

    // addVote(categoryID: String, cardId: string, userId: string) {
    //     const vote = { id: null, category: categoryID, card: cardId, user: userId };
    //     this.http
    //     .post<{message: string, vote: Vote}>('http://localhost:3000/vote', vote);
    // }

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
}
