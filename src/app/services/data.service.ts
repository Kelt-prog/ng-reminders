import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import { NzMessageService } from 'ng-zorro-antd/message';

interface ItemData {
  id: string;
  date: string;
  note: string;
  expired: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class Data {
  endpoint: string = 'https://eu1rope-west1-st-testcase.cloudfunctions.net/';
  response: any;
  id: any;
  answer: any;
  name: string;
  reminders: any = [];
  tableSpinner: boolean = false;

  constructor(
    public localStorageService: LocalStorageService,
    private http: HttpClient,
    private message: NzMessageService
  ) {}

  persist(key: string, value: any) {
    this.localStorageService.set(key, value);
  }

  createErrorMessage(message: string = 'Something went wrong'): void {
    this.message.error(`Error Message: ${message}`, {
      nzDuration: 5000,
      nzPauseOnHover: true,
    });
  }

  setExpiredReminders(reminders): {}[] {
    const currentDate = new Date();
    return reminders.map((remind) => {
      const formatedDate = new Date(remind.date);
      remind.expired = formatedDate < currentDate;
      return remind;
    });
  }

  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};

  updateEditCache(): void {
    this.reminders.forEach((item) => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item },
      };
    });
    console.log(this.reminders);
    console.log(this.editCache);
  }

  getReminders(): void {
    this.http.get(this.endpoint + `api/reminders?userId=${this.id}`).subscribe({
      next: (response) => {
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
    this.http
      .post<any>(this.endpoint + 'api/auth', {})
      .subscribe((response) => {
        this.id = response.id;
        this.name = response.name;
        this.localStorageService.set('id', this.id);
        this.localStorageService.set('name', this.name);
        console.log(response);
        console.log(this.id, this.name);
      });
  }

  createReminder(note?, date?): void {
    this.http
      .post<any>(this.endpoint + `api/reminders?userId=${this.id}`, {
        note,
        date,
      })
      .subscribe({
        next: (response) => {
          this.answer = response;
          this.getReminders();
          console.log('create reminder', this.answer);
        },
        error: (response) => {
          this.createErrorMessage(response.error?.error);
        },
      });
  }

  updateReminder(reminderId: string, note: string, date: string): void {
    this.http
      .put<any>(
        this.endpoint + `api/reminders/${reminderId}?userId=${this.id}`,
        { note, date, })
      .subscribe({
        next: (response) => {
          console.log('обновлено');
        },
        error: (response) => {
          this.createErrorMessage(response.error?.error);
        },
      });
  }

  deleteReminder(reminderId): void {
    const filteredReminders = this.reminders.filter(
      (remind) => remind.id !== reminderId
    );
    this.reminders = filteredReminders;

    this.http
      .delete<any>(
        this.endpoint + `api/reminders/${reminderId}?userId=${this.id}`
      )
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
