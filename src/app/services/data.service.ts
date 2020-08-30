import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { ApiService } from './api.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

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

@Injectable({
  providedIn: 'root',
})
export class Data {
  constructor(
    public localStorageService: LocalStorageService,
    private api : ApiService,
    private message: NzMessageService,
    private notification: NzNotificationService
  ) {}

  user: UserData;
  reminders: ReminderData[] = [];
  tableSpinner: boolean = false;
  editCache: { [key: string]: { edit: boolean; data: ReminderData } } = {};

  createBasicNotification(note, date = 0): void {

    setTimeout(() => {
      this.notification.blank(
        'Напоминание:',
         note
      );
    }, date);
  }

  updateEditCache(): void {
    this.reminders.forEach((item) => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item },
      };
    });
  }

  createErrorMessage(message: string = 'Something went wrong'): void {
    this.message.error(`Error Message: ${message}`, {
      nzDuration: 5000,
      nzPauseOnHover: true,
    });
  }

  setExpiredReminders(reminders): any {
    const currentDate = new Date();
    return reminders.map((remind) => {
      const formatedDate = new Date(remind.date);
      remind.expired = formatedDate < currentDate;
      return remind;
    });
  }

  getReminders(): void {
    this.api.getAll(this.user.id).subscribe({
      next: (response) => {
        console.log(this.user.id);
        this.reminders = this.setExpiredReminders(response);
        this.tableSpinner = false;
        this.updateEditCache();
      },
      error: (response) => {
        this.createErrorMessage(response.error?.error);
        this.tableSpinner = false;
      },
    });
  }

  createUser(): void {
    this.api.createUser()
      .subscribe((response) => {
        this.user = { name: response.name, id: response.id };
        this.localStorageService.set(response.name, response.id);
        console.log(response);
        console.log(this.user);
      });
  }

  createReminder(note?, date?): void {
    this.api.createReminder(this.user.id, note, date)
      .subscribe({
        next: (response) => {
          this.getReminders();
        },
        error: (response) => {
          this.createErrorMessage(response.error?.error);
        },
      });
  }

  updateReminder(reminderId: string, note: string, date: string): void {
    this.api.update(this.user.id, reminderId, note, date )
      .subscribe({
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
    this.api.delete(this.user.id, reminderId)
      .subscribe({
        next: (response) => {
          console.log('удалено из базы');
        },
        error: (response) => {
          this.createErrorMessage(response.error?.error);
        },
      });
  }
}
