import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeTicker } from '../src/utils/normalizeTicker.js';

const validPayload = { s: 'BTCUSDT', c: '67500.12', P: '2.34', h: '68000', l: '65000', q: '123456789' };

test('normalizes a supported ticker into the public market shape', () => {
  const ticker = normalizeTicker(validPayload, new Date('2026-01-01T00:00:00.000Z'));
  assert.deepEqual(ticker, {
    symbol: 'BTCUSDT', baseAsset: 'BTC', quoteAsset: 'USDT', price: 67500.12,
    changePercent: 2.34, high24h: 68000, low24h: 65000, quoteVolume: 123456789,
    updatedAt: '2026-01-01T00:00:00.000Z',
  });
});

test('ignores symbols outside the supported market list', () => {
  assert.equal(normalizeTicker({ ...validPayload, s: 'DOGEUSDT' }), null);
});

test('rejects malformed or unsafe numeric values', () => {
  assert.equal(normalizeTicker({ ...validPayload, c: 'not-a-number' }), null);
  assert.equal(normalizeTicker({ ...validPayload, c: '-1' }), null);
  assert.equal(normalizeTicker({ ...validPayload, q: '-5' }), null);
});
