import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../models/loginRequest';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private urlBe: string = "http://localhost:3000";
  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string){
    const loginData = {email, password};
    return this.http.post<LoginResponse>(`${this.urlBe}/api/v1/auth/signin`, loginData);
  }

  isLoggedIn(){
    return !!localStorage.getItem('token');
  }

  redirectToForumIfLoggedIn() {
    if (this.isLoggedIn()) {
      this.router.navigate(['/forum']);
    }
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }
}
