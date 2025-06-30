import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { Quest, QuestReward } from '../../types';
import { Target, Star, Clock, Gift, CheckCircle, Lock, Zap } from 'lucide-react';

const QuestSystem: React.FC = () => {
  const { avatar, updateKarma, updateGunas, updateVirtues, addNotification } = useGameStore();
  const [activeQuests, setActiveQuests] = useState<Quest[]>([]);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  const allQuests: Quest[] = [
    {
      id: 'daily_meditation',
      title: 'Daily Meditation Practice',
      description: 'Complete 7 days of consecutive meditation to develop inner peace and spiritual discipline.',
      type: 'meditation',
      difficulty: 'easy',
      rewards: {
        karma: 50,
        gunaChanges: { sattva: 20, tamas: -10 },
        virtuePoints: { wisdom: 15, temperance: 10 }
      },
      requirements: [
        { type: 'level', value: 1, comparison: 'min' }
      ]
    },
    {
      id: 'compassion_challenge',
      title: 'Acts of Compassion',
      description: 'Perform 10 acts of kindness and compassion to strengthen your heart chakra and develop loving-kindness.',
      type: 'karma',
      difficulty: 'medium',
      rewards: {
        karma: 100,
        gunaChanges: { sattva: 25, rajas: -5 },
        virtuePoints: { compassion: 25, justice: 10 }
      },
      requirements: [
        { type: 'virtue', value: 20, comparison: 'min' },
        { type: 'karma', value: 50, comparison: 'min' }
      ],
      yogaPathBonus: 'karma'
    },
    {
      id: 'scripture_study',
      title: 'Sacred Text Mastery',
      description: 'Study and reflect on 21 verses from the Bhagavad Gita to deepen your spiritual understanding.',
      type: 'knowledge',
      difficulty: 'medium',
      rewards: {
        karma: 75,
        gunaChanges: { sattva: 30, tamas: -15 },
        virtuePoints: { wisdom: 30, truthfulness: 15 }
      },
      requirements: [
        { type: 'virtue', value: 25, comparison: 'min' }
      ],
      yogaPathBonus: 'jnana'
    },
    {
      id: 'devotional_practice',
      title: 'Path of Pure Devotion',
      description: 'Engage in 30 days of devotional practices including prayer, chanting, and surrender to develop bhakti.',
      type: 'service',
      difficulty: 'hard',
      rewards: {
        karma: 150,
        gunaChanges: { sattva: 40, rajas: -10, tamas: -10 },
        virtuePoints: { devotion: 40, compassion: 20 }
      },
      requirements: [
        { type: 'virtue', value: 40, comparison: 'min' },
        { type: 'guna', value: 60, comparison: 'min' }
      ],
      yogaPathBonus: 'bhakti'
    },
    {
      id: 'mental_mastery',
      title: 'Master of the Mind',
      description: 'Achieve perfect concentration through advanced meditation techniques and mental discipline.',
      type: 'meditation',
      difficulty: 'legendary',
      rewards: {
        karma: 200,
        gunaChanges: { sattva: 50, rajas: -20, tamas: -20 },
        virtuePoints: { wisdom: 35, temperance: 30, detachment: 25 }
      },
      requirements: [
        { type: 'level', value: 10, comparison: 'min' },
        { type: 'virtue', value: 60, comparison: 'min' },
        { type: 'guna', value: 80, comparison: 'min' }
      ],
      yogaPathBonus: 'raja'
    }
  ];

  useEffect(() => {
    if (!avatar) return;

    const available = allQuests.filter(quest => {
      if (completedQuests.includes(quest.id)) return false;
      
      return quest.requirements.every(req => {
        switch (req.type) {
          case 'level':
            return avatar.level >= req.value;
          case 'karma':
            return avatar.stats.karma.total >= req.value;
          case 'virtue':
            const avgVirtue = Object.values(avatar.stats.virtues).reduce((sum, val) => sum + val, 0) / 8;
            return avgVirtue >= req.value;
          case 'guna':
            return avatar.stats.gunas.sattva >= req.value;
          default:
            return true;
        }
      });
    });

    setActiveQuests(available);
  }, [avatar, completedQuests]);

  const handleQuestComplete = (quest: Quest) => {
    if (!avatar) return;

    updateKarma({
      id: `quest_${Date.now()}`,
      action: `Completed quest: ${quest.title}`,
      karmaChange: quest.rewards.karma,
      gunaEffect: quest.rewards.gunaChanges,
      timestamp: new Date(),
      context: 'Quest completion'
    });

    updateGunas(quest.rewards.gunaChanges);
    updateVirtues(quest.rewards.virtuePoints);

    if (quest.yogaPathBonus === avatar.stats.yogaPath) {
      const bonus = Math.floor(quest.rewards.karma * 0.5);
      updateKarma({
        id: `quest_bonus_${Date.now()}`,
        action: `Yoga path bonus for ${quest.title}`,
        karmaChange: bonus,
        gunaEffect: { sattva: 10 },
        timestamp: new Date(),
        context: 'Yoga path alignment bonus'
      });
      addNotification(`Quest completed with yoga path bonus! +${quest.rewards.karma + bonus} total karma`);
    } else {
      addNotification(`Quest completed! +${quest.rewards.karma} karma gained`);
    }

    setCompletedQuests(prev => [...prev, quest.id]);
    setSelectedQuest(null);
  };

  const getDifficultyColor = (difficulty: Quest['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      case 'legendary': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: Quest['type']) => {
    switch (type) {
      case 'dharma': return '⚖️';
      case 'karma': return '🤝';
      case 'meditation': return '🧘‍♂️';
      case 'service': return '🙏';
      case 'knowledge': return '📚';
      default: return '✨';
    }
  };

  const canCompleteQuest = (quest: Quest) => {
    return Math.random() > 0.7;
  };

  const getQuestProgress = (quest: Quest) => {
    return Math.floor(Math.random() * 100);
  };

  return (
    <div className="min-h-screen pt-20 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-spiritual font-bold text-saffron-700 mb-2">
            Spiritual Quests
          </h1>
          <p className="text-gray-600">
            Embark on sacred journeys to deepen your spiritual practice
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-saffron-700 mb-4 flex items-center">
                <Target className="w-6 h-6 mr-2" />
                Available Quests
              </h2>
              <div className="space-y-4">
                {activeQuests.map((quest, index) => (
                  <motion.div
                    key={quest.id}
                    className="spiritual-card p-6 cursor-pointer hover:shadow-lg transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedQuest(quest)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{getTypeIcon(quest.type)}</div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {quest.title}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quest.difficulty)}`}>
                              {quest.difficulty}
                            </span>
                            {quest.yogaPathBonus === avatar?.stats.yogaPath && (
                              <span className="px-2 py-1 bg-saffron-100 text-saffron-700 rounded-full text-xs font-medium">
                                Path Bonus
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          +{quest.rewards.karma}
                        </div>
                        <div className="text-xs text-gray-500">Karma</div>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {quest.description}
                    </p>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-gray-800">{getQuestProgress(quest)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-saffron-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${getQuestProgress(quest)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-4 text-sm">
                        {Object.entries(quest.rewards.gunaChanges).map(([guna, change]) => (
                          <span key={guna} className="text-blue-600">
                            {guna}: {change > 0 ? '+' : ''}{change}
                          </span>
                        ))}
                      </div>
                      {canCompleteQuest(quest) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuestComplete(quest);
                          }}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {completedQuests.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-saffron-700 mb-4 flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  Completed Quests
                </h2>
                <div className="space-y-3">
                  {completedQuests.map((questId) => {
                    const quest = allQuests.find(q => q.id === questId)!;
                    return (
                      <div key={questId} className="spiritual-card p-4 opacity-75">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <div>
                              <h4 className="font-medium text-gray-800">{quest.title}</h4>
                              <div className="text-sm text-gray-600">
                                Completed • +{quest.rewards.karma} karma earned
                              </div>
                            </div>
                          </div>
                          <div className="text-2xl opacity-50">{getTypeIcon(quest.type)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="spiritual-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-saffron-700">
                Quest Progress
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Available</span>
                  <span className="font-medium">{activeQuests.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-medium text-green-600">{completedQuests.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Karma Earned</span>
                  <span className="font-medium text-saffron-600">
                    {completedQuests.reduce((total, questId) => {
                      const quest = allQuests.find(q => q.id === questId);
                      return total + (quest?.rewards.karma || 0);
                    }, 0)}
                  </span>
                </div>
              </div>
            </div>

            {avatar && (
              <div className="spiritual-card p-6">
                <h3 className="text-lg font-semibold mb-4 text-saffron-700">
                  Your Path Bonus
                </h3>
                <div className="text-center">
                  <div className="text-3xl mb-2">
                    {avatar.stats.yogaPath === 'karma' ? '🤝' :
                     avatar.stats.yogaPath === 'bhakti' ? '❤️' :
                     avatar.stats.yogaPath === 'jnana' ? '🧠' : '🧘‍♂️'}
                  </div>
                  <div className="font-medium text-gray-800 capitalize mb-2">
                    {avatar.stats.yogaPath} Yoga
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    Complete quests aligned with your path for bonus rewards
                  </div>
                  <div className="text-xs text-saffron-600">
                    +50% karma bonus for matching quests
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {selectedQuest && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedQuest(null)}
            >
              <motion.div
                className="spiritual-card p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-5xl">{getTypeIcon(selectedQuest.type)}</div>
                    <div>
                      <h2 className="text-2xl font-bold text-saffron-700 mb-2">
                        {selectedQuest.title}
                      </h2>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedQuest.difficulty)}`}>
                          {selectedQuest.difficulty}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {selectedQuest.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedQuest(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <p className="text-gray-700 leading-relaxed mb-6">
                  {selectedQuest.description}
                </p>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Requirements</h3>
                  <div className="space-y-2">
                    {selectedQuest.requirements.map((req, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Lock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {req.type === 'level' ? `Level ${req.value}+` :
                           req.type === 'karma' ? `${req.value}+ Karma` :
                           req.type === 'virtue' ? `${req.value}+ Average Virtue` :
                           req.type === 'guna' ? `${req.value}+ Sattva` : 'Unknown requirement'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Rewards</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        +{selectedQuest.rewards.karma}
                      </div>
                      <div className="text-sm text-green-700">Karma Points</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-sm text-blue-700 mb-2">Guna Changes</div>
                      {Object.entries(selectedQuest.rewards.gunaChanges).map(([guna, change]) => (
                        <div key={guna} className="text-xs text-blue-600">
                          {guna}: {change > 0 ? '+' : ''}{change}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedQuest(null)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                  {canCompleteQuest(selectedQuest) && (
                    <button
                      onClick={() => handleQuestComplete(selectedQuest)}
                      className="karma-button"
                    >
                      Complete Quest
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuestSystem;