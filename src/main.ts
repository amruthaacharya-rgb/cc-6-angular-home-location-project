import { bootstrapApplication, provideProtractorTestingSupport } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(App, {
  providers: [
    provideProtractorTestingSupport(), 
    provideRouter(routes, withComponentInputBinding())],
}).catch((err) => console.error(err));
