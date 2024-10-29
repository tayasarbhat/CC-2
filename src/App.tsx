import React, { useState } from 'react';
import NumberShuffler from './components/NumberShuffler';
import CsvViewer from './components/CsvViewer';
import ManualShuffle from './components/ManualShuffle';
import MergeFiles from './components/MergeFiles';
import LandingPage from './components/LandingPage';

type View = 'landing' | 'shuffle' | 'viewer' | 'manual' | 'merge';

function App() {
  const [currentView, setCurrentView] = useState<View>('landing');

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onNavigate={setCurrentView} />;
      case 'shuffle':
        return <NumberShuffler onBack={() => setCurrentView('landing')} />;
      case 'viewer':
        return <CsvViewer onBack={() => setCurrentView('landing')} />;
      case 'manual':
        return <ManualShuffle onBack={() => setCurrentView('landing')} />;
      case 'merge':
        return <MergeFiles onBack={() => setCurrentView('landing')} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {renderView()}
      </div>
    </div>
  );
}

export default App;
