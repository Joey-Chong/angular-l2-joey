import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  stockList = [{}];

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    console.log(form.value);
    form.resetForm();
    this.localStorageService.addStock('something');
  }
}
