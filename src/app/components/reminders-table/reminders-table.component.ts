import { Component, OnInit } from '@angular/core';
import { Data } from '../../services/data.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';

interface DataItem {
  note: string;
  date: any;
  id: string;
}

@Component({
  selector: 'reminders-table',
  templateUrl: './reminders-table.component.html',
})
export class RemindersTableComponent implements OnInit {
  constructor(
    public data: Data,
    public localStorageService: LocalStorageService,
    private notification: NzNotificationService,
    private nzMessageService: NzMessageService) {}

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

  ngOnInit() {}
}
