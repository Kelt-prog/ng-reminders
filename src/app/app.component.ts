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
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  response: any;
  postResponse: any;
  id: any;
  name: string;
  spinner: boolean = false;

  listOfColumn = [
    {
      title: 'Сообщение',
    },
    {
      title: 'Время срабатывания',
      compare: (a: DataItem, b: DataItem) => a.date.localeCompare(b.date),
    },
    {
      title: 'Действия'
    }
  ];
  
  constructor(
    public data: Data,
    public localStorageService: LocalStorageService,
    private notification: NzNotificationService,
  ) {}

  createBasicNotification(): void {
    setTimeout(() => {
      this.notification
      .blank(
        'Notification Title',
        'This is the content of the notification. This is the content of the notification. This is the content of the notification.'
      )  
    }, 1000);
    
  }

  ngOnInit() {
    const checkIfDataExist = this.localStorageService.get('name', 'id');
    console.log(checkIfDataExist);
    if (checkIfDataExist != null && checkIfDataExist.id != null) {
      this.data.id = checkIfDataExist.id;
      this.data.name = checkIfDataExist.name;
      console.log('юзер в локал сторедж');
    } else {
      this.spinner = true;
      this.data.createUser();
      console.log('юзера нет в локал сторедж');
    }
    this.data.getReminders();
    console.log(this.data.reminders);
  }
}
