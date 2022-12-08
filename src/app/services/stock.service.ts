import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { env } from '../environment';
import { catchError, map } from 'rxjs/operators';
import {
  IStockCard,
  IStockInfoResponse,
  IStockLookupResponse,
} from '../models/stock-card';
import { getTrendIcon } from '../utils/trend-icon';

@Injectable()
export class StockService {
  constructor(private http: HttpClient) {}

  //TODO: error handling
  getStockInfo(symbol: string): Observable<IStockInfoResponse> {
    return this.http.get<IStockInfoResponse>(`${env.baseUrl}quote`, {
      params: { symbol, token: env.apiKey },
    });
  }

  getStockName(symbol: string): Observable<IStockLookupResponse> {
    return this.http.get<IStockLookupResponse>(`${env.baseUrl}search`, {
      params: { q: symbol, token: env.apiKey },
    });
  }

  getCardInfo(symbol: string): Observable<IStockCard> {
    return forkJoin({
      info: this.getStockInfo(symbol),
      name: this.getStockName(symbol),
    }).pipe(
      map((data) => {
        const foundLookup = data.name.result.find(
          (item) => item.symbol === symbol
        );
        return <IStockCard>{
          name: foundLookup?.description ?? null,
          symbol: foundLookup?.symbol ?? null,
          changeToday: data.info.dp / 100,
          currentPrice: data.info.c,
          openingPrice: data.info.o,
          highPrice: data.info.h,
          trendIcon: getTrendIcon(data.info.dp),
        };
      }),
      catchError((err: HttpErrorResponse) => {
        console.error(err.message);
        return of(null);
      })
    );
  }
}
