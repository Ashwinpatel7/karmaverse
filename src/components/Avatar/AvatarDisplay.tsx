import React from 'react';
import { motion } from 'framer-motion';
import { Avatar } from '../../types';

interface AvatarDisplayProps {
  avatar: Avatar;
  size?: 'small' | 'medium' | 'large';
  showStats?: boolean;
  animated?: boolean;
}

const AvatarDisplay: React.FC<AvatarDisplayProps> = ({ 
  avatar, 
  size = 'medium', 
  showStats = false,
  animated = true 
}) => {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-32 h-32',
    large: 'w-48 h-48'
  };

  const getAuraIntensity = () => {
    switch (avatar.appearance.aura) {
      case 'none': return 0;
      case 'dim': return 0.3;
      case 'bright': return 0.6;
      case 'radiant': return 0.8;
      case 'divine': return 1.0;
      default: return 0.3;
    }
  };

  const getFormEmoji = () => {
    switch (avatar.appearance.form) {
      case 'human': return '🧘‍♂️';
      case 'celestial': return '👼';
      case 'animal': return '🦅';
      case 'divine': return '🕉️';
      default: return '🧘‍♂️';
    }
  };

  const getDominantGuna = () => {
    const { sattva, rajas, tamas } = avatar.stats.gunas;
    if (sattva >= rajas && sattva >= tamas) return 'sattva';
    if (rajas >= tamas) return 'rajas';
    return 'tamas';
  };

  const getGunaColor = () => {
    const dominant = getDominantGuna();
    switch (dominant) {
      case 'sattva': return '#fbbf24';
      case 'rajas': return '#ef4444';
      case 'tamas': return '#6b7280';
      default: return '#fbbf24';
    }
  };

  const avatarVariants = {
    idle: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'reverse' as const,
        ease: 'easeInOut' as const
      }
    },
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.3
      }
    }
  };

  const auraVariants = {
    pulse: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut' as const
      }
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        className={`relative ${sizeClasses[size]} flex items-center justify-center`}
        variants={animated ? avatarVariants : undefined}
        initial="idle"
        animate="idle"
        whileHover="hover"
      >
        {avatar.appearance.aura !== 'none' && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${avatar.appearance.colors.aura}${Math.floor(getAuraIntensity() * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
              filter: 'blur(8px)'
            }}
            variants={animated ? auraVariants : undefined}
            animate="pulse"
          />
        )}

        <motion.div
          className="relative z-10 w-full h-full rounded-full flex items-center justify-center text-6xl"
          style={{
            background: `linear-gradient(135deg, ${avatar.appearance.colors.primary}, ${avatar.appearance.colors.secondary})`,
            border: `3px solid ${getGunaColor()}`,
            boxShadow: `0 0 20px ${getGunaColor()}40`
          }}
        >
          {getFormEmoji()}
        </motion.div>

        <div className="absolute -right-2 top-0 flex flex-col space-y-1">
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: avatar.stats.spiritualLevel > i * 10 ? getGunaColor() : '#e5e7eb',
                opacity: avatar.stats.spiritualLevel > i * 10 ? 1 : 0.3
              }}
              animate={{
                scale: avatar.stats.spiritualLevel > i * 10 ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      </motion.div>

      <div className="mt-4 text-center">
        <h3 className="font-spiritual text-lg font-semibold text-saffron-700">
          {avatar.name}
        </h3>
        <p className="text-sm text-gray-600">
          Incarnation {avatar.incarnation} • Level {avatar.level}
        </p>
        <p className="text-xs text-gray-500 capitalize">
          {avatar.stats.yogaPath} Yoga Path
        </p>
      </div>

      {showStats && (
        <motion.div
          className="mt-4 spiritual-card p-4 w-full max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Karma</span>
              <span className={`text-sm font-bold ${
                avatar.stats.karma.total > 0 ? 'text-green-600' : 
                avatar.stats.karma.total < 0 ? 'text-red-600' : 'text-gray-600'
              }`}>
                {avatar.stats.karma.total > 0 ? '+' : ''}{avatar.stats.karma.total}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  avatar.stats.karma.total > 0 ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{
                  width: `${Math.min(100, Math.abs(avatar.stats.karma.total) / 10)}%`
                }}
              />
            </div>
          </div>

          <div className="mb-3">
            <h4 className="text-sm font-medium mb-2">Gunas Balance</h4>
            <div className="space-y-1">
              {Object.entries(avatar.stats.gunas).map(([guna, value]) => (
                <div key={guna} className="flex items-center">
                  <span className="text-xs w-16 capitalize">{guna}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5 mx-2">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        guna === 'sattva' ? 'bg-yellow-500' :
                        guna === 'rajas' ? 'bg-red-500' : 'bg-gray-500'
                      }`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                  <span className="text-xs w-8">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Strongest Virtues</h4>
            <div className="flex flex-wrap gap-1">
              {Object.entries(avatar.stats.virtues)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([virtue, value]) => (
                  <span
                    key={virtue}
                    className="px-2 py-1 bg-saffron-100 text-saffron-700 text-xs rounded-full capitalize"
                  >
                    {virtue} {value}
                  </span>
                ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AvatarDisplay;