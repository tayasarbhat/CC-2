import React, { useEffect, useState } from 'react';
import { Shuffle, Table, FileText, Layers, ArrowRight, Sparkles, Users, Award, Target, Activity, Calendar, Clock, Medal } from 'lucide-react';

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
    name: 'Manual Shuffle',
    description: 'Manually input and process phone numbers with bulk operations and CSV management',
    icon: Shuffle,
    gradient: 'from-emerald-500 to-teal-500',
    delay: '0'
  },
  {
    id: 'manual',
    name: 'Number Shuffler',
    description: 'Generate intelligent variations of phone numbers using advanced algorithms',
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
  const [agents, setAgents] = useState([]);
  const [totalActivations, setTotalActivations] = useState(0);
  const [remainingTarget, setRemainingTarget] = useState(0);
  const [totalTarget, setTotalTarget] = useState(0);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // Update clock and date every second
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }));
      setCurrentDate(now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }));
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch('https://script.google.com/macros/s/AKfycbwH6Z1WTQW5QRcMZQsvXcpeX22SY6qnunv_5TRN58DuEVzyQtA99bCMP2PoW6ABL0SK/exec')
      .then(response => response.json())
      .then(data => {
        const mappedAgents = data.map((row: any) => ({
          name: row['Agent Name'] || '',
          silver: Number(row['Silver']) || 0,
          gold: Number(row['Gold']) || 0,
          platinum: Number(row['Platinum']) || 0,
          standard: Number(row['Standard']) || 0,
          target: Number(row['Target']) || 10 // Default to 10 if not provided
        }));

        // Sort agents by total activations in descending order
        const sortedAgents = mappedAgents.sort((a, b) => {
          const totalA = a.silver + a.gold + a.platinum + a.standard;
          const totalB = b.silver + b.gold + b.platinum + b.standard;
          return totalB - totalA;
        });

        setAgents(sortedAgents);

        const getTotalActivations = () =>
          sortedAgents.reduce((acc, agent) => acc + agent.silver + agent.gold + agent.platinum + agent.standard, 0);

        const getTotalTarget = () =>
          sortedAgents.reduce((acc, agent) => acc + agent.target, 0);

        setTotalActivations(getTotalActivations());
        setTotalTarget(getTotalTarget());
        setRemainingTarget(getTotalTarget() - getTotalActivations());
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const getTotal = (agent: any) => agent.silver + agent.gold + agent.platinum + agent.standard;

  const renderMedalIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Medal className="w-5 h-5 text-yellow-400 inline ml-2" title="Gold Medal" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-400 inline ml-2" title="Silver Medal" />;
      case 2:
        return <Medal className="w-5 h-5 text-orange-500 inline ml-2" title="Bronze Medal" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header Section with Modernized Clock and Calendar */}
      <div className="group relative overflow-hidden rounded-2xl p-1 animate-scaleIn">
        <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
          style={{ backgroundImage: 'linear-gradient(to right, from-indigo-400, to-pink-400)' }}></div>
        <div className="relative bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 transition-all duration-500 group-hover:border-white/20">
          <h2 className="text-6xl font-bold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent text-center mb-4 animate-fadeIn">
            Albatross Communication Services
          </h2>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent text-center mb-4 animate-fadeIn">
            Activations Dashboard
          </h3>
          <div className="flex justify-center items-center space-x-6 animate-fadeIn">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg group-hover:scale-110 transition-transform duration-500">
              <Clock className="w-5 h-5 text-white" />
              <span className="text-lg font-semibold text-white">{currentTime}</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg group-hover:scale-110 transition-transform duration-500">
              <Calendar className="w-5 h-5 text-white" />
              <span className="text-lg font-semibold text-white">{currentDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Section */}
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
              </div>
            </button>
          );
        })}
      </div>

      {/* Activations Dashboard Section */}
      <div className="animate-fadeIn mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Target Card */}
        <div className="group relative overflow-hidden rounded-2xl p-1 animate-scaleIn">
          <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
            style={{ backgroundImage: 'linear-gradient(to right, from-indigo-500, to-purple-500)' }}></div>
          <div className="relative bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10 
                          transition-all duration-500 group-hover:border-white/20">
            <div className="flex items-center">
              <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <Target className="w-7 h-7 text-white" />
              </div>
              <div className="ml-6">
                <p className="text-1xl font-bold text-indigo-600/70">Total Target</p>
                <p className="text-3xl font-bold text-white">{totalTarget}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Total Activations Card */}
        <div className="group relative overflow-hidden rounded-2xl p-1 animate-scaleIn">
          <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
            style={{ backgroundImage: 'linear-gradient(to right, from-blue-500, to-teal-500)' }}></div>
          <div className="relative bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10 
                          transition-all duration-500 group-hover:border-white/20">
            <div className="flex items-center">
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <Award className="w-7 h-7 text-white" />
              </div>
              <div className="ml-6">
                <p className="text-1xl font-bold text-indigo-600/70">Total Activations</p>
                <p className="text-3xl font-bold text-white">{totalActivations}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Remaining Target Card */}
        <div className="group relative overflow-hidden rounded-2xl p-1 animate-scaleIn">
          <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
            style={{ backgroundImage: 'linear-gradient(to right, from-emerald-500, to-cyan-500)' }}></div>
          <div className="relative bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10 
                          transition-all duration-500 group-hover:border-white/20">
            <div className="flex items-center">
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <Target className="w-7 h-7 text-white" />
              </div>
              <div className="ml-6">
                <p className="text-1xl font-bold text-indigo-600/70">Remaining Target</p>
                <p className="text-3xl font-bold text-white">{remainingTarget}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="animate-fadeIn mt-8 glass-card rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="modern-table w-full">
            <thead>
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-indigo-600 uppercase tracking-wider">Agent Name</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-emerald-600 uppercase tracking-wider">Silver</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-amber-600 uppercase tracking-wider">Gold</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-violet-600 uppercase tracking-wider">Platinum</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-blue-600 uppercase tracking-wider">Standard</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-indigo-600 uppercase tracking-wider">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y-8 divide-transparent">
              {agents.map((agent, index) => (
                <tr key={index} className="group relative overflow-hidden rounded-2xl p-1 animate-scaleIn hover:bg-white/10 transition-all duration-500">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg">
                        <span className="text-lg font-bold text-white">
                          {agent.name.charAt(0)}
                        </span>
                      </div>
                      <span className="font-semibold text-white">
                        {agent.name}
                        {renderMedalIcon(index)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-emerald-600 font-semibold">{agent.silver}</td>
                  <td className="px-6 py-4 text-center text-amber-600 font-semibold">{agent.gold}</td>
                  <td className="px-6 py-4 text-center text-violet-600 font-semibold">{agent.platinum}</td>
                  <td className="px-6 py-4 text-center text-blue-600 font-semibold">{agent.standard}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-blue-500"
                          style={{ width: `${(getTotal(agent) / agent.target) * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold text-gray-900">{getTotal(agent)}/{agent.target}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="px-6 py-4 font-semibold text-gray-900">Total</td>
                <td className="px-6 py-4 text-center font-bold text-emerald-600">
                  {agents.reduce((sum, agent) => sum + agent.silver, 0)}
                </td>
                <td className="px-6 py-4 text-center font-bold text-amber-600">
                  {agents.reduce((sum, agent) => sum + agent.gold, 0)}
                </td>
                <td className="px-6 py-4 text-center font-bold text-violet-600">
                  {agents.reduce((sum, agent) => sum + agent.platinum, 0)}
                </td>
                <td className="px-6 py-4 text-center font-bold text-blue-600">
                  {agents.reduce((sum, agent) => sum + agent.standard, 0)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-indigo-500" />
                    <span className="font-semibold text-gray-900">
                      {totalActivations}/{agents.reduce((sum, agent) => sum + agent.target, 0)} Total Activations
                    </span>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
