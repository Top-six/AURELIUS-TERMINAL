
import { MarketTicker, OHLCData, MacroEvent, NewsItem } from '../types';

// --- API CONFIGURATION ---
const TWELVE_DATA_KEY = '28d69810ba844f6e83167423db9b1274';
const FRED_KEY = '2de7a700b2953d9dff5c302fb3d306bb';
const NEWS_API_KEY = '318fa0babc5c4fd19713eb316ed5ac42';

const SYMBOLS_MAP: Record<string, string> = {
  'EUR/USD': 'EUR/USD',
  'GBP/USD': 'GBP/USD',
  'USD/JPY': 'USD/JPY',
  'XAU/USD': 'XAU/USD',
  'BTC/USD': 'BTC/USD',
  'SPX500': 'SPX', // TwelveData symbol for S&P 500
  'US10Y': 'USD'   // Proxy or specific bond ticker if available
};

// --- HELPER FUNCTIONS ---

const format = (date: Date, formatStr: string) => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// --- MARKET DATA (TwelveData) ---

export const fetchMarketTickers = async (): Promise<MarketTicker[]> => {
  try {
    const symbols = Object.values(SYMBOLS_MAP).join(',');
    const response = await fetch(`https://api.twelvedata.com/quote?symbol=${symbols}&apikey=${TWELVE_DATA_KEY}`);
    const data = await response.json();

    if (data.code === 400 || !data) throw new Error("API Limit or Error");

    // Handle single result vs multiple results
    const results = data.symbol ? [data] : Object.values(data);

    return results.map((item: any) => ({
      symbol: item.symbol,
      price: parseFloat(item.close) || 0,
      change: parseFloat(item.change) || 0,
      changePercent: parseFloat(item.percent_change) || 0,
      volume: parseInt(item.volume) || 0,
      high: parseFloat(item.high) || 0,
      low: parseFloat(item.low) || 0,
      timestamp: new Date().toISOString() // TwelveData doesn't always send ISO in quote
    }));
  } catch (error) {
    console.warn("Falling back to mock tickers due to API error:", error);
    return getMockTickers();
  }
};

export const fetchOHLCData = async (symbol: string, interval: string = '1h'): Promise<OHLCData[]> => {
  try {
    // Convert generic intervals to TwelveData format if needed
    const apiSymbol = SYMBOLS_MAP[symbol] || symbol;
    const response = await fetch(`https://api.twelvedata.com/time_series?symbol=${apiSymbol}&interval=${interval}&outputsize=50&apikey=${TWELVE_DATA_KEY}`);
    const data = await response.json();

    if (data.status === 'error' || !data.values) throw new Error(data.message || "API Error");

    return data.values.reverse().map((candle: any) => ({
      time: candle.datetime,
      open: parseFloat(candle.open),
      high: parseFloat(candle.high),
      low: parseFloat(candle.low),
      close: parseFloat(candle.close),
      volume: parseInt(candle.volume) || 0
    }));
  } catch (error) {
    console.warn("Falling back to mock OHLC due to API error:", error);
    return getMockOHLC(symbol);
  }
};

// --- MACRO DATA (FRED) ---

export const fetchMacroEvents = async (): Promise<MacroEvent[]> => {
  try {
    // FRED doesn't have a simple "Calendar" endpoint, so we fetch specific series
    // CPI: CPIAUCSL, GDP: GDP, Unemployment: UNRATE
    const seriesIds = ['CPIAUCSL', 'UNRATE', 'FEDFUNDS'];
    const events: MacroEvent[] = [];

    for (const id of seriesIds) {
        const response = await fetch(`https://api.stlouisfed.org/fred/series/observations?series_id=${id}&limit=1&sort_order=desc&api_key=${FRED_KEY}&file_type=json`);
        const data = await response.json();
        
        if (data.observations && data.observations.length > 0) {
            const obs = data.observations[0];
            let name = id === 'CPIAUCSL' ? 'US CPI (Inflation)' : id === 'UNRATE' ? 'US Unemployment Rate' : 'Fed Funds Rate';
            
            events.push({
                id: id,
                time: obs.date, // FRED dates are YYYY-MM-DD
                currency: 'USD',
                event: name,
                importance: 'HIGH',
                actual: parseFloat(obs.value).toFixed(2) + (id === 'CPIAUCSL' ? '' : '%'),
                forecast: '-', // FRED doesn't provide forecasts
                previous: '-' // Would need to fetch limit=2 to get previous
            });
        }
    }
    return events;
  } catch (error) {
    console.warn("Falling back to mock Macro due to API error:", error);
    return getMockMacro();
  }
};

