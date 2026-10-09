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

export type FeedStatus = 'connecting' | 'connected' | 'reconnecting' | 'offline';
