import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
  constructor() {}

  addStock(symbol: string) {
    const stockSymbols: string[] = JSON.parse(
      localStorage.getItem('stockSymbols')
    );
    if (stockSymbols) {
      localStorage.setItem(
        'stockSymbols',
        JSON.stringify(stockSymbols.push(symbol))
      );
    }
  }
}
