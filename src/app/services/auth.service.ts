import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../models/loginRequest';
import { Router } from '@angular/router';
import { SignupRequest } from '../models/signupRequest';
import { BehaviorSubject, catchError, tap } from 'rxjs';
import { ResetPasswordRequest } from '../models/resetPasswordRequest';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());

  isLoggedIn$ = this.loggedIn.asObservable();

  private urlBe: string = "http://localhost:3000";
  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string){
    const loginData = { email, password };
    return this.http.post<LoginResponse>(`${this.urlBe}/api/v1/auth/signin`, loginData).pipe(
      tap((response : LoginResponse) => {
        console.log(response);
        localStorage.setItem('token', response.result.token);
  // Nếu bạn cũng muốn lưu refreshToken
  localStorage.setItem('refreshToken', response.result.refreshToken);
        this.loggedIn.next(true);
      })
    );
  }

  signinWithFacebook(accessToken: string){
    return this.http.post<LoginResponse>(`${this.urlBe}/api/v1/auth/facebook/signin`, accessToken);
  }

  signinWithGoogle(accessToken: string){
    return this.http.post<LoginResponse>(`${this.urlBe}/api/v1/auth/google/signin`, accessToken);
  }

  signup(signupData: SignupRequest){
    return this.http.post(`${this.urlBe}/api/v1/auth/signup`, signupData);
  }

  forgetPassword(email: string){
    const body = {
      email: email
    };
    return this.http.post(`${this.urlBe}/api/v1/auth/forget-password`, body);
  }

  resetPassword(resetPasswordData: ResetPasswordRequest){
    return this.http.post(`${this.urlBe}/api/v1/auth/reset-password`, resetPasswordData);
  }

  isLoggedIn() : boolean{
    return !!localStorage.getItem('token');
  }


  logout(){
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

}
