"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, LineChart, Line } from 'recharts';
import { Search, Zap, ListTree, Activity, History, ShieldAlert, BarChart3, Info, Skull, Menu, X, LayoutGrid } from 'lucide-react';
import { useCryptoData } from '../hooks/useCryptoData';
import { useOrderBook } from '../hooks/useOrderBook';
import { useMarketTrades } from '../hooks/useMarketTrades';
import { useBinance24hrTicker } from '../hooks/useBinance24hrTicker';

const COIN_LIST = [
  { id: 'BTC', name: 'Bitcoin', symbol: 'BTCUSDT', color: '#f7931a' },
  { id: 'ETH', name: 'Ethereum', symbol: 'ETHUSDT', color: '#627eea' },
  { id: 'SOL', name: 'Solana', symbol: 'SOLUSDT', color: '#14f195' },
  { id: 'BNB', name: 'Binance Coin', symbol: 'BNBUSDT', color: '#f3ba2f' },
  { id: 'XRP', name: 'Ripple', symbol: 'XRPUSDT', color: '#23292f' },
  { id: 'AVAX', name: 'Avalanche', symbol: 'AVAXUSDT', color: '#e84142' },
  { id: 'POL', name: 'Polygon', symbol: 'POLUSDT', color: '#8247e5' },
  { id: 'SHIB', name: 'Shiba Inu', symbol: 'SHIBUSDT', color: '#ff0000' },
];

