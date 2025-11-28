export enum Page {
  DASHBOARD = 'DASHBOARD',
  TECHNICAL = 'TECHNICAL',
  MACRO = 'MACRO',
  NEWS = 'NEWS',
  IDEAS = 'IDEAS',
  FORECAST = 'FORECAST',
}

export interface MarketTicker {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  timestamp: string;
}

export interface OHLCData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  summary: string;
  timestamp: string;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  relatedSymbols: string[];
  impactScore: number; // 0-100
}

export interface MacroEvent {
  id: string;
  time: string;
  currency: string;
  event: string;
  importance: 'LOW' | 'MEDIUM' | 'HIGH';
  actual: string;
  forecast: string;
  previous: string;
}

export interface TradeIdea {
  id: string;
  symbol: string;
  direction: 'LONG' | 'SHORT';
  entryZone: [number, number];
  stopLoss: number;
  takeProfit: [number, number];
  conviction: number; // 0-100
  narrative: string;
  riskReward: number;
  timestamp: string;
  catalysts: string[];
}

export interface ForecastModel {
  name: string;
  type: 'ARIMA' | 'XGBoost' | 'LSTM';
  horizon: string;
  confidence: number;
  data: { date: string; value: number; upper: number; lower: number }[];
}