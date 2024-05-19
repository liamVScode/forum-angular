import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private urlBe: string = "https://localhost:3000/api/v1/user"

  constructor(private http: HttpClient) { }

  editUser(body: any){
    return this.http.post(`${this.urlBe}/edit-profile`, body);
  }

  getAllActivities(page?: string, size?: string){
    let params = new HttpParams();
    params = params.set('page', page || '0');
    params = params.set('size', size || '20');
    return this.http.get(`${this.urlBe}/all-activity`, {params});
  }

  changeAvatar(avatar: FormData){
    return this.http.post(`${this.urlBe}/change-avatar`, avatar);
  }

  updateStatus(email: string, status: string){
    const body = {
      email: email,
      status: status
    }
    return this.http.post(`${this.urlBe}/update-status`, body);
  }
}
