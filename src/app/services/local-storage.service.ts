import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
  constructor() {}

  addStock(symbol: string) {
    const stockSymbols: string[] = JSON.parse(
      localStorage.getItem('stockSymbols')
    );
    if (stockSymbols) {
      if (!this.isDuplicate(symbol)) stockSymbols.push(symbol);
      localStorage.setItem('stockSymbols', JSON.stringify(stockSymbols));
    } else {
      localStorage.setItem('stockSymbols', JSON.stringify([symbol]));
    }
  }

  removeStock(symbol: string) {
    const stockSymbols: string[] = JSON.parse(
      localStorage.getItem('stockSymbols')
    );
    if (stockSymbols) {
      localStorage.setItem(
        'stockSymbols',
        JSON.stringify(stockSymbols.filter((item) => item !== symbol))
      );
    }
  }

  getStockList() {
    return JSON.parse(localStorage.getItem('stockSymbols'));
  }

  isDuplicate(symbol: string): boolean {
    const stockSymbols: string[] = JSON.parse(
      localStorage.getItem('stockSymbols')
    );
    return stockSymbols.indexOf(symbol) !== -1;
  }
}
