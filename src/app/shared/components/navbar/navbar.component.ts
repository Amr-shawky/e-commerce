import { AuthService } from './../../../core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { FlowbiteService } from '../../../core/services/flowbite';
import { CartService } from '../../../core/services/cart.service';
import { CartResponse } from '../../../core/models/api.interface';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent implements OnInit{
  constructor(private authService: AuthService, 
    private flowbiteService: FlowbiteService,
    private cartservice : CartService
  ) {
     authService.isLogin.subscribe({
      next: (isLogin) => {
        console.log({isLogin} , "nav");

        this.localIsLogin = isLogin;
      },
    });
  }
    localIsLogin = false;
    numOfCartItems : number = 0;
  logOut() {
    this.authService.logOut();
  }
    getallcarts() {
  
      this.cartservice.getCart().subscribe({
        next: (response: CartResponse) => {
          this.cartservice.numOfCartItems.next(response.numOfCartItems);
          
          this.cartservice.numOfCartItems.subscribe({
            next: (count) => {
              this.numOfCartItems = count;
            },
            error: (error) => {
              console.log(error);
            }
          });
          // this.cartData = response;
          // this.isFirstLoading = false;
          // this.isLoading = false;
        },
        error: (error: any) => {
          console.log(error);
          // this.toastr.error('Failed to load cart', 'Error');
          // this.isFirstLoading = false;
          // this.isLoading = false;
        },
      });
    }
  
  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
    this.getallcarts();
  }
  pages:{title:string, path:string}[] = [
    {title: 'Home', path: '/home'},
    {title: 'Products', path: '/products'},
    {title: 'Cart', path: '/cart'},
    {title: 'Categories', path: '/categories'},
    {title: 'Brands', path: '/brands'},
    {title: 'wishlist', path: '/wish-list'}
  ];
  authpages:{title:string, path:string}[] = [
    {title: 'Login', path: '/login'},
    {title: 'Register', path: '/register'},
  ];
}
