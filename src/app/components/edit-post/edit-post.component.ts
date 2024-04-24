import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/User';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.scss'
})
export class EditPostComponent implements OnInit{
  showButtons : boolean = false;
  showForm : boolean = false;
  selectedButton : number = 1;
  titleInput : string = '';
  textInput : string = '';
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

  selectedImages: File[] = [];
  imagePreviews: string[] = [];
  postId: string = '';

  postDetail : any;

  constructor(private postService: PostService, private route: ActivatedRoute, public router: Router){

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.postId = params['postId'];
      this.categoryId = params['categoryId'];
      this.showDetailPost();
      this.getTopicAndPrefix();
    });
  }


  showDetailPost(){
    this.postService.getPostDetails(this.postId).subscribe({
      next: (response) => {
        this.postDetail = response;
        console.log(this.postDetail);

        this.prefixId = this.postDetail?.result?.prefix.prefixId;
        this.titleInput = this.postDetail?.result?.title;
        this.textInput = this.postDetail?.result?.commentDto[0]?.content;
        this.questionInput = this.postDetail?.result?.poll?.question;
        this.responsesInput = this.postDetail?.result?.poll?.responses.map((res:any) => res.responseContent) || [];
        this.maxResponses = this.postDetail?.result?.poll?.maximumSelectableResponses;
        this.isUnlimited = this.postDetail?.result?.poll?.isUnlimited;
        if (this.isUnlimited) {
          this.maxResponses = 'true';
        } else if (this.maxResponses === 1) {
          this.maxResponses = '1';
        } else {
          this.maxResponses = 'custom';
          this.customMaxResponses = this.postDetail?.result?.poll?.maximumSelectableResponses;
        }
        this.changeVote = this.postDetail?.result?.poll?.changeVote;
        this.displayVote = this.postDetail?.result?.poll?.viewResultNoVote;
        this.imagePreviews = this.postDetail?.result?.commentDto[0]?.imageUrls || [];
        this.selectedImages = [];
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  editPost(){
    let finalMaxResponse: any;
    if (this.maxResponses === 'custom') {
        finalMaxResponse = this.customMaxResponses;
    } else if (this.maxResponses === 'true') {
        finalMaxResponse = 0;
        this.isUnlimited = true;
    } else {
        finalMaxResponse = 1;
    }

    const formData = new FormData();
    formData.append('postId', this.postId);
    formData.append('title', this.titleInput);
    formData.append('prefixId', this.prefixId.toString());
    formData.append('categoryId', this.categoryId.toString());
    formData.append('commentContent', this.textInput);

    if (this.selectedImages && this.selectedImages.length > 0) {
      this.selectedImages.forEach((file: File) => {
          formData.append('imageFiles', file, file.name);
      });
    }

    // Append poll related data only if poll data is available
    if (this.questionInput && this.responsesInput.length > 0) {
      formData.append('pollQuestion', this.questionInput);
      formData.append('maximumSelectableResponses', finalMaxResponse.toString());
      formData.append('isUnlimited', this.isUnlimited.toString());
      formData.append('changeVote', this.changeVote.toString());
      formData.append('viewResultNoVote', this.displayVote.toString());
      formData.append('pollResponses', JSON.stringify(this.responsesInput));
    }

    this.postService.editPost(formData).subscribe({
      next: (response) => {
        console.log('Post edit:', response);
        this.router.navigate(['category', response.result.categoryDto.categoryId ,'detail-post', response.result.postId]);
      },
      error: (error) => {
        console.error('Error editing post:', error);
      }
    });
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




  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const files = input?.files;
    if (files) {
      Array.from(files).forEach(file => {
        this.selectedImages.push(file);
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (reader.result) {
            this.imagePreviews.push(reader.result as string);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  }


  removeImage(index: number): void {
    this.selectedImages.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }
}
