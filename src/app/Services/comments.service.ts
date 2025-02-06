import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
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
  
  addComment(comment: string, date: Date): void {
    if (!comment.trim()) return;
  
    this.afAuth.currentUser
      .then((user) => {
        if (user) {
          const commentId = this.client.createId();
          this.client
            .collection('comments')
            .doc(commentId)
            .set({
              text: comment,
              uid: user.uid,
              date: date.toISOString().split('T')[0],
            })
            .then(() => {
              console.log('Komentarz dodany do Firebase');
            })
            .catch((err) => {
              console.error('Błąd podczas dodawania komentarza do Firebase:', err);
            });
        } else {
          console.error('Brak użytkownika');
        }
      })
      .catch((err) => {
        console.error('Błąd podczas pobierania użytkownika:', err);
      });
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
                ref
                  .where('uid', '==', uid)
                  .where('date', '==', dayString) 
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
