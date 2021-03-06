import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ApiService {
  constructor(private http: HttpClient) {}

  private readonly endpoint = 'https://5f4a9dfd41cb390016de3632.mockapi.io/';

  public getAll(userId) {
    return this.http.get(this.endpoint + `auth/${userId}/reminders`);
  }

  public createUser() {
    return this.http.post<any>(this.endpoint + 'auth', {});
  }

  public createReminder(userId, note?, date?) {
    return this.http.post<any>(this.endpoint + `auth/${userId}/reminders`, { note, date });
  }

  public update(userId, reminderId: string, note: string, date: string) {
    return this.http.put<any>(
      this.endpoint + `auth/${userId}/reminders/${reminderId}`,
      { note, date }
    );
  }

  public delete(userId, reminderId: string) {
    return this.http.delete<any>(
      this.endpoint + `auth/${userId}/reminders/${reminderId}`
    );
  }
}
