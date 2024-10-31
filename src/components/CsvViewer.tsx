import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Check, Upload, Search, X, FileText, PhoneCall, ArrowUpDown } from 'lucide-react';

interface CsvViewerProps {
  onBack: () => void;
}

type SortType = 'all' | 'called' | 'remaining';

interface FileHistory {
  fileName: string;
  numbers: string[];
  timestamp: number;
}

const CsvViewer: React.FC<CsvViewerProps> = ({ onBack }) => {
  const [entries, setEntries] = useState<Array<{ number: string; comment: string }>>([]);
  const [clickedNumbers, setClickedNumbers] = useState<Set<string>>(new Set());
  const [recordsPerPage, setRecordsPerPage] = useState<number>(10);
  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState<SortType>('all');
  const [fileHistory, setFileHistory] = useState<FileHistory[]>([]);
  const [currentFileName, setCurrentFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load file history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('fileHistory');
    if (savedHistory) {
      setFileHistory(JSON.parse(savedHistory));
    }

    // Load clicked numbers from localStorage
    const savedClickedNumbers = new Set<string>();
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith('clicked_')) {
        const number = key.replace('clicked_', '');
        if (localStorage.getItem(key) === 'clicked') {
          savedClickedNumbers.add(number);
        }
      }
    }
    setClickedNumbers(savedClickedNumbers);
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const lines = content.split('\n');
      const numbers = lines.slice(1).filter(line => line.trim());

      // Check if file was previously processed
      const existingFile = fileHistory.find(f => f.fileName === file.name);

      if (!existingFile) {
        // New file - reset clicked numbers for these numbers
        const newClickedNumbers = new Set(clickedNumbers);
        numbers.forEach(number => {
          if (newClickedNumbers.has(number)) {
            newClickedNumbers.delete(number);
            localStorage.removeItem(`clicked_${number}`);
          }
        });
        setClickedNumbers(newClickedNumbers);

        // Add to file history
        const newHistory = [...fileHistory, {
          fileName: file.name,
          numbers,
          timestamp: Date.now()
        }];
        setFileHistory(newHistory);
        localStorage.setItem('fileHistory', JSON.stringify(newHistory));
      }

      setCurrentFileName(file.name);

      const newEntries = numbers.map(number => ({
        number: number.trim(),
        comment: localStorage.getItem(`comment_${number}`) || ''
      }));

      setEntries(newEntries);
    };

    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => file.type === 'text/csv' || file.name.endsWith('.csv'));

    if (csvFile) {
      processFile(csvFile);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy number to clipboard.');
    }
    setClickedNumbers(prev => new Set([...prev, text]));
    localStorage.setItem(`clicked_${text}`, 'clicked');
  };

  const handleCommentChange = (number: string, comment: string) => {
    localStorage.setItem(`comment_${number}`, comment);
    setEntries(prev =>
      prev.map(entry =>
        entry.number === number ? { ...entry, comment } : entry
      )
    );
  };

  const filteredAndSortedEntries = entries
    .filter(entry =>
      entry.number.includes(searchTerm) ||
      entry.comment.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(entry => {
      if (sortType === 'called') return clickedNumbers.has(entry.number);
      if (sortType === 'remaining') return !clickedNumbers.has(entry.number);
      return true;
    });

  const currentFileStats = {
    total: entries.length,
    called: entries.filter(entry => clickedNumbers.has(entry.number)).length,
    remaining: entries.filter(entry => !clickedNumbers.has(entry.number)).length
  };

  const statsCards = [
    {
      title: "Total Numbers",
      value: currentFileStats.total,
      icon: <FileText className="w-5 h-5 text-emerald-400" />,
      onClick: () => setSortType('all'),
      active: sortType === 'all'
    },
    {
      title: "Called Numbers",
      value: currentFileStats.called,
      icon: <PhoneCall className="w-5 h-5 text-amber-400" />,
      onClick: () => setSortType('called'),
      active: sortType === 'called'
    },
    {
      title: "Remaining",
      value: currentFileStats.remaining,
      icon: <Check className="w-5 h-5 text-purple-400" />,
      onClick: () => setSortType('remaining'),
      active: sortType === 'remaining'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="mb-8 px-4 py-2 flex items-center text-white/70 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Tools
      </button>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
        <div
          className={`relative transition-all duration-300 ${
            isDragging ? 'scale-105 border-emerald-500' : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <label className="flex flex-col items-center justify-center w-full p-12 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-white/40 transition-all group">
            <div className="flex items-center justify-center mb-4">
              <Upload className="w-12 h-12 transition-transform group-hover:scale-110 duration-300" />
             
            </div>
            <div className="space-y-2 text-center">
              <p className="text-xl font-semibold">Drop your CSV file here</p>
              <p className="text-sm text-gray-400">or click to browse</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {entries.length > 0 && (
          <div className="mt-8 space-y-6 animate-fadeIn">
            {currentFileName && (
              <div className="text-sm text-gray-400 mb-4">
                Current file: {currentFileName}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {statsCards.map((card, index) => (
                <button
                  key={index}
                  onClick={card.onClick}
                  className={`text-left bg-white/5 rounded-xl p-4 backdrop-blur-lg border transition-all ${
                    card.active
                      ? 'border-emerald-500/50 shadow-glow'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <p className="text-sm text-gray-400">{card.title}</p>
                        <ArrowUpDown
                          className={`w-4 h-4 ml-2 transition-opacity ${
                            card.active ? 'opacity-100' : 'opacity-0'
                          }`}
                        />
                      </div>
                      <p className="text-2xl font-bold mt-1">{card.value}</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2">
                      {card.icon}
                    </div>
                  </div>
                  {card.title === "Called Numbers" && entries.length > 0 && (
                    <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-500"
                        style={{
                          width: `${
                            (currentFileStats.called / currentFileStats.total) *
                            100
                          }%`
                        }}
                      />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search numbers or comments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-emerald-500 transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <select
                value={recordsPerPage}
                onChange={(e) => setRecordsPerPage(Number(e.target.value))}
                className="bg-white/1 border border-green/20 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500 transition-all"
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={40}>40 per page</option>
                <option value={100}>100 per page</option>
                <option value={entries.length}>All records</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Phone Number
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Comment
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredAndSortedEntries
                    .slice(0, recordsPerPage)
                    .map((entry, index) => (
                      <tr
                        key={index}
                        className="group hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm">{index + 1}</td>
                        <td className="px-6 py-4">
                          <button
                            onMouseDown={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              copyToClipboard(entry.number);
                            }}
                            className="flex items-center space-x-2 text-lg font-medium hover:text-emerald-400 transition-colors"
                          >
                            <span className="phone-number">{entry.number}</span>
                            {clickedNumbers.has(entry.number) && (
                              <Check className="w-4 h-4 text-emerald-400" />
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={entry.comment}
                            onChange={(e) =>
                              handleCommentChange(entry.number, e.target.value)
                            }
                            className="w-full bg-white/5 border border-transparent rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 transition-all group-hover:border-white/20"
                            placeholder="Add a comment..."
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CsvViewer;
