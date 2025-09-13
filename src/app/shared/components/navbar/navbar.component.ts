import { AuthService } from './../../../core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { FlowbiteService } from '../../../core/services/flowbite';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent implements OnInit{
  constructor(private authService: AuthService, private flowbiteService: FlowbiteService) {
     authService.isLogin.subscribe({
      next: (isLogin) => {
        console.log({isLogin} , "nav");

        this.localIsLogin = isLogin;
      },
    });
  }
    localIsLogin = false;
  logOut() {
    this.authService.logOut();
  }
  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }
  pages:{title:string, path:string}[] = [
    {title: 'Home', path: '/home'},
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
