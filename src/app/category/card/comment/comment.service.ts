import { Injectable } from '@angular/core';
import { Card } from '../card.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/register/user.model';

@Injectable({providedIn: 'root'})

export class CommentService {
    private comments: Comment[] = [];
    public commentsUpdated = new Subject<Comment[]>();
    constructor(private http: HttpClient) {}

    getComments() {
        this.http.get<{message: string; comments: any}>(
            'http://localhost:3000/comment'
        )
        .pipe(
            map(commentData => {
                return {
                    comments: commentData.comments.map(comment => {
                        return {
                            id: comment._id,
                            content: comment.content,
                            card: comment.card,
                            user: comment.user
                        };
                    })
                };
            })
        )
        .subscribe(transformCommentData => {
            this.comments = transformCommentData.comments;
            this.commentsUpdated.next(
                [...this.comments]
            );
        });
    }

    getCommentUpdateListener() {
        return this.commentsUpdated.asObservable();
    }

    addComment(value, cardSelected: Card, userId, callback) {
        const comment = { id: null, content: value, card: cardSelected.id, user: userId };
        this.http
        .post<{message: string, comment: Comment}>('http://localhost:3000/comment', comment)
        .subscribe(responseData => {
            callback();
        });
    }

    updateComment(Id: string, Content, card: Card, userId, callback) {
        let commentData: any;
        commentData = {
            id: Id,
            content: Content,
            card: card.id,
            user: userId
        };
        this.http
            .put('http://localhost:3000/comment/' + Id, commentData)
            .subscribe(reponse => {
                callback();
            });
    }

    deleteComment(commentId: string) {
        return this.http
        .delete('http://localhost:3000/comment/' + commentId);
  }
}
