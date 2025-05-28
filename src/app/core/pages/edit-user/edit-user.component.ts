import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import {ModalService} from '../../../../shared/model/modal.services';
import {ChangePasswordModalComponent} from '../../../../features/change-password-modal.component';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
  standalone: true,
  imports: [ChangePasswordModalComponent, CommonModule, FormsModule]
})
export class EditUserComponent implements OnInit {
  userId!: string;  // Твой ID пользователя
  form = {
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    // возможно другие поля
  };

  message = '';
  loading = false;

  constructor(
    private api: ApiService,
    private modalService: ModalService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    // Загрузка данных пользователя по userId
    this.loadUser();
  }

  async loadUser() {
    try {
      const userData = await this.api.getUserById(this.userId);
      this.form.first_name = userData.first_name;
      this.form.last_name = userData.last_name;
      this.form.email = userData.email;
      this.form.phone_number = userData.phone_number;
    } catch (error) {
      this.message = 'Ошибка загрузки данных пользователя';
    }
  }

  openChangePasswordModal() {
    this.modalService.open('changePasswordModal', { userId: this.userId });
  }

  async saveProfile() {
    this.loading = true;
    try {
      const formData = new FormData();
      formData.append('first_name', this.form.first_name);
      formData.append('last_name', this.form.last_name);
      formData.append('email', this.form.email);
      formData.append('phone_number', this.form.phone_number);

      await this.api.updateUser(Number(this.userId), formData);
      this.message = 'Профиль успешно обновлён!';

    } catch (error) {
      this.message = 'Ошибка обновления профиля';
    } finally {
      this.loading = false;
      await this.router.navigateByUrl(`/my_profile/${this.userId}`);
    }
  }
}
