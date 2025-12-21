import { useState, useEffect, useRef } from 'react';

export const useOrderBook = (symbol: string) => {
  const [orders, setOrders] = useState<{ bids: any[][], asks: any[][] }>({ bids: [], asks: [] });
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const streamSymbol = symbol.toLowerCase();
    // Bazı durumlarda @depth20 daha stabildir
    ws.current = new WebSocket(`wss://stream.binance.com:9443/ws/${streamSymbol}@depth20`);

    ws.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      
      // Binance stream formatına göre farklı anahtarları kontrol et
      const bids = msg.b || msg.bids || [];
      const asks = msg.a || msg.asks || [];

      if (bids.length > 0 || asks.length > 0) {
        setOrders({ bids, asks });
      }
    };

    ws.current.onerror = (e) => console.log("WS Hata:", e);

    return () => {
      if (ws.current) ws.current.close();
    };
  }, [symbol]);

  return orders;
};