import type { MarketTicker } from '../types/market';

const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

interface MarketsResponse {
  data: MarketTicker[];
}

export async function fetchMarkets(signal?: AbortSignal): Promise<MarketTicker[]> {
  const response = await fetch(`${API_URL}/api/markets`, { signal, headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Market API returned ${response.status}`);
  const payload = (await response.json()) as MarketsResponse;
  return payload.data;
}
