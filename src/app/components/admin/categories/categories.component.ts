import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../services/admin/category.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TopicService } from '../../../services/admin/topic.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  @ViewChild('deleteModal', { static: false }) deleteModal!: ElementRef;
  @ViewChild('editModal') editModal!: ElementRef;
  @ViewChild('addModal') addModal!: ElementRef;

  categories: any[] = [];
  topics: any[] = [];

  deleteCategoryId: string = "";

  currentPage: number = 1;
  totalPages: number = 1;
  totalElements: number = 0;
  pageSize: number = 10;

  showButtons: boolean = false;

  isLoggedIn: boolean = false;
  currentUser: any;

  editedCategory: any = {};
  newCategoryName: string = "";
  newTopicId: string = "";

  constructor(private route : ActivatedRoute, private router: Router,
    private authService: AuthService, private categoryService: CategoryService,
    private topicService: TopicService
  ){

  }
  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      this.currentUser = this.authService.getCurrentUser();
    });
    this.route.params.subscribe(params => {
      this.currentPage = params['page'];
      this.getAllCategories(this.currentPage.toString(), this.pageSize.toString());
    });
    this.getListTopic();
  }

  getAllCategories(page:string, size: string){
    const pageNumber = (Number(page) - 1).toString();
    this.categoryService.getAllCategory(pageNumber, size).subscribe({
      next: (response: any) => {


        this.categories = response?.result?.content;console.log(this.categories);
        this.currentPage = response?.result?.pageable?.pageNumber + 1;
        this.totalPages = response?.result?.totalPages;
        this.totalElements = response?.result?.totalElements;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  getListTopic(){
    this.topicService.listTopic().subscribe({
      next: (response: any) => {
        this.topics = response.result;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  addCategory(){
    this.categoryService.addCategory(this.newCategoryName, this.newTopicId).subscribe({
      next: (response: any) => {
        this.categories.push(response?.result);
        this.getAllCategories(this.currentPage.toString(), this.pageSize.toString());
        alert("Đã thêm thành công");
        this.closeModal();
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  saveChanges(){
    this.categoryService.editCategory(this.editedCategory.categoryId, this.editedCategory.categoryName, this.editedCategory.topicId).subscribe({
      next: (response: any) => {
        alert("Đã sửa thành công");
        this.getAllCategories(this.currentPage.toString(), this.pageSize.toString());
        this.closeModal();
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  deleteCategory(){
    this.categoryService.deleteCategory(this.deleteCategoryId).subscribe({
      next: (response) => {
        alert("Đã xóa thành công");
        this.getAllCategories(this.currentPage.toString(), this.pageSize.toString());
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
    this.router.navigate(['admin', 'categories', 'page', this.currentPage])
  }

  openDeleteModal(categoryId: string) {
    this.deleteCategoryId = categoryId;
  }

  openEditModal(category: any) {
    this.editedCategory = category;
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
