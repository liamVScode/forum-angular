import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResponseService {

  private urlBe: string = "https://localhost:3000/api/posts/polls/responses";
  constructor(private http:HttpClient) { }

  vote(responseId: string[]){
    const body = { responseId: responseId };
    return this.http.post(`${this.urlBe}/vote`, body);
  }

  updateVote(pollId: string, responseId: string[]){
    const body = {
      pollId: pollId,
      responseId: responseId
    }
    return this.http.post(`${this.urlBe}/update-vote`, body);
  }

  getResponseByPoll(pollId: string){
    let params = new HttpParams().set('pollId', pollId);
    return this.http.get(`${this.urlBe}/get-response-by-poll`, {params})
  }
}
