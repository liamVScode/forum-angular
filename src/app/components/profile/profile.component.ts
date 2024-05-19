import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { MustMatch } from '../../../password.validator';
import { ChangePasswordRequest } from '../../models/ChangePasswordRequest';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  @ViewChild('fileInput') fileInput: any;
  activeSection: string = 'personal-info';

  passwordForm! : FormGroup;

  isEditing: boolean = false;
  currentUser: any;
  userProfile: any;

  changePasswordClicked: boolean = false;
  activities: any[] = [];

  currentPage: number = 1;
  totalPages: number = 1;
  totalElements: number = 0;
  pageSize: number = 20;

  selectedImage: File | null | undefined;
  imagePreview: string ="";

  constructor(private http: HttpClient, private authService: AuthService, private userService: UserService,
    private formBuilder: FormBuilder, public router: Router
  ){
    this.authService.currentUser?.subscribe(user => {
      this.currentUser = user;
      this.userProfile = { ...this.currentUser };
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', Validators.required]
    }, {
      validator: MustMatch('newPassword', 'confirmNewPassword')
    });
    this.getAllActivity(this.currentPage.toString());
  }

  showContent(section: string) {
    this.activeSection = section;
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  openFileInput() {
    this.fileInput.nativeElement.click();
  }

  handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      if (this.selectedImage) {
        this.selectedImage = null;
        this.imagePreview = '';
      }

      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (reader.result) {
          this.imagePreview = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  confirmImage(){
    const formData = new FormData();

    if (this.selectedImage) {
        formData.append('avatar', this.selectedImage, this.selectedImage.name);
    }

    this.userService.changeAvatar(formData).subscribe({
      next: (response: any) => {
        this.userProfile = response.result;
        this.currentUser = this.userProfile;
        localStorage.setItem('currentUser', JSON.stringify(this.userProfile));
        alert("Đã thay đổi ảnh đại diện.");
        this.cancelImage();
      },
      error: (error) => {
        console.log(error);

      }
    })
  }

  cancelImage(): void {
    this.selectedImage = null;
  }

  getAllActivity(page?: string){
    const pageNumber = (Number(page) - 1).toString();
    this.userService.getAllActivities(page).subscribe({
      next: (response: any) => {
        this.activities = response?.result?.content;
        this.currentPage = response?.result?.pageable?.pageNumber + 1;
        this.totalPages = response?.result?.totalPages;
        this.totalElements = response?.result?.totalElements;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  saveChanges() {
    this.isEditing = false;
    const body = {
      firstName: this.userProfile.firstName,
      lastName: this.userProfile.lastName,
      dateOfBirth: this.userProfile.dateOfBirth,
      location: this.userProfile.location,
      website: this.userProfile.website,
      about: this.userProfile.about,
      skype: this.userProfile.skype,
      facebook: this.userProfile.facebook,
      twitter: this.userProfile.twitter
    }
    this.userService.editUser(body).subscribe({
      next: (response: any) => {
        this.userProfile = response.result;
        this.currentUser = this.userProfile;
        localStorage.setItem('currentUser', JSON.stringify(this.userProfile));
        alert("Đã sửa thông tin thành công");
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  changePassword(){
    if(this.passwordForm.valid){
      const { currentPassword, newPassword } = this.passwordForm.value;
      const changePasswordRequest: ChangePasswordRequest = { currentPassword, newPassword };
      this.authService.changePassword(changePasswordRequest).subscribe({
        next: (response) => {
          alert("Đổi mật khẩu thành công, vui lòng đăng nhập lại.");
          this.authService.logout().subscribe(() => {
            this.router.navigate(['/login']);
          });
        },
        error: (error) => {
          if(error.error && error.error.code === 1010){
            alert("Mật khẩu không chính xác");
          }
          console.log(error);
        }
      });
    }
  }

  cancelChangePassword(){
    this.changePasswordClicked = false;
  }

  cancelEdit(){
    this.isEditing = false;
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
    this.getAllActivity(this.currentPage.toString());
  }

}
