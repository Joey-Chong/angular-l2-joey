import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { IStockCard } from '../../models/stock-card';
import { LocalStorageService } from '../../services/local-storage.service';
import { StockService } from '../../services/stock.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  stockList: IStockCard[] = [];

  constructor(
    private localStorageService: LocalStorageService,
    private stockService: StockService
  ) {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    this.localStorageService.addStock(form.value.stockSymbol);
    this.stockService.getStockInfo('TSLA').pipe(
      tap((info: any) => {
        this.stockList.push({
          name: 'TESLA',
          symbol: 'TSLA',
          changeToday: info.dp,
          currentPrice: info.c,
          openingPrice: info.o,
          highPrice: info.h,
        });
      })
    );
    form.resetForm();
  }
}
