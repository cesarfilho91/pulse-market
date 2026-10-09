import express from 'express';
import cors from 'cors';
import type { MarketStore } from './services/marketStore.js';
import type { BinanceFeed } from './services/binanceFeed.js';
import { createMarketRouter } from './routes/marketRoutes.js';

export function createApp(store: MarketStore, feed: BinanceFeed, clientOrigin: string) {
  const app = express();
  app.disable('x-powered-by');
  app.use(cors({ origin: clientOrigin.split(',').map((origin) => origin.trim()), methods: ['GET'] }));
  app.use(express.json({ limit: '16kb' }));
  app.use('/api', createMarketRouter(store, feed));
  app.use((_request, response) => response.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found.' } }));
  return app;
}
