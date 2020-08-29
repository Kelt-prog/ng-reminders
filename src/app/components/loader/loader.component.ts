import { Component } from '@angular/core';
import { Subject } from 'rxjs';

import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'loader',
  template: `
   <div *ngIf="isLoading | async" class="spinner">
    <nz-spin nzSimple [nzSize]="'large'"></nz-spin>
  </div>`,
})
export class LoaderComponent {
  constructor(private loaderService: LoaderService) {}

  isLoading: Subject<boolean> = this.loaderService.isLoading;
}
