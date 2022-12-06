export interface IStockCard {
  name: string;
  symbol: string;
  changeToday: number; // dp
  currentPrice: number; // c
  openingPrice: number; // o
  highPrice: number; // h
}
