import { useState } from 'react';
import { FileText, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { DragDropZone } from '../UI/DragDropZone.jsx';
import { useApp } from '../../context/AppContext.jsx';

const FileStatus = ({ file, status, error }) => (
  <div className="flex items-center gap-2 py-2 px-3 bg-zinc-900 rounded-lg text-xs">
    <FileText size={13} className="text-zinc-400 shrink-0" />
    <span className="flex-1 truncate text-zinc-300">{file.name}</span>
    <span className="text-zinc-500">{(file.size / 1024).toFixed(0)} KB</span>
    {status === 'pending' && <span className="text-zinc-600 text-[10px]">pending</span>}
    {status === 'parsing' && <Loader2 size={12} className="text-blue-400 animate-spin" />}
    {status === 'done' && <CheckCircle size={12} className="text-emerald-400" />}
    {status === 'error' && (
      <span title={error}><AlertCircle size={12} className="text-rose-400" /></span>
    )}
  </div>
);

export const ResumeUpload = () => {
  const { sources, setSources, isRunning } = useApp();
  const [fileStatuses, setFileStatuses] = useState({});

  const handleFiles = (newFiles) => {
    const valid = newFiles.filter((f) => {
      const ext = f.name.split('.').pop().toLowerCase();
      return ['pdf', 'docx'].includes(ext);
    });
    setSources((prev) => ({
      ...prev,
      resumes: [...(prev.resumes || []), ...valid],
    }));
    const newStatuses = {};
    valid.forEach((f) => { newStatuses[f.name] = 'pending'; });
    setFileStatuses((prev) => ({ ...prev, ...newStatuses }));
  };

  const removeFile = (name) => {
    setSources((prev) => ({
      ...prev,
      resumes: (prev.resumes || []).filter((f) => f.name !== name),
    }));
    setFileStatuses((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const files = sources.resumes || [];

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-zinc-300">Upload Resumes (PDF / DOCX)</p>
      <DragDropZone
        onFiles={handleFiles}
        accept=".pdf,.docx"
        multiple
        label="Drop resumes here or click to browse"
        sublabel="Multiple files supported · PDF and DOCX"
      />
      {files.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
            <span>{files.length} file{files.length !== 1 ? 's' : ''} queued</span>
            {!isRunning && (
              <button
                onClick={() => { setSources((p) => ({ ...p, resumes: [] })); setFileStatuses({}); }}
                className="text-zinc-600 hover:text-rose-400 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
          {files.map((f) => (
            <div key={f.name} className="flex items-center gap-2">
              <div className="flex-1">
                <FileStatus file={f} status={fileStatuses[f.name] || 'pending'} />
              </div>
              {!isRunning && (
                <button onClick={() => removeFile(f.name)} className="p-1.5 text-zinc-600 hover:text-rose-400 transition-colors shrink-0">
                  <X size={13} />
                </button>
              )}
            </div>
          ))}
        </motion.div>
      )}
      <p className="text-xs text-zinc-600">
        Resumes will be parsed by AI (requires Groq API key) and matched against the JD when you run the agent.
      </p>
    </div>
  );
};

export default ResumeUpload;
