import React, { useState } from 'react';
import { generateTradeIdeaFromAI } from '../services/geminiService';
import { TradeIdea } from '../types';
import { MOCK_SYMBOLS } from '../constants';
import { Zap, ArrowRight, Target, Shield, CheckCircle } from 'lucide-react';

export const TradeIdeas: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState(MOCK_SYMBOLS[0]);
  const [loading, setLoading] = useState(false);
  const [idea, setIdea] = useState<TradeIdea | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setIdea(null);
    
    // Simulate fetching context from store
    const context = `
      Price is currently trading at a key daily support level. 
      RSI is 32 (oversold). 
      Macro news from US is slightly bearish, but ECB is dovish. 
      Volume profile shows high node at support.
    `;

    const generatedIdea = await generateTradeIdeaFromAI(selectedSymbol, context);
    if (!generatedIdea) {
        // Fallback mock if API fails/no key
        setIdea({
            id: 'mock-1',
            symbol: selectedSymbol,
            direction: 'LONG',
            entryZone: [1.0820, 1.0835],
            stopLoss: 1.0790,
            takeProfit: [1.0890, 1.0950],
            conviction: 85,
            narrative: "Strong rejection of daily demand zone coupled with oversold RSI conditions. Risk/Reward is favorable for a bounce towards weekly VWAP.",
            riskReward: 2.8,
            timestamp: new Date().toISOString(),
            catalysts: ['Oversold RSI', 'Daily Support Hold']
        });
    } else {
        setIdea(generatedIdea);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-deep-green text-ivory p-8 rounded-sm shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <h2 className="font-serif text-3xl font-bold mb-4 flex items-center">
            <Zap className="w-8 h-8 text-gold mr-3" />
            Alpha Generator
        </h2>
        <p className="text-gray-300 mb-8 max-w-xl">
            Leverage our proprietary Gemini-powered engine to synthesize macro, technical, and sentiment data into actionable high-probability trade setups.
        </p>

        <div className="flex items-center bg-white/10 p-2 rounded-sm max-w-md backdrop-blur-sm border border-white/20">
            <select 
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="bg-transparent text-ivory font-bold px-4 py-2 outline-none w-full border-r border-white/20"
            >
                {MOCK_SYMBOLS.map(s => <option key={s} value={s} className="text-deep-green">{s}</option>)}
            </select>
            <button 
                onClick={handleGenerate}
                disabled={loading}
                className="px-6 py-2 bg-gold text-deep-green font-bold hover:bg-yellow-500 transition-colors whitespace-nowrap disabled:opacity-50"
            >
                {loading ? 'COMPUTING...' : 'GENERATE IDEA'}
            </button>
        </div>
      </div>

      {idea && (
        <div className="bg-white border-t-4 border-gold shadow-lg rounded-sm p-8 animate-fade-in">
            <div className="flex justify-between items-start border-b border-gray-100 pb-6 mb-6">
                <div>
                    <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-4xl font-serif font-bold text-deep-green">{idea.symbol}</h3>
                        <span className={`px-3 py-1 text-sm font-bold rounded uppercase tracking-widest ${idea.direction === 'LONG' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {idea.direction}
                        </span>
                    </div>
                    <div className="text-sm text-gray-500">{new Date(idea.timestamp).toLocaleString()}</div>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-500 uppercase tracking-widest mb-1">Conviction</div>
                    <div className="text-3xl font-bold text-deep-green">{idea.conviction}%</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="bg-ivory p-4 rounded-sm border border-gold/20">
                    <div className="flex items-center text-sm font-bold text-gray-500 mb-2">
                        <ArrowRight className="w-4 h-4 mr-2" /> ENTRY ZONE
                    </div>
                    <div className="text-xl font-mono font-bold text-deep-green">
                        {idea.entryZone[0].toFixed(4)} - {idea.entryZone[1].toFixed(4)}
                    </div>
                </div>
                <div className="bg-red-50 p-4 rounded-sm border border-red-100">
                    <div className="flex items-center text-sm font-bold text-red-500 mb-2">
                        <Shield className="w-4 h-4 mr-2" /> STOP LOSS
                    </div>
                    <div className="text-xl font-mono font-bold text-red-700">
                        {idea.stopLoss.toFixed(4)}
                    </div>
                </div>
                <div className="bg-green-50 p-4 rounded-sm border border-green-100">
                    <div className="flex items-center text-sm font-bold text-green-600 mb-2">
                        <Target className="w-4 h-4 mr-2" /> TARGETS
                    </div>
                    <div className="text-xl font-mono font-bold text-green-800">
                        {idea.takeProfit[0].toFixed(4)}
                        <span className="text-sm text-gray-400 mx-2">/</span> 
                        {idea.takeProfit[1].toFixed(4)}
                    </div>
                </div>
            </div>

            <div className="prose prose-sm max-w-none text-gray-700 bg-gray-50 p-6 rounded-sm border border-gray-100">
                <h4 className="text-deep-green font-bold uppercase tracking-wider mb-2">Thesis Narrative</h4>
                <p>{idea.narrative}</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
                {idea.catalysts.map((cat, idx) => (
                    <div key={idx} className="flex items-center px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-600 shadow-sm">
                        <CheckCircle className="w-3 h-3 mr-1 text-gold" />
                        {cat}
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};
