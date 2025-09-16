import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { wishlistService } from '../../../../core/services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  imports: [],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit{
  constructor(private wishlistService: wishlistService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.getwishlist();
  }
  getwishlist(){
    this.wishlistService.getwishlist().subscribe({
      next: (response) => {
        this.toastr.success('wishlist loaded successfully', 'Success');
        console.log(response);
      },
      error: (error) => {
        this.toastr.error('Failed to load wishlist ' + error, 'Error');
        console.log(error);
      }
    });
  }

}
