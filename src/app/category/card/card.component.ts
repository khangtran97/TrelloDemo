import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Card } from './card.model';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.css']
})

export class CardComponent implements OnInit {
    public isShowAddCard: boolean = false;
    public isEdit: boolean = false;
    inputCardForm: FormGroup;
    private cards: Card[] = [
        {id: null, title: 'ABC', description: 'fsdf', comment: null, category: null},
        {id: null, title: 'DEF', description: 'fsdf', comment: null, category: null},
        {id: null, title: 'GHI', description: 'fsdf', comment: null, category: null}
    ]
    onAddCard() {
        this.isShowAddCard = true;
    }

    onCancelCard() {
        this.isShowAddCard = false;
        this.inputCardForm.reset();
    }

    onMouseEnter() {
        this.isEdit = true;
    }

    onCreate() {}

    ngOnInit() {}
}