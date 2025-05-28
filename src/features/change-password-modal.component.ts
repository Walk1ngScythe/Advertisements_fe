import { Component, OnDestroy } from '@angular/core';
import { ModalService, ModalType, ModalData } from '../shared/model/modal.services';
import { ApiService } from '../app/core/services/api.service';
import { Subscription } from 'rxjs';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `<div *ngIf="isOpen">
    <div *ngIf="(modalService.modalType$ | async) === 'changePasswordModal'"
         class="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">

      <div class="bg-gray-800 p-6 rounded-lg w-80 shadow-lg">
        <h3 class="text-lg font-bold mb-4 text-white">Сменить пароль</h3>

        <form (ngSubmit)="submit()">
          <label class="block text-white mb-1">Старый пароль</label>
          <input type="password" [(ngModel)]="old_password" name="old_password" required
                 class="w-full px-3 py-2 mb-3 rounded bg-gray-700 text-white" />

          <label class="block text-white mb-1">Новый пароль</label>
          <input type="password" [(ngModel)]="new_password" name="new_password" required
                 class="w-full px-3 py-2 mb-3 rounded bg-gray-700 text-white" />

          <label class="block text-white mb-1">Подтверждение пароля</label>
          <input type="password" [(ngModel)]="new_password_confirm" name="new_password_confirm" required
                 class="w-full px-3 py-2 mb-3 rounded bg-gray-700 text-white" />

          <div class="flex justify-between items-center">
            <button type="submit" [disabled]="loading"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              {{ loading ? 'Отправка...' : 'Сменить' }}
            </button>

            <button type="button" (click)="close()"
                    class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
              Отмена
            </button>
          </div>

          <div *ngIf="message" class="mt-3 text-sm text-red-400">{{ message }}</div>
        </form>
      </div>
    </div>
  </div>
  `
})
export class ChangePasswordModalComponent implements OnDestroy {

  old_password = '';
  new_password = '';
  new_password_confirm = '';

  message = '';
  loading = false;

  userId!: number;
  isOpen = false;

  private subscriptions: Subscription[] = [];

  constructor(
    public modalService: ModalService,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Подписываемся на события модалки
    this.subscriptions.push(
      this.modalService.modalType$.subscribe(type => {
        if (type === 'changePasswordModal') {
          this.resetForm();
        } else {
          this.isOpen = false;
        }
      }),
      this.modalService.isOpen$.subscribe(isOpen => {
        this.isOpen = isOpen;
      }),
      this.modalService.modalData$.subscribe((data: ModalData) => {
        const userId = data['userId'];
        if (userId) {
          this.userId = userId;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  resetForm() {
    this.old_password = '';
    this.new_password = '';
    this.new_password_confirm = '';
    this.message = '';
    this.isOpen = true;
  }

  close() {
    this.modalService.close();
  }

  async submit() {
    if (this.new_password !== this.new_password_confirm) {
      this.message = 'Новый пароль и подтверждение не совпадают';
      return;
    }
    this.message = '';
    this.loading = true;

    try {
      await this.api.changePassword(String(this.userId), this.old_password, this.new_password, this.new_password_confirm);

      this.message = 'Пароль успешно изменён!';
      setTimeout(() => this.close(), 1500);
    } catch (error: any) {
      this.message = 'Ошибка: ' + (error.message || 'неизвестная ошибка');
    } finally {
      this.loading = false;
      await this.router.navigateByUrl(`/my_profile/${this.userId}`);
    }
  }
}
