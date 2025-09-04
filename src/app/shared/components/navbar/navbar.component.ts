import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  pages:{title:string, path:string}[] = [
    {title: 'Home', path: '/'},
    {title: 'Products', path: '/products'},
    {title: 'Cart', path: '/cart'},
    {title: 'Categories', path: '/categories'},
    {title: 'Brands', path: '/brands'}
  ];
  authpages:{title:string, path:string}[] = [
    {title: 'Login', path: '/login'},
    {title: 'Register', path: '/register'},
  ];
}
