import { useState, useEffect, useRef } from 'react';

export const useMarketTrades = (symbol: string) => {
  const [trades, setTrades] = useState<any[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    setTrades([]);
    ws.current = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`);

    ws.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const newTrade = {
        id: msg.t,
        price: msg.p,
        qty: msg.q,
        time: new Date(msg.T).toLocaleTimeString(),
        isBuyerMaker: msg.m // true ise satış, false ise alış
      };

      setTrades((prev) => [newTrade, ...prev].slice(0, 50));
    };

    return () => ws.current?.close();
  }, [symbol]);

  return trades;
};