import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { env } from '../environment';
import { ISentimentCard, ISentimentResponse } from '../models/sentiment-card';
import { IStockLookupResponse } from '../models/stock-card';

@Injectable()
export class SentimentService {
  constructor(private http: HttpClient) {}

  getSentiment(symbol: string): Observable<ISentimentResponse> {
    const date = new Date();
    // using en-CA to get the format we need
    const to = new Date(date.getFullYear(), date.getMonth()).toLocaleDateString(
      'en-CA'
    );
    const from = new Date(
      date.getFullYear(),
      date.getMonth() - 2
    ).toLocaleDateString('en-CA');
    console.log(from);
    console.log(to);
    return this.http.get<ISentimentResponse>(
      `${env.baseUrl}stock/insider-sentiment`,
      {
        params: { symbol, token: env.apiKey, from, to },
      }
    );
  }

  getStockName(symbol: string): Observable<IStockLookupResponse> {
    return this.http.get<IStockLookupResponse>(`${env.baseUrl}search`, {
      params: { q: symbol, token: env.apiKey },
    });
  }

  getCardInfo(symbol: string) {
    return forkJoin({
      sentiment: this.getSentiment(symbol),
      name: this.getStockName(symbol),
    }).pipe(
      map((data) => {
        const foundLookup = data.name.result.find(
          (item) => item.symbol === symbol
        );
        return <ISentimentCard>{
          name: foundLookup.description,
          symbol: data.sentiment.symbol,
          monthly: this.prepareMonthlyDate(data.sentiment.data),
        };
      })
    );
  }

  prepareMonthlyDate(sentimentData) {
    const monthlyData = sentimentData.map(({ symbol, ...data }) => {
      return {
        trendIcon: this.getTrendIcon(data.change),
        ...data,
      };
    });
    // ascending order, making sure data is in order
    return monthlyData.sort((a, b) => a - b);
  }

  getTrendIcon(value: number) {
    if (value < 0) return '🡻';
    if (value > 0) return '🡹';
    else return '-';
  }
}
