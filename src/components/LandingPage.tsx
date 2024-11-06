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
  const [totalActivations, setTotalActivations] = useState(0);
  const [remainingTarget, setRemainingTarget] = useState(0);
  const [totalTarget, setTotalTarget] = useState(0);
  const [totalAttendance, setTotalAttendance] = useState(0);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [attendance, setAttendance] = useState([]);
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
    // Fetch activations data
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

        const sortedAgents = mappedAgents.sort((a, b) => (b.silver + b.gold + b.platinum + b.standard) - (a.silver + a.gold + a.platinum + a.standard));
        setAgents(sortedAgents);

        const getTotalActivations = () => sortedAgents.reduce((acc, agent) => acc + agent.silver + agent.gold + agent.platinum + agent.standard, 0);
        const getTotalTarget = () => sortedAgents.reduce((acc, agent) => acc + agent.target, 0);

        setTotalActivations(getTotalActivations());
        setTotalTarget(getTotalTarget());
        setRemainingTarget(getTotalTarget() - getTotalActivations());
      })
      .catch(error => console.error('Error fetching data:', error));

    // Fetch attendance data
    fetch('https://script.google.com/macros/s/YOUR_ATTENDANCE_SCRIPT_URL/exec') // Replace with your URL
      .then(response => response.json())
      .then(data => {
        const mappedAttendance = data.map((row: any) => ({
          name: row['Agent Name'] || '',
          status: row['Status'] || 'Absent'
        }));

        const total = mappedAttendance.length;
        const present = mappedAttendance.filter(agent => agent.status === 'Present').length;
        const absent = mappedAttendance.filter(agent => agent.status === 'Absent').length;

        setAttendance(mappedAttendance);
        setTotalAttendance(total);
        setPresentCount(present);
        setAbsentCount(absent);
      })
      .catch(error => console.error('Error fetching attendance data:', error));
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Existing Clock and Tools sections */}
      
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
          <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" style={{ backgroundImage: 'linear-gradient(to right, from-pink-500, to-purple-500)' }}></div>
          <div className="relative bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10 transition-all duration-500 group-hover:border-white/20">
            <div className="flex items-center">
              <div className="p-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg group-hover:scale-110 transition-transform duration-500">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div className="ml-6">
                <p className="text-1xl font-bold text-pink-600/70">Total Attendance</p>
                <p className="text-3xl font-bold text-white">{totalAttendance}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Present Count Card */}
        <div className="group relative overflow-hidden rounded-2xl p-1 animate-scaleIn">
          <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" style={{ backgroundImage: 'linear-gradient(to right, from-emerald-500, to-teal-500)' }}></div>
          <div className="relative bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10 transition-all duration-500 group-hover:border-white/20">
            <div className="flex items-center">
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg group-hover:scale-110 transition-transform duration-500">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <div className="ml-6">
                <p className="text-1xl font-bold text-emerald-600/70">Present</p>
                <p className="text-3xl font-bold text-white">{presentCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Absent Count Card */}
        <div className="group relative overflow-hidden rounded-2xl p-1 animate-scaleIn">
          <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" style={{ backgroundImage: 'linear-gradient(to right, from-red-500, to-pink-500)' }}></div>
          <div className="relative bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10 transition-all duration-500 group-hover:border-white/20">
            <div className="flex items-center">
              <div className="p-4 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 shadow-lg group-hover:scale-110 transition-transform duration-500">
                <XCircle className="w-7 h-7 text-white" />
              </div>
              <div className="ml-6">
                <p className="text-1xl font-bold text-red-600/70">Absent</p>
                <p className="text-3xl font-bold text-white">{absentCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table Section */}
      <div className="animate-fadeIn mt-8 glass-card rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="modern-table w-full">
            <thead>
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-indigo-600 uppercase tracking-wider">Agent Name</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-indigo-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y-8 divide-transparent">
              {attendance.map((agent, index) => (
                <tr key={index} className="group relative overflow-hidden rounded-2xl p-1 animate-scaleIn hover:bg-white/10 transition-all duration-500">
                  <td className="px-6 py-4 font-semibold text-white">{agent.name}</td>
                  <td className="px-6 py-4 text-center font-semibold text-white">{agent.status}</td>
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
