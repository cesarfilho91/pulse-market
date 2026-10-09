import { useEffect, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { fetchMarkets } from '../services/marketApi';
import type { FeedStatus, MarketTicker } from '../types/market';

const SOCKET_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

interface FeedState {
  markets: MarketTicker[];
  status: FeedStatus;
  lastUpdated: Date | null;
  error: string | null;
}

export function useMarketFeed() {
  const [state, setState] = useState<FeedState>({ markets: [], status: 'connecting', lastUpdated: null, error: null });

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const socket: Socket = io(SOCKET_URL || undefined, { transports: ['websocket', 'polling'], reconnection: true, reconnectionAttempts: Infinity });

    fetchMarkets(controller.signal)
      .then((markets) => {
        if (active && markets.length) setState((current) => ({ ...current, markets, lastUpdated: new Date(), error: null }));
      })
      .catch(() => {
        if (active) setState((current) => ({ ...current, error: 'Não foi possível carregar a cotação inicial.' }));
      });

    socket.on('connect', () => setState((current) => ({ ...current, status: 'connected', error: null })));
    socket.on('disconnect', () => setState((current) => ({ ...current, status: 'reconnecting' })));
    socket.on('connect_error', () => setState((current) => ({ ...current, status: 'reconnecting' })));
    socket.on('feed:status', (event: { status: 'connected' | 'reconnecting' }) => {
      setState((current) => ({ ...current, status: event.status }));
    });
    socket.on('market:snapshot', (markets: MarketTicker[]) => {
      if (!active || !markets.length) return;
      setState((current) => ({ ...current, markets, lastUpdated: new Date(), error: null }));
    });
    socket.on('market:update', (ticker: MarketTicker) => {
      if (!active) return;
      setState((current) => {
        const markets = new Map(current.markets.map((market) => [market.symbol, market]));
        markets.set(ticker.symbol, ticker);
        return { ...current, markets: [...markets.values()].sort((a, b) => a.symbol.localeCompare(b.symbol)), lastUpdated: new Date(), error: null };
      });
    });

    return () => {
      active = false;
      controller.abort();
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, []);

  return state;
}
