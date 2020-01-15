import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommentService } from './comment.service';
import { Card } from '../card.model';
import { Subscription } from 'rxjs';
import { Comment } from './comment.model';
import { AuthService } from 'src/app/auth/auth.service';

class ViewComment implements Comment {
    id: string;
    content: string;
    card: string;
    user: string;
    editing: boolean = false;
}

@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
    userIsAuthenticated = false;
    isShowAddComment: boolean = false;
    userId: string;
    inputMemberCardForm: FormGroup;
    public comments: ViewComment[] = [];
    private commentsSub: Subscription;
    private authStatusSub: Subscription;

    @Input('cardSelected') card: Card;

    constructor(private commentService: CommentService,
                private fb: FormBuilder,
                private authService: AuthService) {}

    ngOnInit() {
        this.inputMemberCardForm = this.fb.group({
            textComment: ['', [Validators.required, Validators.minLength(3)]]
        });
        this.commentService.getComments();
        this.commentsSub = this.commentService.getCommentUpdateListener().subscribe((data: any) => {
            let arrayComment = [];
            for (let i = 0; i < data.length; i++) {
                arrayComment.push({
                    id: data[i].id,
                    content: data[i].content,
                    card: data[i].card,
                    user: data[i].user
                });
            }
            this.comments = arrayComment.filter(comment => comment.card === this.card.id);
        });
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
            this.userId = this.authService.getUserId();
        });
    }

    ShowAddComment() {
        this.isShowAddComment = !this.isShowAddComment;
    }

    onAddComment(card) {
        this
        .commentService
        .addComment(this.inputMemberCardForm.value.textComment,
                    card,
                    localStorage.getItem('userId'),
                    () => {
                    this.commentService.getComments();
                    this.inputMemberCardForm.reset();
        });
    }

    onDelete(commentId: string) {
        this.commentService.deleteComment(commentId).subscribe(() => {
            this.commentService.getComments();
        });
    }
}
