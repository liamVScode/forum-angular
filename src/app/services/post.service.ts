import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CreatePostRequest } from '../models/CreatePostRequest';
import { CreatePostResponse } from '../models/CreatePostResponse';
import { EditPostResponse } from '../models/EditPostResponse';

@Injectable({
  providedIn: 'root'
})
export class PostService{

  private urlBe: string = "http://localhost:3000";

  constructor(private http: HttpClient) { }


  getPostDetails(postId: string) {
    let params = new HttpParams().set('postId', postId);
    return this.http.get(`${this.urlBe}/api/posts/detail-post`, { params });
  }

  getTopicAndPrefix(categoryId: string){
    let params = new HttpParams().set('categoryId', categoryId);
    return this.http.get(`${this.urlBe}/api/posts/topic-prefix`, {params})
  }

  createPost(createPost: CreatePostRequest){
    return this.http.post<CreatePostResponse>(`${this.urlBe}/api/posts/create-post`, createPost);
  }

  editPost(postId:string){
    let params = new HttpParams().set('postId', postId);
    return this.http.post<EditPostResponse>(`${this.urlBe}/api/posts/edit-post`, {params});
  }
}
