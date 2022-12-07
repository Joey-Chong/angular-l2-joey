import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class SentimentService {

  constructor(private http: HttpClient) {}

}