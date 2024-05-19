import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  private urlBe: string = "https://localhost:3000/api/v1/admin";

  constructor(private http: HttpClient) { }

  getAllTopic(page?: string, size?: string){
    let params = new HttpParams();
    params = params.set('page', page || '0');
    params = params.set('size', size || '10');
    return this.http.get(`${this.urlBe}/topics/all-topic`, {params});
  }

  listTopic(){
    return this.http.get(`${this.urlBe}/topics/list-topic`);
  }
  
  addTopic(topicName: string){
    const body = {
      topicName: topicName
    }
    return this.http.post(`${this.urlBe}/topics/create-topic`, body);
  }

  editTopic(topicId: string, topicName: string){
    const body = {
      topicId: topicId,
      topicName: topicName
    }
    return this.http.put(`${this.urlBe}/topics/edit-topic`, body);
  }

  deleteTopic(topicId: string){
    let params = new HttpParams();
    params = params.set('topicId', topicId);
    return this.http.delete(`${this.urlBe}/topics/delete-topic`, {params});
  }
}
