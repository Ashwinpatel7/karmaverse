import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { Yuga } from '../../types';
import { Globe, Sun, Cloud, TreePine, Mountain, Waves, Users, Zap, Heart, Shield } from 'lucide-react';

const WorldExplorer: React.FC = () => {
  const { worldState, avatar, transitionYuga, updateKarma, addNotification } = useGameStore();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const yugaDescriptions = {
    satya: {
      name: 'Satya Yuga',
      title: 'The Golden Age of Truth',
      description: 'An age of perfect virtue, where dharma reigns supreme and all beings live in harmony with divine law.',
      characteristics: ['Perfect righteousness', 'No suffering or disease', 'Natural abundance', 'Divine communion'],
      duration: '1,728,000 years',
      color: 'from-yellow-200 to-green-200',
      textColor: 'text-green-800'
    },
    treta: {
      name: 'Treta Yuga',
      title: 'The Silver Age of Sacrifice',
      description: 'Virtue begins to decline, but dharma is still strong. Great sacrifices and rituals maintain cosmic order.',
      characteristics: ['Three-quarters virtue', 'Introduction of rituals', 'Emergence of kingdoms', 'Heroic deeds'],
      duration: '1,296,000 years',
      color: 'from-yellow-100 to-orange-200',
      textColor: 'text-orange-800'
    },
    dvapara: {
      name: 'Dvapara Yuga',
      title: 'The Bronze Age of Duality',
      description: 'Virtue and vice are equally balanced. Knowledge becomes divided and conflicts arise between good and evil.',
      characteristics: ['Half virtue remains', 'Division of knowledge', 'Rise of conflicts', 'Material progress'],
      duration: '864,000 years',
      color: 'from-orange-100 to-red-200',
      textColor: 'text-red-800'
    },
    kali: {
      name: 'Kali Yuga',
      title: 'The Iron Age of Darkness',
      description: 'The age of darkness and materialism. Virtue is at its lowest, but spiritual liberation is most accessible.',
      characteristics: ['Quarter virtue remains', 'Widespread ignorance', 'Material obsession', 'Easy liberation'],
      duration: '432,000 years',
      color: 'from-gray-200 to-gray-400',
      textColor: 'text-gray-800'
    }
  };

  const locations = [
    {
      id: 'temple',
      name: 'Sacred Temple',
      icon: '🏛️',
      description: 'A place of worship and spiritual learning',
      benefits: { karma: 10, sattva: 5 },
      available: true
    },
    {
      id: 'forest',
      name: 'Enchanted Forest',
      icon: '🌲',
      description: 'Meditate among ancient trees and connect with nature',
      benefits: { karma: 8, sattva: 8 },
      available: worldState.environment.spirituality > 30
    },
    {
      id: 'mountain',
      name: 'Sacred Mountain',
      icon: '⛰️',
      description: 'Climb to spiritual heights and gain wisdom',
      benefits: { karma: 15, sattva: 10 },
      available: worldState.environment.harmony > 50
    },
    {
      id: 'river',
      name: 'Holy River',
      icon: '🌊',
      description: 'Purify your soul in sacred waters',
      benefits: { karma: 12, sattva: 7 },
      available: true
    },
    {
      id: 'village',
      name: 'Dharmic Village',
      icon: '🏘️',
      description: 'Serve the community and practice karma yoga',
      benefits: { karma: 20, sattva: 3 },
      available: worldState.environment.prosperity > 40
    },
    {
      id: 'cave',
      name: 'Meditation Cave',
      icon: '🕳️',
      description: 'Deep contemplation in solitude',
      benefits: { karma: 5, sattva: 15 },
      available: worldState.currentYuga !== 'kali'
    }
  ];

  const handleLocationVisit = (location: typeof locations[0]) => {
    if (!avatar || !location.available) return;

    updateKarma({
      id: `location_${Date.now()}`,
      action: `Visited ${location.name}`,
      karmaChange: location.benefits.karma,
      gunaEffect: { sattva: location.benefits.sattva },
      timestamp: new Date(),
      context: `World exploration in ${worldState.currentYuga} Yuga`
    });

    addNotification(`Visited ${location.name}: +${location.benefits.karma} karma, +${location.benefits.sattva} sattva`);
    setSelectedLocation(null);
  };

  const handleYugaTransition = (newYuga: Yuga) => {
    if (newYuga === worldState.currentYuga) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      transitionYuga(newYuga);
      setIsTransitioning(false);
    }, 1000);
  };

  const getEnvironmentIcon = (aspect: string, value: number) => {
    const icons = {
      harmony: value > 70 ? '☮️' : value > 40 ? '⚖️' : '⚔️',
      prosperity: value > 70 ? '💰' : value > 40 ? '🏠' : '🍞',
      spirituality: value > 70 ? '🕉️' : value > 40 ? '🙏' : '📿',
      conflict: value > 70 ? '⚔️' : value > 40 ? '🤝' : '☮️'
    };
    return icons[aspect as keyof typeof icons] || '❓';
  };

  const currentYuga = yugaDescriptions[worldState.currentYuga];

  return (
    <div className="min-h-screen pt-20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-spiritual font-bold text-saffron-700 mb-2">
            World Explorer
          </h1>
          <p className="text-gray-600">
            Journey through the cosmic cycles and sacred locations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Yuga Display */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className={`spiritual-card p-8 bg-gradient-to-br ${currentYuga.color} relative overflow-hidden`}>
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className={`text-3xl font-bold ${currentYuga.textColor} mb-2`}>
                      {currentYuga.name}
                    </h2>
                    <p className={`text-lg ${currentYuga.textColor} opacity-80`}>
                      {currentYuga.title}
                    </p>
                  </div>
                  <div className="text-6xl">
                    {worldState.currentYuga === 'satya' ? '🌅' :
                     worldState.currentYuga === 'treta' ? '🌞' :
                     worldState.currentYuga === 'dvapara' ? '🌆' : '🌃'}
                  </div>
                </div>

                <p className={`${currentYuga.textColor} opacity-90 mb-6 leading-relaxed`}>
                  {currentYuga.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {currentYuga.characteristics.map((char, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center space-x-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="w-2 h-2 bg-current rounded-full opacity-60" />
                      <span className={`text-sm ${currentYuga.textColor} opacity-80`}>
                        {char}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <div className={`text-sm ${currentYuga.textColor} opacity-70`}>
                  Duration: {currentYuga.duration}
                </div>
              </div>
            </div>

            {/* Environment Status */}
            <motion.div
              className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {Object.entries(worldState.environment).slice(0, 4).map(([aspect, value]) => (
                <div key={aspect} className="spiritual-card p-4 text-center">
                  <div className="text-3xl mb-2">
                    {getEnvironmentIcon(aspect, value)}
                  </div>
                  <div className="text-sm font-medium text-gray-700 capitalize mb-1">
                    {aspect}
                  </div>
                  <div className="text-lg font-bold text-saffron-600">
                    {value}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        aspect === 'conflict' ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Sacred Locations */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-2xl font-semibold text-saffron-700 mb-6">
                Sacred Locations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {locations.map((location) => (
                  <motion.div
                    key={location.id}
                    className={`spiritual-card p-6 cursor-pointer transition-all ${
                      location.available
                        ? 'hover:shadow-lg hover:scale-105'
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                    whileHover={location.available ? { y: -5 } : {}}
                    onClick={() => location.available && setSelectedLocation(location.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{location.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">
                          {location.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {location.description}
                        </p>
                        <div className="flex space-x-4 text-xs">
                          <span className="text-green-600">
                            +{location.benefits.karma} Karma
                          </span>
                          <span className="text-yellow-600">
                            +{location.benefits.sattva} Sattva
                          </span>
                        </div>
                      </div>
                    </div>
                    {!location.available && (
                      <div className="mt-3 text-xs text-red-600">
                        Not available in current world state
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Yuga Selector (Debug/Admin) */}
            <div className="spiritual-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-saffron-700">
                Cosmic Cycles
              </h3>
              <div className="space-y-2">
                {Object.entries(yugaDescriptions).map(([yuga, info]) => (
                  <button
                    key={yuga}
                    onClick={() => handleYugaTransition(yuga as Yuga)}
                    disabled={isTransitioning}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      worldState.currentYuga === yuga
                        ? 'border-saffron-300 bg-saffron-50'
                        : 'border-gray-200 hover:border-saffron-200'
                    } ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="font-medium text-gray-800">{info.name}</div>
                    <div className="text-xs text-gray-600">{info.title}</div>
                  </button>
                ))}
              </div>
              <div className="mt-4 text-xs text-gray-500">
                * Yuga transitions affect world environment and available locations
              </div>
            </div>

            {/* Collective Karma */}
            <div className="spiritual-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-saffron-700">
                Collective Karma
              </h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-saffron-600 mb-2">
                  {worldState.collectiveKarma}
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  Combined karma of all souls
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      worldState.collectiveKarma >= 0 ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{
                      width: `${Math.min(100, Math.max(0, (worldState.collectiveKarma + 1000) / 20))}%`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* World Events */}
            <div className="spiritual-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-saffron-700">
                Cosmic Events
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Sun className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium">Solar Eclipse</div>
                    <div className="text-xs text-gray-600">Spiritual energy amplified</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <Mountain className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="text-sm font-medium">Sacred Festival</div>
                    <div className="text-xs text-gray-600">Bonus karma for good deeds</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            {avatar && (
              <div className="spiritual-card p-6">
                <h3 className="text-lg font-semibold mb-4 text-saffron-700">
                  Your Impact
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Locations Visited</span>
                    <span className="font-medium">
                      {avatar.stats.karma.recent.filter(a => a.context.includes('exploration')).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">World Contribution</span>
                    <span className="font-medium text-green-600">
                      +{Math.max(0, avatar.stats.karma.total)} karma
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Spiritual Influence</span>
                    <span className="font-medium">
                      {avatar.stats.spiritualLevel > 50 ? 'High' : 
                       avatar.stats.spiritualLevel > 25 ? 'Medium' : 'Growing'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Location Visit Modal */}
        <AnimatePresence>
          {selectedLocation && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLocation(null)}
            >
              <motion.div
                className="spiritual-card p-8 max-w-md w-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                {(() => {
                  const location = locations.find(l => l.id === selectedLocation)!;
                  return (
                    <div className="text-center">
                      <div className="text-6xl mb-4">{location.icon}</div>
                      <h3 className="text-2xl font-bold text-saffron-700 mb-2">
                        {location.name}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {location.description}
                      </p>
                      <div className="flex justify-center space-x-6 mb-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            +{location.benefits.karma}
                          </div>
                          <div className="text-sm text-gray-600">Karma</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-600">
                            +{location.benefits.sattva}
                          </div>
                          <div className="text-sm text-gray-600">Sattva</div>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setSelectedLocation(null)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleLocationVisit(location)}
                          className="flex-1 karma-button"
                        >
                          Visit
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transition Overlay */}
        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              className="fixed inset-0 bg-white/90 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center">
                <motion.div
                  className="text-8xl mb-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  🕉️
                </motion.div>
                <h2 className="text-2xl font-bold text-saffron-700 mb-2">
                  Cosmic Transition
                </h2>
                <p className="text-gray-600">
                  The world is shifting between yugas...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WorldExplorer;