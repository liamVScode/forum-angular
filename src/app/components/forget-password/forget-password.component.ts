import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {

  email: string | null = null;


  constructor(private authService: AuthService){

  }

  forgetPassword() {
    if(this.email){
      this.authService.forgetPassword(this.email).subscribe({
        next: (response : any) => {
          alert("Yêu cầu đã được gửi tới mail: " + this.email);
        },
        error: (error) => {
          alert("Email không có trong hệ thống");
        }
      })
    }
  }

}
