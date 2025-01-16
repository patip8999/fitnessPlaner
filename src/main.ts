import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { initializeApp } from 'firebase/app';  // Importujemy funkcję initializeApp
import {  environmet } from './environments/environments';


// Inicjalizacja Firebase
initializeApp(environmet.firebaseConfig);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));