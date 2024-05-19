import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrefixService {

  private urlBe: string = "https://localhost:3000/api/v1/admin";

  constructor(private http: HttpClient) { }

  getAllPrefix(page?: string, size?: string){
    let params = new HttpParams();
    params = params.set('page', page || '0');
    params = params.set('size', size || '10');
    return this.http.get(`${this.urlBe}/prefixes/all-prefix`, {params});
  }

  listPrefix(){
    return this.http.get(`${this.urlBe}/prefixes/list-prefix`);
  }

  addPrefix(prefixName: string, topicId: string){
    const body = {
      prefixName: prefixName,
      topicId: topicId
    }
    return this.http.post(`${this.urlBe}/prefixes/create-prefix`, body);
  }

  editPrefix(prefixId: string, prefixName: string, topicId: string){
    const body = {
      prefixId: prefixId,
      prefixName: prefixName,
      topicId: topicId
    }
    return this.http.put(`${this.urlBe}/prefixes/edit-prefix`, body);
  }

  deletePrefix(topicId: string){
    let params = new HttpParams();
    params = params.set('prefixId', topicId);
    return this.http.delete(`${this.urlBe}/prefixes/delete-prefix`, {params});
  }
}
