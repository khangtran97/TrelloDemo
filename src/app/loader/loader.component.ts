import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LoaderService } from './loader.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-loading',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  loading: boolean;
  constructor(private loaderService: LoaderService,
              private SpinnerService: NgxSpinnerService,
              private cdRef: ChangeDetectorRef) {
    this.loaderService.isLoading.subscribe((v) => {
      this.loading = v;
      if (this.loading) {
        this.SpinnerService.show();
      } else {
        this.SpinnerService.hide();
      }
    });
  }
  ngOnInit() {
  }

}