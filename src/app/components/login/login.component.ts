import { CommonModule } from '@angular/common';
import { Component, OnInit ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginComponent{
  email: string = "";
  password: string = "";

  constructor(private authService: AuthService, private router: Router, private socialAuthService: SocialAuthService){
    // this.authService.redirectToForumIfLoggedIn();
  }

  login(){
    this.authService.login(this.email, this.password).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', String(response.token));
        localStorage.setItem('refreshToken', String(response.refreshToken));

        this.router.navigate(["/forum"]);
      },
      error: (error) => {
        alert("Thông tin tài khoản hoặc mật khẩu không chính xác");
        console.error("Login error: ", error);
      }
    })
  }

  loginWithFacebook(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  loginWithGoogle1(): void {
    console.log('a');
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((userData) => {

      console.log(userData);

    }).catch((error) => {
      console.error("Login with Google failed", error);
    });
  }

  handleCredentialResponse(response: any): void {
    // Gửi token ID tới AuthService để xử lý
    this.authService.signinWithGoogle(response.credential);
  }
}
