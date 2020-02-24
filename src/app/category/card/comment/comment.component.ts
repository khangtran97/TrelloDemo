import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommentService } from './comment.service';
import { Card } from '../card.model';
import { Subscription } from 'rxjs';
import { Comment } from './comment.model';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/register/user.model';
import { LikeCommentService } from './like.service';
import { Like } from './like.model';
import { PermissionService } from 'src/app/auth/permission.service';

class ViewComment implements Comment {
    id: string;
    content: string;
    creator: string;
    card: string;
    user: string;
    username: string;
    likes: Like[];
    editing: boolean = false;
}

@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.scss']
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
                private authService: AuthService,
                private likeService: LikeCommentService,
                private perService: PermissionService) {}

    ngOnInit() {
        this.inputMemberCardForm = this.fb.group({
            textComment: ['', [Validators.required, Validators.minLength(3)]]
        });
        this.inputEditCommentForm = this.fb.group({
            textCommentEdit: ['', [Validators.required, Validators.minLength(3)]]
        });
        this.filterComment();
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.userId = this.authService.getUserId();
    }

    filterComment() {
        this.commentService.getComments().subscribe((data) => {
            const arrayComment = [];
            let comments = data.comments;
            for (let i = 0; i < comments.length; i++) {
                arrayComment.push({
                    id: comments[i].id,
                    content: comments[i].content,
                    creator: comments[i].creator,
                    card: comments[i].card,
                    user: comments[i].user,
                    likes: comments[i].like,
                    editing: false
                });
            }
            this.comments = arrayComment.filter(comment => comment.card === this.card.id);
        });
    }

    canReadWrite() {
        const isAdmin = this.perService.IsAdmin();
        const isMember = this.perService.IsMember();

        if (isAdmin || isMember) {
            return true;
        }

        return false;
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
                    this.filterComment();
                    this.inputMemberCardForm.reset();
        });
    }

    likeComment(index, cardId, commentId) {
        const commentSelected = this.comments[index].likes;
        const currentUser = localStorage.getItem('userId');
        let checkLiked = true;
        if (typeof commentSelected !== 'undefined' && commentSelected.length > 0) {
            for (let i = 0; i < commentSelected.length; i++) {
                if (commentSelected[i].user === currentUser) {
                    checkLiked = false;
                    this.likeService.deleteLike(commentId, currentUser).subscribe(() => {
                        this.filterComment();
                    });
                    return;
                }
            }
        }

        if (checkLiked) {
            this.likeService.addLike(
                commentId,
                this.comments[index].content,
                this.comments[index].creator,
                cardId,
                localStorage.getItem('userId'),
                () => {
                    this.filterComment();
                });
        }
    }

    onDelete(commentId: string) {
        this.commentService.deleteComment(commentId).subscribe(() => {
            this.filterComment();
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
    }
}
