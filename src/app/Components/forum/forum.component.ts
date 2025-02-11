import {
  Component,
  inject,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { ForumService, Thread, Comment } from '../../Services/forum.service';
import { AuthService } from '../../Services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-forum',
  standalone: true,
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css'],
  imports: [FormsModule, CommonModule, DatePipe],

})
export class ForumComponent implements OnInit {
  threads = signal<Thread[]>([]);
  model = signal<Thread>({
    id: '',
    title: '',
    content: '',
    authorId: '',
    createdAt: new Date(),
  });
  authService: AuthService = inject(AuthService);
  authorCache = new Map<string, string>();
  forumService: ForumService = inject(ForumService);

  ngOnInit(): void {
    this.loadThreads();
  }

  toggleComments(threadId: string): void {
    this.threads.update((threads) =>
      threads.map((thread) =>
        thread.id === threadId
          ? { ...thread, showComments: !thread.showComments }
          : thread
      )
    );
  }

  loadThreads(): void {
    this.forumService.getThreads().subscribe((threads) => {
      this.threads.set(threads);
      threads.forEach((thread) => {
        this.forumService.getComments(thread.id).subscribe((comments) => {
          comments.forEach((comment) => this.loadUserEmail(comment));
          this.threads.update((currentThreads) =>
            currentThreads.map((t) =>
              t.id === thread.id ? { ...t, comments } : t
            )
          );
        });
      });
    });
  }

  loadUserEmail(comment: Comment): void {
    if (this.authorCache.has(comment.authorId)) {
      comment.authorEmail = this.authorCache.get(comment.authorId);
    } else {
      this.forumService.getUserEmail(comment.authorId).subscribe((user) => {
        if (user) {
          comment.authorEmail = user.email;
          this.authorCache.set(comment.authorId, user.email);
        } else {
          comment.authorEmail = 'Nieznany autor';
        }
      });
    }
  }

  addThread(): void {
    const currentModel = this.model();
    if (currentModel.title && currentModel.content) {
      this.forumService.createThread(currentModel).then(() => {
        this.model.set({
          id: '',
          title: '',
          content: '',
          authorId: '',
          createdAt: new Date(),
        });
        this.loadThreads();
      });
    }
  }

  showCommentForm(threadId: string): void {
    this.threads.update((threads) =>
      threads.map((thread) =>
        thread.id === threadId
          ? { ...thread, showCommentForm: !thread.showCommentForm }
          : thread
      )
    );
  }

  addComment(threadId: string): void {
    const thread = this.threads().find((t) => t.id === threadId);
    if (thread) {
      const commentContent = thread.newComment || '';
      if (commentContent) {
        this.authService.getCurrentUser().subscribe((user) => {
          if (user) {
            const comment: Comment = {
              id: '',
              content: commentContent,
              authorId: user.uid,
              createdAt: new Date(),
              threadId,
            };
            this.forumService.addComment(threadId, comment).then(() => {
              this.threads.update((threads) =>
                threads.map((t) =>
                  t.id === threadId
                    ? { ...t, newComment: '', showCommentForm: false }
                    : t
                )
              );
              this.loadThreads();
            });
          }
        });
      }
    }
  }
}
