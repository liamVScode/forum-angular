import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private urlBe: string = "https://localhost:3000/api/v1/admin";

  constructor(private http: HttpClient) { }

  getAllCategory(page?: string, size?: string){
    let params = new HttpParams();
    params = params.set('page', page || '0');
    params = params.set('size', size || '10');
    return this.http.get(`${this.urlBe}/categories/all-category`, {params});
  }

  addCategory(categoryName: string, topicId: string){
    const body = {
      categoryName: categoryName,
      topicId: topicId
    }
    return this.http.post(`${this.urlBe}/categories/create-category`, body);
  }

  editCategory(categoryId: string, categoryName: string, topicId: string){
    const body = {
      categoryId: categoryId,
      categoryName: categoryName,
      topicId: topicId
    }
    return this.http.put(`${this.urlBe}/categories/edit-category`, body);
  }

  deleteCategory(categoryId: string){
    let params = new HttpParams();
    params = params.set('categoryId', categoryId);
    return this.http.delete(`${this.urlBe}/categories/delete-category`, {params});
  }
}
