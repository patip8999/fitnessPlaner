import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { environmet } from '../environments/environments';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    importProvidersFrom([
      AngularFirestoreModule,
      AngularFireModule.initializeApp(environmet.firebaseConfig),
    ]),
  ],
};
