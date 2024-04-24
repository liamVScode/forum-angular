import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../services/post.service';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from '../../../time-ago.pipe';
import { User } from '../../models/User';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { ImageSanitizerService } from '../../services/ImageSanitizerService';

@Component({
  selector: 'app-detail-post',
  standalone: true,
  imports: [CommonModule, TimeAgoPipe, FormsModule],
  templateUrl: './detail-post.component.html',
  styleUrl: './detail-post.component.scss'
})
export class DetailPostComponent implements OnInit{

  @ViewChild('deleteModal', { static: false }) deleteModal!: ElementRef;

  postId : string = "";

  postDetail : any;

  currentUser:User | null | undefined;

  isLoggedIn: boolean = false;

  content?: string;

  selectedImages: File[] = [];
  imagePreviews : string[] = [];

  categoryId : string = '';
  topicPrefix : any;

  constructor(private route : ActivatedRoute, private postService: PostService,
     public router: Router, private authService: AuthService){

  }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      this.currentUser = this.authService.getCurrentUser();
    });
    this.route.params.subscribe(params => {
      this.postId = params['postId'];
      this.categoryId = params['categoryId'];
      this.showDetailPost();
      this.getTopicAndPrefix();
    });

  }

  getTopicAndPrefix(){
    this.postService.getTopicAndPrefix(this.categoryId).subscribe({
      next: (response) => {
        this.topicPrefix = response;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  showDetailPost(){
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

  commentPost(){
    if (!this.content) {
      console.error("Content is empty or undefined.");
      return;
    }

    const formData = new FormData();
    formData.append('content', this.content);
    formData.append('postId', this.postId);
    // Handle image files
    if (this.selectedImages && this.selectedImages.length > 0) {
      this.selectedImages.forEach((file: File) => {
          formData.append('imageFiles', file, file.name);
      });
    }


    this.postService.createComment(formData).subscribe({
      next : (response) => {
        console.log(response);
        this.showDetailPost();
        this.content = '';
        this.imagePreviews = [];
      },
      error : (error) => {
        console.log(error);

      }
    })
  }

  deletePost(){

    this.postService.deletePost(this.postId).subscribe({
      next: (response) => {
        console.log(response);
        this.closeModal();
        this.router.navigate(['category', this.categoryId])

        alert("Đã xóa bài viết thành công");
      },
      error: (error) => {
        console.log(error);

      }
    })
  }

  private closeModal() {
    // Nếu sử dụng Bootstrap Modal
    if (this.deleteModal) {
      this.deleteModal.nativeElement.classList.remove('show');
      this.deleteModal.nativeElement.style.display = 'none';
    }

    // Xóa modal backdrop
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.parentNode?.removeChild(backdrop);
    }
    if (document.body.style.overflow === 'hidden') {
      document.body.style.overflow = 'auto';
    }

  }

  handleEdit(i : number, commentId : string){
    if(i === 0){
      this.postId = this.route.snapshot.params['postId'];
      this.router.navigate(['category', this.categoryId, 'detail-post', 'edit-post', this.postId]);
    } else {

    }
  }


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const files = input?.files;
    if (files && files.length > 0) {
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
