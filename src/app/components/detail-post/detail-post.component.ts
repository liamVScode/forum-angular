import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../services/post.service';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from '../../../time-ago.pipe';
import { UserDto } from '../../models/UserDto';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { ImageSanitizerService } from '../../services/ImageSanitizerService';
import { CommentService } from '../../services/comment.service';
import { LikeService } from '../../services/like.service';
import { LikeDto } from '../../models/LikeDto';
import { Comment } from '../../models/Comment';
import { ResponseService } from '../../services/response.service';

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

  currentUser:UserDto | null | undefined;

  isLoggedIn: boolean = false;

  content?: string;

  selectedImages: File[] = [];
  imagePreviews : string[] = [];

  categoryId : string = '';
  topicPrefix : any;

  commentList: any;
  likeList: { [commentId: string]: LikeDto[] } = {};

  currentPage: number = 1;
  totalPages: number = 1;
  totalElements: number = 0;
  pageSize: number = 10;

  poll: any;
  totalVotes: number = 0;

  selectedResponses: any[] = [];

  hasVoted : boolean = false;
  numSelected: number = 0;
  isEdittingVote: boolean = false;
  responses: any;

  showOverlay: boolean = false;

  constructor(private route : ActivatedRoute, private postService: PostService,
    public router: Router, private authService: AuthService,
    private commentService: CommentService,
    private likeService: LikeService,
    private responseService: ResponseService){

  }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      this.currentUser = this.authService.getCurrentUser();
    });
    this.route.params.subscribe(params => {
      this.postId = params['postId'];
      this.categoryId = params['categoryId'];
      this.currentPage = params['page'];
      this.showDetailPost(this.currentPage.toString());
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

  showDetailPost(page: string){
    this.postService.getPostDetails(this.postId).subscribe({
      next: (response: any) => {
        this.postDetail = response;
        console.log(response);
        this.loadPoll();
        this.allCommentByPost(page);
        if(this.postDetail?.result?.poll != null){
          this.poll = this.postDetail?.result?.poll;
          this.totalVotes = this.poll.responses.reduce((total: number, currentResponse: { voteCount: number }) => {
            return total + currentResponse.voteCount;
        }, 0);
        }
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  allCommentByPost(page: string){
    const pageNumber = (Number(page) - 1).toString();
    this.commentService.getAllCommentByPost(this.postId, pageNumber).subscribe({
      next: (response) => {
        this.commentList = response;
        this.commentList.result.content.map((comment: any) => this.allLikeByComment(comment.commentId))
        this.currentPage = this.commentList?.result?.pageable?.pageNumber + 1;
        this.totalPages = this.commentList?.result?.totalPages;
        this.totalElements = this.commentList.result?.totalElements;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  allLikeByComment(commentId: string){
    this.likeService.getAllLikeByComment(commentId).subscribe({
      next: (response : LikeDto[] | any) => {
        this.likeList[commentId] = response.result;

        this.getLikeSummary(commentId);
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


    this.commentService.createComment(formData).subscribe({
      next : (response) => {
        this.allCommentByPost(this.totalPages.toString());
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
        this.closeModal();
        this.router.navigate(['category', this.categoryId, 'page', '1']);
        alert("Đã xóa bài viết thành công");
      },
      error: (error) => {
        console.log(error);

      }
    })
  }

  likeComment(commentId: string){
    console.log(commentId);

    this.likeService.likeComment(commentId).subscribe({
      next: (response) => {
        this.allCommentByPost(this.currentPage.toString());
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  unlikeComment(commentId: string){
    console.log(commentId);

    this.likeService.unlikeComment(commentId).subscribe({
      next: (response) => {
        this.allCommentByPost(this.currentPage.toString());
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  isCommentLikedByCurrentUser(commentId: string): boolean {
    const likes = this.likeList[commentId];
    return likes && likes.some(like => like?.userDto?.userId === this.currentUser?.userId);
  }


  getLikeSummary(commentId: string): string {
    const likes = this.likeList[commentId];

    if (!likes || !Array.isArray(likes) || likes.length === 0) {
        return "Chưa có lượt thích";
    }

    const currentUserLiked = likes.some(like => like?.userDto?.userId === this.currentUser?.userId);

   const otherUserLikes = likes.filter(like => like?.userDto?.userId !== this.currentUser?.userId)
                                .map(like => `${like?.userDto?.firstName} ${like?.userDto?.lastName}`);

    let summary = currentUserLiked ? ['Bạn'] : [];
    otherUserLikes.forEach(userName => {
        if (summary.length < 3) {
            summary.push(userName);
        }
    });


    if (likes.length > 3) {
        const othersCount = likes.length - summary.length;
        summary[2] = `${summary[2]} và ${othersCount} người khác`;
    }

    return summary.join(', ') + ' đã thích';
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

  updateNumSelected() {
    this.numSelected = this.poll.responses.filter((res: any) => res.selected).length;
  }

  onSelectResponse(response: any) {
    if (this.isUnlimited || this.selectedResponses.length < this.poll.maximumSelectableResponses || response.selected) {
        let index = this.selectedResponses.findIndex(res => res.responseId === this.poll.responses.responseId);
        if (index === -1) {
          if (this.canSelectMore(response)) {
              this.selectedResponses.push(response);
              this.updateNumSelected();
          }
      } else {
          this.selectedResponses.splice(index, 1);
          this.updateNumSelected();
      }
    }
}


canSelectMore(selectedResponse: any): boolean {
  this.updateNumSelected();
  if (this.poll.isUnlimited) {
    return true;
  }
  if (selectedResponse.selected) {
    return true;
  }
  return this.numSelected < this.poll.maximumSelectableResponses;
}

loadPoll() {
  this.responseService.getResponseByPoll(this.postDetail?.result?.poll?.pollId).subscribe({
    next: (response : any) => {
      this.poll.responses.forEach((pollResponse:any) => {
        const votedResponse = response.result.find((r:any) => r.responseId === pollResponse.responseId);
        pollResponse.selected = votedResponse ? votedResponse.responseUsers.some((ru:any) => ru.userId === this.currentUser?.userId) : false;
      });
      this.hasVoted = response.result.some((res:any) => res.responseUsers.some((ru:any) => ru.userId === this.currentUser?.userId));
    },
    error: (error) => {
      console.error('Error when voting', error);
    }
  });
}



vote() {
  this.selectedResponses = this.poll.responses.filter((response: any) => response.selected).map((response: any) => response.responseId);
  this.responseService.vote(this.selectedResponses).subscribe({
    next: (response) => {
      console.log('Vote successfully submitted', response);
      this.showDetailPost(this.currentPage.toString());
      this.hasVoted = true;
      this.isEdittingVote = false;
    },
    error: (error) => {
      console.error('Error when voting', error);
    }
  });
}

updateVote(){
  this.isEdittingVote = false;
  this.selectedResponses = this.poll.responses.filter((response: any) => response.selected).map((response: any) => response.responseId);
  this.responseService.updateVote(this.postDetail?.result?.poll?.pollId, this.selectedResponses).subscribe({
    next: (response) => {
      this.showDetailPost(this.currentPage.toString());
      this.hasVoted = true;
      this.isEdittingVote = false;
    },
    error: (error) => {
      console.error('Error when voting', error);
    }
  });
}

enableVote(){
  this.isEdittingVote = true;
}

cancelEdit(){
  this.isEdittingVote = false;
}



get isUnlimited() {
    return this.poll.isUnlimited;
}

get changeVote() {
    return this.poll.changeVote;
}

get viewResultsNoVote() {
    return this.poll.viewResultsNoVote;
}

  removeImage(index: number): void {
    this.selectedImages.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  pagesToShow(): number[] {
    const visiblePages = 5;
    const pages: number[] = [];
    const startPage: number = Math.max(this.currentPage - Math.floor(visiblePages / 2), 1);
    const endPage: number = Math.min(startPage + visiblePages - 1, this.totalPages);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    if (Number(page) < 1 || Number(page) > this.totalPages) {
      return;
    }
    this.currentPage = Number(page);
    this.router.navigate(['category', this.categoryId, 'detail-post', this.postId, 'page', this.currentPage])
  }

}
