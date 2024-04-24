import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterService {


  private urlBe: string = "http://localhost:3000/api/posts";

  constructor(private http: HttpClient)
  {}

  filterPosts(
    prefixId?: string,
    searchKeyword?: string,
    updateTime?: string,
    postType?: string,
    sortField?: string,
    sortOrder?: string,
    page?: string,
  ) {
    let params = new HttpParams()
      .set('prefixId', prefixId || '')
      .set('searchKeyword', searchKeyword || '')
      .set('updateTime', updateTime || '')
      .set('hasPoll', postType || '')
      .set('sortField', sortField || '')
      .set('sortOrder', sortOrder || '')
      .set('page', page || '0');

    return this.http.get(`${this.urlBe}/filter-post`, { params });
  }
}
