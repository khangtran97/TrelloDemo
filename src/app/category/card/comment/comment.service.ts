import { Injectable } from '@angular/core';
import { Card } from '../card.model';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})

export class CommentService {
    private comment: Comment[] = [];
    constructor(private http: HttpClient) {}

    addComment(value, cardSelected: Card, userId, callback) {
        const comment = { id: null, content: value, card: cardSelected.id, user: userId };
        this.http
        .post<{message: string, comment: Comment}>('http://localhost:3000/comment', comment)
        .subscribe(responseData => {
            callback();
        });
    }

    deleteComment(commentId: string) {
        return this.http
        .delete('http://localhost:3000/comment/' + commentId);
  }
}
