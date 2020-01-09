import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Card } from './card.model';
import { Category } from '../category.model';
import { CardService } from './card.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.css']
})

export class CardComponent implements OnInit {
    public isShowAddCard: boolean = false;
    public isEdit: boolean = false;
    inputCardForm: FormGroup;

    @Input('category') category: Category;

    // public cards: Card[] = [
    //     { id: null, title: 'ABC', description: 'fsdf', comment: null, category: '5e1553dde56c011d64344445' },
    //     { id: null, title: 'DEF', description: 'fsdf', comment: null, category: '5e169248da279b1548514067' },
    //     { id: null, title: 'GHI', description: 'fsdf', comment: null, category: '5e169248da279b1548514067' }
    // ];
    public cards: Card[] = [];
    private cardsSub: Subscription;

    getFilteredCard() {
        return this.cards.filter(card => card.category === this.category.id);
    }

    constructor(private cardService: CardService,
                private fb: FormBuilder) {}

    ngOnInit() {
        this.inputCardForm = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(3)]]
        });
        this.cardService.getCards();
        this.cardsSub = this.cardService.getCardUpdateListener().subscribe(data => {
            console.log(data);
        });
    }

    onAddCard() {
        this.isShowAddCard = true;
    }



    onCancelCard() {
        this.isShowAddCard = false;
        this.inputCardForm.reset();
    }

    onCreate(category) {
        this.cardService.addCard(this.inputCardForm.value.title, category);
    }
}
