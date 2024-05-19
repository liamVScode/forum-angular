import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostadService } from '../../../services/admin/postad.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TopicService } from '../../../services/admin/topic.service';
import { get } from 'jquery';

@Component({
  selector: 'app-topic',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './topic.component.html',
  styleUrl: './topic.component.scss'
})
export class TopicComponent {
  @ViewChild('deleteModal', { static: false }) deleteModal!: ElementRef;
  @ViewChild('editModal') editModal!: ElementRef;
  @ViewChild('addModal') addModal!: ElementRef;
  topics: any[] = [];

  deleteTopicId: string = "";

  currentPage: number = 1;
  totalPages: number = 1;
  totalElements: number = 0;
  pageSize: number = 10;

  showButtons: boolean = false;

  isLoggedIn: boolean = false;
  currentUser: any;

  editedTopic: any = {};
  newTopicName: string = "";

  constructor(private route : ActivatedRoute, private postadService: PostadService, private router: Router,
    private authService: AuthService, private topicService: TopicService
  ){

  }
  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      this.currentUser = this.authService.getCurrentUser();
    });
    this.route.params.subscribe(params => {
      this.currentPage = params['page'];
      this.getAllTopic(this.currentPage.toString(), this.pageSize.toString());
    });
  }

  getAllTopic(page:string, size: string){
    const pageNumber = (Number(page) - 1).toString();
    console.log(page, size);
    this.topicService.getAllTopic(pageNumber, size).subscribe({
      next: (response: any) => {
        console.log(response);
        this.topics = response?.result?.content;
        this.currentPage = response?.result?.pageable?.pageNumber + 1;
        this.totalPages = response?.result?.totalPages;
        this.totalElements = response?.result?.totalElements;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  addTopic(){
    this.topicService.addTopic(this.newTopicName).subscribe({
      next: (response: any) => {
        this.topics.push(response?.result);
        this.getAllTopic(this.currentPage.toString(), this.pageSize.toString());
        alert("Đã thêm thành công");
        this.closeModal();
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  saveChanges(){
    this.topicService.editTopic(this.editedTopic.topicId, this.editedTopic.topicName).subscribe({
      next: (response: any) => {
        alert("Đã sửa thành công");
        this.getAllTopic(this.currentPage.toString(), this.pageSize.toString());
        this.closeModal();
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  deleteTopic(){
    this.topicService.deleteTopic(this.deleteTopicId).subscribe({
      next: (response) => {
        alert("Đã xóa thành công");
        this.getAllTopic(this.currentPage.toString(), this.pageSize.toString());
        this.closeModal();
      }
    })
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
    this.router.navigate(['admin', 'topics', 'page', this.currentPage])
  }

  openDeleteModal(topicId: string) {
    this.deleteTopicId = topicId;
  }

  openEditModal(topic: any) {
    this.editedTopic = {...topic};
  }


  private closeModal() {
    // Nếu sử dụng Bootstrap Modal
    if (this.deleteModal) {
      this.deleteModal.nativeElement.classList.remove('show');
      this.deleteModal.nativeElement.style.display = 'none';
    }

    if (this.editModal) {
      this.editModal.nativeElement.classList.remove('show');
      this.editModal.nativeElement.style.display = 'none';
    }

    if (this.addModal) {
      this.addModal.nativeElement.classList.remove('show');
      this.addModal.nativeElement.style.display = 'none';
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

  calculateStartIndex(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  calculateEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalElements);
  }

}
