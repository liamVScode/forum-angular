import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = "";
  password: string = "";

  constructor(private authService: AuthService, private router: Router){
    this.authService.redirectToForumIfLoggedIn();
  }

  login(){
    this.authService.login(this.email, this.password).subscribe({
      next: (response: any) => {
        localStorage.setItem('token',   String(response.token));
        localStorage.setItem('refreshToken', String(response.refreshToken));

        this.router.navigate(["/forum"]);
      },
      error: (error) => {
        alert("Thông tin tài khoản hoặc mật khẩu không chính xác");
        console.error("Login error: ", error);
      }
    })
  }
}
