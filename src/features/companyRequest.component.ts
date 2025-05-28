import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalService } from '../shared/model/modal.services';
import { ApiService } from '../app/core/services/api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-company-report-modal',
  standalone: false,
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
      <div class="relative bg-gray-700 rounded-2xl shadow-xl w-full max-w-md p-6 text-white">
        <!-- Кнопка закрыть -->
        <button
          (click)="closeModal()"
          class="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold"
          aria-label="Закрыть"
        >
          ×
        </button>

        <h2 class="text-xl font-semibold mb-4">Заявка на добавление компании</h2>

        <input
          type="text"
          [(ngModel)]="companyName"
          placeholder="Название компании"
          class="w-full mb-3 p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
        />

        <textarea
          [(ngModel)]="description"
          rows="4"
          placeholder="Описание компании..."
          class="w-full mb-3 p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder-gray-400"
        ></textarea>

        <input
          type="file"
          (change)="onFileSelected($event)"
          accept="image/*"
          class="mb-4 text-white"
        />

        <button
          (click)="submitCompanyRequest()"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Отправить заявку
        </button>
      </div>
    </div>
  `
})

export class CompanyRequestComponent implements OnInit, OnDestroy {
  companyName = '';
  description = '';
  selectedFile: File | null = null;
  private modalDataSub!: Subscription;

  constructor(
    public modalService: ModalService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.modalDataSub = this.modalService.modalData$.subscribe((data) => {
      // Можно обрабатывать входящие данные, если потребуется
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  submitCompanyRequest() {
    const trimmedName = this.companyName.trim();
    const trimmedDescription = this.description.trim();

    if (!trimmedName || !trimmedDescription) {
      alert('Пожалуйста, заполните все поля.');
      return;
    }

    if (!this.selectedFile) {
      alert('Пожалуйста, приложите документ в виде фото.');
      return;
    }

    const formData = new FormData();
    formData.append('company_name', trimmedName);
    formData.append('description', trimmedDescription);
    formData.append('documents', this.selectedFile);

    this.apiService.submitCompanyRequest(formData).then(
      (response) => {
        alert('Заявка успешно отправлена!');  // Вот тут уведомление
        console.log('Заявка успешно отправлена:', response);
        this.resetForm();
        this.closeModal();
      },
      (error) => {
        console.error('Ошибка при отправке заявки:', error);
        alert('Не удалось отправить заявку. Попробуйте снова.');
      }
    );
  }

  resetForm() {
    this.companyName = '';
    this.description = '';
    this.selectedFile = null;
  }

  closeModal() {
    this.modalService.close();
  }

  ngOnDestroy(): void {
    if (this.modalDataSub) {
      this.modalDataSub.unsubscribe();
    }
  }
}
