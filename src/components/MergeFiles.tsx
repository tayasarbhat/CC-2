import React, { useState, useRef } from 'react';
import { Upload, Download, ArrowLeft, FileText, CheckCircle, XCircle } from 'lucide-react';

interface MergeFilesProps {
  onBack: () => void;
}

interface ProcessingSummary {
  totalFiles: number;
  totalRecords: number;
  duplicatesRemoved: number;
}

interface ChunkInfo {
  data: string[];
  size: number;
}

function MergeFiles({ onBack }: MergeFilesProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [summary, setSummary] = useState<ProcessingSummary | null>(null);
  const [chunks, setChunks] = useState<ChunkInfo[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFiles(event.target.files);
    }
  };

  const processFiles = async () => {
    if (!selectedFiles) return;

    let mergedData = new Set<string>();
    let totalRecords = 0;

    for (const file of Array.from(selectedFiles)) {
      const text = await file.text();
      const rows = text.split('\n').filter(row => row.trim() !== '');
      totalRecords += rows.length - 1; // Exclude header

      for (let i = 1; i < rows.length; i++) {
        let value = rows[i].trim();
        if (value.startsWith('0')) {
          value = value.substring(1);
        }
        value = '971' + value;
        mergedData.add(value);
      }
    }

    const uniqueData = Array.from(mergedData);
    const duplicatesRemoved = totalRecords - uniqueData.length;

    setSummary({
      totalFiles: selectedFiles.length,
      totalRecords,
      duplicatesRemoved
    });

    // Split data into chunks of 9000
    const chunkSize = 9000;
    const newChunks: ChunkInfo[] = [];
    
    for (let i = 0; i < uniqueData.length; i += chunkSize) {
      const chunkData = uniqueData.slice(i, i + chunkSize);
      const blob = new Blob([chunkData.join('\n')], { type: 'text/csv' });
      newChunks.push({
        data: chunkData,
        size: blob.size
      });
    }

    setChunks(newChunks);
  };

  const downloadChunk = (data: string[], index: number) => {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
    const csvContent = data.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Numbers_${dateStr}_part_${index + 1}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="mb-8 px-4 py-2 flex items-center text-white/70 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Tools
      </button>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Merge CSV Files</h2>
          <p className="text-gray-300">Combine multiple CSV files and remove duplicates</p>
        </div>

        <div className="space-y-6">
          <label className="block w-full p-8 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-white/40 transition-all text-center">
            <Upload className="w-8 h-8 mx-auto mb-4" />
            <span className="block text-lg mb-2">Click to select CSV files</span>
            <span className="text-sm text-gray-400">You can select multiple files</span>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              accept=".csv"
              multiple
              className="hidden"
            />
          </label>

          {selectedFiles && selectedFiles.length > 0 && (
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="font-medium mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Selected Files
              </h3>
              <div className="grid gap-3">
                {Array.from(selectedFiles).map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-white/5 rounded-lg p-3"
                  >
                    <div className="flex-1 truncate">{file.name}</div>
                    <div className="text-sm text-gray-400">
                      {(file.size / 1024).toFixed(2)} KB
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={processFiles}
            disabled={!selectedFiles || selectedFiles.length === 0}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium flex items-center justify-center space-x-2 hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Process Files</span>
          </button>

          {summary && (
            <div className="grid gap-6">
              <div className="bg-white/5 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-center mb-6">Processing Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold mb-2">{summary.totalFiles}</div>
                    <div className="text-sm text-gray-400">Files Merged</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold mb-2">{summary.totalRecords}</div>
                    <div className="text-sm text-gray-400">Total Records</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold mb-2">{summary.duplicatesRemoved}</div>
                    <div className="text-sm text-gray-400">Duplicates Removed</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Processing Results</h3>
                  <div className="text-sm text-gray-400">
                    {summary.totalRecords - summary.duplicatesRemoved} unique records
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-white/5 rounded-lg p-4">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                      <span>Files Successfully Merged</span>
                    </div>
                    <div className="text-green-400">{summary.totalFiles} files</div>
                  </div>
                  <div className="flex items-center justify-between bg-white/5 rounded-lg p-4">
                    <div className="flex items-center">
                      <XCircle className="w-5 h-5 text-red-400 mr-3" />
                      <span>Duplicates Found & Removed</span>
                    </div>
                    <div className="text-red-400">{summary.duplicatesRemoved} records</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {chunks.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-center">Generated Files</h3>
              <div className="grid gap-3">
                {chunks.map((chunk, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">Part {index + 1}</div>
                      <button
                        onClick={() => downloadChunk(chunk.data, index)}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all flex items-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    </div>
                    <div className="text-sm text-gray-400 flex items-center justify-between">
                      <span>{chunk.data.length} records</span>
                      <span>{(chunk.size / 1024).toFixed(2)} KB</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MergeFiles;