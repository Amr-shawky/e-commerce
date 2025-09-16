import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [

    { path: 'home', canActivate: [authGuard], loadComponent: () => import('./features/user/pages/home/home').then(m => m.Home) },
    { path:'',redirectTo:'home',pathMatch:'full'},
    { path:'products', canActivate: [authGuard], loadComponent:() =>import('./features/user/pages/products/products').then(m => m.Products)},
    { path:'product/:id/:slug',canActivate: [authGuard], loadComponent:() =>import('./features/user/pages/product-details/product-details').then(m => m.ProductDetails)},
    { path:'cart', canActivate: [authGuard], loadComponent:() =>import('./features/user/pages/cart/cart').then(m => m.Cart)},
    { path:'brands', canActivate: [authGuard], loadComponent:() =>import('./features/user/pages/brands/brands').then(m => m.Brands)},
    { path:'categories', canActivate: [authGuard], loadComponent:() =>import('./features/user/pages/categories/categories').then(m => m.Categories)},
    {path:'checkout', canActivate: [authGuard], loadComponent:() =>import('./features/user/pages/check-out/check-out.component').then(m => m.CheckOutComponent)},
    {path:'wish-list', canActivate: [authGuard], loadComponent:() =>import('./features/user/pages/wishlist/wishlist.component').then(m => m.WishlistComponent)},
    { path:'login', loadComponent:() =>import('./features/user/pages/login/login').then(m => m.Login)},
    { path:'register', loadComponent:() =>import('./features/user/pages/register/register').then(m => m.Register)},
    { path:'reset-password', loadComponent:() =>import('./features/user/pages/reset-password/reset-password').then(m => m.ResetPassword)},
    { path:'**', loadComponent:() =>import('./features/user/pages/notfound/notfound').then(m => m.Notfound)}

];