export default function Dashboard() {
  const [selectedId, setSelectedId] = useState('BTC');
  const [activeTab, setActiveTab] = useState('LIVE_STREAMING');
  const [searchTerm, setSearchTerm] = useState('');
  const [showInfoCard, setShowInfoCard] = useState(false);
  const [liquidations, setLiquidations] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [whaleAlert, setWhaleAlert] = useState<string | null>(null);

  const btc = useCryptoData('BTCUSDT');
  const eth = useCryptoData('ETHUSDT');
  const sol = useCryptoData('SOLUSDT');
  const bnb = useCryptoData('BNBUSDT');
  const xrp = useCryptoData('XRPUSDT');
  const avax = useCryptoData('AVAXUSDT');
  const pol = useCryptoData('POLUSDT');
  const shib = useCryptoData('SHIBUSDT');

  const allData: Record<string, any> = { BTC: btc, ETH: eth, SOL: sol, BNB: bnb, XRP: xrp, AVAX: avax, POL: pol, SHIB: shib };
  const activeCoin = COIN_LIST.find(c => c.id === selectedId)!;
  const activeData = allData[selectedId];
  const orderBook = useOrderBook(activeCoin.symbol);
  const trades = useMarketTrades(activeCoin.symbol);
  const tickers = useBinance24hrTicker(COIN_LIST.map(c => c.symbol));

  useEffect(() => {
    if (activeData?.price) {
      document.title = `[${activeData.price}] ${activeCoin.id}/USDT`;
    }
  }, [activeData?.price, activeCoin.id]);

  useEffect(() => {
    const liqWs = new WebSocket(`wss://fstream.binance.com/ws/!forceOrder@arr`);
    liqWs.onmessage = (e) => {
      const data = JSON.parse(e.data);
      const liq = data.o;
      if (liq.s === activeCoin.symbol) {
        setLiquidations(prev => [{
          symbol: liq.s, side: liq.S, price: liq.p, qty: liq.q, time: new Date().toLocaleTimeString()
        }, ...prev].slice(0, 50));
      }
    };
    return () => liqWs.close();
  }, [activeCoin.symbol]);

  const formatPrice = (price: number) => {
    if (price === 0) return "0.00";
    if (price < 0.0001) return price.toFixed(8);
    if (price < 1) return price.toFixed(6);
    return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const depthData = useMemo(() => {
    if (!orderBook?.bids || !orderBook?.asks) return [];
    const bids = [...orderBook.bids].slice(0, 15).map(b => ({
      price: parseFloat(b[0]), displayPrice: formatPrice(parseFloat(b[0])), amount: parseFloat(b[1]), type: 'bid'
    })).reverse();
    const asks = [...orderBook.asks].slice(0, 15).map(a => ({
      price: parseFloat(a[0]), displayPrice: formatPrice(parseFloat(a[0])), amount: parseFloat(a[1]), type: 'ask'
    }));
    return [...bids, ...asks];
  }, [orderBook]);

  const whales = useMemo(() => {
    const w = trades.filter(t => (parseFloat(t.price) * parseFloat(t.qty)) > 50000);
    if (w.length > 0 && (parseFloat(w[0].price) * parseFloat(w[0].qty)) > 150000) {
      setWhaleAlert(`Whale ${w[0].isBuyerMaker ? 'Sell' : 'Buy'} Detected!`);
      setTimeout(() => setWhaleAlert(null), 3000);
    }
    return w;
  }, [trades]);

  const sentiment = useMemo(() => {
    if (trades.length === 0) return { buy: 0, sell: 0, active: false };
    const buys = trades.filter(t => !t.isBuyerMaker).length;
    const buyPercent = Math.round((buys / trades.length) * 100);
    return { buy: buyPercent, sell: 100 - buyPercent, active: true };
  }, [trades]);

  const filteredCoins = COIN_LIST.filter(c => 
    (allData[c.id]?.isReady) && 
    (c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const activeCoinTicker = tickers.find(t => t.symbol === activeCoin.symbol);

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans relative">
      {whaleAlert && (
        <div className="fixed top-20 right-4 z-[10000] bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-2xl font-bold text-xs animate-bounce border border-indigo-400">
          <ShieldAlert className="inline mr-2" size={14} /> {whaleAlert}
        </div>
      )}

      <div className={`fixed inset-0 z-[100] lg:relative lg:z-0 lg:flex w-72 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full bg-[#020617] lg:bg-slate-900/10 border-r border-slate-800 w-72">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-indigo-500">
              <Activity size={24} />
              <h1 className="font-bold text-sm tracking-tighter uppercase leading-tight">Real Time<br/>Crypto DB</h1>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 p-1"><X size={20} /></button>
          </div>
          <div className="p-4 flex-1 overflow-y-auto no-scrollbar">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input type="text" placeholder="Search..." className="w-full bg-slate-950/50 border border-slate-800 rounded-lg py-2 pl-9 text-xs focus:outline-none focus:border-indigo-500" onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            {filteredCoins.map((coin) => {
              const ticker = tickers.find(t => t.symbol === coin.symbol);
              const priceChange = ticker ? parseFloat(ticker.priceChangePercent) : 0;
              const sparkData = allData[coin.id]?.data || [];
              return (
                <button key={coin.id} onClick={() => { setSelectedId(coin.id); setIsSidebarOpen(false); }} className={`w-full flex justify-between items-center p-3 mb-1 rounded-lg transition-all ${selectedId === coin.id ? 'bg-indigo-600/20 border border-indigo-500/30' : 'hover:bg-slate-800/30'}`}>
                  <div className="flex flex-col text-left gap-1">
                    <span className="text-xs font-bold" style={{color: coin.color}}>{coin.id}</span>
                    <span className={`text-[9px] ${priceChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{priceChange.toFixed(2)}%</span>
                  </div>
                  <div className="w-16 h-8 opacity-50">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sparkData}>
                        <Line type="monotone" dataKey="value" stroke={priceChange >= 0 ? '#10b981' : '#f43f5e'} strokeWidth={1.5} dot={false} isAnimationActive={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold">${allData[coin.id]?.price}</div>
                    <div className="text-[8px] text-slate-500 uppercase font-mono">V:{( (ticker ? parseFloat(ticker.quoteVolume) : 0) / 1000000).toFixed(1)}M</div>
                  </div>
                </button>
              );
            })}
          </div>
          <footer className="p-4 border-t border-slate-800 bg-slate-950/50 shrink-0">
            <a href="https://github.com/ismailoksuz" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 hover:text-indigo-400 transition-colors">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              SYSTEM ACTIVE: İSMAİL ÖKSÜZ
            </a>
          </footer>
        </div>
      </div>

      {isSidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <main className="flex-1 flex flex-col min-w-0 bg-[#020617] w-full">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-950/40 backdrop-blur-md shrink-0 gap-4">
          <div className="flex items-center gap-2 flex-1 overflow-hidden">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-400 shrink-0"><Menu size={20} /></button>
            <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800 overflow-x-auto no-scrollbar gap-1">
              <TabBtn active={activeTab === 'LIVE_STREAMING'} onClick={() => setActiveTab('LIVE_STREAMING')} icon={<Zap size={14}/>} label="Live" />
              <TabBtn active={activeTab === 'DEPTH'} onClick={() => setActiveTab('DEPTH')} icon={<BarChart3 size={14}/>} label="Depth" />
              <TabBtn active={activeTab === 'HEATMAP'} onClick={() => setActiveTab('HEATMAP')} icon={<LayoutGrid size={14}/>} label="Market" />
              <TabBtn active={activeTab === 'ORDERS'} onClick={() => setActiveTab('ORDERS')} icon={<ListTree size={14}/>} label="Book" />
              <TabBtn active={activeTab === 'WHALES'} onClick={() => setActiveTab('WHALES')} icon={<ShieldAlert size={14}/>} label="Whales" />
              <TabBtn active={activeTab === 'LIQ'} onClick={() => setActiveTab('LIQ')} icon={<Skull size={14}/>} label="Liq" />
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-center shrink-0 min-w-[100px]">
            <div className="flex justify-between w-full mb-1 uppercase font-mono text-[8px]">
              <span className="text-emerald-500">BUY</span><span className="text-rose-500">SELL</span>
            </div>
            <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
              {sentiment.active ? (
                <><div className="h-full bg-emerald-500" style={{ width: `${sentiment.buy}%` }} /><div className="h-full bg-rose-500" style={{ width: `${sentiment.sell}%` }} /></>
              ) : <div className="h-full w-full bg-slate-700/50" />}
            </div>
          </div>

          <div className="flex items-center gap-3 relative shrink-0">
            <button onClick={() => setShowInfoCard(!showInfoCard)} className="text-slate-500 hover:text-indigo-400"><Info size={18} /></button>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-white uppercase">{activeCoin.id}/USDT</span>
              <span className="text-[10px] font-mono text-indigo-400 font-bold">${activeData?.price}</span>
            </div>
            {showInfoCard && activeCoinTicker && (
              <div className="absolute top-full right-0 mt-2 p-4 bg-[#0a1122] border border-slate-700 rounded-lg shadow-2xl z-[9999] w-52 text-[10px] animate-in fade-in zoom-in-95 duration-200">
                <div className="space-y-2 font-mono text-slate-300">
                  <div className="flex justify-between border-b border-slate-800 pb-1"><span>24h %</span><span className={parseFloat(activeCoinTicker.priceChangePercent) >= 0 ? 'text-emerald-400' : 'text-rose-400'}>{activeCoinTicker.priceChangePercent}%</span></div>
                  <div className="flex justify-between"><span>High</span><span>${formatPrice(parseFloat(activeCoinTicker.highPrice))}</span></div>
                  <div className="flex justify-between"><span>Low</span><span>${formatPrice(parseFloat(activeCoinTicker.lowPrice))}</span></div>
                  <div className="flex justify-between"><span>Vol</span><span className="text-indigo-400">${(parseFloat(activeCoinTicker.quoteVolume)/1000000).toFixed(1)}M</span></div>
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-hidden relative">
          {activeTab === 'LIVE_STREAMING' && (
            <div className="h-full p-3 lg:p-6 animate-in fade-in duration-500"><div className="h-full bg-slate-900/20 border border-slate-800 rounded-xl p-2 relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activeData?.data}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={activeCoin.color} stopOpacity={0.2}/><stop offset="95%" stopColor={activeCoin.color} stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.1} />
                  <XAxis dataKey="time" hide />
                  <YAxis domain={['auto', 'auto']} orientation="right" tick={{fill: '#475569', fontSize: 8}} width={45} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', fontSize: '10px' }} />
                  <Area type="monotone" dataKey="value" stroke={activeCoin.color} strokeWidth={2} fillOpacity={1} fill="url(#colorVal)" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div></div>
          )}

          {activeTab === 'HEATMAP' && (
            <div className="h-full p-4 overflow-y-auto no-scrollbar animate-in slide-in-from-bottom duration-500">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 h-full content-start">
                {COIN_LIST.map((coin) => {
                  const ticker = tickers.find(t => t.symbol === coin.symbol);
                  const p = ticker ? parseFloat(ticker.priceChangePercent) : 0;
                  return (
                    <div key={coin.id} className={`aspect-square rounded-2xl flex flex-col items-center justify-center border transition-all ${p >= 0 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
                      <span className="text-lg font-black">{coin.id}</span>
                      <span className={`text-xl font-mono font-bold ${p >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{p > 0 ? '+' : ''}{p}%</span>
                      <span className="text-[10px] text-slate-500 mt-2">${allData[coin.id]?.price}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'DEPTH' && (
            <div className="h-full p-3 lg:p-6 animate-in fade-in">
              <div className="h-full bg-slate-900/40 border border-slate-800 rounded-xl p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={depthData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.05} />
                    <XAxis dataKey="displayPrice" tick={{fill: '#475569', fontSize: 8}} interval={3} angle={-45} textAnchor="end" height={40} />
                    <YAxis orientation="right" tick={{fill: '#475569', fontSize: 8}} width={35} />
                    <Bar dataKey="amount">{depthData.map((e, i) => <Cell key={i} fill={e.type === 'bid' ? '#10b981' : '#f43f5e'} />)}</Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'ORDERS' && (
            <div className="h-full p-2 lg:p-6 overflow-y-auto no-scrollbar font-mono text-[10px]">
              <div className="grid grid-cols-3 p-2 bg-slate-900/80 border border-slate-800 text-slate-500 uppercase font-bold rounded-t-lg"><span>Price</span><span className="text-right">Size</span><span className="text-right">Total</span></div>
              <div className="flex flex-col-reverse border-x border-slate-800">{orderBook.asks?.slice(0, 15).map((a, i) => <div key={i} className="grid grid-cols-3 p-2 border-b border-slate-800/30 text-rose-400"><span>{formatPrice(parseFloat(a[0]))}</span><span className="text-right text-slate-300">{parseFloat(a[1]).toFixed(4)}</span><span className="text-right text-slate-500">{(parseFloat(a[0])*parseFloat(a[1])).toFixed(1)}</span></div>)}</div>
              <div className="p-2 bg-indigo-600/10 border-x border-slate-800 text-center text-indigo-400 font-bold">${activeData?.price}</div>
              <div className="flex flex-col border-x border-b border-slate-800 rounded-b-lg">{orderBook.bids?.slice(0, 15).map((b, i) => <div key={i} className="grid grid-cols-3 p-2 border-b border-slate-800/30 text-emerald-400"><span>{formatPrice(parseFloat(b[0]))}</span><span className="text-right text-slate-300">{parseFloat(b[1]).toFixed(4)}</span><span className="text-right text-slate-500">{(parseFloat(b[0])*parseFloat(b[1])).toFixed(1)}</span></div>)}</div>
            </div>
          )}

          {activeTab === 'WHALES' && (
            <div className="h-full p-4 lg:p-6 overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {whales.length > 0 ? whales.map((w, i) => <div key={i} className={`p-4 rounded-xl border animate-in slide-in-from-right ${w.isBuyerMaker ? 'bg-rose-500/5 border-rose-500/20' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
                  <div className="flex justify-between items-center mb-2"><span className="text-[10px] text-slate-500 uppercase font-bold">{w.isBuyerMaker ? 'Whale SELL' : 'Whale BUY'}</span><span className="text-[9px] text-slate-600">{w.time}</span></div>
                  <div className="text-lg font-bold font-mono">${formatPrice(parseFloat(w.price))}</div>
                  <div className="flex justify-between mt-2 text-[10px] font-mono text-slate-400"><span>Amount: {parseFloat(w.qty).toFixed(3)}</span><span>USD: ${(parseFloat(w.price)*parseFloat(w.qty)).toLocaleString()}</span></div>
                </div>) : <div className="col-span-full h-40 flex items-center justify-center text-slate-600 italic text-[10px]"><p>Monitoring Massive Trades...</p></div>}
              </div>
            </div>
          )}

          {activeTab === 'LIQ' && (
            <div className="h-full p-3 overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {liquidations.length > 0 ? liquidations.map((liq, i) => (
                  <div key={i} className={`p-3 rounded-xl border ${liq.side === 'SELL' ? 'bg-rose-500/5 border-rose-500/20' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
                    <div className="flex justify-between items-center mb-1"><span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${liq.side === 'SELL' ? 'bg-rose-500' : 'bg-emerald-500'} text-white`}>{liq.side === 'SELL' ? 'LONG' : 'SHORT'}</span><span className="text-[8px] text-slate-500 font-mono">{liq.time}</span></div>
                    <div className="flex justify-between items-end"><span className="text-xs font-bold font-mono text-white">${formatPrice(parseFloat(liq.price))}</span><span className="text-[8px] text-slate-400 font-mono">Q:{parseFloat(liq.qty).toFixed(2)}</span></div>
                  </div>
                )) : <div className="col-span-full h-40 flex flex-col items-center justify-center text-slate-700 italic text-[10px]"><Skull size={24} className="mb-2 opacity-20" /><p>No Activity</p></div>}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function TabBtn({ active, onClick, icon, label }: any) {
  return (
    <button onClick={onClick} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-bold transition-all shrink-0 ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40' : 'text-slate-500 hover:text-slate-300'}`}>
      {icon} <span>{label}</span>
    </button>
  );
}