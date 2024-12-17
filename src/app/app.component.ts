import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { AuthService } from './Services/auth.service';
import { NavbarComponent } from './Components/navbar/navbar.component';
export interface ProductModel {
  readonly fitness: string;
  readonly id: string;
}

export interface UserModel {
  readonly email: string;
  readonly password: string;
}
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, LoginComponent, RegisterComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private client = inject(AngularFirestore);
  private router = inject(Router);
  private authService = inject(AuthService);

  getProducts(): Observable<ProductModel[]> {
    return this.client.collection<ProductModel>('products').valueChanges();
  }

  readonly products$: Observable<ProductModel[]> = this.getProducts();

  getUser(): Observable<UserModel> {
    return this.authService.getCurrentUser();
  }
  readonly user$: Observable<UserModel> = this.getUser();
  currentForm: 'login' | 'register' = 'login';
  showForm(formType: 'login' | 'register') {
    this.currentForm = formType;
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}