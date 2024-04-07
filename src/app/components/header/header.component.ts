import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

  isLoggedIn : boolean = false;

  constructor(private router: Router, private authService: AuthService){

  }
  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/forum']);
  }

  toHome(){
    this.router.navigate(['/']);
  }

  toLogin(){
    this.router.navigate(['/login']);
  }

  toRegister(){
    this.router.navigate(['/signup']);
  }

  toForum(){
    this.router.navigate(['/forum']);
  }
}
