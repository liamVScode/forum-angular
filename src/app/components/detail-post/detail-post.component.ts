import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../services/post.service';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from '../../../time-ago.pipe';

@Component({
  selector: 'app-detail-post',
  standalone: true,
  imports: [CommonModule, TimeAgoPipe],
  templateUrl: './detail-post.component.html',
  styleUrl: './detail-post.component.scss'
})
export class DetailPostComponent implements OnInit{

  postId : string = "";

  postDetail : any;

  constructor(private route : ActivatedRoute, private postService: PostService, private router: Router){

  }
  ngOnInit(): void {
    this.showDetailPost();
  }

  showDetailPost(){
    this.postId = this.route.snapshot.params['postId'];
    this.postService.getPostDetails(this.postId).subscribe({
      next: (response) => {
        console.log(response);

        this.postDetail = response;
      },
      error: (error) => {
        console.log(error);

      }
    })
  }

  handleEdit(i : number, commentId : string){
    if(i === 0){
      this.postId = this.route.snapshot.params['postId'];
      this.router.navigate(['/detail-post/edit-post/', this.postId]);
    } else {

    }
  }
}
