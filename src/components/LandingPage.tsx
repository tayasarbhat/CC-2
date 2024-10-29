import React from 'react';
import { Shuffle, Table, FileText, Layers, ArrowRight, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: 'landing' | 'shuffle' | 'viewer' | 'manual' | 'merge') => void;
}

const tools = [
  {
    id: 'viewer',
    name: 'Table Viewer',
    description: 'View, manage, and analyze phone numbers from CSV files with advanced features',
    icon: Table,
    gradient: 'from-teal-500 to-cyan-500',
    delay: '100'
  },
  {
    id: 'shuffle',
    name: 'Number Shuffler',
    description: 'Generate intelligent variations of phone numbers using advanced algorithms',
    icon: Shuffle,
    gradient: 'from-emerald-500 to-teal-500',
    delay: '0'
  },
 
  {
    id: 'manual',
    name: 'Manual Shuffle',
    description: 'Manually input and process phone numbers with bulk operations and CSV management',
    icon: FileText,
    gradient: 'from-cyan-500 to-amber-500',
    delay: '200'
  },
  {
    id: 'merge',
    name: 'Merge Files',
    description: 'Combine multiple CSV files, remove duplicates, and split into manageable chunks',
    icon: Layers,
    gradient: 'from-amber-500 to-emerald-500',
    delay: '300'
  }
];

function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="text-center space-y-4 animate-fadeIn">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-4">
          <Sparkles className="w-4 h-4 mr-2 text-amber-400" />
          <span className="text-sm">Advanced Phone Number Tools</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
          Transform Your Numbers
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Powerful tools for managing, analyzing, and processing phone numbers with advanced features
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => onNavigate(tool.id as any)}
              style={{ animationDelay: `${tool.delay}ms` }}
              className="group relative overflow-hidden rounded-2xl p-1 animate-scaleIn"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-from), var(--tw-gradient-to))` }} />
              
              <div className="relative h-full bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10 
                             transition-all duration-500 group-hover:border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${tool.gradient} 
                                 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/50 transform translate-x-0 group-hover:translate-x-2 
                                       opacity-0 group-hover:opacity-100 transition-all duration-500" />
                </div>

                <h2 className="text-2xl font-bold mb-2 group-hover:text-emerald-400 transition-colors duration-300">
                  {tool.name}
                </h2>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {tool.description}
                </p>

                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 
                               transition-opacity duration-500" style={{ backgroundImage: `linear-gradient(to right, 
                               var(--tw-gradient-from), var(--tw-gradient-to))` }} />
              </div>
            </button>
          );
        })}
      </div>

      <div className="text-center animate-fadeIn" style={{ animationDelay: '400ms' }}>
        <div className="inline-flex items-center space-x-2 text-sm text-gray-400">
          <span>Built with</span>
          <span className="text-emerald-400">♥</span>
          <span>by TAB</span>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
