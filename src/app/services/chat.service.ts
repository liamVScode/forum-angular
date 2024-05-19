import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Message } from '../models/message';
import { BehaviorSubject, Observable, map, of, tap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserDto } from '../models/UserDto';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private urlBe: string = "https://localhost:3000";

  private messageSubject: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);

  private subscriptions = new Set<string>();

  constructor(private http:HttpClient, private webSocketService: WebsocketService){
    this.webSocketService.connect().subscribe();
  }

  getMessageSubject() {
    return this.messageSubject.asObservable();
  }

  // loadChat(chatId: string) {
  //   this.http.get<Message[]>(`${this.urlBe}/api/chat/${chatId}`).pipe(
  //     map(messages => messages.sort((a, b) => Number(a.msgId) - Number(b.msgId)))
  //   ).subscribe(sortedMessages => {
  //     this.messageSubject.next(sortedMessages);
  //   });
  // }

  // joinRoom(chatId: number) {
  //   // ket noi, dang ky nhan tin nhan tu server
  //   this.stompClient.connect({}, () => {
  //     this.stompClient.subscribe(`/topic/${chatId}`, (message: any) => {
  //       const messageContent = JSON.parse(message.body);
  //       const currentMessages = this.messageSubject.getValue();
  //       currentMessages.push(messageContent)
  //       this.messageSubject.next(currentMessages);
  //     });
  //   });
  // }

  loadChat(chatId: string) {
    if (!this.subscriptions.has(chatId)) {
      this.subscriptions.add(chatId);
      this.http.get<{code: string, result: Message[]}>(`${this.urlBe}/api/chat/${chatId}`).pipe(
        map(response => response.result),
        map(messages => messages.sort((a, b) => Number(a.msgId) - Number(b.msgId)))
      ).subscribe(sortedMessages => {
        this.messageSubject.next(sortedMessages);
      });

      this.webSocketService.subscribe(`/topic/${chatId}`, (message: any) => {
        const currentMessages = this.messageSubject.getValue();
        currentMessages.push(message);
        this.messageSubject.next(currentMessages);
        console.log(this.getMessageSubject());
      });
    } else {
      console.log(`Already subscribed to chat ${chatId}`);
    }
  }

  sendMessage(chatId: string, message: any) {
    this.webSocketService.send(`/app/chat/${chatId}`, message);
  }

  createChat(chatName: string, chatType: string, userId: string[]){
    const body = {
      chatName: chatName,
      chatType: chatType,
      userId: userId
    }
    return this.http.post(`${this.urlBe}/api/chat/create-chat`, body);
  }

  loadAllChatByUser(){
    return this.http.get(`${this.urlBe}/api/chat/all-chat-by-user`);
  }

  loadChatWithUser(userId: string){
    let params = new HttpParams().set('userId', userId);
    return this.http.get(`${this.urlBe}/api/chat/chat-with-user`, {params});
  }

}
