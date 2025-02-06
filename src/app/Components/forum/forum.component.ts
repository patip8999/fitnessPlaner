import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { ForumService, Thread, Comment } from '../../Services/forum.service';
import { catchError, map, Observable, of, take } from 'rxjs';
import { AuthService } from '../../Services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-forum',
  standalone: true,
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css'],
  imports: [FormsModule, CommonModule, DatePipe],
  encapsulation: ViewEncapsulation.ShadowDom 
})
export class ForumComponent implements OnInit {
  threads: Thread[] = [];
  model: Thread = { id: '', title: '', content: '', authorId: '', createdAt: new Date() };
  authService: AuthService = inject(AuthService);
  authorCache: Map<string, string> = new Map();

  constructor(private forumService: ForumService) {}

  ngOnInit(): void {
    this.loadThreads();
  }

  toggleComments(threadId: string): void {
    const thread = this.threads.find((t) => t.id === threadId);
    if (thread) {
      thread.showComments = !thread.showComments;
    }
  }
  loadThreads(): void {
    this.forumService.getThreads().subscribe((threads) => {
      this.threads = threads;
      this.threads.forEach((thread) => {

        this.forumService.getComments(thread.id).subscribe((comments) => {
          thread.comments = comments;
   
          thread.comments.forEach((comment) => {
            this.loadUserEmail(comment);
          });
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
    if (this.model.title && this.model.content) {
      this.forumService.createThread(this.model).then(() => {
        this.model = { id: '', title: '', content: '', authorId: '', createdAt: new Date() };
        this.loadThreads();
      });
    }
  }

  showCommentForm(threadId: string): void {
    const thread = this.threads.find((t) => t.id === threadId);
    if (thread) {
      thread.showCommentForm = !thread.showCommentForm;
    }
  }

  addComment(threadId: string): void {
    const thread = this.threads.find((t) => t.id === threadId);
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
              thread.newComment = '';
              thread.showCommentForm = false;
              this.loadThreads(); 
            }).catch((err) => {
              console.error("Error adding comment:", err);
            });
          }
        });
      }
    }
  }

}  