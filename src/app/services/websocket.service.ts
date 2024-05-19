import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import { Observable } from 'rxjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private stompClient: any;
  private isConnected: boolean = false;
  private subscriptionQueue: Array<{destination: string, callback: (message: any) => void}> = [];

  constructor() {
    this.init();
  }

  init() {
    const url = "https://localhost:3000/websocket";
    const socket = new SockJS(url);
    this.stompClient = Stomp.over(socket);
  }

  connect(): Observable<any> {
    return new Observable(observer => {
      if (!this.isConnected) {
        this.stompClient.connect({}, (frame: any) => {
          console.log('Connected: ' + frame);
          this.isConnected = true;
          observer.next(frame);
          observer.complete();
          this.processSubscriptionQueue();
        }, (error: any) => {
          observer.error(error);
        });
      } else {
        observer.next();
        observer.complete();
      }
    });
  }

  subscribe(destination: string, callback: (message: any) => void) {
    if (this.isConnected) {
      this.stompClient.subscribe(destination, (message: any) => {
        callback(JSON.parse(message.body));
      });
    } else {
      this.subscriptionQueue.push({destination, callback});
      console.error('WebSocket is not connected. Subscription request queued.');
    }
  }

  private processSubscriptionQueue() {
    while (this.subscriptionQueue.length > 0) {
      const subscription = this.subscriptionQueue.shift();
      if (subscription) {
        const { destination, callback } = subscription;
        this.subscribe(destination, callback);
      }
    }
  }


  send(destination: string, body: any) {
    if (this.isConnected) {
      this.stompClient.send(destination, {}, JSON.stringify(body));
    } else {
      console.error('Attempted to send message without a connection');
    }
  }
}
