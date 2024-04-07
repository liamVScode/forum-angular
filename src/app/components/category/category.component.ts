import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { PostService } from '../../services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CreatePostRequest } from '../../models/CreatePostRequest';
import { HttpHeaders } from '@angular/common/http';
import { CreatePostResponse } from '../../models/CreatePostResponse';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {
  isFilterPopupVisible: boolean = false;
  showButtons : boolean = false;
  showForm : boolean = false;
  selectedButton : number = 1;
  titleInput : string = '';
  textInput : string = '';
  editorContent : string = '';
  questionInput : string = '';
  responsesInput: string[] = [''];
  maxResponses? :any;
  changeVote : boolean = false;
  publicVote : boolean = false;
  displayVote : boolean = false;
  customMaxResponses? : number;
  categoryId : string = '';
  isUnlimited:boolean = false;
  topicPrefix:any;
  prefixId : string = '';
  private readonly token : string = localStorage.getItem('token') || '';



  constructor(private postService: PostService, private route: ActivatedRoute, private router: Router){
    this.getTopicAndPrefix();
  }

  toggleFilterPopup() {
    this.isFilterPopupVisible = !this.isFilterPopupVisible;
  }

  addResponses(){
    this.responsesInput.push('');
  }

  onInputFocus(index : number){
    if(index === this.responsesInput.length - 1){
      this.addResponses();
    }
  }

  handleButtonClick(buttonNumber: number){
    this.selectedButton = buttonNumber;

    this.showForm = buttonNumber === 1 || buttonNumber === 2;
  }

  getTopicAndPrefix(){
    this.categoryId = this.route.snapshot.params['categoryId'];
    this.postService.getTopicAndPrefix(this.categoryId).subscribe({
      next: (response) => {
        this.topicPrefix = response;
        console.log(this.topicPrefix);
      },
      error: (error) => {
        console.log(error);

      }
    })
  }

  createPost(){
    let finalMaxResponse;
    if(this.maxResponses === 'custom'){
      finalMaxResponse = this.customMaxResponses;
    } else {
      finalMaxResponse = this.maxResponses === 'true' ? 0 : 1;
      this.isUnlimited = true;
    }

    const dataRequest = {
      title : this.titleInput,
      prefixId : this.prefixId,
      categoryId : this.categoryId,
      commentContent : this.textInput,
      imageUrls : [],
      pollQuestion : this.questionInput,
      maximumSelectableResponses : finalMaxResponse,
      isUnlimited : this.isUnlimited,
      changeVote : this.changeVote,
      viewResultNoVote : this.displayVote,
      pollResponses : this.responsesInput
    } as CreatePostRequest
    console.log(dataRequest);


    this.postService.createPost(dataRequest).subscribe({
      next: (response : CreatePostResponse) => {
        console.log(response);
        this.router.navigate(['/detail-post/', response.result.postId])
      },
      error: (error) => {
        console.log(error);

      }
    })
  }



}
