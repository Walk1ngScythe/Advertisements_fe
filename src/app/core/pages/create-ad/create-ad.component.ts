import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-create-ad',
  standalone: false,
  templateUrl: './create-ad.component.html',
  styleUrl: './create-ad.component.css'

})
export class CreateAdComponent {

   adForm!: FormGroup;
  rubrics: any[] = [];
  mainImagePreview: string | null = null;
  additionalImagePreviews: string[] = [];
  mainImageFile: File | null = null;
  additionalImages: File[] = [];

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.adForm = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
    price: ['', [Validators.required, Validators.min(0)]],
    rubric: ['', Validators.required]
  });

    this.api.getRubric().then(data => {
      this.rubrics = data;
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.mainImageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.mainImagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onMultipleFilesChange(event: any): void {
    const files = Array.from(event.target.files) as File[];
    this.additionalImages = files;
    this.additionalImagePreviews = [];

    for (let file of files) {
      const reader = new FileReader();
      reader.onload = () => {
        this.additionalImagePreviews.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.adForm.invalid || !this.mainImageFile) {
      alert('Заполните все поля и выберите главное изображение');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.adForm.value.title);
    formData.append('content', this.adForm.value.content);
    formData.append('price', this.adForm.value.price);
    formData.append('rubric', this.adForm.value.rubric);
    formData.append('main_image', this.mainImageFile);

    try {
      const ad = await this.api.createAd(formData); 
      await this.uploadAdditionalImages(ad.id);     
      this.adForm.reset();
      this.goToUserProfilePage();
    } catch (error) {
      console.error('Ошибка при создании:', error);
      alert('Ошибка при создании');
    }
  }

  async uploadAdditionalImages(bbId: number): Promise<void> {
    for (let image of this.additionalImages) {
      const formData = new FormData();
      formData.append('bb', bbId.toString());
      formData.append('image', image);
      try {
        await this.api.uploadImage(formData);
      } catch (e) {
        console.error('Ошибка при загрузке изображения:', e);
      }
    }
  }

  goToUserProfilePage(): void {
    const myId = this.authService.getUserIdFromLocalStorage();
    this.router.navigate(['/my_profile', myId]);
  }

}
