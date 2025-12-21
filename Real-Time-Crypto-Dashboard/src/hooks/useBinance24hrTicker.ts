import { useState, useEffect } from 'react';

export function useBinance24hrTicker(symbols: string[]) {
  const [tickers, setTickers] = useState<any[]>([]);

  useEffect(() => {
    const fetchTickers = async () => {
      try {
        const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbols=${JSON.stringify(symbols)}`);
        const data = await response.json();
        setTickers(data);
      } catch (error) {
        console.error("Ticker fetch error:", error);
      }
    };

    fetchTickers();
    const interval = setInterval(fetchTickers, 10000); 

    return () => clearInterval(interval);
  }, [symbols.join(',')]);

  return tickers;
}