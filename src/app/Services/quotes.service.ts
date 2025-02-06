import { inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

export interface QuoteModel {
  readonly name: string;
}
@Injectable({
  providedIn: 'root',
})
export class QuotesService {
  client: AngularFirestore = inject(AngularFirestore);

  getQuotes(): Observable<QuoteModel[]> {
    return this.client.collection<QuoteModel>('quotes').valueChanges();
  }
}
