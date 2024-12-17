import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.css'
})
export class AuthFormComponent {

  @Input() isLogin: boolean = true;
  @Input() buttonText: string = '';
  @Input() email: string = '';
  @Input() password: string = '';

  @Output() emailChange = new EventEmitter<string>();
  @Output() passwordChange = new EventEmitter<string>();
  @Output() formSubmit = new EventEmitter<{ email: string, password: string }>();

  onEmailChange() {
    this.emailChange.emit(this.email);
  }

  onPasswordChange() {
    this.passwordChange.emit(this.password);
  }

  onSubmit() {
    if (this.email && this.password) {
      this.formSubmit.emit({ email: this.email, password: this.password });
    } else {
      console.log('Proszę podać e-mail i hasło.');
    }
  }
}