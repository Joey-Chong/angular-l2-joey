export interface IStockCard {
  name: string; //description
  symbol: string; //symbol
  changeToday: number; // dp
  currentPrice: number; // c
  openingPrice: number; // o
  highPrice: number; // h
  trendIcon: '&#129145;' | '&#129147;' | '&#8645;';
}

export interface IStockInfoResponse {
  c: number;
  d: number;
  dp: number;
  h: number;
  l: number;
  o: number;
  pc: number;
  t: number;
}

export interface IStockLookupResponse {
  count: number;
  result: {
    description: string;
    displaySymbol: string;
    symbol: string;
    type: string;
  }[];
}