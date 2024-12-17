import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
export interface ProductModel {
  readonly fitness: string
}
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private client = inject(AngularFirestore)
 
  getProducts(): Observable<ProductModel[]> {
    return this.client.collection<ProductModel>('products').valueChanges()
  }
  
  readonly products$: Observable<ProductModel[]> = this.getProducts()
  }