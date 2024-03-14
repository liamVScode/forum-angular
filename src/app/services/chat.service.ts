import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Message } from '../models/message';
import { BehaviorSubject, Observable, map, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private urlBe: string = "http://localhost:3000";

  private stompClient: any;

  private messageSubject = new BehaviorSubject<Message[]>([]);

  constructor(private http:HttpClient){
    this.initConnectionWebSocket();
  }

  initConnectionWebSocket(){
    const url = "http://localhost:3000/chat-socket";
    const socket = new SockJS(url);
    this.stompClient = Stomp.over(socket);
  }

  getMessageSubject() {
    return this.messageSubject.asObservable();
  }

  loadChat() {
    // fetch api nhan tin nhan
    this.http.get<Message[]>(`${this.urlBe}/api/chat/1`).pipe(
      map(messages => messages.sort((a, b) => a.msgId - b.msgId))
    ).subscribe(sortedMessages => {
      this.messageSubject.next(sortedMessages);
    });
  }

  joinRoom(chatId: number) {
    // ket noi, dang ky nhan tin nhan tu server
    this.stompClient.connect({}, () => {
      this.stompClient.subscribe(`/topic/${chatId}`, (message: any) => {
        const messageContent = JSON.parse(message.body);
        const currentMessages = this.messageSubject.getValue();
        currentMessages.push(messageContent)
        this.messageSubject.next(currentMessages);
      });
    });
  }

  sendMessage(chatId: number, message: Message){
    this.stompClient.send(`/app/chat/${chatId}`, {}, JSON.stringify(message));
  }

}
