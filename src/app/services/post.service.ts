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

  getAllPostByCategory(categoryId: string, page?: string, size?: string){
    let params = new HttpParams();
    params = params.set('categoryId', categoryId);
    params = params.set('page', page || '0');
    params = params.set('size', size || '10');
    return this.http.get(`${this.urlBe}/api/posts/all-post`, {params});
  }

  createPost(createPost: FormData){
    return this.http.post<CreatePostResponse>(`${this.urlBe}/api/posts/create-post`, createPost);
  }

  editPost(editPost : FormData){
    return this.http.put<EditPostResponse>(`${this.urlBe}/api/posts/edit-post`, editPost);
  }

  deletePost(deletePost: string){
    const params = new HttpParams().set('postId', deletePost);
    return this.http.delete(`${this.urlBe}/api/posts/delete-post`, {params});
  }

  createComment(commentRequest: FormData){
    return this.http.post<CommentResponse>(`${this.urlBe}/api/posts/create-comment`, commentRequest);
  }

}
