import React from 'react';
import { Page } from '../types';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  return (
    <div className="flex h-screen w-full bg-ivory text-deep-green overflow-hidden font-sans">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
      <div className="flex flex-col flex-1 h-full relative">
        <Header currentPage={currentPage} />
        <main className="flex-1 overflow-y-auto p-6 relative z-0 scrollbar-thin">
           {children}
        </main>
      </div>
    </div>
  );
};