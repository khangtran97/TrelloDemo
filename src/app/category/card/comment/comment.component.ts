import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommentService } from './comment.service';
import { Card } from '../card.model';
import { Subscription } from 'rxjs';
import { Comment } from './comment.model';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/register/user.model';

class ViewComment implements Comment {
    id: string;
    content: string;
    creator: string;
    card: string;
    user: string;
    editing: boolean = false;
}

@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit, OnDestroy {
    userIsAuthenticated = false;
    isShowAddComment: boolean = false;
    userId: string;
    userName: string;
    inputMemberCardForm: FormGroup;
    inputEditCommentForm: FormGroup;
    public comments: ViewComment[] = [];
    private commentsSub: Subscription;
    private authStatusSub: Subscription;
    private usernameSub: Subscription;

    @Input('cardSelected') card: Card;

    constructor(private commentService: CommentService,
                private fb: FormBuilder,
                private authService: AuthService) {}

    ngOnInit() {
        this.inputMemberCardForm = this.fb.group({
            textComment: ['', [Validators.required, Validators.minLength(3)]]
        });
        this.inputEditCommentForm = this.fb.group({
            textCommentEdit: ['', [Validators.required, Validators.minLength(3)]]
        })
        this.commentService.getComments();
        this.commentsSub = this.commentService.getCommentUpdateListener().subscribe((data: any) => {
            let arrayComment = [];
            for (let i = 0; i < data.length; i++) {
                arrayComment.push({
                    id: data[i].id,
                    content: data[i].content,
                    creator: data[i].creator,
                    card: data[i].card,
                    user: data[i].user,
                    editing: false
                });
            }
            this.comments = arrayComment.filter(comment => comment.card === this.card.id);
        });
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.userId = this.authService.getUserId();
        // this.userName = localStorage.getItem('userName');

        // this.authService.getUserNameById(this.userId);
        // this.usernameSub = this.authService.getUsernameUpdateListener().subscribe(users => {
        //     const user = users;
        // });
    }

    ShowAddComment() {
        this.isShowAddComment = !this.isShowAddComment;
    }

    onAddComment(card) {
        this
        .commentService
        .addComment(this.inputMemberCardForm.value.textComment,
                    localStorage.getItem('userName'),
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

    onCancelEditComment(index) {
        this.comments[index].editing = false;
        this.inputEditCommentForm.reset();
    }

    onEditingComment(index) {
        this.comments[index].editing = true;
    }

    onEditComment(index, card: Card) {
        this.comments[index].editing = false;
        this.commentService.updateComment(
            this.comments[index].id,
            this.inputEditCommentForm.get('textCommentEdit').value,
            localStorage.getItem('userName'),
            card,
            this.userId,
            () => {
                this.commentService.getComments();
            });
    }

    ngOnDestroy() {
        this.commentsSub.unsubscribe();
    }
}
