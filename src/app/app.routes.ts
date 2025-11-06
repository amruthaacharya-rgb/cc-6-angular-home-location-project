import { Routes } from '@angular/router';
import { Home } from './home/home';
import { HousingLocationDetails } from './housing-location-details/housing-location-details';
import { About } from './about/about';
import { AddHomeLocation } from './add-home-location/add-home-location';
import { LoginComponent } from './auth/login/login';
// import { authGuard } from './auth/auth-guard';
export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    {
        path: 'home',
        component: Home,
        // canActivate: [authGuard],
        title: 'Home Page',
        children: [
            { path: 'add', component: AddHomeLocation, title: 'Add Component' },
            { path: 'edit/:id', component: AddHomeLocation },
        ]
    },
    { path: 'home/:id', 
        // canActivate: [authGuard], 
        component: HousingLocationDetails, title: 'Home Details' },
    { path: 'about', component: About, title: 'About Details' }
];
