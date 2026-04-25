import { motion } from 'framer-motion';

export const EmptyState = ({ icon, title, description, action, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex flex-col items-center justify-center py-16 px-8 text-center ${className}`}
  >
    {icon && (
      <div className="text-5xl mb-4 opacity-60">{icon}</div>
    )}
    <h3 className="text-lg font-semibold text-zinc-300 mb-2">{title}</h3>
    {description && <p className="text-sm text-zinc-500 max-w-xs leading-relaxed mb-6">{description}</p>}
    {action}
  </motion.div>
);

export default EmptyState;
