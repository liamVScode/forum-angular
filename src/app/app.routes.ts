import { ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { LoginComponent } from './components/login/login.component';
import { ForumComponent } from './components/forum/forum.component';


export const routes: Routes = [
  { path: '', redirectTo: '/forum', pathMatch: 'full' },
  {path: 'chat/:userId', component: ChatComponent},
  {path: 'login', component: LoginComponent},
  {path: 'forum', component: ForumComponent},

];
