import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  private urlBe: string = "https://localhost:3000/api/statistics"

  constructor(private http: HttpClient) { }

  getNumberOfOnlineUser(){
    return this.http.get(`${this.urlBe}/online-user`);
  }

  getNumberOfPost(){
    return this.http.get(`${this.urlBe}/number-of-post`);
  }

  getNumberOfComment(){
    return this.http.get(`${this.urlBe}/number-of-comment`);
  }

  getNumberOfUser(){
    return this.http.get(`${this.urlBe}/number-of-user`);
  }
}
