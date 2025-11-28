import { LucideIcon, BarChart2, Globe, TrendingUp, Zap, Calendar, FileText } from 'lucide-react';
import { Page } from './types';

export const APP_NAME = "AURELIUS TERMINAL";

export const NAVIGATION_ITEMS: { page: Page; label: string; icon: LucideIcon }[] = [
  { page: Page.DASHBOARD, label: 'Overview', icon: BarChart2 },
  { page: Page.TECHNICAL, label: 'Technical Suite', icon: TrendingUp },
  { page: Page.MACRO, label: 'Macro Calendar', icon: Calendar },
  { page: Page.FORECAST, label: 'Forecast Lab', icon: Globe },
  { page: Page.NEWS, label: 'News Intelligence', icon: FileText },
  { page: Page.IDEAS, label: 'Trade Ideas', icon: Zap },
];

export const MOCK_SYMBOLS = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'XAU/USD', 'BTC/USD', 'SPX500', 'US10Y'];

export const COLORS = {
  deepGreen: '#013220',
  gold: '#D4AF37',
  ivory: '#FFFFF0',
  navy: '#001F3F',
  red: '#ef4444',
  green: '#22c55e',
};