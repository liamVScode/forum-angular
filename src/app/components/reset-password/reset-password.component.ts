import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MustMatch } from '../../../password.validator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit{

  resetPasswordForm!: FormGroup;
  token!: string;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute){
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'];
    this.resetPasswordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', Validators.required]
    }, {
      validator: MustMatch('newPassword', 'confirmNewPassword')
    });
  }

  onSubmit() {
    if(this.resetPasswordForm.valid){
      const resetPasswordData = {
        token: this.token,
        newPassword: this.resetPasswordForm.get('newPassword')?.value
      };
      this.authService.resetPassword(resetPasswordData).subscribe({
        next: (response) => {
          alert("Thay đổi mật khẩu thành công");
          this.router.navigate(["/login"]);
        },
        error: (error) => {
          if(error.status == 403){
            alert("Phiên làm việc đã hết hạn, vui lòng thực hiện lại.");
          }
        }
      });
    }
  }

}
