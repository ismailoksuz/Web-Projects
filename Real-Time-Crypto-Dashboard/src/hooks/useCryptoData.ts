import { useState, useEffect, useRef } from 'react';

export const useCryptoData = (symbol: string) => {
  const [data, setData] = useState<{time: string, value: number}[]>([]);
  const [price, setPrice] = useState<string>(''); // Boş başlıyoruz
  const [isReady, setIsReady] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const streamSymbol = symbol.toLowerCase();
    ws.current = new WebSocket(`wss://stream.binance.com:9443/ws/${streamSymbol}@ticker`);

    ws.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.c) {
        const val = parseFloat(msg.c);
        let formattedPrice = val < 1 
          ? parseFloat(val.toFixed(8)).toString() 
          : val.toFixed(2);
        
        setPrice(formattedPrice);
        setIsReady(true); // Veri geldi, hazırız
        
        setData((prev) => {
          const newData = [...prev, { 
            time: new Date().toLocaleTimeString(), 
            value: val 
          }];
          return newData.slice(-30);
        });
      }
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, [symbol]);

  return { data, price, isReady };
};