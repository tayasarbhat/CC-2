import React, { useState } from 'react';
import { Shuffle, Download, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { ShuffleMethod } from '../shuffleLogic/types';
import { shuffleMethods } from '../shuffleLogic';
import { downloadCSV } from '../shuffleLogic/utils';

interface NumberShufflerProps {
  onBack: () => void;
}

function NumberShuffler({ onBack }: NumberShufflerProps) {
  const [selectedMethod, setSelectedMethod] = useState<ShuffleMethod | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isMethodListOpen, setIsMethodListOpen] = useState(false);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(value);
  };

  const handleMethodSelect = (method: ShuffleMethod) => {
    setSelectedMethod(method);
    setIsMethodListOpen(false);
  };

  const handleGenerate = () => {
    if (!selectedMethod || !phoneNumber || phoneNumber.length !== 10) {
      alert('Please enter a valid 10-digit phone number and select a shuffle method.');
      return;
    }

    const numbers = selectedMethod.generate(phoneNumber);
    downloadCSV(numbers, `${selectedMethod.id}_shuffled_numbers.csv`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="mb-8 px-4 py-2 flex items-center text-white/70 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Tools
      </button>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
        <div className="space-y-6">
          {/* Phone Number Input */}
          <div>
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <div className="relative">
              <input
                type="text"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                placeholder="Enter 10-digit number"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                maxLength={10}
              />
            </div>
          </div>

          {/* Method Selector */}
          <div className="relative">
            <label className="block text-sm font-medium mb-2">Shuffle Method</label>
            <button
              onClick={() => setIsMethodListOpen(!isMethodListOpen)}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg flex items-center justify-between hover:bg-white/10 transition-all"
            >
              <span>{selectedMethod?.name || 'Select a method'}</span>
              {isMethodListOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {isMethodListOpen && (
              <div className="absolute z-10 w-full mt-2 bg-gray-900 border border-white/20 rounded-lg shadow-xl max-h-96 overflow-y-auto">
                {shuffleMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => handleMethodSelect(method)}
                    className="w-full px-4 py-3 text-left hover:bg-white/10 transition-all flex items-center space-x-3"
                  >
                    <Shuffle className="w-5 h-5" />
                    <div>
                      <div className="font-medium">{method.name}</div>
                      <div className="text-sm text-gray-400">{method.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!selectedMethod || phoneNumber.length !== 10}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium flex items-center justify-center space-x-2 hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            <span>Generate & Download CSV</span>
          </button>
        </div>

        {/* Selected Method Info */}
        {selectedMethod && (
          <div className="mt-8 p-4 bg-white/5 rounded-lg">
            <h3 className="font-medium mb-2">{selectedMethod.name}</h3>
            <p className="text-sm text-gray-300">{selectedMethod.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default NumberShuffler;