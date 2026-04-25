import { useState, useRef } from 'react';
import { Upload, FileText } from 'lucide-react';

export const DragDropZone = ({
  onFiles,
  accept = '.pdf,.docx',
  multiple = false,
  label = 'Drop files here or click to browse',
  sublabel,
  className = '',
  children,
}) => {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) onFiles(multiple ? files : [files[0]]);
  };

  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) onFiles(multiple ? files : [files[0]]);
    e.target.value = '';
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl transition-all cursor-pointer
        ${dragging
          ? 'border-blue-400 bg-blue-500/10'
          : 'border-zinc-700 hover:border-zinc-500 bg-zinc-900/40 hover:bg-zinc-800/40'
        } ${className}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={handleChange}
      />
      {children || (
        <div className="flex flex-col items-center justify-center py-8 px-4 gap-3">
          <div className={`p-3 rounded-xl transition-colors ${dragging ? 'bg-blue-500/20' : 'bg-zinc-800'}`}>
            {dragging ? <FileText size={24} className="text-blue-400" /> : <Upload size={24} className="text-zinc-400" />}
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-zinc-300">{label}</p>
            {sublabel && <p className="text-xs text-zinc-500 mt-1">{sublabel}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default DragDropZone;
