import { Injectable } from '@angular/core';
import { Card } from '../card.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

const BACKEND_URL =  environment.apiUrl + '/comment/';

@Injectable({providedIn: 'root'})

export class CommentService {
    private comments: Comment[] = [];
    public commentsUpdated = new Subject<Comment[]>();
    constructor(private http: HttpClient) {}

    getComments() {
        return this.http.get<{message: string; comments: any}>(
            BACKEND_URL
        )
        .pipe(
            map(commentData => {
                return {
                    comments: commentData.comments.map(comment => {
                        return {
                            id: comment._id,
                            content: comment.content,
                            creator: comment.creator,
                            card: comment.card,
                            user: comment.user,
                            like: comment.likes
                        };
                    })
                };
            })
        );
    }

    getCommentUpdateListener() {
        return this.commentsUpdated.asObservable();
    }

    addComment(value, Creator, cardSelected: Card, userId, callback) {
        const comment = { id: null, content: value, creator: Creator, card: cardSelected.id, user: userId };
        this.http
        .post<{message: string, comment: Comment}>(BACKEND_URL, comment)
        .subscribe(responseData => {
            callback();
        });
    }

    updateComment(Id: string, Content, Creator, card: Card, userId) {
        let commentData: any;
        commentData = {
            id: Id,
            content: Content,
            creator: Creator,
            card: card.id,
            user: userId
        };
        return this.http
            .put(BACKEND_URL + Id, commentData);
    }

    deleteComment(commentId: string) {
        return this.http
        .delete(BACKEND_URL + commentId);
    }
}
