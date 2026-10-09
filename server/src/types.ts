export interface MarketTicker {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  price: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  quoteVolume: number;
  updatedAt: string;
}

export interface BinanceTickerMessage {
  s?: string;
  c?: string;
  P?: string;
  h?: string;
  l?: string;
  q?: string;
}

export interface BinanceStreamMessage {
  stream?: string;
  data?: BinanceTickerMessage;
}
