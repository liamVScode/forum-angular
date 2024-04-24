import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { PostService } from '../../services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CreatePostRequest } from '../../models/CreatePostRequest';
import { HttpHeaders } from '@angular/common/http';
import { CreatePostResponse } from '../../models/CreatePostResponse';
import { FilterService } from '../../services/filter.service';
import { error } from 'jquery';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit{
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
  isUnlimited:boolean = true;

  prefixId : string = '';

  topicPrefix:any;
  postList: any;

  selectedImages: File[] = [];
  imagePreviews: string[] = [];

  prefixIdFilter: string = '';
  searchKeyword: string = '';
  updateTimeFilter: string = '';
  postTypeFilter: string = '';
  sortField: string = '';
  sortOrder: string = '';

  currentPage: number = 1;
  totalPages: number = 1;
  totalElements: number = 0;
  pageSize: number = 10;

  isLoggedIn: boolean = false;
  currentUser?: any;

  isFilter: boolean = false;
  activeFilters: Array<{ key: string, label: string, value: any }> = [];

  constructor(private authService: AuthService, private postService: PostService, private filterService: FilterService, private route: ActivatedRoute, public router: Router){

  }
  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      this.currentUser = this.authService.getCurrentUser();
    });
    this.categoryId = this.route.snapshot.params['categoryId'];
    this.getTopicAndPrefix();
    this.allPostByCategory();
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
      },
      error: (error) => {
        console.log(error);

      }
    })
  }

  allPostByCategory(page?: string){
    const pageNumber = (Number(page) - 1).toString();
    this.postService.getAllPostByCategory(this.categoryId, pageNumber).subscribe({
      next: (response) => {
        this.postList = response;
        console.log(this.postList);
        this.currentPage = this.postList?.result?.pageable?.pageNumber + 1;
        this.totalPages = this.postList?.result?.totalPages;
        this.totalElements = this.postList.result?.totalElements;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  createPost() {
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
    formData.append('title', this.titleInput);
    formData.append('prefixId', this.prefixId.toString());
    formData.append('categoryId', this.categoryId.toString());
    formData.append('commentContent', this.textInput);
    // Handle image files
    console.log(this.selectedImages);

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

    this.postService.createPost(formData).subscribe({
      next: (response) => {
        console.log('Post created:', response);
        this.router.navigate(['category', response.result.categoryDto.categoryId ,'detail-post', response.result.postId]);
      },
      error: (error) => {
        console.error('Error creating post:', error);
      }
    });
  }


  filterPost(page?: string){

    const isFilterEmpty = !this.prefixIdFilter && !this.searchKeyword && !this.updateTimeFilter && !this.postTypeFilter;
    if (isFilterEmpty) {
        this.isFilter = false;
        this.allPostByCategory(page);
        return;
    }else{
      this.isFilter = true;
      this.updateActiveFilters();
    }
    const pageNumber = (Number(page) - 1).toString();
    this.filterService.filterPosts(this.prefixIdFilter, this.searchKeyword, this.updateTimeFilter, this.postTypeFilter,
       this.sortField, this.sortOrder, pageNumber).subscribe({
      next: (response) => {
        this.postList = response;
        this.currentPage = this.postList?.result?.pageable?.pageNumber + 1;
        this.totalPages = this.postList?.result?.totalPages;
        this.totalElements = this.postList.result?.totalElements;
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
      this.allPostByCategory('0');
    } else {
      this.filterPost('0');
    }
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

    if (this.isFilter) {
      this.filterPost(page.toString());
    } else {
      this.allPostByCategory(page.toString());
    }
  }




  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const files = input?.files;
    if (files) {
      this.selectedImages = Array.from(files);
      this.imagePreviews = [];

      Array.from(files).forEach(file => {
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
    this.selectedImages.splice(index, 1);
  }



}
