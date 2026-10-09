import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import type { MarketTicker } from '../types/market';

const CURRENCY = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 4 });
const COMPACT = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 });
const ASSET_NAMES: Record<string, string> = { BTC: 'Bitcoin', ETH: 'Ethereum', SOL: 'Solana', BNB: 'BNB', XRP: 'XRP' };

function formatPrice(price: number): string {
  return CURRENCY.format(price);
}

function formatVolume(volume: number): string {
  return `$${COMPACT.format(volume)}`;
}

function AssetMark({ symbol }: { symbol: string }) {
  const label = symbol.replace('USDT', '');
  return <span className={`asset-mark asset-${label.toLowerCase()}`}>{label === 'BTC' ? '₿' : label.slice(0, 1)}</span>;
}

export function MarketTable({ markets, filter }: { markets: MarketTicker[]; filter: string }) {
  const visibleMarkets = markets.filter((market) => {
    const query = filter.trim().toLowerCase();
    return !query || market.baseAsset.toLowerCase().includes(query) || (ASSET_NAMES[market.baseAsset] ?? '').toLowerCase().includes(query);
  });

  return (
    <div className="table-scroll">
      <table className="market-table">
        <thead><tr><th>Ativo</th><th>Último preço</th><th>24h</th><th className="optional-column">Máxima 24h</th><th className="optional-column">Mínima 24h</th><th>Volume 24h</th></tr></thead>
        <tbody>
          {visibleMarkets.map((market) => {
            const positive = market.changePercent > 0;
            const negative = market.changePercent < 0;
            return (
              <tr key={market.symbol}>
                <td><div className="asset-cell"><AssetMark symbol={market.symbol} /><span className="asset-copy"><strong>{market.baseAsset}</strong><small>{ASSET_NAMES[market.baseAsset] ?? market.baseAsset} <span>/ USDT</span></small></span></div></td>
                <td className="numeric price-cell">{formatPrice(market.price)}</td>
                <td><span className={`change ${positive ? 'positive' : negative ? 'negative' : 'neutral'}`}>{positive ? <ArrowUpRight size={14} /> : negative ? <ArrowDownRight size={14} /> : <Minus size={14} />}{Math.abs(market.changePercent).toFixed(2)}%</span></td>
                <td className="numeric optional-column muted-number">{formatPrice(market.high24h)}</td>
                <td className="numeric optional-column muted-number">{formatPrice(market.low24h)}</td>
                <td className="numeric volume-cell">{formatVolume(market.quoteVolume)}</td>
              </tr>
            );
          })}
          {visibleMarkets.length === 0 && <tr><td className="empty-state" colSpan={6}>Nenhum ativo encontrado para “{filter}”.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
