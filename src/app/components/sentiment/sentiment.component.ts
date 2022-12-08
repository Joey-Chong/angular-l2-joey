import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { ErrorMessage } from '../../models/error-message.enum';
import { ISentimentCard } from '../../models/sentiment-card';
import { SentimentService } from '../../services/sentiment.service';

@Component({
  selector: 'app-sentiment',
  templateUrl: './sentiment.component.html',
  styleUrls: ['./sentiment.component.scss'],
})
export class SentimentComponent implements OnInit {
  private unsub$ = new Subject<void>();
  errorMsg: ErrorMessage = null;
  isLoading = false;

  sentimentCard: ISentimentCard;

  constructor(
    private sentimentService: SentimentService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isLoading = true;
    const symbol = this.activatedRoute.snapshot.params.symbol;
    this.getSentimentCard(symbol);
  }

  getSentimentCard(symbol: string) {
    this.sentimentService
      .getCardInfo(symbol)
      .pipe(
        tap((data: ISentimentCard) => {
          console.log(data);
          if (data?.name) {
            this.sentimentCard = data;
            this.errorMsg = null;
          } else if (data !== null) {
            this.sentimentCard = null;
            this.errorMsg = ErrorMessage.notFound;
          } else {
            this.sentimentCard = null;
            this.errorMsg = ErrorMessage.httpError;
          }
          this.isLoading = false;
        }),
        takeUntil(this.unsub$)
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

  getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);
  
    return date.toLocaleString('en-US', { month: 'long' });
  }
}
