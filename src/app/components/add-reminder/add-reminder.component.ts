import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'add-reminder',
  templateUrl: './add-reminder.component.html',
  styleUrls: ['./add-reminder.component.scss'],
})
export class AddReminderComponent implements OnInit {
  constructor(public data: DataService, private fb: FormBuilder) {}
  reminderText: string;
  reminderDate: any;
  validateForm!: FormGroup;

  onChangeReminderText(text: string) {
    this.reminderText = text;
  }

  onChosenDate(result: Date): void {
    this.reminderDate = result;
  }

  submitReminder(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
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
