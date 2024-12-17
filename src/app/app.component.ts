import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { User } from 'firebase/auth'; // Dodaj import User
import { AuthService } from './Services/auth.service';
export interface ProductModel {
  readonly fitness: string
  readonly id: string
}

export interface UserModel {
  readonly email: string, 
  readonly password: string,
}
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, LoginComponent, RegisterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  private client = inject(AngularFirestore)
 

private authService = inject(AuthService)

 
getProducts(): Observable<ProductModel[]> {
  return this.client.collection<ProductModel>('products').valueChanges()
}

readonly products$: Observable<ProductModel[]> = this.getProducts()


getUser(): Observable<UserModel> {
  return this.authService.getCurrentUser(); // Zakładając, że getCurrentUser zwraca Observable<UserModel>
}
readonly user$: Observable<UserModel> = this.getUser();
  
  // Wylogowanie
  logout() {
    this.authService.logout();
  }

}