// --- NEWS DATA (NewsAPI) ---

export const fetchNewsItems = async (): Promise<NewsItem[]> => {
  try {
    // Note: NewsAPI free tier blocks requests from the browser (CORS). 
    // In a real app, you need a backend proxy. 
    // If this fails, it falls back to mock data.
    const response = await fetch(`https://newsapi.org/v2/top-headlines?category=business&language=en&apiKey=${NEWS_API_KEY}`);
    const data = await response.json();

    if (data.status !== 'ok') throw new Error(data.message);

    return data.articles.map((article: any, index: number) => ({
        id: index.toString(),
        title: article.title,
        source: article.source.name,
        summary: article.description || article.title,
        timestamp: new Date(article.publishedAt).toLocaleTimeString(),
        sentiment: 'NEUTRAL', // NewsAPI doesn't provide sentiment, defaulting
        relatedSymbols: ['USD', 'Global'],
        impactScore: 50
    }));

  } catch (error) {
    console.warn("Falling back to mock News due to CORS/API error:", error);
    return getMockNews();
  }
};


// --- MOCK FALLBACKS (kept for reliability) ---

const getMockTickers = (): MarketTicker[] => [
    { symbol: 'EUR/USD', price: 1.0845, change: -0.0023, changePercent: -0.21, volume: 125000, high: 1.0890, low: 1.0830, timestamp: new Date().toISOString() },
    { symbol: 'GBP/USD', price: 1.2630, change: 0.0015, changePercent: 0.12, volume: 98000, high: 1.2660, low: 1.2590, timestamp: new Date().toISOString() },
    { symbol: 'USD/JPY', price: 151.20, change: 0.45, changePercent: 0.30, volume: 110000, high: 151.50, low: 150.80, timestamp: new Date().toISOString() },
    { symbol: 'XAU/USD', price: 2345.50, change: 12.50, changePercent: 0.54, volume: 45000, high: 2355.00, low: 2330.00, timestamp: new Date().toISOString() },
    { symbol: 'SPX500', price: 5210.50, change: -15.25, changePercent: -0.29, volume: 2000000, high: 5240.00, low: 5190.00, timestamp: new Date().toISOString() },
];

const getMockOHLC = (symbol: string): OHLCData[] => {
    // Generate dummy candles
    const data: OHLCData[] = [];
    let price = 100;
    const now = new Date();
    for(let i=0; i<50; i++) {
        const time = new Date(now.getTime() - (50-i)*3600*1000);
        const open = price;
        const close = price + (Math.random()-0.5)*2;
        data.push({
            time: format(time, 'yyyy-MM-dd HH:mm'),
            open, close, 
            high: Math.max(open, close) + 0.5,
            low: Math.min(open, close) - 0.5,
            volume: 1000
        });
        price = close;
    }
    return data;
};

const getMockMacro = (): MacroEvent[] => [
  { id: '1', time: '08:30', currency: 'USD', event: 'Non-Farm Employment Change', importance: 'HIGH', actual: '303K', forecast: '200K', previous: '275K' },
  { id: '2', time: '08:30', currency: 'USD', event: 'Unemployment Rate', importance: 'HIGH', actual: '3.8%', forecast: '3.9%', previous: '3.9%' },
];

const getMockNews = (): NewsItem[] => [
  { id: '1', title: 'Fed Officials Signal Caution on Rate Cuts Amid Strong Jobs Data', source: 'Reuters', summary: 'Federal Reserve officials emphasized the need for more data before lowering interest rates, citing robust labor market conditions.', timestamp: '10 mins ago', sentiment: 'NEGATIVE', relatedSymbols: ['USD', 'SPX500'], impactScore: 85 },
  { id: '2', title: 'ECB Keeps Rates Steady, Hints at June Pivot', source: 'Bloomberg', summary: 'The European Central Bank maintained borrowing costs but signaled that cooling inflation could allow for a rate cut in June.', timestamp: '45 mins ago', sentiment: 'POSITIVE', relatedSymbols: ['EUR', 'DAX'], impactScore: 75 },
];
