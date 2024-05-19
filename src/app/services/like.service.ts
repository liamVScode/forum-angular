import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { param } from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class LikeService {

  private urlBe: string = "https://localhost:3000/api/posts/comments/likes";

  constructor(private http:HttpClient) {}


  likeComment(commentId: string){
    let params = new HttpParams().set('commentId', commentId);
    return this.http.post(`${this.urlBe}/like-comment`, null, {params});
  }

  unlikeComment(commentId: string){
    let params = new HttpParams().set('commentId', commentId);
    return this.http.post(`${this.urlBe}/unlike-comment`, null, {params});
  }

  getAllLikeByComment(commentId: string){
    let params = new HttpParams().set('commentId', commentId);
    return this.http.get(`${this.urlBe}/like-by-comment`, {params})
  }
}
