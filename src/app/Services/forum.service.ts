import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { catchError, map, Observable } from 'rxjs';
import { of } from 'rxjs';
import { UserModel } from '../Models/User.model';

export interface Thread {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
  newComment?: string; // For user to input new comment
  showCommentForm?: boolean; // To toggle the comment form visibility
  comments?: Comment[];
  showComments?: boolean;  // Add comments property to store comments related to the thread
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

  // Load threads from Firestore
  getThreads(): Observable<Thread[]> {
    return this.firestore.collection<Thread>('threads').valueChanges({ idField: 'id' });
  }

  // Create a new thread
  createThread(thread: Thread): Promise<void> {
    return this.afAuth.currentUser.then(user => {
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
    return this.afAuth.currentUser.then(user => {
      if (user) {
        const commentId = this.firestore.createId(); // Generate a new ID for the comment
        return this.firestore
          .collection('threads') // Access threads collection
          .doc(threadId) // Find the thread by threadId
          .collection('comments') // Access comments subcollection
          .doc(commentId) // Use the generated commentId for the document
          .set({
            ...comment, // Store the comment data
            authorId: user.uid,
            createdAt: new Date(), // Set the creation timestamp
          });
      }
      return Promise.reject('User not authenticated');
    });
  }
  // Fetch all comments for a thread
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
            authorId: comment.authorId, // Pobierz authorId
            createdAt: comment.createdAt?.toDate() || new Date(),
            threadId: threadId,
          }))
        )
      );
  }

 // forum.service.ts
getUserEmail(uid: string): Observable<UserModel | undefined> {
  return this.firestore.collection('users').doc<UserModel>(uid).valueChanges();
}

}
