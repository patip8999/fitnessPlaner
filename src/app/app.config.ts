import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { environmet } from '../environments/environments';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),
    importProvidersFrom([
      AngularFirestoreModule,
      AngularFireAuthModule,
      AngularFireModule.initializeApp(environmet.firebaseConfig),
    ]),
    DatePipe, 
  ],
};
