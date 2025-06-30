import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { YogaPath } from '../../types';

const AvatarCreation: React.FC = () => {
  const { initializeAvatar, setCurrentView } = useGameStore();
  const [name, setName] = useState('');
  const [selectedPath, setSelectedPath] = useState<YogaPath | null>(null);
  const [step, setStep] = useState(1);

  const yogaPaths = [
    {
      path: 'karma' as YogaPath,
      title: 'Karma Yoga',
      subtitle: 'Path of Selfless Action',
      description: 'Achieve liberation through selfless service and righteous action without attachment to results.',
      icon: '🤝',
      color: 'from-green-400 to-green-600',
      quote: 'You have a right to perform your prescribed duty, but never to the fruits of action. - Bhagavad Gita 2.47'
    },
    {
      path: 'bhakti' as YogaPath,
      title: 'Bhakti Yoga',
      subtitle: 'Path of Devotion',
      description: 'Attain the Divine through love, devotion, and surrender to the Supreme.',
      icon: '❤️',
      color: 'from-pink-400 to-pink-600',
      quote: 'Those who always worship Me with exclusive devotion... to them I carry what they lack. - Bhagavad Gita 9.22'
    },
    {
      path: 'jnana' as YogaPath,
      title: 'Jnana Yoga',
      subtitle: 'Path of Knowledge',
      description: 'Realize the Self through wisdom, study, and discrimination between the real and unreal.',
      icon: '🧠',
      color: 'from-blue-400 to-blue-600',
      quote: 'The Self cannot be attained by study... It is attained by him alone whom It chooses. - Katha Upanishad'
    },
    {
      path: 'raja' as YogaPath,
      title: 'Raja Yoga',
      subtitle: 'Path of Meditation',
      description: 'Master the mind through meditation, breath control, and mental discipline.',
      icon: '🧘‍♂️',
      color: 'from-purple-400 to-purple-600',
      quote: 'Yoga is the cessation of fluctuations of the mind. - Patanjali Yoga Sutras'
    }
  ];

  const handleCreateAvatar = () => {
    if (name.trim() && selectedPath) {
      initializeAvatar(name.trim(), selectedPath);
      setCurrentView('dashboard');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        className="max-w-4xl w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <div className="text-8xl mb-4">🕉️</div>
          <h1 className="text-4xl font-spiritual font-bold text-saffron-700 mb-2">
            Begin Your Spiritual Journey
          </h1>
          <p className="text-gray-600 text-lg">
            Create your avatar and choose your path to moksha
          </p>
        </motion.div>

        {step === 1 && (
          <motion.div
            className="spiritual-card p-8 max-w-md mx-auto"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-semibold text-center mb-6 text-saffron-700">
              What is your name, seeker?
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Spiritual Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all"
                  maxLength={20}
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will be your identity throughout your spiritual journey
                </p>
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!name.trim()}
                className="w-full karma-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue Your Journey
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="text-center" variants={itemVariants}>
              <h2 className="text-3xl font-semibold text-saffron-700 mb-2">
                Choose Your Yoga Path
              </h2>
              <p className="text-gray-600">
                Each path leads to the same ultimate truth, but through different practices
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {yogaPaths.map((yoga) => (
                <motion.div
                  key={yoga.path}
                  className={`spiritual-card p-6 cursor-pointer transition-all duration-300 ${
                    selectedPath === yoga.path
                      ? 'ring-4 ring-saffron-300 shadow-xl scale-105'
                      : 'hover:shadow-lg hover:scale-102'
                  }`}
                  variants={itemVariants}
                  onClick={() => setSelectedPath(yoga.path)}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center mb-4">
                    <div className="text-6xl mb-3">{yoga.icon}</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {yoga.title}
                    </h3>
                    <p className="text-sm text-saffron-600 font-medium">
                      {yoga.subtitle}
                    </p>
                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    {yoga.description}
                  </p>

                  <div className="bg-saffron-50 p-3 rounded-lg">
                    <p className="text-xs text-saffron-700 italic">
                      "{yoga.quote}"
                    </p>
                  </div>

                  {selectedPath === yoga.path && (
                    <motion.div
                      className="mt-4 text-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <div className="inline-flex items-center px-3 py-1 bg-saffron-100 text-saffron-700 rounded-full text-sm font-medium">
                        ✓ Selected Path
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.div
              className="flex justify-center space-x-4"
              variants={itemVariants}
            >
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                Back
              </button>
              <button
                onClick={handleCreateAvatar}
                disabled={!selectedPath}
                className="karma-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Begin Spiritual Journey
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Progress Indicator */}
        <motion.div
          className="flex justify-center mt-8 space-x-2"
          variants={itemVariants}
        >
          {[1, 2].map((stepNum) => (
            <div
              key={stepNum}
              className={`w-3 h-3 rounded-full transition-all ${
                step >= stepNum ? 'bg-saffron-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </motion.div>

        {/* Inspirational Quote */}
        <motion.div
          className="text-center mt-12 max-w-2xl mx-auto"
          variants={itemVariants}
        >
          <div className="spiritual-card p-6 bg-gradient-to-r from-saffron-50 to-lotus-50">
            <p className="text-gray-700 italic mb-2">
              "As a person puts on new garments, giving up old ones, the soul similarly accepts new material bodies, giving up the old and useless ones."
            </p>
            <p className="text-sm text-saffron-600 font-medium">
              — Bhagavad Gita 2.22
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AvatarCreation;