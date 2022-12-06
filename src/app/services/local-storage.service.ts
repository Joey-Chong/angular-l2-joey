import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
  constructor() {}

  addStock(symbol: string) {
    const stockSymbols: string[] = JSON.parse(
      localStorage.getItem('stockSymbols')
    );
    if (stockSymbols) {
      stockSymbols.push(symbol);
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
}
