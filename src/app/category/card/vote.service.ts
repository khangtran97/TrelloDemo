import { Vote } from './vote.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../category.model';
import { map } from 'rxjs/operators';

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

    addVote(category: Category, cardId: string, userId: string) {
        const vote = { id: null, category: category.id, card: cardId, user: userId };
        this.http
        .post<{message: string, vote: Vote}>('http://localhost:3000/vote', vote)
        .subscribe(responseData => {
        });
    }
}
