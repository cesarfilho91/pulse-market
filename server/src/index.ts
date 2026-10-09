import { createServer } from 'node:http';
import { Server as SocketIOServer } from 'socket.io';
import { env } from './config/env.js';
import { createApp } from './app.js';
import { MarketStore } from './services/marketStore.js';
import { BinanceFeed } from './services/binanceFeed.js';

const store = new MarketStore();
const httpServer = createServer();
const io = new SocketIOServer(httpServer, {
  cors: { origin: env.clientOrigin.split(',').map((origin) => origin.trim()), methods: ['GET'] },
  transports: ['websocket', 'polling'],
});
const feed = new BinanceFeed(store, io);
const app = createApp(store, feed, env.clientOrigin);
httpServer.on('request', app);

io.on('connection', (socket) => {
  socket.emit('market:snapshot', store.getAll());
  socket.emit('feed:status', { status: feed.status });
});

httpServer.listen(env.port, () => {
  console.info(`Pulse Market API listening on port ${env.port}`);
  feed.start();
});

function shutdown(signal: string): void {
  console.info(`${signal} received. Shutting down...`);
  feed.stop();
  io.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 5_000).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
