import { useState } from 'react';
import { FileText, X, AlertCircle } from 'lucide-react';
import { DragDropZone } from '../UI/DragDropZone.jsx';
import { useFileExtractor } from '../../hooks/useFileExtractor.js';

export const JDFileUpload = ({ onTextExtracted }) => {
  const [file, setFile] = useState(null);
  const [err, setErr] = useState('');
  const { extract, extracting } = useFileExtractor();

  const handleFiles = async (files) => {
    const f = files[0];
    setFile(f);
    setErr('');
    try {
      const text = await extract(f);
      onTextExtracted(text);
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div className="space-y-2">
      <DragDropZone
        onFiles={handleFiles}
        accept=".pdf,.docx"
        label="Drop JD file here or click to browse"
        sublabel="Supports PDF and DOCX files"
        className="min-h-[80px]"
      />
      {extracting && (
        <div className="text-xs text-blue-400 flex items-center gap-2 px-2">
          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
          Extracting text from file...
        </div>
      )}
      {file && !extracting && !err && (
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
          <FileText size={13} />
          <span className="flex-1 truncate">{file.name}</span>
          <button onClick={() => { setFile(null); onTextExtracted(''); }} className="text-zinc-500 hover:text-zinc-300">
            <X size={13} />
          </button>
        </div>
      )}
      {err && (
        <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
          <AlertCircle size={13} />
          <span>{err}</span>
        </div>
      )}
    </div>
  );
};

export default JDFileUpload;
