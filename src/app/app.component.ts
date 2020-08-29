import { Component, OnInit } from '@angular/core';
import { Data } from './services/data.service';
import { LocalStorageService } from './services/local-storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';


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


  startEdit(id: string): void {
    this.data.editCache[id].edit = true;
  }

  cancelEdit(id: string): void {
    const index = this.data.reminders.findIndex((item) => item.id === id);
    this.data.editCache[id] = {
      data: { ...this.data.reminders[index] },
      edit: false,
    };
  }

  saveEdit(id: string): void {
    const { reminders } = this.data;
    const index = reminders.findIndex((item) => item.id === id);
    Object.assign(reminders[index], this.data.editCache[id].data);
    this.data.editCache[id].edit = false;
    this.data.updateReminder(
      reminders[index].id,
      reminders[index].note,
      reminders[index].date
    );
  }



  listOfColumn = [
    {
      title: 'Сообщение',
    },
    {
      title: 'Время срабатывания',
      compare: (a: DataItem, b: DataItem) => a.date.localeCompare(b.date),
    },
    {
      title: 'Действия',
    },
    {
      title: 'Истекло/Активно',
    },
  ];

  constructor(
    public data: Data,
    public localStorageService: LocalStorageService,
    private notification: NzNotificationService,
    private nzMessageService: NzMessageService
  ) {}

  createBasicNotification(): void {
    setTimeout(() => {
      this.notification.blank(
        'Notification Title',
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
