import { motion } from 'framer-motion';

export const Loader = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: '0.4rem',
    md: '0.8rem',
    lg: '1.5rem',
  };

  return (
    <div 
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ 
        fontSize: sizeMap[size] || '1rem',
        minHeight: '2.5em',
        minWidth: '2.5em'
      }}
    >
      <div className="premium-loader" />
    </div>
  );
};
