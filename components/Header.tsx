import React from 'react';
import { Page } from '../types';
import { Bell, Search, User, Settings } from 'lucide-react';

interface HeaderProps {
  currentPage: Page;
}

export const Header: React.FC<HeaderProps> = ({ currentPage }) => {
  return (
    <header className="h-20 bg-ivory border-b border-deep-green/10 flex items-center justify-between px-8 shadow-sm">
      <div className="flex items-center">
         <h2 className="font-serif text-2xl font-bold text-deep-green tracking-tight">
            {currentPage.replace('_', ' ')}
         </h2>
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative hidden md:block">
            <input 
                type="text" 
                placeholder="Search symbol, news, or event..." 
                className="pl-10 pr-4 py-2 bg-white border border-deep-green/20 rounded-sm text-sm focus:outline-none focus:border-gold w-64 text-deep-green"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <button className="relative text-deep-green hover:text-gold transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="text-deep-green hover:text-gold transition-colors">
            <Settings className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-3 pl-6 border-l border-deep-green/10">
            <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-deep-green">Alex Mercer</div>
                <div className="text-xs text-gray-500 font-medium">Head of Macro</div>
            </div>
            <div className="w-10 h-10 bg-deep-green text-gold flex items-center justify-center rounded-sm font-serif font-bold">
                AM
            </div>
        </div>
      </div>
    </header>
  );
};