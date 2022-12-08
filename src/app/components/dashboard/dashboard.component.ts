import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { ErrorMessage } from '../../models/error-message.enum';
import { IStockCard } from '../../models/stock-card';
import { LocalStorageService } from '../../services/local-storage.service';
import { StockService } from '../../services/stock.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private unsub$ = new Subject<void>();
  errorMsg: ErrorMessage = null;
  isLoading = false;

  stockCards: IStockCard[] = [];
  localStockList: string[] = [];

  constructor(
    private localStorageService: LocalStorageService,
    private stockService: StockService
  ) {}

  ngOnInit() {
    this.localStockList = this.localStorageService.getStockList();
    if (this.localStockList && this.localStockList.length > 0) {
      this.isLoading = true;
      this.localStockList.forEach((symbol: string) => {
        this.addStockCard(symbol);
      });
    }
  }

  onSubmit(form: NgForm) {
    this.errorMsg = null;
    if (form.value.stockSymbol) {
      const formValue = form.value.stockSymbol.toUpperCase();
      // check duplicate first then add to local storage
      if (!this.localStorageService.isDuplicate(formValue)) {
        this.isLoading = true;
        this.addStockCard(formValue);
        this.localStorageService.addStock(formValue);
      } else {
        this.errorMsg = ErrorMessage.duplicate;
      }
      form.resetForm();
    } else {
      this.errorMsg = ErrorMessage.emptySymbol;
    }
  }

  addStockCard(symbol: string) {
    this.stockService
      .getCardInfo(symbol)
      .pipe(
        tap((data: IStockCard) => {
          if (data?.name) {
            this.stockCards.push(data);
            this.errorMsg = null;
          } else if (data !== null) {
            this.errorMsg = ErrorMessage.notFound;
            this.localStorageService.removeStock(symbol);
          } else {
            this.errorMsg = ErrorMessage.httpError;
            this.localStorageService.removeStock(symbol);
          }
          this.isLoading = false;
        }),
        takeUntil(this.unsub$)
      )
      .subscribe();
  }

  removeStockCard(symbol: string) {
    this.stockCards = this.stockCards.filter((item) => item.symbol !== symbol);
    this.localStorageService.removeStock(symbol);
  }

  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }
}
