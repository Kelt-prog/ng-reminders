import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Data } from './services/data.service';
import { LocalStorageService } from './services/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'ng-notifications';
  key: string = 'key';
  value: string = 'value';
  endpoint: string = 'https://europe-west1-st-testcase.cloudfunctions.net/';
  userName: string = '';
  response: any;
  postResponse: any;
  id: any;
  name: string;
  spinner: boolean = false;
  constructor(
    private http: HttpClient,
    public data: Data,
    public localStorageService: LocalStorageService,
  ) {}

  inputHandler(event: any, type: string) {
    if (type == 'key') {
      this.key = event.target.value;
    }
    this.value = event.target.value;
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
