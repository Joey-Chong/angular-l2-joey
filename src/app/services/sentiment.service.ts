import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import { env } from '../environment';
import {
  IDateRange,
  ISentimentCard,
  ISentimentResponse,
} from '../models/sentiment-card';
import { IStockLookupResponse } from '../models/stock-card';
import { getTrendIcon } from '../utils/trend-icon';

@Injectable()
export class SentimentService {
  constructor(private http: HttpClient) {}

  dateRange: IDateRange = {
    fromDate: null,
    toDate: null,
  };

  getSentiment(symbol: string, date: Date): Observable<ISentimentResponse> {
    // endpoint doesn't cross year?
    this.dateRange.toDate = new Date(date.getFullYear(), date.getMonth());
    this.dateRange.fromDate = new Date(date.getFullYear(), date.getMonth() - 2);
    // using en-CA to get the format we need
    return this.http.get<ISentimentResponse>(
      `${env.baseUrl}stock/insider-sentiment`,
      {
        params: {
          symbol,
          token: env.apiKey,
          from: this.dateRange.fromDate.toLocaleDateString('en-CA'),
          to: this.dateRange.toDate.toLocaleDateString('en-CA'),
        },
      }
    );
  }

  getStockName(symbol: string): Observable<IStockLookupResponse> {
    return this.http.get<IStockLookupResponse>(`${env.baseUrl}search`, {
      params: { q: symbol, token: env.apiKey },
    });
  }

  getCardInfo(symbol: string, date: Date): Observable<ISentimentCard> {
    return forkJoin({
      sentiment: this.getSentiment(symbol, date),
      name: this.getStockName(symbol),
    }).pipe(
      map((data) => {
        const foundLookup = data.name.result.find(
          (item) => item.symbol === symbol
        );
        return <ISentimentCard>{
          name: foundLookup?.description ?? null,
          symbol: data.sentiment.symbol,
          monthly: this.prepareMonthlyDate(data.sentiment.data),
        };
      }),
      catchError((err: HttpErrorResponse) => {
        console.error(err.message);
        return of(null);
      })
    );
  }

  prepareMonthlyDate(sentimentData): ISentimentCard['monthly'] {
    // ascending order, making sure data is in order
    let monthlyData = sentimentData.sort((a, b) => a.month - b.month);
    return monthlyData.map(({ symbol, ...data }) => {
      return {
        trendIcon: getTrendIcon(data.change),
        fullDate: new Date(data.year, data.month - 1),
        ...data,
      };
    });
  }
}
