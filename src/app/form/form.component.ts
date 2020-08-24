import { Component, OnInit } from '@angular/core';
import { Data } from '../services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'formS',
  template: `
    <h2>Создать напоминание</h2>
    <form
      nz-form
      [formGroup]="validateForm"
      (ngSubmit)="submitReminder()"
      [nzLayout]="'vertical'"
    >
      <nz-form-item>
        <nz-form-control [nzSpan]="12" nzErrorTip="Введите текст напоминания">
          <input
            id="reminder-text"
            type="text"
            formControlName="formReminderText"
            nz-input
            (change)="onChangeReminderText($event.target.value)"
            placeholder="Введите текст напоминания"
          />
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-control [nzSpan]="12" nzErrorTip="Выберите дату">
          <nz-date-picker
            nzShowTime
            nzFormat="yyyy-MM-dd HH:mm:ss"

            formControlName="formReminderDate"
            (nzOnOk)="onChosenDate($event)"
          >
          </nz-date-picker>
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-control [nzSpan]="12">
          <button nz-button nzType="primary">
            Создать напоминание
          </button>
          <hr />
        </nz-form-control>
      </nz-form-item>
    </form>
    <button nz-button nzType="primary" (click)="this.data.getReminders()">
      получить список
    </button>
  `,
  styles: [
    `
      h2 {
        text-align: center;
        padding-right: 70px;
        margin: 50px 0 20px;
      }
      .ant-btn-primary {
        width: 100%;
      }
      nz-date-picker,
      nz-month-picker,
      nz-range-picker,
      nz-week-picker {
        margin: 0 8px 12px 0;
        width: 100%;
      }
    `,
  ],
})
export class Form implements OnInit {
  constructor(public data: Data, private fb: FormBuilder) {}
  reminderText: string;
  reminderDate: any;
  validateForm!: FormGroup;

  onChangeReminderText(text) {
    this.reminderText = text;
  }

  onChosenDate(result: Date): void {
    this.reminderDate = result.toISOString();
  }

  submitReminder(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      this.data.spinner = true;
      this.data.createReminder(this.reminderText, this.reminderDate);
      this.validateForm.reset();
    }
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      formReminderText: [null, [Validators.required]],
      formReminderDate: [null, [Validators.required]],
    });
  }
}
