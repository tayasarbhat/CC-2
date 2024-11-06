import React, { useEffect, useState } from 'react';
import { Shuffle, Table, FileText, Layers, ArrowRight, Sparkles, Users, Award, Target, Activity, Calendar, Clock, Medal, CheckCircle, XCircle } from 'lucide-react';

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
  const [attendance, setAttendance] = useState([]);
  const [totalActivations, setTotalActivations] = useState(0);
  const [remainingTarget, setRemainingTarget] = useState(0);
  const [totalTarget, setTotalTarget] = useState(0);
  const [totalAttendance, setTotalAttendance] = useState(0);
  const [present, setPresent] = useState(0);
  const [absent, setAbsent] = useState(0);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
      setCurrentDate(now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

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
          target: Number(row['Target']) || 10
        }));

        const sortedAgents = mappedAgents.sort((a, b) => {
          const totalA = a.silver + a.gold + a.platinum + a.standard;
          const totalB = b.silver + b.gold + b.platinum + b.standard;
          return totalB - totalA;
        });

        setAgents(sortedAgents);
        setTotalActivations(sortedAgents.reduce((acc, agent) => acc + agent.silver + agent.gold + agent.platinum + agent.standard, 0));
        setTotalTarget(sortedAgents.reduce((acc, agent) => acc + agent.target, 0));
        setRemainingTarget(totalTarget - totalActivations);
      })
      .catch(error => console.error('Error fetching data:', error));
    
    fetch('https://attendance-data-source-url.com')
      .then(response => response.json())
      .then(data => {
        const mappedAttendance = data.map((row: any) => ({
          name: row['Agent Name'] || '',
          present: row['Present'] || 0,
          absent: row['Absent'] || 0,
        }));

        setAttendance(mappedAttendance);
        setTotalAttendance(mappedAttendance.length);
        setPresent(mappedAttendance.reduce((acc, agent) => acc + agent.present, 0));
        setAbsent(mappedAttendance.reduce((acc, agent) => acc + agent.absent, 0));
      })
      .catch(error => console.error('Error fetching attendance:', error));
  }, []);

  const getTotal = (agent: any) => agent.silver + agent.gold + agent.platinum + agent.standard;

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header Section */}
      <div className="group relative overflow-hidden rounded-2xl p-1 animate-scaleIn">
        <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
          style={{ backgroundImage: 'linear-gradient(to right, from-indigo-400, to-pink-400)' }}></div>
        <div className="relative bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 transition-all duration-500 group-hover:border-white/20">
          <h2 className="text-6xl font-bold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent text-center mb-4 animate-fadeIn">
            Albatross Communication Services
          </h2>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent text-center mb-4 animate-fadeIn">
            Activations & Attendance Dashboard
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
    
      {/* Attendance Dashboard Section */}
      <div className="animate-fadeIn mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Attendance Card */}
        <div className="group relative overflow-hidden rounded-2xl p-1 animate-scaleIn">
          <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
            style={{ backgroundImage: 'linear-gradient(to right, from-green-500, to-yellow-500)' }}></div>
          <div className="relative bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10 
                          transition-all duration-500 group-hover:border-white/20">
            <div className="flex items-center">
              <div className="p-4 rounded-xl bg-gradient-to-r from-green-500 to-yellow-500 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div className="ml-6">
                <p className="text-1xl font-bold text-green-600/70">Total Attendance</p>
                <p className="text-3xl font-bold text-white">{totalAttendance}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Present Card */}
        <div className="group relative overflow-hidden rounded-2xl p-1 animate-scaleIn">
          <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
            style={{ backgroundImage: 'linear-gradient(to right, from-blue-500, to-teal-500)' }}></div>
          <div className="relative bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10 
                          transition-all duration-500 group-hover:border-white/20">
            <div className="flex items-center">
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <div className="ml-6">
                <p className="text-1xl font-bold text-indigo-600/70">Present</p>
                <p className="text-3xl font-bold text-white">{present}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Absent Card */}
        <div className="group relative overflow-hidden rounded-2xl p-1 animate-scaleIn">
          <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
            style={{ backgroundImage: 'linear-gradient(to right, from-red-500, to-yellow-500)' }}></div>
          <div className="relative bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10 
                          transition-all duration-500 group-hover:border-white/20">
            <div className="flex items-center">
              <div className="p-4 rounded-xl bg-gradient-to-r from-red-500 to-yellow-500 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <XCircle className="w-7 h-7 text-white" />
              </div>
              <div className="ml-6">
                <p className="text-1xl font-bold text-indigo-600/70">Absent</p>
                <p className="text-3xl font-bold text-white">{absent}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="animate-fadeIn mt-8 glass-card rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="modern-table w-full">
            <thead>
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-indigo-600 uppercase tracking-wider">Agent Name</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-green-600 uppercase tracking-wider">Present</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-red-600 uppercase tracking-wider">Absent</th>
              </tr>
            </thead>
            <tbody className="divide-y-8 divide-transparent">
              {attendance.map((agent, index) => (
                <tr key={index} className="group relative overflow-hidden rounded-2xl p-1 animate-scaleIn hover:bg-white/10 transition-all duration-500">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg">
                        <span className="text-lg font-bold text-white">{agent.name.charAt(0)}</span>
                      </div>
                      <span className="font-semibold text-white">{agent.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-green-600 font-semibold">{agent.present}</td>
                  <td className="px-6 py-4 text-center text-red-600 font-semibold">{agent.absent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
