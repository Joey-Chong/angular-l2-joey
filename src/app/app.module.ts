import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SentimentComponent } from './components/sentiment/sentiment.component';

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [AppComponent, DashboardComponent, SentimentComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
