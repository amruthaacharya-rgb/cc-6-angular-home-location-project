import { Routes } from '@angular/router';
import { Home } from './home/home';
import { HousingLocationDetails } from './housing-location-details/housing-location-details';
import { About } from './about/about';
import { AddHomeLocation } from './add-home-location/add-home-location';

export const routes: Routes = [
    {
        path : '',
        component : Home,
        title : 'App Page'
    },
    {
        path : 'home',
        component : Home,
        title : 'Home Page'
    },
    {
        path : 'home/add',
        component : AddHomeLocation,
        title : 'Add Component'
    },
    {
        path : 'home/:id',
        component : HousingLocationDetails,
        title : 'Home Details'
    },
    {
        path : 'about',
        component : About,
        title : 'about Details'
    },
];


