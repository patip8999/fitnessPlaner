import { Component, inject } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../Services/theme.service';
import { UserService } from '../../Services/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  userPhotoURL: string = '';
  displayName: string = '';
  email: string = '';
  newAvatarURL: string = '';
  avatarFile: File | null = null;
  authService: AuthService = inject(AuthService);
  userService: UserService = inject(UserService);
  themeService: ThemeService = inject(ThemeService);
  userSignal = this.authService.getCurrentUser();
  private afAuth: AngularFireAuth = inject(AngularFireAuth);
  constructor() {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.userPhotoURL = user.photoURL || '';
        this.displayName = user.displayName || 'Nieznany użytkownik';
        this.email = user.email || 'Brak adresu e-mail';

        this.loadUser();
      } else {
        console.log('Nie ma zalogowanego użytkownika');
      }
    });
  }
  changeGradient(color: string) {
    this.themeService.setGradient(color);
  }

  loadUser() {
    this.userService.getUser().subscribe((user) => {
      if (user) {
        this.userPhotoURL = user.photoURL || '';
        this.displayName = user.displayName || 'Nieznany użytkownik';
        this.email = user.email || 'Brak adresu e-mail';
      }
    });
  }
  onAvatarChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      this.avatarFile = input.files[0];
    }
  }
  saveAvatar(newAvatarURL: string): void {
    this.afAuth.currentUser
      .then((user) => {
        if (user && user.uid) {
          this.userService.updateAvatarInFirestore(newAvatarURL, user.uid);
          this.userPhotoURL = newAvatarURL; // Zaktualizowanie awatara w komponencie
          console.log('Awatar zapisany pomyślnie!');
        }
      })
      .catch((error) => {
        console.error('Błąd przy zapisywaniu awatara:', error);
      });
  }
}