import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import AvatarDisplay from '../Avatar/AvatarDisplay';
import { getRandomQuote } from '../../data/scriptures';
import { getRandomDilemma } from '../../data/dilemmas';
import { ScriptureQuote, DharmaDilemma } from '../../types';
import { Sun, Moon, Star, Heart, Brain, Zap } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { 
    avatar, 
    worldState, 
    addJournalEntry, 
    updateKarma, 
    updateGunas,
    addNotification,
    currentDilemma,
    setCurrentView
  } = useGameStore();

  const [dailyQuote, setDailyQuote] = useState<ScriptureQuote | null>(null);
  const [currentDilemmaState, setCurrentDilemmaState] = useState<DharmaDilemma | null>(null);
  const [showDilemma, setShowDilemma] = useState(false);

  useEffect(() => {
    // Set daily quote
    setDailyQuote(getRandomQuote());
    
    // Check if we should show a new dilemma
    const lastDilemmaDate = localStorage.getItem('lastDilemmaDate');
    const today = new Date().toDateString();
    
    if (lastDilemmaDate !== today) {
      setCurrentDilemmaState(getRandomDilemma());
      setShowDilemma(true);
      localStorage.setItem('lastDilemmaDate', today);
    }
  }, []);

  const handleDilemmaChoice = (optionId: string) => {
    if (!currentDilemmaState || !avatar) return;

    const selectedOption = currentDilemmaState.options.find(opt => opt.id === optionId);
    if (!selectedOption) return;

    // Apply consequences
    updateKarma({
      id: `dilemma_${Date.now()}`,
      action: `${currentDilemmaState.title}: ${selectedOption.text}`,
      karmaChange: selectedOption.consequences.karma,
      gunaEffect: selectedOption.consequences.gunaChanges,
      timestamp: new Date(),
      context: 'Daily Dharma Dilemma'
    });

    updateGunas(selectedOption.consequences.gunaChanges);

    // Add journal entry
    addJournalEntry({
      date: new Date(),
      prompt: currentDilemmaState.scenario,
      reflection: `I chose: ${selectedOption.text}. ${selectedOption.consequences.description}`,
      mood: selectedOption.consequences.karma > 0 ? 'peaceful' : 'conflicted',
      karmaContext: [],
      insights: [selectedOption.consequences.scriptureReference || '']
    });

    addNotification(`Dharma choice made: ${selectedOption.consequences.karma > 0 ? 'Positive' : 'Negative'} karma gained`);
    setShowDilemma(false);
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 6) return { greeting: 'Good Dawn', icon: Star, color: 'text-purple-600' };
    if (hour < 12) return { greeting: 'Good Morning', icon: Sun, color: 'text-yellow-600' };
    if (hour < 18) return { greeting: 'Good Afternoon', icon: Sun, color: 'text-orange-600' };
    return { greeting: 'Good Evening', icon: Moon, color: 'text-blue-600' };
  };

  const getYugaDescription = () => {
    switch (worldState.currentYuga) {
      case 'satya':
        return 'The Golden Age of Truth and Righteousness';
      case 'treta':
        return 'The Silver Age of Virtue and Sacrifice';
      case 'dvapara':
        return 'The Bronze Age of Duality and Conflict';
      case 'kali':
        return 'The Iron Age of Darkness and Materialism';
      default:
        return 'The Current Age';
    }
  };

  if (!avatar) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🕉️</div>
          <h2 className="text-2xl font-spiritual text-saffron-700 mb-4">
            Welcome to KarmaVerse
          </h2>
          <p className="text-gray-600 mb-6">
            Begin your spiritual journey through the cosmic cycles
          </p>
          <button 
            className="karma-button"
            onClick={() => setCurrentView('avatar')}
          >
            Create Your Avatar
          </button>
        </div>
      </div>
    );
  }

  const timeInfo = getTimeOfDay();
  const TimeIcon = timeInfo.icon;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <TimeIcon className={`w-8 h-8 ${timeInfo.color}`} />
              <div>
                <h1 className="text-3xl font-spiritual font-bold text-saffron-700">
                  {timeInfo.greeting}, {avatar.name}
                </h1>
                <p className="text-gray-600">
                  {getYugaDescription()} • Day {avatar.currentLife.duration + 1}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Current Yuga</div>
              <div className="text-2xl font-bold capitalize text-saffron-600">
                {worldState.currentYuga}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Avatar & Quick Stats */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="spiritual-card p-6">
              <AvatarDisplay avatar={avatar} size="large" showStats={true} />
            </div>

            {/* Quick Actions */}
            <div className="spiritual-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-saffron-700">
                Spiritual Practices
              </h3>
              <div className="space-y-3">
                <button
                  className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-sacred-100 to-sacred-200 hover:from-sacred-200 hover:to-sacred-300 transition-all"
                  onClick={() => setCurrentView('meditation')}
                >
                  <Brain className="w-5 h-5 text-sacred-600" />
                  <span>Meditation</span>
                </button>
                <button
                  className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-lotus-100 to-lotus-200 hover:from-lotus-200 hover:to-lotus-300 transition-all"
                  onClick={() => setCurrentView('journal')}
                >
                  <Heart className="w-5 h-5 text-lotus-600" />
                  <span>Journal</span>
                </button>
                <button
                  className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-saffron-100 to-saffron-200 hover:from-saffron-200 hover:to-saffron-300 transition-all"
                  onClick={() => setCurrentView('world')}
                >
                  <Zap className="w-5 h-5 text-saffron-600" />
                  <span>Explore World</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Center Column - Daily Content */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Daily Scripture */}
            {dailyQuote && (
              <div className="spiritual-card p-6">
                <h3 className="text-lg font-semibold mb-4 text-saffron-700 flex items-center">
                  <span className="text-2xl mr-2">📜</span>
                  Daily Wisdom
                </h3>
                <div className="space-y-4">
                  <div className="sanskrit-text text-lg leading-relaxed">
                    {dailyQuote.text}
                  </div>
                  <div className="text-gray-700 italic">
                    "{dailyQuote.translation}"
                  </div>
                  <div className="text-sm text-saffron-600 font-medium">
                    — {dailyQuote.source}
                  </div>
                  <div className="text-sm text-gray-600 bg-saffron-50 p-3 rounded-lg">
                    <strong>Context:</strong> {dailyQuote.context}
                  </div>
                </div>
              </div>
            )}

            {/* Daily Dharma Dilemma */}
            {showDilemma && currentDilemmaState && (
              <motion.div
                className="spiritual-card p-6 border-2 border-saffron-300"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-lg font-semibold mb-4 text-saffron-700 flex items-center">
                  <span className="text-2xl mr-2">⚖️</span>
                  Daily Dharma Dilemma
                </h3>
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">
                    {currentDilemmaState.title}
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {currentDilemmaState.scenario}
                  </p>
                  <div className="space-y-2">
                    {currentDilemmaState.options.map((option) => (
                      <button
                        key={option.id}
                        className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-saffron-300 hover:bg-saffron-50 transition-all"
                        onClick={() => handleDilemmaChoice(option.id)}
                      >
                        <div className="font-medium text-gray-800">
                          {option.text}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Karma: {option.consequences.karma > 0 ? '+' : ''}{option.consequences.karma}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Right Column - Progress & World State */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            {/* Spiritual Progress */}
            <div className="spiritual-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-saffron-700">
                Spiritual Progress
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Spiritual Level</span>
                    <span className="text-sm font-bold">{avatar.stats.spiritualLevel}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-saffron-400 to-saffron-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, avatar.stats.spiritualLevel * 10)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {avatar.stats.karma.positive}
                    </div>
                    <div className="text-xs text-green-700">Positive Karma</div>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {avatar.stats.karma.negative}
                    </div>
                    <div className="text-xs text-red-700">Negative Karma</div>
                  </div>
                </div>
              </div>
            </div>

            {/* World State */}
            <div className="spiritual-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-saffron-700">
                World Harmony
              </h3>
              <div className="space-y-3">
                {Object.entries(worldState.environment).slice(0, 4).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm capitalize">{key}</span>
                      <span className="text-sm">{value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          key === 'conflict' ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Actions */}
            <div className="spiritual-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-saffron-700">
                Recent Actions
              </h3>
              <div className="space-y-2">
                {avatar.stats.karma.recent.slice(0, 5).map((action) => (
                  <div
                    key={action.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm text-gray-700 truncate">
                      {action.action}
                    </span>
                    <span className={`text-sm font-bold ${
                      action.karmaChange > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {action.karmaChange > 0 ? '+' : ''}{action.karmaChange}
                    </span>
                  </div>
                ))}
                {avatar.stats.karma.recent.length === 0 && (
                  <p className="text-sm text-gray-500 italic">
                    No recent actions. Begin your spiritual journey!
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;