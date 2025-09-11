import { Routes } from '@angular/router';

export const routes: Routes = [

    { path: 'home', loadComponent: () => import('./features/user/pages/home/home').then(m => m.Home) },
    { path:'',redirectTo:'home',pathMatch:'full'},
    { path:'products',loadComponent:() =>import('./features/user/pages/products/products').then(m => m.Products)},
    { path:'login', loadComponent:() =>import('./features/user/pages/login/login').then(m => m.Login)},
    { path:'register', loadComponent:() =>import('./features/user/pages/register/register').then(m => m.Register)},
    { path:'product/:id/:slug', loadComponent:() =>import('./features/user/pages/product-details/product-details').then(m => m.ProductDetails)},
    { path:'cart', loadComponent:() =>import('./features/user/pages/cart/cart').then(m => m.Cart)},
    { path:'brands', loadComponent:() =>import('./features/user/pages/brands/brands').then(m => m.Brands)},
    { path:'categories', loadComponent:() =>import('./features/user/pages/categories/categories').then(m => m.Categories)},
    { path:'reset-password', loadComponent:() =>import('./features/user/pages/reset-password/reset-password').then(m => m.ResetPassword)},
    { path:'**', loadComponent:() =>import('./features/user/pages/notfound/notfound').then(m => m.Notfound)}
];
