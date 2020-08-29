import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import ru from '@angular/common/locales/ru';

import { AppComponent } from './app.component';
import { AddReminderComponent } from './components/add-reminder/add-reminder.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RemindersTableComponent } from './components/reminders-table/reminders-table.component';
import { LoaderComponent } from './components/loader/loader.component';
import { LoaderService } from './services/loader.service';
import { LoaderInterceptor } from './interceptors/loader.interceptor';
// Ant Design Angular Components
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { ru_RU } from 'ng-zorro-antd/i18n';

registerLocaleData(ru);

@NgModule({
  declarations: [
    AppComponent,
    AddReminderComponent,
    RemindersTableComponent,
    HeaderComponent,
    FooterComponent,
    LoaderComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    NzButtonModule,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzTableModule,
    NzDatePickerModule,
    NzSpinModule,
    NzMessageModule,
    NzNotificationModule,
    NzPopconfirmModule,
    NzIconModule,
    NzToolTipModule,
  ],
  providers: [
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: NZ_I18N, useValue: ru_RU },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
