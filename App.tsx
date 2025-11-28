import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { TechnicalAnalysis } from './pages/TechnicalAnalysis';
import { MacroCalendar } from './pages/MacroCalendar';
import { NewsIntelligence } from './pages/NewsIntelligence';
import { TradeIdeas } from './pages/TradeIdeas';
import { ForecastLab } from './pages/ForecastLab';
import { Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);

  const renderPage = () => {
    switch (currentPage) {
      case Page.DASHBOARD:
        return <Dashboard />;
      case Page.TECHNICAL:
        return <TechnicalAnalysis />;
      case Page.MACRO:
        return <MacroCalendar />;
      case Page.NEWS:
        return <NewsIntelligence />;
      case Page.IDEAS:
        return <TradeIdeas />;
      case Page.FORECAST:
        return <ForecastLab />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

export default App;