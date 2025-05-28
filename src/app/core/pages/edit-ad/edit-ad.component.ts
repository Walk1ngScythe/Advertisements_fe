import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-edit-ad',
  standalone: false,
  templateUrl: './edit-ad.component.html',
  styleUrl: './edit-ad.component.css'
})
export class EditAdComponent {
  adForm!: FormGroup;
  rubrics: any[] = [];
  mainImageFile: File | null = null;
  additionalImages: File[] = [];
  mainImagePreview: string | null = null;
  additionalImagePreviews: string[] = [];
  existingAdditionalImages: string[] = [];

  adId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.adId = Number(this.route.snapshot.paramMap.get('id'));
    this.adForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      rubric: ['', Validators.required]
    });

    this.api.getRubric().then((data) => {
      this.rubrics = data.results;
    });

    this.api.getAdvertisementById(String(this.adId)).then((ad) => {
      this.adForm.patchValue({
        title: ad.title,
        content: ad.content,
        price: ad.price,
        rubric: ad.rubric_info.id
      });
      this.mainImagePreview = ad.main_image;
      this.existingAdditionalImages = ad.images.map((img: any) => img.image);
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
    if (this.adForm.invalid) return;

    const formData = new FormData();
    formData.append('title', this.adForm.value.title);
    formData.append('content', this.adForm.value.content);
    formData.append('price', this.adForm.value.price);
    formData.append('rubric', this.adForm.value.rubric);

    if (this.mainImageFile) {
      formData.append('main_image', this.mainImageFile);
    }

    try {
      await this.api.updateAd(this.adId, formData);
      if (this.additionalImages.length) {
        await this.api.uploadAdImages(this.adId, this.additionalImages);
      }
      this.router.navigate(['/ad-detail/', this.adId]);
    } catch (error) {
      console.error('Ошибка при обновлении:', error);
      alert('Не удалось обновить объявление');
    }
  }
}
