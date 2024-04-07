import { ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { LoginComponent } from './components/login/login.component';
import { ForumComponent } from './components/forum/forum.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AuthGuard } from '../authGuard';
import { GuestGuard } from '../GuestGuard';
import { DetailPostComponent } from './components/detail-post/detail-post.component';
import { CategoryComponent } from './components/category/category.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';


export const routes: Routes = [
  // { path: '', redirectTo: '/forum', pathMatch: 'full' },
  {path: 'chat/:userId', component: ChatComponent},
  {path: 'login', component: LoginComponent, canActivate: [GuestGuard]},
  {path: 'forum', component: ForumComponent},
  {path: 'signup', component: RegisterComponent, canActivate: [GuestGuard]},
  {path: 'forget-password', component: ForgetPasswordComponent, canActivate: [GuestGuard]},
  {path: 'reset-password', component: ResetPasswordComponent, canActivate: [GuestGuard]},
  {path: 'detail-post/:postId', component: DetailPostComponent},
  {path: 'category/:categoryId', component: CategoryComponent},
  {path: 'detail-post/edit-post/:postId', component: EditPostComponent, canActivate: [AuthGuard]}
];
