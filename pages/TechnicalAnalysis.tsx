
import React, { useState, useEffect } from 'react';
import { fetchOHLCData } from '../services/mockDataService';
import { OHLCData } from '../types';
import { ComposedChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceArea, Line } from 'recharts';
import { MOCK_SYMBOLS } from '../constants';

export const TechnicalAnalysis: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState(MOCK_SYMBOLS[0]);
  const [data, setData] = useState<OHLCData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
        setLoading(true);
        const ohlc = await fetchOHLCData(selectedSymbol, '1h'); // Defaulting to 1H for this view
        setData(ohlc);
        setLoading(false);
    };
    loadData();
  }, [selectedSymbol]);

  // Calculate simple zones if data exists
  const high = data.length ? Math.max(...data.map(d => d.high)) : 0;
  const low = data.length ? Math.min(...data.map(d => d.low)) : 0;
  const range = high - low;
  const supplyZone = { y1: high, y2: high - (range * 0.05) };
  const demandZone = { y1: low, y2: low + (range * 0.05) };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex justify-between items-center bg-white p-4 border border-deep-green/10 rounded-sm">
        <div className="flex items-center space-x-4">
            <h2 className="font-serif text-lg text-deep-green font-bold">Chart Intelligence</h2>
            <select 
                value={selectedSymbol} 
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="bg-ivory border border-deep-green/20 rounded-sm px-3 py-1 text-sm text-deep-green font-bold focus:outline-none focus:border-gold"
            >
                {MOCK_SYMBOLS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <div className="flex space-x-1">
                {['M15', 'H1', 'H4', 'D1'].map(tf => (
                    <button key={tf} className="px-2 py-1 text-xs border border-gray-200 hover:border-gold rounded-sm">{tf}</button>
                ))}
            </div>
        </div>
        <div className="flex items-center space-x-4 text-xs font-bold text-gray-500">
            <span className="flex items-center"><span className="w-2 h-2 bg-red-200 mr-2 rounded-full"></span> Supply Zone</span>
            <span className="flex items-center"><span className="w-2 h-2 bg-green-200 mr-2 rounded-full"></span> Demand Zone</span>
            <span className="flex items-center"><span className="w-2 h-2 bg-blue-500 mr-2 rounded-full"></span> VWAP</span>
        </div>
      </div>

      <div className="flex-1 bg-white border border-deep-green/10 rounded-sm p-4 relative">
        {loading ? (
            <div className="flex h-full items-center justify-center text-gold font-bold animate-pulse">LOADING CHART DATA...</div>
        ) : (
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{top: 20, right: 30, left: 20, bottom: 20}}>
                    <XAxis dataKey="time" tick={{fontSize: 10}} minTickGap={30} />
                    <YAxis domain={['auto', 'auto']} tick={{fontSize: 10}} orientation="right" />
                    <Tooltip 
                        contentStyle={{backgroundColor: '#FFFFF0', borderColor: '#D4AF37'}}
                        itemStyle={{color: '#013220'}}
                        labelStyle={{color: '#666'}}
                    />
                    
                    {/* Supply Zone */}
                    <ReferenceArea y1={supplyZone.y1} y2={supplyZone.y2} fill="red" fillOpacity={0.1} strokeOpacity={0.3} />
                    {/* Demand Zone */}
                    <ReferenceArea y1={demandZone.y1} y2={demandZone.y2} fill="green" fillOpacity={0.1} strokeOpacity={0.3} />
                    
                    {/* Close Line */}
                    <Line type="monotone" dataKey="close" stroke="#001F3F" dot={false} strokeWidth={2} />
                </ComposedChart>
            </ResponsiveContainer>
        )}
        
        <div className="absolute top-6 left-6 bg-white/90 p-4 border border-deep-green/10 shadow-lg rounded-sm backdrop-blur-sm">
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Technical Scan</h4>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between w-48">
                    <span>Trend (H4)</span>
                    <span className="font-bold text-green-600">Bullish</span>
                </div>
                <div className="flex justify-between w-48">
                    <span>RSI (14)</span>
                    <span className="font-bold text-deep-green">62.5 (Neutral)</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
