import React from 'react';
import { Shuffle, Table, FileText, ArrowRight, Layers } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: 'landing' | 'shuffle' | 'viewer' | 'manual' | 'merge') => void;
}

function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <button
        onClick={() => onNavigate('shuffle')}
        className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 text-left"
      >
        <div className="flex items-center justify-between mb-4">
          <Shuffle className="w-8 h-8" />
          <ArrowRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Number Shuffler</h2>
        <p className="text-gray-300">Generate intelligent variations of phone numbers using advanced algorithms</p>
      </button>

      <button
        onClick={() => onNavigate('viewer')}
        className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 text-left"
      >
        <div className="flex items-center justify-between mb-4">
          <Table className="w-8 h-8" />
          <ArrowRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300" />
        </div>
        <h2 className="text-2xl font-bold mb-2">CSV Viewer</h2>
        <p className="text-gray-300">View, manage, and analyze phone numbers from CSV files with advanced features</p>
      </button>

      <button
        onClick={() => onNavigate('manual')}
        className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 text-left"
      >
        <div className="flex items-center justify-between mb-4">
          <FileText className="w-8 h-8" />
          <ArrowRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Manual Shuffle</h2>
        <p className="text-gray-300">Manually input and process phone numbers with bulk operations and CSV management</p>
      </button>

      <button
        onClick={() => onNavigate('merge')}
        className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 text-left"
      >
        <div className="flex items-center justify-between mb-4">
          <Layers className="w-8 h-8" />
          <ArrowRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Merge Files</h2>
        <p className="text-gray-300">Combine multiple CSV files, remove duplicates, and split into manageable chunks</p>
      </button>
    </div>
  );
}

export default LandingPage;