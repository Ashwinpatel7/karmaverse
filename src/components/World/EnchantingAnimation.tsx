import React from 'react';
import { motion } from 'framer-motion';

interface EnchantingAnimationProps {
  onComplete: () => void;
}

const EnchantingAnimation: React.FC<EnchantingAnimationProps> = ({ onComplete }) => {
  // Trigger onComplete after animation finishes
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // 3 seconds animation
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative w-full h-full overflow-hidden">
        {/* Central Om symbol */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl text-saffron-500"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ 
            scale: 1.5, 
            opacity: [0, 1, 1, 0],
            rotateY: 360
          }}
          transition={{ 
            duration: 3,
            times: [0, 0.2, 0.8, 1]
          }}
        >
          🕉️
        </motion.div>
        
        {/* Light rays */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-0 left-0 w-1 h-20 bg-saffron-400 origin-bottom"
              style={{ 
                rotate: i * 30,
                translateY: -50
              }}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ 
                opacity: [0, 0.8, 0],
                scaleY: [0, 1, 0]
              }}
              transition={{ 
                duration: 3,
                delay: i * 0.05,
                repeat: 1,
                repeatType: "reverse"
              }}
            />
          ))}
        </div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-yellow-300"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0
            }}
            animate={{ 
              y: [null, Math.random() * -300],
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{ 
              duration: 2 + Math.random() * 1,
              delay: Math.random() * 1
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default EnchantingAnimation;