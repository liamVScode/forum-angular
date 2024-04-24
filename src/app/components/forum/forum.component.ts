import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/User';

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [],
  templateUrl: './forum.component.html',
  styleUrl: './forum.component.scss'
})
export class ForumComponent implements OnInit{

  currentUser : User | null | undefined;

  constructor(private authService: AuthService){

  }

  ngOnInit(){
    this.currentUser = this.authService.getCurrentUser();
  }

}
