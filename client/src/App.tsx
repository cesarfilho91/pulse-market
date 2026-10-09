import { useMemo, useState } from 'react';
import { Activity, ArrowDownRight, ArrowUpRight, Clock3, Github, Search, ShieldCheck, TrendingUp, Waves } from 'lucide-react';
import { MarketTable } from './components/MarketTable';
import { StatusPill } from './components/StatusPill';
import { useMarketFeed } from './hooks/useMarketFeed';
import './styles.css';

const USD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

function App() {
  const { markets, status, lastUpdated, error } = useMarketFeed();
  const [filter, setFilter] = useState('');
  const [showPositive, setShowPositive] = useState(false);

  const summary = useMemo(() => {
    const sorted = [...markets].sort((a, b) => b.quoteVolume - a.quoteVolume);
    const leader = sorted[0];
    const averageChange = markets.length ? markets.reduce((sum, market) => sum + market.changePercent, 0) / markets.length : 0;
    return { leader, averageChange, gainers: markets.filter((market) => market.changePercent > 0).length };
  }, [markets]);

  const displayedMarkets = showPositive ? markets.filter((market) => market.changePercent > 0) : markets;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#top" aria-label="Pulse Market, início"><span className="brand-symbol"><Waves size={22} /></span><span>pulse<span className="brand-light">market</span><small>MARKET INTELLIGENCE</small></span></a>
        <div className="side-section-label">WORKSPACE</div>
        <a className="nav-item active" href="#markets"><Activity size={17} />Visão geral</a>
        <a className="nav-item" href="#markets"><TrendingUp size={17} />Mercados <span className="nav-count">05</span></a>
        <div className="sidebar-bottom"><div className="sidebar-note"><span className="note-icon"><ShieldCheck size={17} /></span><div><strong>Dados públicos</strong><p>Cotações fornecidas pela Binance. Apenas para consulta.</p></div></div><a className="github-link" href="https://github.com" target="_blank" rel="noreferrer"><Github size={16} /> Projeto open-source <span>↗</span></a></div>
      </aside>

      <main className="main-content" id="top">
        <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <strong>Visão geral</strong></div><div className="topbar-right"><span className="market-hours"><span className="tiny-live-dot" />Mercado global</span><span className="topbar-divider" /><StatusPill status={status} /></div></header>

        <section className="page-intro"><div><div className="eyebrow"><span className="eyebrow-line" /> MARKET OVERVIEW <span className="eyebrow-date">· SPOT</span></div><h1>Mercado em <span>movimento.</span></h1><p>Acompanhe os principais ativos cripto com dados atualizados em tempo real.</p></div><div className="intro-meta"><span className="meta-label">ÚLTIMA ATUALIZAÇÃO</span><strong><Clock3 size={14} />{lastUpdated ? lastUpdated.toLocaleTimeString('pt-BR') : 'Aguardando dados'}</strong><small>Atualização automática</small></div></section>

        {error && <div className="inline-alert" role="status">{error} Verifique se a API está disponível.</div>}

        <section className="stats-grid" aria-label="Resumo do mercado">
          <article className="stat-card"><div className="stat-top"><span>Ativos monitorados</span><span className="stat-icon blue"><Activity size={17} /></span></div><div className="stat-value">{String(markets.length).padStart(2, '0')}<small> pares</small></div><div className="stat-foot"><span className="stat-dot" />Pares selecionados em USDT</div></article>
          <article className="stat-card"><div className="stat-top"><span>Variação média · 24h</span><span className={`stat-icon ${summary.averageChange >= 0 ? 'green' : 'red'}`}><TrendingUp size={17} /></span></div><div className={`stat-value ${summary.averageChange >= 0 ? 'positive-text' : 'negative-text'}`}>{markets.length ? `${summary.averageChange > 0 ? '+' : ''}${summary.averageChange.toFixed(2)}%` : '—'}</div><div className="stat-foot">Média simples dos ativos exibidos</div></article>
          <article className="stat-card"><div className="stat-top"><span>Maior volume · 24h</span><span className="stat-icon purple"><Waves size={17} /></span></div><div className="stat-value stat-value-asset">{summary.leader?.baseAsset ?? '—'}<small>{summary.leader ? USD.format(summary.leader.price) : 'Aguardando dados'}</small></div><div className="stat-foot">{summary.leader ? `Volume ${new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(summary.leader.quoteVolume)} USDT` : 'Sem dados disponíveis'}</div></article>
          <article className="stat-card"><div className="stat-top"><span>Ativos em alta</span><span className="stat-icon green"><ArrowUpRight size={17} /></span></div><div className="stat-value">{String(summary.gainers).padStart(2, '0')}<small> de {String(markets.length).padStart(2, '0')}</small></div><div className="stat-foot"><span className="mini-up"><ArrowUpRight size={12} /></span>Variação positiva nas últimas 24h</div></article>
        </section>

        <section className="market-panel" id="markets"><div className="panel-heading"><div><div className="panel-title-row"><h2>Principais mercados</h2><span className="live-tag"><span />LIVE</span></div><p>Preços spot · Valores em dólar americano (USD)</p></div><div className="panel-controls"><label className="search-box"><Search size={15} /><input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Buscar ativo" aria-label="Buscar ativo" /></label><button className={`filter-button ${showPositive ? 'selected' : ''}`} onClick={() => setShowPositive((current) => !current)}><ArrowDownRight size={14} />Em alta</button></div></div>
          <MarketTable markets={displayedMarkets} filter={filter} />
          <div className="panel-footer"><span><span className="footer-live-dot" />{status === 'connected' ? 'Conexão em tempo real ativa' : status === 'reconnecting' ? 'Reconectando ao feed de mercado…' : 'Estabelecendo conexão…'}</span><span>Fonte: Binance Spot API <span className="footer-separator">·</span> Atualização via WebSocket</span></div>
        </section>

        <footer className="page-footer"><span>© {new Date().getFullYear()} Pulse Market <span className="footer-separator">·</span> Projeto demonstrativo</span><span>Feito para acompanhar o mercado, não para prever o futuro.</span></footer>
      </main>
    </div>
  );
}

export default App;
