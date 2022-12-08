import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
  constructor() {}

  addStock(symbol: string): void {
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

  removeStock(symbol: string): void {
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

  getStockList(): string[] {
    return JSON.parse(localStorage.getItem('stockSymbols'));
  }

  isDuplicate(symbol: string): boolean {
    const stockSymbols: string[] = JSON.parse(
      localStorage.getItem('stockSymbols')
    );
    if (!stockSymbols) return false;
    return stockSymbols.indexOf(symbol) !== -1;
  }
}
