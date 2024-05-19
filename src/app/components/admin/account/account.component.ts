import { Component } from '@angular/core';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {
  @ViewChild('deleteModal', { static: false }) deleteModal!: ElementRef;

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
    private authService: AuthService
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
}
