import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Injectable, OnInit } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import { BehaviorSubject, Observable, map } from 'rxjs';
import SockJS from 'sockjs-client';
import { Notification } from '../models/Notification';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { WebsocketService } from './websocket.service';
import { UserDto } from '../models/UserDto';


@Injectable({
  providedIn: 'root'
})
export class NotificationService{

  private urlBe: string = "https://localhost:3000";

  private notificationSubject: BehaviorSubject<Notification[]> = new BehaviorSubject<Notification[]>([]);

  currentUser: UserDto | null | undefined;

  constructor(private http: HttpClient, private webSocketService: WebsocketService,
    private authService: AuthService
  ) {
      this.webSocketService.connect().subscribe();
  }

  subscribeNotifications(userId: string | undefined) {
    this.webSocketService.subscribe(`/user/${userId}/topic/notifications`, (notification: any) => {
      const currentNotifications = this.notificationSubject.getValue();
      currentNotifications.unshift(notification);
      this.notificationSubject.next([...currentNotifications]);
    });
  }

  getNotificationSubject() {
    return this.notificationSubject.asObservable();
  }

  updateNotificationStatus(id: string, status: string) {
    const body = { notificationId: id, status: status };
    return this.http.put(`${this.urlBe}/api/notifications/update-notification`, body);
  }

  getAllNotification() {
    this.http.get<{code: string, result: Notification[]}>(`${this.urlBe}/api/notifications/get-all`).pipe(
      map(response => response.result),
      map(messages => messages.sort((a, b) => Number(b.notificationId) - Number(a.notificationId)))
    ).subscribe(notification => {
      this.notificationSubject.next(notification);
    });
  }
}
