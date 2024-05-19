import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../../services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PostadService } from '../../../services/admin/postad.service';
import { AuthService } from '../../../services/auth.service';
import { FilterService } from '../../../services/filter.service';
import { PrefixService } from '../../../services/admin/prefix.service';
import { post } from 'jquery';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent implements OnInit{

  @ViewChild('deleteModal', { static: false }) deleteModal!: ElementRef;

  isFilterPopupVisible: boolean = false;
  isFilter: boolean = false;
  activeFilters: Array<{ key: string, label: string, value: any }> = [];
  prefixIdFilter: string = '';
  searchKeyword: string = '';
  updateTimeFilter: string = '';
  postTypeFilter: string = '';
  sortField: string = '';
  sortOrder: string = '';
  prefixes: any[]=[];


  posts: any[] = [];

  deletePostId: string = "";

  currentPage: number = 1;
  totalPages: number = 1;
  totalElements: number = 0;
  pageSize: number = 10;

  showButtons: boolean = false;

  isLoggedIn: boolean = false;
  currentUser: any;

  constructor(private route : ActivatedRoute, private postadService: PostadService, private router: Router,
    private authService: AuthService, private filterService: FilterService, private prefixService: PrefixService
  ){

  }
  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      this.currentUser = this.authService.getCurrentUser();
    });
    this.route.params.subscribe(params => {
      this.currentPage = params['page'];
      this.getAllPost(this.currentPage.toString(), this.pageSize.toString());
    });
    this.getAllPrefix();
  }

  toggleFilterPopup() {
    this.isFilterPopupVisible = !this.isFilterPopupVisible;
  }

  filterPost(page?: string){
    const isFilterEmpty = !this.prefixIdFilter && !this.searchKeyword && !this.updateTimeFilter && !this.postTypeFilter && !this.sortField;
    if (isFilterEmpty) {
        this.isFilter = false;
        if(page === "")
          this.getAllPost('1', this.pageSize.toString());
        return;
    }else{
      this.isFilter = true;
      this.updateActiveFilters();
    }
    const pageNumber = (Number(page) - 1).toString();
    console.log(this.postTypeFilter);

    this.filterService.filterPosts(this.prefixIdFilter, this.searchKeyword, this.updateTimeFilter, this.postTypeFilter,
       this.sortField, this.sortOrder, pageNumber).subscribe({
      next: (response: any) => {
        this.posts = response.result.content;
        console.log(this.posts);
        this.currentPage = response.result?.pageable?.pageNumber + 1;
        this.totalPages = response.result?.totalPages;
        this.totalElements = response.result?.totalElements;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  updateActiveFilters() {
    this.activeFilters = [];
    if (this.prefixIdFilter) {
        this.activeFilters.push({ key: 'prefix', label: 'Prefix', value: this.prefixIdFilter });
    }
    if (this.searchKeyword) {
        this.activeFilters.push({ key: 'keyword', label: 'Keyword', value: this.searchKeyword });
    }
    if (this.updateTimeFilter) {
        this.activeFilters.push({ key: 'updateTime', label: 'Update Time', value: this.updateTimeFilter });
    }
    if (this.postTypeFilter) {
        this.activeFilters.push({ key: 'postType', label: 'Post Type', value: this.postTypeFilter });
    }
  }

  removeFilter(filterKey: string): void {
    switch (filterKey) {
      case 'prefix':
        this.prefixIdFilter = "";
        break;
      case 'keyword':
        this.searchKeyword = "";
        break;
      case 'updateTime':
        this.updateTimeFilter = "";
        break;
      case 'postType':
        this.postTypeFilter = "";
        break;
      default:
        break;
    }
    // Sau khi xóa bộ lọc, kiểm tra xem còn bộ lọc nào không, nếu không thì tải lại toàn bộ bài viết
    if (!this.prefixIdFilter && !this.searchKeyword && !this.updateTimeFilter && !this.postTypeFilter) {
      this.activeFilters = [];
      this.isFilter = false;
      this.getAllPost(this.currentPage.toString(), this.pageSize.toString());
    } else {
      this.filterPost('0');
    }
  }

  getAllPrefix(){
    this.prefixService.listPrefix().subscribe({
      next: (response: any) => {
        this.prefixes = response.result;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  getAllPost(page:string, size: string){
    const pageNumber = (Number(page) - 1).toString();
    console.log(page, size);

    this.postadService.getAllPost(pageNumber, size).subscribe({
      next: (response: any) => {
        console.log(response);
        this.posts = response?.result?.content;
        this.currentPage = response?.result?.pageable?.pageNumber + 1;
        this.totalPages = response?.result?.totalPages;
        this.totalElements = response?.result?.totalElements;
      },
      error: (error) => {
        console.log(error);
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
    this.router.navigate(['admin', 'posts', 'page', this.currentPage])
  }

  openDeleteModal(postId: string) {
    this.deletePostId = postId;
  }

  deletePost(): void {
    if(this.deletePostId){
      this.postadService.deletePost(this.deletePostId).subscribe({
        next: (response) => {
          this.closeModal();
          alert("Đã xóa bài viết thành công");
          this.deletePostId = "";
          this.getAllPost(this.currentPage.toString(), this.pageSize.toString());
        },
        error: (error: any) => {
          console.error('Error deleting post:', error);
        }
      });
    }

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

  lockPost(postId: string): void {
    this.postadService.lockPost(postId).subscribe(
      () => {
        this.getAllPost(this.currentPage.toString(), this.pageSize.toString());
      },
      (error: any) => {
        console.error('Error locking post:', error);
      }
    );
  }

  unlockPost(postId: string): void {
    this.postadService.unlockPost(postId).subscribe(
      () => {
        this.getAllPost(this.currentPage.toString(), this.pageSize.toString());
      },
      (error: any) => {
        console.error('Error unlocking post:', error);
      }
    );
  }

  detailPost(postId: string): void {
    this.postadService.deletePost(postId).subscribe(
      () => {

      },
      (error: any) => {
        console.error('Error unlocking post:', error);
      }
    );
  }

  calculateStartIndex(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  calculateEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalElements);
  }
}
