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
  dateRange = this.sentimentService.dateRange;

  constructor(
    private sentimentService: SentimentService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    const symbol = this.activatedRoute.snapshot.params.symbol;
    this.getSentimentCard(symbol);
  }

  getSentimentCard(symbol: string): void {
    const date = new Date();
    this.sentimentService
      .getCardInfo(symbol, date)
      .pipe(
        tap((data: ISentimentCard) => {
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

  ngOnDestroy(): void {
    this.unsub$.next();
    this.unsub$.complete();
  }
}
