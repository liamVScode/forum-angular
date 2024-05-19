import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CreatePostRequest } from '../models/CreatePostRequest';
import { CreatePostResponse } from '../models/CreatePostResponse';
import { EditPostResponse } from '../models/EditPostResponse';
import { CommentResponse } from '../models/CommentResponse';
import { CommentRequest } from '../models/CommentRequest';

@Injectable({
  providedIn: 'root'
})
export class PostService{

  private urlBe: string = "https://localhost:3000/api/posts";

  constructor(private http: HttpClient) { }


  getPostDetails(postId: string) {
    let params = new HttpParams().set('postId', postId);
    return this.http.get(`${this.urlBe}/detail-post`, { params });
  }

  getTopicAndPrefix(categoryId: string){
    let params = new HttpParams().set('categoryId', categoryId);
    return this.http.get(`${this.urlBe}/topic-prefix`, {params})
  }

  getAllPostByCategory(categoryId: string, page?: string, size?: string){
    let params = new HttpParams();
    params = params.set('categoryId', categoryId);
    params = params.set('page', page || '0');
    params = params.set('size', size || '10');
    return this.http.get(`${this.urlBe}/all-post`, {params});
  }

  createPost(createPost: FormData){
    return this.http.post<CreatePostResponse>(`${this.urlBe}/create-post`, createPost);
  }

  editPost(editPost : FormData){
    return this.http.put<EditPostResponse>(`${this.urlBe}/edit-post`, editPost);
  }

  deletePost(deletePost: string){
    const params = new HttpParams().set('postId', deletePost);
    return this.http.post(`${this.urlBe}/delete-post`, null, {params});
  }

}
