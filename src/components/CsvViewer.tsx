import React, { useState, useRef } from 'react';
import { ArrowLeft, Check, Upload } from 'lucide-react';

interface CsvViewerProps {
  onBack: () => void;
}

const CsvViewer: React.FC<CsvViewerProps> = ({ onBack }) => {
  const [entries, setEntries] = useState<Array<{ number: string; comment: string }>>([]);
  const [clickedNumbers, setClickedNumbers] = useState<Set<string>>(new Set());
  const [recordsPerPage, setRecordsPerPage] = useState<number>(10);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result as string;
      const lines = content.split('\n');
      const newEntries = lines
        .slice(1) // Skip header row
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="mb-8 px-4 py-2 flex items-center text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Tools
        </button>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          <div className="mb-8">
            <label className="flex items-center justify-center w-full p-6 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-white/40 transition-all">
              <Upload className="w-6 h-6 mr-2" />
              <span>Upload CSV File</span>
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
            <>
              <div className="mb-4 flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  Total Records: {entries.length}
                </div>
                <select
                  value={recordsPerPage}
                  onChange={(e) => setRecordsPerPage(Number(e.target.value))}
                  className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 transition-all"
                >
                  <option value={10}>10 records</option>
                  <option value={20}>20 records</option>
                  <option value={40}>40 records</option>
                  <option value={100}>100 records</option>
                  <option value={entries.length}>All records</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-6 py-3 text-left text-base font-semibold">#</th>
                      <th className="px-6 py-3 text-left text-base font-semibold">Phone Number</th>
                      <th className="px-6 py-3 text-left text-base font-semibold">Comment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {entries.slice(0, recordsPerPage).map((entry, index) => (
                      <tr key={index} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-base">{index + 1}</td>
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
                            className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-base focus:outline-none focus:border-purple-500 transition-all"
                            placeholder="Add a comment..."
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CsvViewer;
