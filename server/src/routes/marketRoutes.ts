import { Router } from 'express';
import type { MarketStore } from '../services/marketStore.js';
import type { BinanceFeed } from '../services/binanceFeed.js';

export function createMarketRouter(store: MarketStore, feed: BinanceFeed): Router {
  const router = Router();

  router.get('/markets', (_request, response) => {
    response.setHeader('Cache-Control', 'no-store');
    response.json({ data: store.getAll(), meta: { count: store.size, source: 'binance' } });
  });

  router.get('/health', (_request, response) => {
    const status = feed.status;
    response.status(status === 'connected' ? 200 : 503).json({
      status: status === 'connected' ? 'ok' : 'degraded',
      service: 'pulse-market-api',
      feed: status,
      marketsAvailable: store.size,
      timestamp: new Date().toISOString(),
    });
  });

  return router;
}
