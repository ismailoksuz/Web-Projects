# Real-Time Crypto Analytics Dashboard

A high-performance, responsive cryptocurrency surveillance terminal built with Next.js 15 and Tailwind CSS. This application provides institutional-grade market data visualization by interfacing directly with Binance WebSocket API for zero-latency price and order book updates.

## Live Demo
https://real-time-crypto-dashboard-git-main-ismailoksuzs-projects.vercel.app/

## Core Functionalities

### Market Surveillance
* Live Price Streaming: Real-time price action monitoring with high-frequency updates.
* Interactive Area Charts: Dynamic price history visualization utilizing Recharts for smooth data transitions.
* Sparkline Integration: Per-asset mini trend indicators within the sidebar for immediate market sentiment analysis.

### Advanced Order Flow Tools
* Real-Time Order Book: Visualized L2 bid/ask depth with automatic spread calculation.
* Depth Chart: Bar-based market depth visualization to identify significant support and resistance zones.
* Whale Tracker: Automated filtering system for identifying large-scale market transactions (transactions > $50,000 USD).
* Liquidation Monitor: Real-time tracking of forced liquidations across the futures market.

### Technical Indicators & Analytics
* Market Sentiment Engine: Dynamic buy/sell volume ratio analysis based on recent trade execution.
* Relative Change Heatmap: A comprehensive market overview grid displaying percentage changes across all tracked assets.
* Asset Statistics: Detailed 24-hour high, low, and volume metrics via REST API integration.

## Technical Architecture

### Frontend Stack
* Framework: Next.js 15 (App Router)
* Styling: Tailwind CSS
* Icons: Lucide React
* Charts: Recharts
* State Management: React Hooks (useState, useMemo, useEffect)

### Data Sources
* WebSocket: Binance wss://stream.binance.com:9443 for real-time trade and depth data.
* Futures WebSocket: Binance fstream.binance.com for global liquidation event monitoring.
* REST API: Binance v3/ticker/24hr for daily statistics and volume data.

## Deployment and Optimization
* Edge Ready: Optimized for deployment on Vercel with minimal bundle size.
* Responsive Design: Fluid UI architecture that adapts from mobile handsets to ultra-wide desktop monitors.
* Performance: Utilizes React useMemo to prevent unnecessary re-renders during high-frequency data updates.

## Development

To run the project locally:

1. Clone the repository:
   git clone https://github.com/ismailoksuz/Real-Time-Crypto-Dashboard.git

2. Install dependencies:
   npm install

3. Start the development server:
   npm run dev

## Author
İsmail ÖKSÜZ
https://github.com/ismailoksuz
