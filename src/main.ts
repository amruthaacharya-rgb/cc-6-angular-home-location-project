import { bootstrapApplication, provideProtractorTestingSupport } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app/app.routes';
import { ToastrModule } from 'ngx-toastr';
import { importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(App, {
  providers: [
    provideProtractorTestingSupport(),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),
    importProvidersFrom(ToastrModule.forRoot({
      positionClass: 'toast-top-center',
      timeOut: 3000,
      preventDuplicates: true,
    })),
  ],

}).catch((err) => console.error(err));
