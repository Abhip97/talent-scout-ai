import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext.jsx';

export const EmptyState = ({ icon, title, description, action, className = '' }) => {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-16 px-8 text-center ${className}`}
    >
      {icon && <div className="text-5xl mb-4 opacity-60">{icon}</div>}
      <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>{title}</h3>
      {description && (
        <p className={`text-sm max-w-xs leading-relaxed mb-6 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
          {description}
        </p>
      )}
      {action}
    </motion.div>
  );
};

export default EmptyState;
