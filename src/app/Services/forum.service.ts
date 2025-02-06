import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, Observable } from 'rxjs';
import { UserModel } from '../Models/User.model';

export interface Thread {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
  newComment?: string;
  showCommentForm?: boolean;
  comments?: Comment[];
  showComments?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  createdAt: Date;
  threadId: string;
  authorEmail?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ForumService {
  constructor(
    private firestore: AngularFirestore,
    public afAuth: AngularFireAuth
  ) {}

  getThreads(): Observable<Thread[]> {
    return this.firestore
      .collection<Thread>('threads')
      .valueChanges({ idField: 'id' });
  }

  createThread(thread: Thread): Promise<void> {
    return this.afAuth.currentUser.then((user) => {
      if (user) {
        const threadId = this.firestore.createId();
        return this.firestore
          .collection('threads')
          .doc(threadId)
          .set({
            ...thread,
            authorId: user.uid,
            createdAt: new Date(),
          });
      }
      return Promise.reject('User not authenticated');
    });
  }

  addComment(threadId: string, comment: Comment): Promise<void> {
    return this.afAuth.currentUser.then((user) => {
      if (user) {
        const commentId = this.firestore.createId();
        return this.firestore
          .collection('threads')
          .doc(threadId)
          .collection('comments')
          .doc(commentId)
          .set({
            ...comment,
            authorId: user.uid,
            createdAt: new Date(),
          });
      }
      return Promise.reject('User not authenticated');
    });
  }

  getComments(threadId: string): Observable<Comment[]> {
    return this.firestore
      .collection('threads')
      .doc(threadId)
      .collection('comments')
      .valueChanges({ idField: 'id' })
      .pipe(
        map((comments: any[]) =>
          comments.map((comment: any) => ({
            id: comment.id,
            content: comment.content,
            authorId: comment.authorId,
            createdAt: comment.createdAt?.toDate() || new Date(),
            threadId: threadId,
          }))
        )
      );
  }

  getUserEmail(uid: string): Observable<UserModel | undefined> {
    return this.firestore
      .collection('users')
      .doc<UserModel>(uid)
      .valueChanges();
  }
}
