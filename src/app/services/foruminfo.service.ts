import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ForuminfoService {

  private urlBe: string = "https://localhost:3000/api";

  constructor(private http:HttpClient) {}

  getAllPost(){
    return this.http.get(`${this.urlBe}/posts/get-all`);
  }

  getForumInfo(){
    return this.http.get(`${this.urlBe}/forum/forum-info`);
  }
}
