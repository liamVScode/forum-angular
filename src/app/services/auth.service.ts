import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, tap } from 'rxjs';
import { UserDto } from '../models/UserDto';
import { LoginResponse } from '../models/LoginRequest';
import { SignupRequest } from '../models/SignupRequest';
import { ResetPasswordRequest } from '../models/ResetPasswordRequest';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import jwt_decode, { jwtDecode } from 'jwt-decode';
import { ChangePasswordRequest } from '../models/ChangePasswordRequest';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAdmin : boolean = false;

  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());

  isLoggedIn$ = this.loggedIn.asObservable();

  private urlBe: string = "https://localhost:3000";

  private currentUserSubject?: BehaviorSubject<any>;
  public currentUser?: Observable<any>;

  constructor(private http: HttpClient, private router: Router, private socialAuthService: SocialAuthService,
    private userService: UserService
  ) {
    const storedUser = localStorage.getItem('currentUser');
    let parsedUser = null;

    try {
      parsedUser = storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error('Error parsing stored user', e);
      localStorage.removeItem('currentUser');
    }

    this.currentUserSubject = new BehaviorSubject<any>(parsedUser);
    this.currentUser = this.currentUserSubject.asObservable();
   }

  public get currentUserValue(): any {
    return this.currentUserSubject?.value;
  }


  login(email: string, password: string){
    const loginData = { email, password };
    return this.http.post<LoginResponse>(`${this.urlBe}/api/v1/auth/signin`, loginData).pipe(
      tap((response : LoginResponse) => {
        this.isAdmin = false;
        console.log(response);
        localStorage.setItem('token', response.result.token);
        localStorage.setItem('refreshToken', response.result.refreshToken);
        localStorage.setItem('currentUser', JSON.stringify(response.result.userDto));
        this.loggedIn.next(true);
        this.currentUserSubject?.next(response.result.userDto);
      })
    );
  }

  signinWithFacebook(accessToken: string){
    return this.http.post<LoginResponse>(`${this.urlBe}/api/v1/auth/facebook/signin`,{ accessToken }).pipe(
      tap((response : LoginResponse) => {
        this.isAdmin = false;
        console.log(response);
        localStorage.setItem('token', response.result.token);
        localStorage.setItem('refreshToken', response.result.refreshToken);
        localStorage.setItem('currentUser', JSON.stringify(response.result.userDto));
        this.loggedIn.next(true);
        this.currentUserSubject?.next(response.result.userDto);
      })
    );
  }

  signinWithGoogle(accessToken: string){
    return this.http.post<LoginResponse>(`${this.urlBe}/api/v1/auth/google/signin`, accessToken);
  }

  loginAdmin(email: string, password: string){
    const loginData = { email, password };
    return this.http.post<LoginResponse>(`${this.urlBe}/api/v1/auth/signinAdmin`, loginData).pipe(
      tap((response : LoginResponse) => {
        console.log(response);
        localStorage.setItem('token', response.result.token);
        localStorage.setItem('refreshToken', response.result.refreshToken);
        localStorage.setItem('currentUser', JSON.stringify(response.result.userDto));
        this.loggedIn.next(true);
        this.currentUserSubject?.next(response.result.userDto);
      })
    );
  }

  getRole(){
    return this.getCurrentUser()?.role;
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

  changePassword(changePasswordRequest: ChangePasswordRequest){
    return this.http.post(`${this.urlBe}/api/v1/auth/change-password`, changePasswordRequest);
  }

  isLoggedIn() : boolean{
    return !!localStorage.getItem('token');
  }

  getCurrentUser(): UserDto | null {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
        return JSON.parse(userJson);
    }
    return null;
  }

  getToken(){
    const token = localStorage.getItem('token');
    if (token) {
        return token;
    }
    return null;
  }


  logout(): Observable<any> {
    return this.http.post(`${this.urlBe}/api/v1/auth/logout`, {}).pipe(
      tap(() => {
        this.clearLocalStorage();
        this.socialAuthService.signOut().catch(error => {
          console.error('Error during social sign out', error);
        });
      })
    );
  }


  clearLocalStorage() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    this.currentUserSubject?.next(null);
    this.loggedIn.next(false);

  }

  isTokenExpired(token: string): boolean {
    if (!token) return true;

    const decoded: any = jwtDecode(token);
    const expirationDate = new Date(0);
    expirationDate.setUTCSeconds(decoded.exp);

    return expirationDate < new Date();
  }

  handleTokenExpiration() {
    const token : string | null = localStorage.getItem('token');
    const currentUserJson = localStorage.getItem('currentUser');
    const currentUser = currentUserJson ? JSON.parse(currentUserJson) : null;
    const email = currentUser ? currentUser.email : null;
    if(token !== null){
      if (this.isTokenExpired(token)) {
        this.userService.updateStatus(email, "1");
        this.clearLocalStorage();
      }
    }
  }

}
