import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Globe } from 'lucide-react';

const generateForecastData = () => {
  const data = [];
  let value = 100;
  for (let i = 0; i < 50; i++) {
    const isHistorical = i < 40;
    const date = `T+${i}`;
    value = value + (Math.random() - 0.5) * 5;
    
    if (isHistorical) {
        data.push({
            date,
            actual: value,
            forecast: null,
            upper: null,
            lower: null
        });
    } else {
        // Diverge
        data.push({
            date,
            actual: null,
            forecast: value,
            upper: value + (i - 39) * 2,
            lower: value - (i - 39) * 2
        });
    }
  }
  return data;
};

export const ForecastLab: React.FC = () => {
  const data = generateForecastData();

  return (
    <div className="h-full flex flex-col space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="font-serif text-2xl text-deep-green font-bold flex items-center">
                <Globe className="w-6 h-6 mr-3 text-gold" />
                Macro-Quant Forecasting
            </h2>
            <div className="flex space-x-2">
                <select className="bg-white border border-gray-300 rounded-sm px-4 py-2 text-sm font-bold text-deep-green">
                    <option>ARIMA</option>
                    <option>XGBoost Regressor</option>
                    <option>LSTM Neural Net</option>
                </select>
                <button className="bg-deep-green text-gold px-6 py-2 rounded-sm font-bold text-sm">RETRAIN MODEL</button>
            </div>
        </div>

        <div className="flex-1 bg-white p-6 border border-deep-green/10 rounded-sm shadow-sm relative">
            <div className="absolute top-6 left-6 z-10 bg-white/80 p-4 backdrop-blur-sm border border-gray-200 rounded-sm">
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Model Accuracy</div>
                <div className="text-2xl font-mono font-bold text-deep-green">87.4%</div>
                <div className="text-xs text-green-600 font-bold mt-1">MAPE: 2.1%</div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                    <XAxis dataKey="date" tick={{fontSize: 10}} />
                    <YAxis domain={['auto', 'auto']} tick={{fontSize: 10}} />
                    <Tooltip contentStyle={{ backgroundColor: '#FFFFF0', borderColor: '#D4AF37' }} />
                    <Legend />
                    
                    {/* Historical Line */}
                    <Area type="monotone" dataKey="actual" stroke="#001F3F" strokeWidth={3} fill="none" name="Historical Data" />
                    
                    {/* Forecast Range */}
                    <Area type="monotone" dataKey="upper" stroke="none" fill="#D4AF37" fillOpacity={0.1} />
                    <Area type="monotone" dataKey="lower" stroke="none" fill="#D4AF37" fillOpacity={0.1} />
                    
                    {/* Forecast Line */}
                    <Area type="monotone" dataKey="forecast" stroke="#D4AF37" strokeWidth={3} strokeDasharray="5 5" fill="url(#colorForecast)" name="AI Projection" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};
