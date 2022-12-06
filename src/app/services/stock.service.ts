import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { env } from '../environment';
import { map, tap } from 'rxjs/operators';
import { IStockCard } from '../models/stock-card';

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
    }).pipe(
      map((data: any) => {
        const foundLookup = data.name.result.find(
          (item) => item.symbol === symbol
        );
        return <IStockCard>{
          name: foundLookup.description,
          symbol: foundLookup.symbol,
          changeToday: data.info.dp,
          currentPrice: data.info.c,
          openingPrice: data.info.o,
          highPrice: data.info.h,
        };
      })
    );
  }
}
