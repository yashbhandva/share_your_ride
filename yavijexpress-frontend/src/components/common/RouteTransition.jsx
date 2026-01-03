import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const RouteTransition = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && <div className="page-load-indicator active"></div>}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="route-content-wrapper"
      >
        <div className={`content-fade-in ${!isLoading ? 'visible' : ''}`}>
          {children}
        </div>
      </motion.div>
    </>
  );
};

export default RouteTransition;