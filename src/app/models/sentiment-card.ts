export interface ISentimentCard {
  name: string;
  symbol: string;
  monthly: {
    trendIcon: '⤴' | '⤵' | '⥮';
    change: number;
    month: number;
    mspr: number;
    year: number;
  }[];
}

export interface ISentimentResponse {
  data: {
    change: number;
    month: number;
    mspr: number;
    symbol: string;
    year: number;
  }[];
  symbol: string;
}
