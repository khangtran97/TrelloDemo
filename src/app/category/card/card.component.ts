import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Card } from './card.model';
import { Category } from '../category.model';
import { CardService } from './card.service';
import { Subscription } from 'rxjs';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

class ViewCard implements Card {
    id: string;
    title: string;
    description: string;
    comment: string;
    category: string;
    editing: boolean = false;
}

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.css']
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
                private modalService: NgbModal) {}

    ngOnInit() {
        this.inputCardForm = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(3)]]
        });
        this.inputEditCardForm = this.fb.group({
            textCardEdit: ['', [Validators.required, Validators.minLength(3)]]
        });
        this.cardService.getCards();
        this.cardsSub = this.cardService.getCardUpdateListener().subscribe(data => {
            let arrayCard = [];
            for (let i = 0; i< data.length; i++) {
                arrayCard.push({
                    id: data[i].id,
                    title: data[i].title,
                    description: data[i].description,
                    comment: data[i].comment,
                    category: data[i].category,
                    editing: false
                });
            }
            this.cards = arrayCard.filter(card => card.category === this.category.id);
        });
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
            () => {
                this.cardService.getCards();
            });
    }

    onCreate(category) {
        this.cardService.addCard(
            this.inputCardForm.value.title,
            category,
            () => {
                this.cardService.getCards();
                this.onCancelCard();
            }
        );
    }

    onDeleteCard(index, cardId) {
        this.cards[index].id = cardId;
        this.cardService.deleteCard(cardId).subscribe(() => {
            this.cardService.getCards();
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
        this.cardsSub.unsubscribe();
    }
}
