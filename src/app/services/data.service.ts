import { Injectable } from '@angular/core';

import { LocalStorageService } from './local-storage.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Data {
  key: string = 'key';
  value: string = 'value';
  endpoint: string = 'https://europe-west1-st-testcase.cloudfunctions.net/';
  userName: string = '';
  response: any;
  postResponse: any;
  id: any;
  answer: any;
  name: string;
  reminders: any = [];
  spinner: boolean = false;
  constructor(
    public localStorageService: LocalStorageService,
    private http: HttpClient
  ) {}
  persist(key: string, value: any) {
    this.localStorageService.set(key, value);
  }

  getReminders() {
    this.http
      .get(
        this.endpoint +
          `api/reminders?userId=${
            this.localStorageService.get('name', 'id').id
          }`
      )
      .subscribe({
        next: (response) => {
            this.reminders = response;
            console.log(response);
        },
        error: (error) => console.error('There was an error!', error),
      });
  }
  createUser() {
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
  createReminder(reminder?, date?) {
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
          error: (error) =>{
            console.error('There was an error!', error);
            this.spinner = false;
          } 
        });
  }
  updateData() {}
  deleteData() {}
  putData() {}
}
