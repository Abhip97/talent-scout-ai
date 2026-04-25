import { Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { exportToCSV, exportToJSON } from '../../utils/exportUtils.js';

export const ExportButtons = ({ shortlist }) => {
  if (!shortlist?.length) return null;

  return (
    <div className="flex items-center gap-2">
      <motion.button
        onClick={() => exportToCSV(shortlist)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-600/30 text-emerald-300 rounded-xl text-xs font-semibold transition-colors"
      >
        <Download size={13} /> Export CSV
      </motion.button>
      <motion.button
        onClick={() => exportToJSON(shortlist)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-1.5 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/30 text-blue-300 rounded-xl text-xs font-semibold transition-colors"
      >
        <Download size={13} /> Export JSON
      </motion.button>
    </div>
  );
};

export default ExportButtons;
