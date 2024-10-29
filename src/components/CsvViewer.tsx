import React, { useState, useRef } from 'react';
import { ArrowLeft, Check, Upload, Search, X, FileText } from 'lucide-react';

interface CsvViewerProps {
  onBack: () => void;
}

const CsvViewer: React.FC<CsvViewerProps> = ({ onBack }) => {
  const [entries, setEntries] = useState<Array<{ number: string; comment: string }>>([]);
  const [clickedNumbers, setClickedNumbers] = useState<Set<string>>(new Set());
  const [recordsPerPage, setRecordsPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredEntries = entries.filter(entry => 
    entry.number.includes(searchTerm) || entry.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result as string;
      const lines = content.split('\n');
      const newEntries = lines
        .slice(1)
        .filter(line => line.trim())
        .map(line => {
          const number = line.trim();
          const savedComment = localStorage.getItem(`comment_${number}`) || '';
          const wasClicked = localStorage.getItem(`clicked_${number}`) === 'clicked';
          
          if (wasClicked) {
            setClickedNumbers(prev => new Set([...prev, number]));
          }
          
          return { number, comment: savedComment };
        });

      setEntries(newEntries);
    };

    reader.readAsText(file);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setClickedNumbers(prev => new Set([...prev, text]));
      localStorage.setItem(`clicked_${text}`, 'clicked');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCommentChange = (number: string, comment: string) => {
    localStorage.setItem(`comment_${number}`, comment);
    setEntries(prev =>
      prev.map(entry =>
        entry.number === number ? { ...entry, comment } : entry
      )
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const lines = content.split('\n');
        const newEntries = lines
          .slice(1)
          .filter(line => line.trim())
          .map(line => ({
            number: line.trim(),
            comment: localStorage.getItem(`comment_${line.trim()}`) || ''
          }));
        setEntries(newEntries);
      };
      reader.readAsText(file);
    }
  };

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
            isDragging ? 'scale-105 border-purple-500' : ''
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search numbers or comments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-purple-500 transition-all"
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
                className="bg-white/5 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 transition-all"
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
                    <th className="px-6 py-4 text-left text-sm font-semibold">#</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Phone Number</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Comment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredEntries.slice(0, recordsPerPage).map((entry, index) => (
                    <tr 
                      key={index}
                      className="group hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm">{index + 1}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => copyToClipboard(entry.number)}
                          className="flex items-center space-x-2 text-lg font-medium hover:text-purple-400 transition-colors"
                        >
                          <span>{entry.number}</span>
                          {clickedNumbers.has(entry.number) && (
                            <Check className="w-4 h-4 text-green-400" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={entry.comment}
                          onChange={(e) => handleCommentChange(entry.number, e.target.value)}
                          className="w-full bg-white/5 border border-transparent rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 transition-all group-hover:border-white/20"
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
