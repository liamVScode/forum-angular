import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { UserDto } from '../../models/UserDto';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../models/Notification';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

  isLoggedIn : boolean = false;
  currentUser : UserDto | null | undefined;
  notifications: any[] = [];
  unreadCount = 0;

  constructor(public router: Router, private authService: AuthService,
    private notificationService: NotificationService,
    private sanitizer: DomSanitizer
  ){
    this.authService.currentUser?.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });
    this.currentUser = this.authService.currentUserValue;
    if(this.currentUser){
      this.notificationService.subscribeNotifications(this.currentUser?.userId);
      this.loadNotifications();
      this.listenForNewNotifications();
    }
  }

  loadNotifications() {
    this.notificationService.getAllNotification();
  }

  listenForNewNotifications() {
    this.notificationService.getNotificationSubject().subscribe((notification: any[]) => {
      this.notifications = notification;
      this.unreadCount = notification.filter(noti => noti.status === 0).length;
    });
  }

  readNotification(notification: any) {
    this.router.navigate([notification.link]);
    if (notification.status === 0) {
      this.notificationService.updateNotificationStatus(notification.notificationId, '1').subscribe(() => {
        notification.status = 1;
        this.unreadCount--;
        this.notifications = [...this.notifications];
      });
    }
  }

  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }


  logout(){
    this.authService.logout().subscribe({
      next: (response: any) => {
        this.router.navigate(['/forum']);
      }
    });
  }

  toHome(){
    this.router.navigate(['/']);
  }

  toLogin(){
    this.router.navigate(['/login']);
  }

  toRegister(){
    this.router.navigate(['/signup']);
  }

  toForum(){
    this.router.navigate(['/forum']);
  }
}
