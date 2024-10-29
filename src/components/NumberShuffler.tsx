import React, { useState, useRef } from 'react';
import { Upload, Download, ArrowLeft } from 'lucide-react';
import { SHUFFLE_CONFIG } from '../config';

interface ManualShuffleProps {
  onBack: () => void;
}

function ManualShuffle({ onBack }: ManualShuffleProps) {
  const [numbers, setNumbers] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mergeFilesRef = useRef<HTMLInputElement>(null);

  const formatNumber = (input: string): string => {
    const cleaned = input.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return cleaned;
    }
    return '';
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const lines = value.split('\n');
    const formattedNumbers: string[] = [];

    lines.forEach(line => {
      const formattedNumber = formatNumber(line);
      if (formattedNumber) {
        SHUFFLE_CONFIG.prefixes.forEach(prefix => {
          formattedNumbers.push(prefix + formattedNumber.substring(3));
        });
      }
    });

    // If we reach the end of a number (10 digits), add a newline
    if (value.length > inputValue.length && formatNumber(value.split('\n').pop() || '').length === 10) {
      setInputValue(value + '\n');
    }

    setNumbers([...new Set(formattedNumbers)]);
  };

  const downloadCSV = () => {
    if (numbers.length === 0) return;
    
    const csvContent = 'Phone Numbers\n' + numbers.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'shuffled_numbers.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setInputValue(text);
        processNumbers(text);
      };
      reader.readAsText(file);
    }
  };

  const handleMergeFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const allNumbers = new Set<string>();
    let filesProcessed = 0;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const lines = content.split('\n');
        lines.forEach((line, index) => {
          if (index > 0 && line.trim()) {
            allNumbers.add(line.trim());
          }
        });

        filesProcessed++;
        if (filesProcessed === files.length) {
          setNumbers(Array.from(allNumbers));
          setInputValue(Array.from(allNumbers).join('\n'));
        }
      };
      reader.readAsText(file);
    });
  };

  const processNumbers = (input: string) => {
    const inputNumbers = input.split('\n').filter(number => number.trim() !== "");
    if (inputNumbers.length > 500) {
      alert('Please enter up to 500 numbers only.');
      return;
    }

    let modifiedNumbers: string[] = [];
    inputNumbers.forEach((number) => {
      const baseNumber = number.trim();
      if (baseNumber.length === 10 && !isNaN(Number(baseNumber))) {
        SHUFFLE_CONFIG.prefixes.forEach(prefix => {
          const modifiedNumber = prefix + baseNumber.substring(3);
          if (modifiedNumber.length === 10) {
            modifiedNumbers.push(modifiedNumber);
          }
        });
      }
    });

    modifiedNumbers = [...new Set(modifiedNumbers)];
    modifiedNumbers.sort((a, b) => {
      const prefixOrder: { [key: string]: number } = { 
        "050": 0, "054": 1, "056": 2, "052": 3, "055": 4 
      };
      return prefixOrder[a.substring(0, 3)] - prefixOrder[b.substring(0, 3)];
    });

    setNumbers(modifiedNumbers);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="mb-8 px-4 py-2 flex items-center text-white/70 hover:text-white transition-colors animate-slideIn"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Tools
      </button>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl animate-scaleIn">
        <div className="relative mb-8">
          <textarea
            value={inputValue}
            onChange={handleTextAreaChange}
            className="w-full h-96 p-6 bg-white/5 border border-white/20 rounded-lg text-white resize-none focus:outline-none focus:border-emerald-500 focus-ring transition-all font-mono glass-morphism"
            placeholder="Enter ten-digit numbers (automatically formatted)"
          />
          <div className="absolute top-4 right-4 flex space-x-2">
            <div className="px-3 py-1 bg-emerald-500/20 rounded-full text-xs text-emerald-300">
              {inputValue.split('\n').filter(Boolean).length} numbers
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={downloadCSV}
            disabled={numbers.length === 0}
            className="flex items-center px-6 py-4 bg-gradient-to-r from-emerald-600 to-amber-600 rounded-lg font-medium hover:from-emerald-500 hover:to-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-glow hover:shadow-glow-lg group"
          >
            <Download className="w-5 h-5 mr-2 group-hover:animate-bounce-slow" />
            <span>Download CSV</span>
          </button>

          <label className="flex items-center px-6 py-4 bg-white/5 border border-white/20 rounded-lg cursor-pointer hover:bg-white/10 transition-all group glass-morphism">
            <Upload className="w-5 h-5 mr-2 group-hover:animate-pulse-slow" />
            <span>Upload CSV</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <label className="flex items-center px-6 py-4 bg-white/5 border border-white/20 rounded-lg cursor-pointer hover:bg-white/10 transition-all group glass-morphism">
            <Upload className="w-5 h-5 mr-2 group-hover:animate-pulse-slow" />
            <span>Merge CSV Files</span>
            <input
              ref={mergeFilesRef}
              type="file"
              accept=".csv"
              multiple
              onChange={handleMergeFiles}
              className="hidden"
            />
          </label>
        </div>

        {numbers.length > 0 && (
          <div className="overflow-x-auto animate-fadeIn">
            <table className="w-full table-hover">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-3 text-left text-sm font-semibold">#</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Number</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {numbers.map((number, index) => (
                  <tr key={index} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm">{index + 1}</td>
                    <td className="px-6 py-4 font-mono">{number}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManualShuffle;
