import React, { useEffect, useState } from 'react';
import { Shuffle, Table, FileText, Layers, ArrowRight, Sparkles, Users, Award, Target, Activity, Calendar, Clock } from 'lucide-react';

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

  useEffect(() => {
    fetch('https://script.google.com/macros/s/AKfycbx96S87lnh7haL6v5eajGkeRi_3-wTmXIvf21zQuV7jFUejC21ysKBi00orzM8Hm8pQnA/exec')
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

        setAgents(mappedAgents);

        const getTotalActivations = () =>
          mappedAgents.reduce((acc, agent) => acc + agent.silver + agent.gold + agent.platinum + agent.standard, 0);

        const getTotalTarget = () =>
          mappedAgents.reduce((acc, agent) => acc + agent.target, 0);

        setTotalActivations(getTotalActivations());
        setRemainingTarget(getTotalTarget() - getTotalActivations());
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const getTotal = (agent: any) => agent.silver + agent.gold + agent.platinum + agent.standard;

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header Section */}
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
      <div className="animate-fadeIn mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8 glass-card rounded-2xl shadow-lg">
          <header className="mb-8">
            <h2 className="text-3xl font-bold text-indigo-600/70 gradient-text">Activations Dashboard</h2>
            <div className="flex items-center gap-4 mt-2">
              <div className="clock px-4 py-2 rounded-xl flex items-center gap-3">
                <Clock className="w-5 h-5 text-indigo-600" />
                <span className="time-text font-semibold text-lg" id="current-time">00:00:00</span>
              </div>
              <div className="date-text flex items-center gap-3">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <span className="font-medium text-indigo-600/70" id="current-date"></span>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="stat-card rounded-2xl p-8">
              <div className="flex items-center">
                <div className="gradient-bg p-4 rounded-xl shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div className="ml-6">
                  <p className="text-sm font-medium text-indigo-600/70">Total Agents</p>
                  <p className="text-3xl font-bold text-gray-900" id="total-agents">{agents.length}</p>
                </div>
              </div>
            </div>

            <div className="stat-card rounded-2xl p-8">
              <div className="flex items-center">
                <div className="gradient-bg p-4 rounded-xl shadow-lg">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <div className="ml-6">
                  <p className="text-sm font-medium text-indigo-600/70">Total Activations</p>
                  <p className="text-3xl font-bold text-gray-900" id="total-activations">{totalActivations}</p>
                </div>
              </div>
            </div>

            <div className="stat-card rounded-2xl p-8">
              <div className="flex items-center">
                <div className="gradient-bg p-4 rounded-xl shadow-lg">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <div className="ml-6">
                  <p className="text-sm font-medium text-indigo-600/70">Remaining Target</p>
                  <p className="text-3xl font-bold text-gray-900" id="remaining-target">{remainingTarget}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="modern-table w-full" id="agents-table">
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
                  <tr key={index} className="shadow-sm table-hover-effect">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg">
                          <span className="text-lg font-bold text-white">
                            {agent.name.charAt(0)}
                          </span>
                        </div>
                        <span className="font-semibold text-gray-900">{agent.name}</span>
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
                  <td className="px-6 py-4 text-center font-bold text-emerald-600" id="total-silver">
                    {agents.reduce((sum, agent) => sum + agent.silver, 0)}
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-amber-600" id="total-gold">
                    {agents.reduce((sum, agent) => sum + agent.gold, 0)}
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-violet-600" id="total-platinum">
                    {agents.reduce((sum, agent) => sum + agent.platinum, 0)}
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-blue-600" id="total-standard">
                    {agents.reduce((sum, agent) => sum + agent.standard, 0)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Activity className="w-5 h-5 text-indigo-500" />
                      <span className="font-semibold text-gray-900" id="total-progress">
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
    </div>
  );
}

export default LandingPage;
