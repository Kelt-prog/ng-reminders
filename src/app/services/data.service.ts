import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { ApiService } from './api.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Howl, Howler } from 'howler';

interface ReminderData {
  id: string;
  date: string;
  note: string;
  expired?: boolean;
}

interface UserData {
  id: string;
  name: string;
}

interface TimeoutsData {
  id: string;
  func: number;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(
    public localStorageService: LocalStorageService,
    private api: ApiService,
    private message: NzMessageService,
    private notification: NzNotificationService
  ) {}

  user: UserData;
  reminders: ReminderData[] = [];
  arrayOfTimeouts: TimeoutsData[] = [];
  tableSpinner: boolean = false;
  editCache: { [key: string]: { edit: boolean; data: ReminderData } } = {};

  createBasicNotification(note: string): void {
    this.notification.blank('Напоминание:', note);
    const sound = new Howl({
      src: ['/assets/clearly.mp3'],
    });
    sound.play();
  }

  createTimeouts(): void {
    const activeReminders = this.reminders.filter(
      (item) => item.expired === false
    );
    activeReminders.forEach((item) => {
      const currentDate = new Date();
      const reminderDate = new Date(item.date);
      const msToActivate = reminderDate.getTime() - currentDate.getTime();
      this.arrayOfTimeouts.push({
        id: item.id,
        func: setTimeout(() => {
          this.createBasicNotification(item.note);
          const expiredIndex = this.reminders.indexOf(
            this.reminders.find((t) => t.id === item.id)
          );
          this.reminders[expiredIndex].expired = true;
        }, msToActivate),
      });
    });
  }

  createErrorMessage(
    message: string = 'Something went wrong',
    error = true
  ): void {
    if (error) {
      this.message.error(`Error Message: ${message}`, {
        nzDuration: 5000,
        nzPauseOnHover: true,
      });
    } else {
      this.message.info(`${message}`, {
        nzDuration: 5000,
        nzPauseOnHover: true,
      });
    }
  }

  updateEditCache(): void {
    this.reminders.forEach((item) => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item },
      };
    });
  }

  setExpiredReminders(reminders): ReminderData[] {
    const currentDate = new Date();
    return reminders.map((remind) => {
      const formatedDate = new Date(remind.date);
      remind.expired = formatedDate < currentDate;

      return remind;
    });
  }

  getReminders(): void {
    this.tableSpinner = true;
    this.api.getAll(this.user.id).subscribe({
      next: (response) => {
        // записываем в стейт напоминания и добавляем к ним boolean (просрочено-активно)
        this.reminders = this.setExpiredReminders(response);
        // очищаем массив с таймерами напоминаний и получаем новый,
        // чтобы избежать дублей и утечек памяти
        this.arrayOfTimeouts.map((item) => clearTimeout(item.func));
        this.createTimeouts();
        this.tableSpinner = false;
        // обновляем массив-кеш с напоминаниями, которые используются для редактирования
        this.updateEditCache();
      },
      error: (response) => {
        this.createErrorMessage(response.error?.error);
        this.tableSpinner = false;
      },
    });
  }

  createUser(): void {
    this.api.createUser().subscribe((response) => {
      // записываем в стейт и локалсторедж данные пользователя
      this.user = { name: response.name, id: response.id };
      this.localStorageService.set(response.name, response.id);
      this.createErrorMessage(
        `Пользователь: ${response.name} - авторизован`,
        false
      );
      console.log(response);
      console.log(this.user);
    });
  }

  createReminder(note?, date?): void {
    this.api.createReminder(this.user.id, note, date).subscribe({
      next: (response) => {
        this.getReminders();
      },
      error: (response) => {
        this.createErrorMessage(response.error?.error);
      },
    });
  }

  updateReminder(reminderId: string, note: string, date: string): void {
    this.api.update(this.user.id, reminderId, note, date).subscribe({
      next: (response) => {
        this.getReminders();
      },
      error: (response) => {
        this.createErrorMessage(response.error?.error);
      },
    });
  }

  deleteReminder(reminderId: string): void {
    const filteredReminders = this.reminders.filter(
      (remind) => remind.id !== reminderId
    );
    this.reminders = filteredReminders;
    this.api.delete(this.user.id, reminderId).subscribe({
      next: (response) => {
        console.log('удалено из базы');
      },
      error: (response) => {
        this.createErrorMessage(response.error?.error);
      },
    });
  }
}
