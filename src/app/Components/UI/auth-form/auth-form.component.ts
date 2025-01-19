import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.css',
})
export class AuthFormComponent {
  @Input() isLogin: boolean = true;
  @Input() buttonText: string = '';
  @Input() email: string = '';
  @Input() password: string = '';
  @Input() confirmPassword: string = '';
  @Input() username: string = '';
  @Output() emailChange = new EventEmitter<string>();
  @Output() passwordChange = new EventEmitter<string>();
  @Output() confirmPasswordChange = new EventEmitter<string>();
  @Output() usernameChange = new EventEmitter<string>();
  @Output() googleLogin = new EventEmitter<void>();
  @Output() formSubmit = new EventEmitter<{
    email: string;
    password: string;
    confirmPassword?: string;
    username?: string;
  }>();

  onEmailChange() {
    this.emailChange.emit(this.email);
  }

  onPasswordChange() {
    this.passwordChange.emit(this.password);
  }
  onConfirmPasswordChange() {
    this.confirmPasswordChange.emit(this.confirmPassword);
  }

  onUsernameChange() {
    this.usernameChange.emit(this.username);
  }

  onSubmit() {
    if (this.isLogin) {
      if (this.email && this.password) {
        this.formSubmit.emit({
          email: this.email,
          username: this.username,
          password: this.password,
          confirmPassword: this.confirmPassword,
        });
      } else {
        console.log('Proszę podać e-mail i hasło.');
      }
    } else {
      if (
        this.email &&
        this.username &&
        this.password &&
        this.password === this.confirmPassword
      ) {
        this.formSubmit.emit({
          email: this.email,
          username: this.username,
          password: this.password,
          confirmPassword: this.confirmPassword,
        });
      } else {
        console.log('Proszę podać e-mail, nazwę użytkownika i hasło.');
      }
    }
  }
  onGoogleLogin() {
    this.googleLogin.emit();
  }
}
