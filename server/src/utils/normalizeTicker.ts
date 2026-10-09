import type { BinanceTickerMessage, MarketTicker } from '../types.js';

const SUPPORTED_ASSETS = new Set(['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT']);

export function normalizeTicker(payload: BinanceTickerMessage, now = new Date()): MarketTicker | null {
  const symbol = payload.s;
  if (!symbol || !SUPPORTED_ASSETS.has(symbol)) return null;

  const price = Number(payload.c);
  const changePercent = Number(payload.P);
  const high24h = Number(payload.h);
  const low24h = Number(payload.l);
  const quoteVolume = Number(payload.q);

  if (![price, changePercent, high24h, low24h, quoteVolume].every(Number.isFinite)) return null;
  if (price <= 0 || high24h <= 0 || low24h <= 0 || quoteVolume < 0) return null;

  return {
    symbol,
    baseAsset: symbol.replace('USDT', ''),
    quoteAsset: 'USDT',
    price,
    changePercent,
    high24h,
    low24h,
    quoteVolume,
    updatedAt: now.toISOString(),
  };
}
