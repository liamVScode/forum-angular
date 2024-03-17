import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  firstName: string = '';
  lastName: string = '';
  location: string = '';
  email: string = '';
  password: string = '';
  acceptPassword: string = '';
  errorMessage: string = '';
  constructor(private authService: AuthService){

  }
  signup(){
    if(this.password != this.acceptPassword) {
      this.errorMessage = "Mật khẩu không khớp";
      return;
    }
    this.errorMessage = '';
    this.authService.signup(this.firstName, this.lastName, this.location, this.email, this.password);
  }
}
