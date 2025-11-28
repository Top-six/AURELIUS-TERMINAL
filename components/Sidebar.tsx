import React from 'react';
import { Page } from '../types';
import { APP_NAME, NAVIGATION_ITEMS, COLORS } from '../constants';
import { Activity } from 'lucide-react';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  return (
    <div className="w-64 h-full bg-deep-green text-ivory flex flex-col border-r border-gold/30 shadow-2xl z-20">
      <div className="h-20 flex items-center px-6 border-b border-gold/30">
        <Activity className="w-6 h-6 text-gold mr-3" />
        <h1 className="font-serif text-lg font-bold tracking-widest text-gold">{APP_NAME}</h1>
      </div>

      <nav className="flex-1 py-8 px-3 space-y-2">
        {NAVIGATION_ITEMS.map((item) => {
          const isActive = currentPage === item.page;
          return (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={`w-full flex items-center px-4 py-3 rounded-md transition-all duration-200 group ${
                isActive 
                  ? 'bg-gold/10 text-gold border-r-2 border-gold' 
                  : 'text-gray-400 hover:text-ivory hover:bg-white/5'
              }`}
            >
              <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-gold' : 'text-gray-500 group-hover:text-ivory'}`} />
              <span className={`text-sm font-medium tracking-wide ${isActive ? 'font-semibold' : ''}`}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-gold/30">
        <div className="text-xs text-gold/60 uppercase tracking-widest mb-2">System Status</div>
        <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-gray-300">Data Pipeline: Active</span>
        </div>
        <div className="flex items-center space-x-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse delay-75"></div>
            <span className="text-xs text-gray-300">AI Engine: Online</span>
        </div>
      </div>
    </div>
  );
};