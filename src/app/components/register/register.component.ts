import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MustMatch } from '../../../password.validator';
import { SignupRequest } from '../../models/signupRequest';
import { catchError } from 'rxjs';
import { LoginComponent } from '../login/login.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{
  registerForm! : FormGroup;
  // firstName: string = '';
  // lastName: string = '';
  // location: string = '';
  // email: string = '';
  // password: string = '';
  // acceptPassword: string = '';
  // errorMessage: string = '';
  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router){

  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      location: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  onSubmit(){
    if(this.registerForm.valid){
      const signupData: SignupRequest = this.registerForm.value;
      this.authService.signup(signupData).subscribe({
        next: (response) => {
          alert("Đăng ký thành công, tiến hành đăng nhập.")
          this.router.navigate(["/login"]);
        },
        error: (error) => {
          if(error.status == 400){
            alert("Người dùng này đã tồn tại trên hệ thống");
          }
          console.log(error);
        }
      });
    }
  }
}
