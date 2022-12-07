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
    return this.http.get<ISentimentResponse>(`${env.baseUrl}insider-sentiment`, {
      params: { symbol, token: env.apiKey },
    });
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
        console.log(data);
        const foundLookup = data.name.result.find(
          (item) => item.symbol === symbol
        );
        return <ISentimentCard>{
          name: foundLookup.description,
          symbol: data.sentiment.symbol,
          monthly: data.sentiment.data.map(({symbol, ...data}) => {
            return {
              trendIcon: this.getTrendIcon(data.change),
              ...data
            }
          })
        };
      })
    );
  }

  getTrendIcon(value: number) {
    if (value < 0) return '🡻';
    if (value > 0) return '🡹';
    else return '-';
  }
}