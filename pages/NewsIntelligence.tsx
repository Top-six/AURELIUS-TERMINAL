
import React, { useState, useEffect } from 'react';
import { fetchNewsItems } from '../services/mockDataService';
import { NewsItem } from '../types';
import { FileText, ExternalLink, Zap } from 'lucide-react';
import { analyzeSentiment } from '../services/geminiService';

export const NewsIntelligence: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  useEffect(() => {
    const loadNews = async () => {
        const data = await fetchNewsItems();
        setNews(data);
        setLoading(false);
    };
    loadNews();
  }, []);

  const handleAnalyze = async (id: string, text: string) => {
    setAnalyzingId(id);
    // Use Gemini to analyze the real news text
    const result = await analyzeSentiment(text);
    
    // Update local state with the AI result
    setNews(prev => prev.map(item => 
        item.id === id 
        ? { ...item, impactScore: result.score, sentiment: result.score > 60 ? 'POSITIVE' : result.score < 40 ? 'NEGATIVE' : 'NEUTRAL' } 
        : item
    ));
    
    setAnalyzingId(null);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
         <h2 className="font-serif text-2xl text-deep-green font-bold">Live Intelligence Wire</h2>
         <div className="text-sm text-gray-500">Connected sources: NewsAPI, Reuters, Bloomberg</div>
      </div>

      <div className="grid gap-4">
        {loading ? (
             <div className="p-8 text-center text-gray-500">Fetching Global Headlines...</div>
        ) : news.map((item) => (
            <div key={item.id} className="bg-white p-6 border-l-4 border-gold shadow-sm rounded-r-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold bg-navy text-white px-2 py-1 rounded uppercase tracking-wider">{item.source}</span>
                        <span className="text-xs text-gray-400">{item.timestamp}</span>
                    </div>
                    <div className={`text-xs font-bold px-2 py-1 rounded border ${
                        item.sentiment === 'POSITIVE' ? 'text-green-700 border-green-200 bg-green-50' :
                        item.sentiment === 'NEGATIVE' ? 'text-red-700 border-red-200 bg-red-50' :
                        'text-gray-700 border-gray-200 bg-gray-50'
                    }`}>
                        {item.sentiment} IMPACT
                    </div>
                </div>
                
                <h3 className="text-lg font-serif font-bold text-deep-green mb-2 hover:text-gold cursor-pointer">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{item.summary}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Related:</span>
                        {item.relatedSymbols.map(s => (
                            <span key={s} className="text-xs font-bold text-deep-green bg-ivory border border-gold/30 px-2 py-0.5 rounded">{s}</span>
                        ))}
                    </div>
                    <div className="flex space-x-3">
                        <button 
                            onClick={() => handleAnalyze(item.id, item.summary)}
                            className="flex items-center text-xs font-bold text-gold hover:text-deep-green transition-colors"
                        >
                            {analyzingId === item.id ? (
                                <span className="animate-pulse">ANALYZING...</span>
                            ) : (
                                <>
                                    <Zap className="w-3 h-3 mr-1" />
                                    AI DEEP DIVE
                                </>
                            )}
                        </button>
                        <button className="flex items-center text-xs font-bold text-gray-400 hover:text-deep-green transition-colors">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            ORIGINAL SOURCE
                        </button>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};
