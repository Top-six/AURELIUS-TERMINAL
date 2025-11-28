
import React, { useState, useEffect } from 'react';
import { fetchMacroEvents } from '../services/mockDataService';
import { MacroEvent } from '../types';
import { Calendar, Filter } from 'lucide-react';

export const MacroCalendar: React.FC = () => {
  const [events, setEvents] = useState<MacroEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM'>('ALL');

  useEffect(() => {
    const loadEvents = async () => {
        const data = await fetchMacroEvents();
        setEvents(data);
        setLoading(false);
    };
    loadEvents();
  }, []);

  const filteredEvents = filter === 'ALL' ? events : events.filter(e => e.importance === filter);

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="font-serif text-2xl text-deep-green font-bold flex items-center">
                <Calendar className="w-6 h-6 mr-3 text-gold" />
                Global Economic Calendar (FRED Data)
            </h2>
            <div className="flex space-x-2">
                <button 
                    onClick={() => setFilter('ALL')}
                    className={`px-4 py-2 text-sm font-bold rounded-sm border ${filter === 'ALL' ? 'bg-deep-green text-gold border-deep-green' : 'bg-white text-gray-600 border-gray-300'}`}
                >
                    All Events
                </button>
                <button 
                    onClick={() => setFilter('HIGH')}
                    className={`px-4 py-2 text-sm font-bold rounded-sm border ${filter === 'HIGH' ? 'bg-deep-green text-gold border-deep-green' : 'bg-white text-gray-600 border-gray-300'}`}
                >
                    High Impact
                </button>
            </div>
        </div>

        <div className="bg-white border border-deep-green/10 rounded-sm shadow-sm overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-deep-green/5 text-deep-green uppercase text-xs font-bold tracking-wider">
                    <tr>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Currency</th>
                        <th className="px-6 py-4">Event</th>
                        <th className="px-6 py-4">Importance</th>
                        <th className="px-6 py-4">Actual</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {loading ? (
                        <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading FRED Economic Data...</td></tr>
                    ) : filteredEvents.map((event) => (
                        <tr key={event.id} className="hover:bg-ivory transition-colors">
                            <td className="px-6 py-4 font-mono text-sm text-gray-600">{event.time}</td>
                            <td className="px-6 py-4">
                                <span className="font-bold text-deep-green bg-gray-100 px-2 py-1 rounded text-xs">{event.currency}</span>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-deep-green">{event.event}</td>
                            <td className="px-6 py-4">
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                    event.importance === 'HIGH' ? 'bg-red-100 text-red-700' :
                                    event.importance === 'MEDIUM' ? 'bg-orange-100 text-orange-700' :
                                    'bg-green-100 text-green-700'
                                }`}>
                                    {event.importance}
                                </span>
                            </td>
                            <td className="px-6 py-4 font-mono text-sm font-bold text-deep-green">{event.actual}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};
