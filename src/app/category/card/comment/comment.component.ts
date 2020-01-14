import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommentService } from './comment.service';
import { Card } from '../card.model';

@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
    isShowAddComment: boolean = false;
    inputMemberCardForm: FormGroup;

    @Input('cardSelected') card: Card;

    constructor(private commentService: CommentService,
                private fb: FormBuilder) {}

    ngOnInit() {
        this.inputMemberCardForm = this.fb.group({
            textComment: ['', [Validators.required, Validators.minLength(3)]]
        });
    }

    ShowAddComment() {
        this.isShowAddComment = !this.isShowAddComment;
    }

    onAddComment(card) {
        this.commentService.addComment(this.inputMemberCardForm.value.textComment,
                                       card,
                                       localStorage.getItem('userId'),
                                       () => {
                                        console.log('Added');
        });
    }
}
