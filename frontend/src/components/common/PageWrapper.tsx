import { motion } from 'framer-motion';
import type{ ReactNode } from 'react';

const PageWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gray-100 p-6"
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;

