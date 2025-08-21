import { Routes } from '@angular/router';

export const routes: Routes = [

    { path: '', loadComponent: () => import('./features/user/pages/home/home').then(m => m.Home) }
];
