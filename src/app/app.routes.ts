import { Routes } from '@angular/router';
import { Home } from './home/home';
import { HousingLocationDetails } from './housing-location-details/housing-location-details';
import { About } from './about/about';
import { AddHomeLocation } from './add-home-location/add-home-location';
export const routes: Routes = [
    {
        path: 'home',
        component: Home,
        title: 'Home Page',
        children: [
            { path: 'add', component: AddHomeLocation, title: 'Add Component' },
            { path: 'edit/:id', component: AddHomeLocation },
        ]
    },
    { path: 'home/:id', component: HousingLocationDetails, title: 'Home Details' },
    {
        path: 'about',
        component: About,
        title: 'About Details'
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    }
];
