import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalService } from '../shared/model/modal.services';
import { ApiService } from '../app/core/services/api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-report-modal',
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

        <h2 class="text-xl font-semibold mb-4 text-white">Отправить жалобу</h2>

        <textarea
          [(ngModel)]="description"
          rows="5"
          placeholder="Опишите проблему..."
          class="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none placeholder-gray-400"
        ></textarea>

        <button
          (click)="sendReport()"
          class="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Отправить жалобу
        </button>
      </div>
    </div>
  `
})
export class ReportModalComponent implements OnInit, OnDestroy {
  description = '';
  authorId: number | null = null; // Для хранения авторского ID
  private modalDataSub!: Subscription; // Для отслеживания изменений в modalData$

  constructor(
    public modalService: ModalService,
    private apiService: ApiService  // Инжектируем ApiService
  ) {}

  ngOnInit(): void {
    // Подписываемся на данные, которые передаются в модалку
    this.modalDataSub = this.modalService.modalData$.subscribe((data) => {
      if (data && data['authorId'] !== undefined) {
        this.authorId = data['authorId']; // Получаем authorId через индексную подпись
        console.log('Получен authorId в модалке:', this.authorId);
      }
    });
  }

  sendReport() {
    const trimmed = this.description.trim();
    if (!trimmed) {
      alert('Пожалуйста, введите описание проблемы.');
      return;
    }

    if (this.authorId === null) {
      alert('Автор не найден.');
      return;
    }

    // Отправка жалобы на сервер
    this.apiService.sendComplaint(this.authorId, trimmed).then(
      (response) => {
        console.log('Жалоба успешно отправлена:', response);
        this.description = ''; // Очищаем поле
        this.closeModal();     // Закрываем модалку
      },
      (error) => {
        console.error('Ошибка при отправке жалобы:', error);
        alert('Не удалось отправить жалобу. Попробуйте снова.');
      }
    );
  }

  closeModal() {
    this.modalService.close(); // Закрытие модалки
  }

  ngOnDestroy(): void {
    // Отписываемся от подписки, когда компонент уничтожается
    if (this.modalDataSub) {
      this.modalDataSub.unsubscribe();
    }
  }
}
