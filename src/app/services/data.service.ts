import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root',
})
export class Data {
  endpoint: string = 'https://europe-west1-st-testcase.cloudfunctions.net/';
  response: any;
  //postResponse: any;
  id: any;
  answer: any;
  name: string;
  reminders: any = [];
  spinner: boolean = false;

  constructor(
    public localStorageService: LocalStorageService,
    private http: HttpClient,
    private message: NzMessageService,
  ) {}

  persist(key: string, value: any) {
    this.localStorageService.set(key, value);
  }

  createErrorMessage(message: string = "Something went wrong"): void {
    this.message.error(`Error Message: ${message}`, {
      nzDuration: 5000,
      nzPauseOnHover: true,
    });
  }

  getReminders(): void {
    this.http
      .get(
        this.endpoint +
          `api/reminders?userId=${this.id}`
      )
      .subscribe({
        next: (response) => {
            this.reminders = response;
            console.log(response);
        },
        error: (response) =>{
          this.createErrorMessage(response.error?.error);
        }
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
        this.spinner = false;
      });
  }

  createReminder(reminder?, date?): void {
      this.http
        .post<any>(
          this.endpoint + `api/reminders?userId=${this.id}`,
          {
            note: reminder,
            date: date,
          }
        )
        .subscribe({
          next: (response) => {
            this.answer = response;
            this.spinner = false;
            console.log('create reminder', this.answer);
          },
          error: (response) => {
            this.createErrorMessage(response.error?.error);
            this.spinner = false;
          } 
        });
  }

  updateData(): void {}

  deleteData(): void {}

  putData(): void {}
}
