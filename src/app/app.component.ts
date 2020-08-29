import { Component, OnInit } from '@angular/core';
import { Data } from './services/data.service';
import { LocalStorageService } from './services/local-storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

interface DataItem {
  note: string;
  date: any;
  id: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  response: any;
  postResponse: any;
  id: any;
  name: string;

  constructor(
    public data: Data,
    public localStorageService: LocalStorageService,
    private notification: NzNotificationService
  ) {}

  createBasicNotification(): void {
    setTimeout(() => {
      this.notification.blank(
        'Напоминание:',
        'This is the content of the notification. This is the content of the notification. This is the content of the notification.'
      );
    }, 0);
  }

  ngOnInit() {
    const checkIfDataExist = this.localStorageService.get('name', 'id');
    console.log(checkIfDataExist);
    if (checkIfDataExist != null && checkIfDataExist.id != null) {
      this.data.id = checkIfDataExist.id;
      this.data.name = checkIfDataExist.name;
      console.log('юзер в локал сторедж');
    } else {
      this.data.spinner = true;
      this.data.createUser();
      console.log('юзера нет в локал сторедж');
    }
    this.data.getReminders();
    this.data.tableSpinner = true;
  }
}
