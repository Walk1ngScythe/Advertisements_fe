import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-create-ad',
  standalone: false,
  
  templateUrl: './create-ad.component.html',
  styleUrl: './create-ad.component.css'
})
export class CreateAdComponent {
   adForm!: FormGroup;
  rubrics: any[] = [];
  mainImageFile: File | null = null;

  constructor(private fb: FormBuilder, private api: ApiService) {}

  ngOnInit(): void {
    this.adForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      rubric: ['', Validators.required],
      main_image: [null, Validators.required]
    });

    this.api.getRubric().then(data => {
      this.rubrics = data;
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.mainImageFile = file;
      this.adForm.patchValue({ main_image: file });
    }
  }

  onSubmit(): void {
    if (this.adForm.invalid) return;

    const formData = new FormData();
    formData.append('title', this.adForm.value.title);
    formData.append('content', this.adForm.value.content);
    formData.append('price', this.adForm.value.price);
    formData.append('rubric', this.adForm.value.rubric);
    if (this.mainImageFile) {
      formData.append('main_image', this.mainImageFile);
    }

    // отправка запроса на API
    this.api.createAd(formData).then(() => {
      alert('Объявление создано!');
      this.adForm.reset();
    }).catch(() => alert('Ошибка при создании'));
  }
}
