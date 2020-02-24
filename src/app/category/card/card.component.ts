import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Card } from './card.model';
import { Category } from '../category.model';
import { CardService } from './card.service';
import { Subscription } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth/auth.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { VoteCardCommentService } from './vote.service';
import { Vote } from './vote.model';
import { filter } from 'rxjs/operators';
import { PermissionService } from 'src/app/auth/permission.service';

class ViewCard implements Card {
    id: string;
    title: string;
    description: string;
    comment: string;
    category: string;
    votes: Vote[];
    editing: boolean = false;
}

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss']
})

export class CardComponent implements OnInit, OnDestroy {
    public isShowAddCard: boolean = false;
    public isEditCard: boolean = false;
    inputCardForm: FormGroup;
    inputEditCardForm: FormGroup;
    isShowEditDelete: boolean = false;
    isShowAddComment: boolean = false;
    inputMemberCardForm: FormGroup;
    public cards: ViewCard[] = [];
    private cardsSub: Subscription;
    cardsByCategoryID: Card[];

    @Input('category') category: Category;

    constructor(private cardService: CardService,
                private fb: FormBuilder,
                private modalService: NgbModal,
                private authService: AuthService,
                private voteCardService: VoteCardCommentService,
                private perService: PermissionService) { }

    ngOnInit() {
        this.inputCardForm = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(3)]]
        });
        this.inputEditCardForm = this.fb.group({
            textCardEdit: ['', [Validators.required, Validators.minLength(3)]]
        });

        this.filterCards();
    }

    filterCards() {
        this.cardService.getCards().subscribe((data) => {
            const cards = data.cards;
            const arrayCard = [];
            for (let i = 0; i < cards.length; i++) {
                arrayCard.push({
                    id: cards[i].id,
                    title: cards[i].title,
                    description: cards[i].description,
                    comment: cards[i].comment,
                    category: cards[i].category,
                    votes: cards[i].vote,
                    editing: false
                });
            }
            this.cards = arrayCard.filter(card => card.category === this.category.id);
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

    voteCard(index, cardId, categoryId) {
        const voteSelected = this.cards[index].votes;
        const currentUser = localStorage.getItem('userId');
        let checkVoted = true;
        if (typeof voteSelected !== 'undefined' && voteSelected.length > 0) {
            for (let i = 0; i < voteSelected.length; i++) {
                if (voteSelected[i].user === currentUser) {
                    checkVoted = false;
                    this.voteCardService.deleteVote(cardId, currentUser).subscribe(() => {
                        this.filterCards();
                    });
                    return;
                }
            }
        }

        if (checkVoted) {
            this.voteCardService.addVote(
                cardId,
                this.cards[index].title,
                categoryId,
                currentUser,
                () => {
                    this.filterCards();
                });
        }
    }

    onAddCard() {
        this.isShowAddCard = true;
    }

    onCancelCard() {
        this.isShowAddCard = false;
        this.inputCardForm.reset();
    }

    onCancelEditCard(index) {
        this.cards[index].editing = false;
        this.inputEditCardForm.reset();
    }

    onEditingCard(index) {
        this.cards[index].editing = true;
    }

    onEditCard(index, category: Category) {
        this.cards[index].editing = false;
        this.cardService.updateCard(
            this.cards[index].id,
            this.inputEditCardForm.get('textCardEdit').value,
            category,
            null,
            () => {
                this.filterCards();
            });
    }

    onCreate(category) {
        this.cardService.addCard(
            this.inputCardForm.value.title,
            category,
            () => {
                this.filterCards();
                this.onCancelCard();
            }
        );
    }

    onDeleteCard(index, cardId) {
        this.cards[index].id = cardId;
        this.cardService.deleteCard(cardId).subscribe(() => {
            this.filterCards();
        },
            (err) => console.log(err));
    }

    openLg(content) {
        this.modalService.open(content, { size: 'lg' }).result.then(
            (result) => {
                this.isShowAddComment = this.closeModal(result);
            }, (reason) => {
                this.isShowAddComment = this.closeModal(reason);
            }
        );
    }

    private closeModal(reason: any): boolean {
        if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return false;
        } else if (reason === ModalDismissReasons.ESC) {
            return false;
        }
    }

    ngOnDestroy() {
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.cards, event.previousIndex, event.currentIndex);
    }
}
