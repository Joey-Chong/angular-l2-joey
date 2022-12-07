import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { ISentimentCard } from '../../models/sentiment-card';
import { SentimentService } from '../../services/sentiment.service';

@Component({
  selector: 'app-sentiment',
  templateUrl: './sentiment.component.html',
  styleUrls: ['./sentiment.component.css'],
})
export class SentimentComponent implements OnInit {
  private unsub$ = new Subject<void>();
  notFound = false;

  sentimentCard: ISentimentCard;

  constructor(
    private sentimentService: SentimentService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    const symbol = this.activatedRoute.snapshot.params.symbol;
    this.getSentimentCard(symbol);
  }

  getSentimentCard(symbol: string) {
    this.sentimentService
      .getCardInfo(symbol)
      .pipe(
        tap((data: ISentimentCard) => {
          console.log(data);
          if (data.name) {
            this.sentimentCard = data;
            this.notFound = false;
          } else {
            this.sentimentCard = null;
            this.notFound = true;
          }
        }),
        takeUntil(this.unsub$)
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }
}
