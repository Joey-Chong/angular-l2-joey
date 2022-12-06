import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { env } from '../environment';
import { tap } from 'rxjs/operators';

@Injectable()
export class StockService {
  constructor(private http: HttpClient) {}

  getStockInfo(symbol: string) {
    return this.http.get(`${env.baseUrl}quote`, {
      params: { symbol, token: env.apiKey },
    });
  }

  getStockName(symbol: string) {
    return this.http.get(`${env.baseUrl}search`, {
      params: { q: symbol, token: env.apiKey },
    });
  }

  getCardInfo(symbol: string) {
    return forkJoin({
      info: this.getStockInfo(symbol),
      name: this.getStockName(symbol),
    });
  }
}
