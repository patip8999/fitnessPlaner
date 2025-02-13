import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { catchError, from, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  public client: AngularFirestore = inject(AngularFirestore);
  private afAuth: AngularFireAuth = inject(AngularFireAuth);
  getComments(): Observable<any[]> {
    return new Observable<any[]>((observer) => {
      this.afAuth.currentUser
        .then((user) => {
          const uid = user?.uid;
          if (uid) {
            this.client
              .collection('comments', (ref) => ref.where('uid', '==', uid))
              .valueChanges()
              .subscribe((comments) => {
                console.log('Pobrane komentarze:', comments);
                observer.next(comments);
              });
          } else {
            observer.next([]);
          }
        })
        .catch((err) => {
          console.error('Błąd podczas pobierania komentarzy:', err);
          observer.next([]);
        });
    });
  }

  addComment(comment: string, date: Date): Observable<void> {
    if (!comment.trim()) return of();

    return from(this.afAuth.currentUser).pipe(
      switchMap((user) => {
        if (user) {
          const commentId = this.client.createId();
          return from(
            this.client
              .collection('comments')
              .doc(commentId)
              .set({
                text: comment,
                uid: user.uid,
                date: date.toISOString().split('T')[0],
              })
          );
        } else {
          throw new Error('Brak użytkownika');
        }
      }),
      catchError((err) => {
        console.error('Błąd podczas dodawania komentarza:', err);
        throw err;
      })
    );
  }

  getCommentsForDay(day: Date): Observable<any[]> {
    return new Observable<any[]>((observer) => {
      this.afAuth.currentUser
        .then((user) => {
          const uid = user?.uid;
          if (uid) {
            const dayString = day.toISOString().split('T')[0];

            this.client
              .collection('comments', (ref) =>
                ref.where('uid', '==', uid).where('date', '==', dayString)
              )
              .valueChanges()
              .subscribe((comments) => {
                console.log('Pobrane komentarze:', comments);
                observer.next(comments);
              });
          } else {
            observer.next([]);
          }
        })
        .catch((err) => {
          console.error('Błąd podczas pobierania komentarzy:', err);
          observer.next([]);
        });
    });
  }
}
