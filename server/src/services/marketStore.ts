import type { MarketTicker } from '../types.js';

export class MarketStore {
  private readonly tickers = new Map<string, MarketTicker>();

  upsert(ticker: MarketTicker): void {
    this.tickers.set(ticker.symbol, ticker);
  }

  getAll(): MarketTicker[] {
    return [...this.tickers.values()].sort((a, b) => a.symbol.localeCompare(b.symbol));
  }

  get size(): number {
    return this.tickers.size;
  }
}
