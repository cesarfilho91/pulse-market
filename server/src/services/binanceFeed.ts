import WebSocket from 'ws';
import type { Server as SocketIOServer } from 'socket.io';
import { MarketStore } from './marketStore.js';
import { normalizeTicker } from '../utils/normalizeTicker.js';
import type { BinanceStreamMessage } from '../types.js';

const STREAM_URL = 'wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker/solusdt@ticker/bnbusdt@ticker/xrpusdt@ticker';
const RECONNECT_DELAY_MS = 2_000;

export class BinanceFeed {
  private socket: WebSocket | undefined;
  private reconnectTimer: NodeJS.Timeout | undefined;
  private stopped = true;
  private connected = false;

  constructor(
    private readonly store: MarketStore,
    private readonly io: SocketIOServer,
  ) {}

  start(): void {
    if (!this.stopped) return;
    this.stopped = false;
    this.connect();
  }

  stop(): void {
    this.stopped = true;
    this.connected = false;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = undefined;
    this.socket?.removeAllListeners();
    this.socket?.close();
    this.socket = undefined;
  }

  get status(): 'connected' | 'reconnecting' | 'stopped' {
    if (this.stopped) return 'stopped';
    return this.connected ? 'connected' : 'reconnecting';
  }

  private connect(): void {
    if (this.stopped) return;
    const socket = new WebSocket(STREAM_URL);
    this.socket = socket;

    socket.on('open', () => {
      this.connected = true;
      this.io.emit('feed:status', { status: 'connected' });
    });

    socket.on('message', (raw) => {
      try {
        const message = JSON.parse(raw.toString()) as BinanceStreamMessage;
        if (!message.data) return;
        const ticker = normalizeTicker(message.data);
        if (!ticker) return;
        this.store.upsert(ticker);
        this.io.emit('market:update', ticker);
      } catch {
        // Ignore malformed upstream messages; the next valid tick restores the flow.
      }
    });

    socket.on('error', () => socket.close());
    socket.on('close', () => {
      this.connected = false;
      if (this.stopped) return;
      this.io.emit('feed:status', { status: 'reconnecting' });
      this.reconnectTimer = setTimeout(() => this.connect(), RECONNECT_DELAY_MS);
      this.reconnectTimer.unref();
    });
  }
}
