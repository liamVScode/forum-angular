import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserDto } from '../../models/UserDto';
import { ForuminfoService } from '../../services/foruminfo.service';
import { error } from 'jquery';
import { TimeAgoPipe } from '../../../time-ago.pipe';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { StatisticsService } from '../../services/statistics.service';

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, TimeAgoPipe],
  templateUrl: './forum.component.html',
  styleUrl: './forum.component.scss'
})
export class ForumComponent implements OnInit{

  currentUser : UserDto | null | undefined;

  posts?: any[] = [];

  infoList? : any[] =[];

  showOverlay: boolean = false;

  numberOfOnlineUser: string = "";
  numberOfUser: string = "";
  numberOfPost: string = "";
  numberOfComment: string = "";

  constructor(private authService: AuthService, private forumService: ForuminfoService,
    public router: Router, private statisticsService: StatisticsService
  ){
  }

  ngOnInit(){
    this.currentUser = this.authService.getCurrentUser();
    this.getAllPost();
    this.getForumInfo();
    this.getNumberOfComment();
    this.getNumberOfOnlineUser();
    this.getNumberOfPost();
    this.getNumberOfUser();
  }

  getNumberOfUser(){
    this.statisticsService.getNumberOfUser().subscribe({
      next: (response: any) => {
        this.numberOfUser = response?.result;
      }
    });
  }
  getNumberOfComment(){
    this.statisticsService.getNumberOfComment().subscribe({
      next: (response: any) => {
        this.numberOfComment = response?.result;
      }
    });
  }
  getNumberOfPost(){
    this.statisticsService.getNumberOfPost().subscribe({
      next: (response: any) => {
        this.numberOfPost = response?.result;
      }
    });
  }
  getNumberOfOnlineUser(){
    this.statisticsService.getNumberOfOnlineUser().subscribe({
      next: (response: any) => {
        this.numberOfOnlineUser = response?.result;
      }
    });
  }

  getAllPost(){
    this.forumService.getAllPost().subscribe({
      next: (response: any) => {
        this.posts = response?.result?.content;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  getForumInfo(){
    this.forumService.getForumInfo().subscribe({
      next: (response: any) => {
        this.infoList = response?.result;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

}
