import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { DataService } from '../../services/data.service';
import { LocalStorageService } from '../../services/local-storage.service';

interface ReminderItem {
  note: string;
  date: any;
  id: string;
  expired?: boolean;
}

@Component({
  selector: 'reminders-table',
  templateUrl: './reminders-table.component.html',
})
export class RemindersTableComponent implements OnInit {
  constructor(
    public data: DataService,
    public localStorageService: LocalStorageService
  ) {}

  listOfColumn = [
    { title: 'Сообщение' },
    { title: 'Время срабатывания',
      compare: (a: ReminderItem, b: ReminderItem) => a.date.localeCompare(b.date) },
    { title: 'Действия'},
    { title: 'Истекло/Активно'},
  ];

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

  ngOnInit() {}
}
