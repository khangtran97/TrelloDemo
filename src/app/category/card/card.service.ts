import { Injectable, OnDestroy, OnInit, Input } from '@angular/core';
import { Card } from './card.model';
import { HttpClient } from '@angular/common/http';
import { CategoryService } from '../category.service';
import { Subscription, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category } from '../category.model';
import { Vote } from './vote.model';
import { environment } from '../../../environments/environment';

const BACKEND_URL =  environment.apiUrl + '/card/';


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
            BACKEND_URL
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
        .post<{message: string, card: Card}>(BACKEND_URL, card)
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
            .put(BACKEND_URL + Id, cardData)
            .subscribe(response => {
                callback();
            });
    }

    deleteCard(cardId: string) {
        return this.http
          .delete(BACKEND_URL + cardId);
    }
}
