import { CommonModule } from '@angular/common';
import { Component, OnInit ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginComponent implements OnInit{
  email: string = "";
  password: string = "";
  user: SocialUser | undefined;
  isAdmin : boolean = false;

  constructor(private authService: AuthService, public router: Router, private socialAuthService: SocialAuthService){
  }

  ngOnInit(): void {
    // Lắng nghe trạng thái đăng nhập
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      if (this.user) {
        // Gửi access token tới backend để xác thực và tạo phiên người dùng
        this.sendAccessTokenToBackend(this.user.authToken);
      }
    });
  }

  login(){
    console.log(this.isAdmin);

    if(this.isAdmin){
      this.authService.loginAdmin(this.email, this.password).subscribe({
        next: (response) => {
          this.router.navigate(["/admin"]);
        },
        error: (error) => {
          alert("Thông tin tài khoản hoặc mật khẩu không chính xác");
          console.error("Login error: ", error);
        }
      })
    }
    else
    {
      this.authService.login(this.email, this.password).subscribe({
        next: (response) => {
          this.router.navigate(["/forum"]);
        },
        error: (error) => {
          alert("Thông tin tài khoản hoặc mật khẩu không chính xác");
          console.error("Login error: ", error);
        }
      })
    }
  }


  loginWithFacebook(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then((userData) => {
      if (userData && userData.authToken) {
        // Gửi access token tới backend để xác thực và tạo phiên người dùng
        this.sendAccessTokenToBackend(userData.authToken);
      }
    }).catch((error) => {
      console.error("Login with Facebook failed", error);
    });
  }

  loginWithGoogle1(): void {
    console.log('a');
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((userData) => {
      console.log(userData);
    }).catch((error) => {
      console.error("Login with Google failed", error);
    });
  }

  sendAccessTokenToBackend(accessToken: string): void {
    console.log(accessToken);

    this.authService.signinWithFacebook(accessToken).subscribe({
      next: (response: any) => {
        if (response && response.result.token) {
          this.router.navigate(['/forum']);
        } else {
          console.error('Authentication failed');
        }
      },
      error: (error) => {
        console.error('Error during authentication:', error);
      }
    });
  }

  handleCredentialResponse(response: any): void {
    // Gửi token ID tới AuthService để xử lý
    this.authService.signinWithGoogle(response.credential);
  }
}
