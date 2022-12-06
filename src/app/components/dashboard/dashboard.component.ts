import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { forkJoin, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { IStockCard } from '../../models/stock-card';
import { LocalStorageService } from '../../services/local-storage.service';
import { StockService } from '../../services/stock.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  private unsub$ = new Subject<void>();

  stockCards: IStockCard[] = [];
  stockList: string[] = [];

  constructor(
    private localStorageService: LocalStorageService,
    private stockService: StockService
  ) {}

  ngOnInit() {
    this.stockList = this.localStorageService.getStockList();
    if (this.stockList) {
      this.stockList.forEach((symbol: string) => {
        // this.getStockInfo(symbol);
      });
    }
  }

  onSubmit(form: NgForm) {
    this.localStorageService.addStock(form.value.stockSymbol);
    // this.getStockInfo(form.value.stockSymbol);
    form.resetForm();
  }

  getStockInfo(symbol: string) {
    this.stockService
      .getCardInfo(symbol)
      .pipe(
        tap((data) => {
          console.log(data);
        }),
        takeUntil(this.unsub$)
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }
}
