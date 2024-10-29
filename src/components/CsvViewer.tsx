import React, { useState } from 'react';
import { Upload, Download, ArrowLeft, Check, Trash } from 'lucide-react';

interface CsvViewerProps {
  onBack: () => void;
}

interface PhoneNumberEntry {
  number: string;
  comment: string;
}

function CsvViewer({ onBack }: CsvViewerProps) {
  const [csvData, setCsvData] = useState<PhoneNumberEntry[]>([]);
  const [clickedNumbers, setClickedNumbers] = useState<Set<string>>(new Set());

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const numbers = text.split('\n')
          .map(line => line.trim())
          .filter(line => line && line !== 'Phone Numbers')
          .map(number => ({
            number: processPhoneNumber(number),
            comment: localStorage.getItem(`comment_${number}`) || ''
          }));
        setCsvData(numbers);
      };
      reader.readAsText(file);
    }
  };

  const processPhoneNumber = (number: string): string => {
    number = number.trim();
    if (number.startsWith('971')) {
      number = number.substring(3);
      number = '0' + number;
    }
    return number;
  };

  const copyToClipboard = async (number: string) => {
    try {
      await navigator.clipboard.writeText(number);
      setClickedNumbers(prev => new Set([...prev, number]));
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCommentChange = (index: number, comment: string) => {
    const newData = [...csvData];
    newData[index].comment = comment;
    setCsvData(newData);
    localStorage.setItem(`comment_${newData[index].number}`, comment);
  };

  const downloadCurrentCSV = () => {
    const csvContent = 'Phone Numbers,Comments\n' + 
      csvData.map(entry => `${entry.number},${entry.comment}`).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'phone_numbers_with_comments.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const removeEntry = (index: number) => {
    setCsvData(prev => prev.filter((_, i) => i !== index));
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
        <div className="flex flex-wrap gap-4 mb-8">
          <label className="flex-1 flex items-center justify-center px-6 py-4 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-white/40 transition-colors">
            <Upload className="w-5 h-5 mr-2" />
            <span>Upload CSV File</span>
            <input
              type="file"
              onChange={handleFileUpload}
              accept=".csv"
              className="hidden"
            />
          </label>

          <button
            onClick={downloadCurrentCSV}
            disabled={csvData.length === 0}
            className="flex items-center px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5 mr-2" />
            <span>Download CSV</span>
          </button>
        </div>

        {csvData.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-3 text-left text-sm font-semibold">#</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Phone Number</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Comment</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {csvData.map((entry, index) => (
                  <tr key={index} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm">{index + 1}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => copyToClipboard(entry.number)}
                        className="flex items-center space-x-2 hover:text-purple-400 transition-colors"
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
                        onChange={(e) => handleCommentChange(index, e.target.value)}
                        className="w-full bg-transparent border border-white/20 rounded px-3 py-1 focus:outline-none focus:border-purple-500"
                        placeholder="Add a comment..."
                      />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => removeEntry(index)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Trash className="w-4 h-4 text-red-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {csvData.length === 0 && (
          <div className="text-center py-12 text-white/60">
            <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Upload a CSV file to view and manage phone numbers</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CsvViewer;