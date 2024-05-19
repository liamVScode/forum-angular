import { ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { LoginComponent } from './components/login/login.component';
import { ForumComponent } from './components/forum/forum.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AuthGuard } from '../Guard/authGuard';
import { GuestGuard } from '../Guard/GuestGuard';
import { DetailPostComponent } from './components/detail-post/detail-post.component';
import { CategoryComponent } from './components/category/category.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';
import { ProfileComponent } from './components/profile/profile.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { PostsComponent } from './components/admin/posts/posts.component';
import { LayoutComponent } from './components/layout/layout.component';
import { AuthAdminGuard } from '../Guard/authAdminGuard';
import { TopicComponent } from './components/admin/topic/topic.component';
import { CategoriesComponent } from './components/admin/categories/categories.component';

export const routes: Routes = [
  {path: '',
  component: LayoutComponent,
    children:[
      {path: 'chat/:userId', component: ChatComponent, canActivate: [AuthGuard]},
      {path: 'login', component: LoginComponent, canActivate: [GuestGuard]},
      {path: 'forum', component: ForumComponent},
      {path: 'signup', component: RegisterComponent, canActivate: [GuestGuard]},
      {path: 'forget-password', component: ForgetPasswordComponent, canActivate: [GuestGuard]},
      {path: 'reset-password', component: ResetPasswordComponent, canActivate: [GuestGuard]},
      {path: 'category/:categoryId/detail-post/:postId/page/:page', component: DetailPostComponent},
      {path: 'category/:categoryId/page/:page', component: CategoryComponent},
      {path: 'category/:categoryId/detail-post/edit-post/:postId', component: EditPostComponent, canActivate: [AuthGuard]},
      {path: 'user-profile/me', component: ProfileComponent, canActivate: [AuthGuard]},
      {path: 'admin/dashboard', component: DashboardComponent}
    ]
  },
  {path: 'admin',
  component: DashboardComponent,
    children: [
      {path: 'posts/page/:page', component: PostsComponent, canActivate: [AuthAdminGuard]},
      {path: 'topics/page/:page', component: TopicComponent, canActivate: [AuthAdminGuard]},
      {path: 'categories/page/:page', component: CategoriesComponent, canActivate: [AuthAdminGuard]}
    ]
  }
];
