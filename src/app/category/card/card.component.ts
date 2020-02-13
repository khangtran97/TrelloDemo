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
        private voteCardService: VoteCardCommentService) { }

    ngOnInit() {
        this.inputCardForm = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(3)]]
        });
        this.inputEditCardForm = this.fb.group({
            textCardEdit: ['', [Validators.required, Validators.minLength(3)]]
        });

        this.filterCards();
        // console.log(this.voteCardService.getVote().subscribe(data => {}));
        // this.voteCardService.getVote().subscribe(data => {
        //     const arrayVotes = data.votes;
        //     console.log(arrayVotes);
        //     for(let i = 0; i < this.cards.length; i++) {
        //         this.votes = arrayVotes.filter(vote => vote.card === this.cards[i].id);

        //     }
        // });
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

    voteCard(index, cardId, categoryId) {
        console.log(this.cards);
        const cards = this.cards;
        let voted = false;
        if (cards[index].votes) {
            cards[index].votes.map(vote => {
                if(vote.user === localStorage.getItem('userId'))
            })
        }
        for(let i = 0; i < cards.length; i++) {
            if (cards[i].votes) {
                cards[i].votes.map(vote => {
                    if (vote.user === localStorage.getItem('userId')) {
                        voted = true;
                    } else {
                        voted = false;
                    }
                });
            }
        }
        console.log(voted);
        // this.voteCardService.addVote(
        //     cardId,
        //     this.cards[index].title,
        //     categoryId,
        //     localStorage.getItem('userId'),
        //     () => {
        //         this.filterCards();
        //     });
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
