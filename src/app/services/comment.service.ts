import { Injectable } from '@angular/core';
import { CommentResponse } from '../models/CommentResponse';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private urlBe: string = "https://localhost:3000/api/posts/comments";

  constructor(private http:HttpClient) { }

  getAllCommentByPost(postId: string, page?: string, size?: string){
    let params = new HttpParams();
    params = params.set('postId', postId);
    params = params.set('page', page || '0');
    params = params.set('size', size || '10');
    return this.http.get(`${this.urlBe}/comment-by-post`, {params});
  }

  createComment(commentRequest: FormData){
    return this.http.post<CommentResponse>(`${this.urlBe}/create-comment`, commentRequest);
  }

  editComment(editCommentRequest: FormData){
    return this.http.put<CommentResponse>(`${this.urlBe}/edit-comment`, editCommentRequest);
  }

  deleteComment(postId: string, commentId: string){
    const params = new HttpParams()
    .set('commentId', commentId)
    .set('postId', postId);
    return this.http.delete(`${this.urlBe}/delete-comment`, {params});
  }
}
