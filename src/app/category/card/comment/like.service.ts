import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Comment } from './comment.model';
import { environment } from '../../../../environments/environment';

const BACKEND_URL =  environment.apiUrl + '/like/';

class ViewComment implements Comment {
    id: string;
    content: string;
    card: string;
    creator: string;
    user: string;
}

@Injectable({ providedIn: 'root'})

export class LikeCommentService {
    constructor(private http: HttpClient) {}

    addLike(Id: string, Content: string, Creator, cardId: string, User: string, callback) {
        let commentData: ViewComment;
        commentData = {
            id: Id,
            content: Content,
            card: cardId,
            creator: Creator,
            user: User
        };
        this.http
            .post(BACKEND_URL, commentData)
            .subscribe(response => {
                callback();
            });
    }

    deleteLike(Id: string, userId: string) {
        let data: any;
        data = {
            id: Id,
            user: userId
        };
        return this.http
        .put(BACKEND_URL + Id, data);
    }
}
