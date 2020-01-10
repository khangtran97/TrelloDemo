import { Injectable, OnDestroy, OnInit, Input } from '@angular/core';
import { Card } from './card.model';
import { HttpClient } from '@angular/common/http';
import { CategoryService } from '../category.service';
import { Subscription, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category } from '../category.model';

@Injectable({ providedIn: 'root'})

export class CardService {
    // public category: Category[];
    // @Input('category') category: Category;
    cards: Card[] = [];
    public cardsUpdated = new Subject<Card[]>();
    private categoriesSub: Subscription;

    constructor(private http: HttpClient,
                private categService: CategoryService) {
                    // this.categService.getCategory();
                    // this.categoriesSub =  this.categService.getCategUpdateListener().subscribe(item => {
                    //     this.category = [...item.categories];
                    // });
                }

    getCards() {
        this.http.get<{message: string; cards: any}>(
            'http://localhost:3000/card'
        )
        .pipe(
            map(cardData => {
                return {
                    cards: cardData.cards.map(card => {
                        return {
                            id: card._id,
                            title: card.title,
                            description: card.description,
                            comment: card.comment,
                            category: card.category
                        };
                    })
                };
            })
        )
        .subscribe(transformCardData => {
            this.cards = transformCardData.cards;
            this.cardsUpdated.next(
                [...this.cards]
            );
        });
    }

    getCardUpdateListener() {
        return this.cardsUpdated.asObservable();
    }

    addCard(title: string, categorySelected: Category, callback) {
        const card = { id: null, title: title, message: null, commnent: null, category: categorySelected.id };
        this.http
        .post<{message: string, card: Card}>('http://localhost:3000/card', card)
        .subscribe(responseData => {
            callback();
        });
    }

    updateCard(Id: string, Title, category: Category) {
        let cardData: Card;
        cardData = {
            id: Id,
            title: Title,
            description: null,
            comment: null,
            category: category.id
        };
        this.http
            .put('http://localhost:3000/card/' + Id, cardData)
            .subscribe(response => {});
    }

    deleteCard(cardId: string) {
        return this.http
          .delete('http://localhost:3000/card/' + cardId);
    }
}
