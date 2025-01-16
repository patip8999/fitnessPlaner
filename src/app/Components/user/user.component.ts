import { Component, inject } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../Services/theme.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  authService: AuthService = inject(AuthService);
  themeService: ThemeService = inject(ThemeService);
  userSignal = this.authService.getCurrentUser();
  changeGradient(color: string) {
    this.themeService.setGradient(color);
  }
}
