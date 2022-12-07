import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SentimentComponent } from './components/sentiment/sentiment.component';
import { LocalStorageService } from './services/local-storage.service';
import { StockService } from './services/stock.service';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports: [BrowserModule, FormsModule, HttpClientModule, AppRoutingModule],
  declarations: [AppComponent, DashboardComponent, SentimentComponent],
  providers: [LocalStorageService, StockService],
  bootstrap: [AppComponent],
})
export class AppModule {}
