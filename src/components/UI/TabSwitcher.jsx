import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext.jsx';

export const TabSwitcher = ({ tabs, active, onChange, className = '' }) => {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  return (
    <div className={`flex gap-1 rounded-xl p-1 ${
      isDark ? 'bg-zinc-900' : 'bg-slate-100'
    } ${className}`}>
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              isActive
                ? isDark ? 'text-white' : 'text-gray-900'
                : isDark ? 'text-zinc-400 hover:text-zinc-200' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="tab-bg"
                className={`absolute inset-0 rounded-lg ${
                  isDark ? 'bg-zinc-700' : 'bg-white shadow-sm'
                }`}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon && <span>{tab.icon}</span>}
              {tab.label}
              {tab.count !== undefined && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? isDark ? 'bg-zinc-600 text-zinc-200' : 'bg-indigo-100 text-indigo-600'
                    : isDark ? 'bg-zinc-800 text-zinc-500' : 'bg-slate-200 text-slate-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default TabSwitcher;
