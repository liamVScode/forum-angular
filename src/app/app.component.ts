import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, LayoutComponent, DashboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{

  constructor(private authService: AuthService, private userService: UserService) {}

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    this.updateUserStatus("1");
  }

  ngOnInit() {
    this.authService.handleTokenExpiration();
  }


  private updateUserStatus(status: string) {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.email) {
      this.userService.updateStatus(currentUser.email, status).subscribe({
        next: (response: any) => {
          console.log('User status updated successfully.');
        },
        error: (error: any) => {
          console.error('Failed to update user status:', error);
        }
      });
    }
  }
  title = 'forum-infor-exchange-angular';
}
