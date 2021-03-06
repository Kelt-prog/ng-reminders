import { Component, OnInit, Input } from '@angular/core';
import { DataService } from './services/data.service';
import { LocalStorageService } from './services/local-storage.service';

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
  constructor(
    public data: DataService,
    public localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    const checkIUserExist = this.localStorageService.get('user');
    if (checkIUserExist != null && checkIUserExist.id != null) {
      this.data.user = { name: checkIUserExist.name, id: checkIUserExist.id };
      console.log('юзер в локал сторедж');
      this.data.getReminders();
    } else {
      this.data.createUser();
      console.log('юзера нет в локал сторедж');
    }
  }
}
