import { Injectable, OnDestroy, OnInit, Input } from '@angular/core';
import { Card } from './card.model';
import { HttpClient } from '@angular/common/http';
import { CategoryService } from '../category.service';
import { Subscription, Subject, BehaviorSubject, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Category } from '../category.model';
import { Vote } from './vote.model';

// class ViewCard implements Card {
//     id: string;
//     title: string;
//     description: string;
//     comment: string;
//     category: string;
//     votes: Vote;
// }

@Injectable({ providedIn: 'root'})

export class CardService {
    cards: Card[] = [];
    votes: Vote[] = [];
    public cardsUpdated = new Subject<Card[]>();
    private categoriesSub: Subscription;

    constructor(private http: HttpClient,
                private categService: CategoryService) {}

    getCards() {
        return this.http.get<{message: string; cards: any}>(
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
                            category: card.category,
                            vote: card.votes
                        };
                    })
                };
            })
        );
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

    updateCard(Id: string, Title, category: Category, User: string, callback) {
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
            .subscribe(response => {
                callback();
            });
    }

    deleteCard(cardId: string) {
        return this.http
          .delete('http://localhost:3000/card/' + cardId);
    }
}
