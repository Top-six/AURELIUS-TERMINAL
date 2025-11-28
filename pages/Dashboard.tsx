
import React, { useEffect, useState } from 'react';
import { fetchMarketTickers } from '../services/mockDataService';
import { MarketTicker } from '../types';
import { TrendingUp, TrendingDown, Activity, Globe } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const Dashboard: React.FC = () => {
  const [tickers, setTickers] = useState<MarketTicker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
        const data = await fetchMarketTickers();
        setTickers(data);
        setLoading(false);
    };

    loadData();
    
    // Poll for updates every 15 seconds (Real API rate limits apply)
    const interval = setInterval(loadData, 15000);

    return () => clearInterval(interval);
  }, []);

  const majorPairs = tickers.filter(t => ['EUR/USD', 'USD/JPY', 'XAU/USD', 'SPX500', 'SPX'].includes(t.symbol));

  return (
    <div className="space-y-6">
      {/* Ticker Tape */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
            <div className="text-gray-500 text-sm animate-pulse">Initializing Data Stream...</div>
        ) : (
            majorPairs.map((ticker) => (
                <TickerCard key={ticker.symbol} ticker={ticker} />
            ))
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
        {/* Market Map / Main Chart Area */}
        <div className="lg:col-span-2 bg-white border border-deep-green/10 rounded-sm shadow-sm p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-xl text-deep-green font-bold flex items-center">
                    <Activity className="w-5 h-5 text-gold mr-2" />
                    Market Regime: Volatile Expansion
                </h3>
                <div className="flex space-x-2">
                    {['1H', '4H', '1D', '1W'].map(tf => (
                        <button key={tf} className="px-3 py-1 text-xs font-bold border border-deep-green/20 rounded-sm hover:bg-deep-green hover:text-gold transition-all">
                            {tf}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex-1 w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                        {time: '08:00', value: 100}, {time: '09:00', value: 102}, {time: '10:00', value: 101}, 
                        {time: '11:00', value: 105}, {time: '12:00', value: 104}, {time: '13:00', value: 108},
                        {time: '14:00', value: 107}, {time: '15:00', value: 110}
                    ]}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="time" stroke="#001F3F" tick={{fontSize: 12}} />
                        <YAxis stroke="#001F3F" tick={{fontSize: 12}} />
                        <Tooltip contentStyle={{backgroundColor: '#FFFFF0', borderColor: '#D4AF37'}} />
                        <Area type="monotone" dataKey="value" stroke="#013220" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Global Macro Summary */}
        <div className="bg-white border border-deep-green/10 rounded-sm shadow-sm p-6">
            <h3 className="font-serif text-lg text-deep-green font-bold mb-4 flex items-center">
                <Globe className="w-5 h-5 text-gold mr-2" />
                Macro Snapshot
            </h3>
            <div className="space-y-4">
                <MacroItem label="US 10Y Yield" value="4.45%" change="+1.2%" isPositive={true} />
                <MacroItem label="VIX Index" value="14.20" change="-2.5%" isPositive={false} />
                <MacroItem label="DXY Dollar Index" value="104.50" change="+0.15%" isPositive={true} />
                <MacroItem label="Brent Crude" value="$89.50" change="+0.8%" isPositive={true} />
                
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <h4 className="text-sm font-bold text-navy mb-3 uppercase tracking-wider">Key Narrative</h4>
                    <p className="text-sm text-gray-600 leading-relaxed italic">
                        "Markets are pricing in a 'higher for longer' stance from the Fed as inflation data remains sticky. Risk-off sentiment is slowly building in equities, while the USD remains bid against G7 currencies."
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const TickerCard: React.FC<{ ticker: MarketTicker }> = ({ ticker }) => {
    const isUp = ticker.changePercent >= 0;
    return (
        <div className="bg-white p-4 border-l-4 border-gold shadow-sm rounded-r-sm">
            <div className="flex justify-between items-start">
                <div>
                    <div className="text-sm font-bold text-gray-500">{ticker.symbol}</div>
                    <div className="text-xl font-serif font-bold text-deep-green mt-1">
                        {ticker.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                    </div>
                </div>
                <div className={`flex items-center text-sm font-bold ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                    {isUp ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                    {Math.abs(ticker.changePercent).toFixed(2)}%
                </div>
            </div>
        </div>
    );
};

const MacroItem: React.FC<{ label: string; value: string; change: string; isPositive: boolean }> = ({ label, value, change, isPositive }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <div className="text-right">
            <div className="text-sm font-bold text-deep-green">{value}</div>
            <div className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>{change}</div>
        </div>
    </div>
);
