import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PostadService {

  private urlBe: string = "https://localhost:3000/api/v1/admin";

  constructor(private http: HttpClient) { }

  getAllPost(page?: string, size?:string){
    let params = new HttpParams();
    params = params.set('page', page || '0');
    params = params.set('size', size || '10');
    return this.http.get(`${this.urlBe}/posts/all-post`, {params});
  }

  lockPost(postId: string){
    let params = new HttpParams().set("postId", postId);
    return this.http.post(`${this.urlBe}/posts/lock-post`, {}, {params});
  }

  unlockPost(postId: string){
    let params = new HttpParams().set("postId", postId);
    return this.http.post(`${this.urlBe}/posts/unlock-post`, {}, {params});
  }

  deletePost(postId: string){
    let params = new HttpParams().set("postId", postId);
    return this.http.post(`${this.urlBe}/posts/delete-post`, {}, {params});
  }
}

