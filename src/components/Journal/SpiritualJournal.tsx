import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { JournalEntry } from '../../types';
import { getRandomQuote } from '../../data/scriptures';
import { Calendar, Star, BookOpen, Plus } from 'lucide-react';

const SpiritualJournal: React.FC = () => {
  const { journalEntries, addJournalEntry, avatar } = useGameStore();
  const [isWriting, setIsWriting] = useState(false);
  const [currentEntry, setCurrentEntry] = useState({
    prompt: '',
    reflection: '',
    mood: 'peaceful' as JournalEntry['mood'],
    insights: ['']
  });
  const [selectedDate, setSelectedDate] = useState<string>('');

  const moodOptions = [
    { mood: 'peaceful' as const, icon: '😌', label: 'Peaceful', color: 'text-green-600' },
    { mood: 'joyful' as const, icon: '😊', label: 'Joyful', color: 'text-yellow-600' },
    { mood: 'inspired' as const, icon: '✨', label: 'Inspired', color: 'text-purple-600' },
    { mood: 'conflicted' as const, icon: '😕', label: 'Conflicted', color: 'text-orange-600' },
    { mood: 'troubled' as const, icon: '😔', label: 'Troubled', color: 'text-red-600' }
  ];

  const journalPrompts = [
    "What spiritual lesson did I learn today?",
    "How did I practice dharma in my actions?",
    "What attachments am I ready to release?",
    "How did I show compassion to others today?",
    "What am I most grateful for in this moment?",
    "How did I handle challenges with equanimity?",
    "What divine qualities did I express today?",
    "How can I better align with my dharmic path?",
    "What fears or desires are holding me back?",
    "How did I serve others selflessly today?"
  ];

  const startNewEntry = () => {
    const randomPrompt = journalPrompts[Math.floor(Math.random() * journalPrompts.length)];
    setCurrentEntry({
      prompt: randomPrompt,
      reflection: '',
      mood: 'peaceful',
      insights: ['']
    });
    setIsWriting(true);
  };

  const saveEntry = () => {
    if (!currentEntry.reflection.trim()) return;

    addJournalEntry({
      date: new Date(),
      prompt: currentEntry.prompt,
      reflection: currentEntry.reflection,
      mood: currentEntry.mood,
      karmaContext: avatar?.stats.karma.recent.slice(0, 3) || [],
      insights: currentEntry.insights.filter(insight => insight.trim())
    });

    setCurrentEntry({
      prompt: '',
      reflection: '',
      mood: 'peaceful',
      insights: ['']
    });
    setIsWriting(false);
  };

  const cancelEntry = () => {
    setIsWriting(false);
    setCurrentEntry({
      prompt: '',
      reflection: '',
      mood: 'peaceful',
      insights: ['']
    });
  };

  const addInsight = () => {
    setCurrentEntry(prev => ({
      ...prev,
      insights: [...prev.insights, '']
    }));
  };

  const updateInsight = (index: number, value: string) => {
    setCurrentEntry(prev => ({
      ...prev,
      insights: prev.insights.map((insight, i) => i === index ? value : insight)
    }));
  };

  const removeInsight = (index: number) => {
    setCurrentEntry(prev => ({
      ...prev,
      insights: prev.insights.filter((_, i) => i !== index)
    }));
  };

  const filteredEntries = selectedDate 
    ? journalEntries.filter(entry => 
        new Date(entry.date).toDateString() === new Date(selectedDate).toDateString()
      )
    : journalEntries;

  const getMoodIcon = (mood: JournalEntry['mood']) => {
    return moodOptions.find(option => option.mood === mood)?.icon || '😌';
  };

  const getMoodColor = (mood: JournalEntry['mood']) => {
    return moodOptions.find(option => option.mood === mood)?.color || 'text-green-600';
  };

  return (
    <div className="min-h-screen pt-20 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-spiritual font-bold text-saffron-700 mb-2">
            Spiritual Journal
          </h1>
          <p className="text-gray-600">
            Reflect on your journey and capture divine insights
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Writing Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* New Entry Button */}
            {!isWriting && (
              <motion.button
                onClick={startNewEntry}
                className="w-full spiritual-card p-6 hover:shadow-lg transition-all border-2 border-dashed border-saffron-300 hover:border-saffron-400"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center space-x-3 text-saffron-600">
                  <Plus className="w-6 h-6" />
                  <span className="text-lg font-medium">Begin New Reflection</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Capture today's spiritual insights and experiences
                </p>
              </motion.button>
            )}

            {/* Writing Interface */}
            <AnimatePresence>
              {isWriting && (
                <motion.div
                  className="spiritual-card p-6"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <div className="space-y-6">
                    {/* Prompt */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reflection Prompt
                      </label>
                      <div className="bg-saffron-50 p-4 rounded-lg border border-saffron-200">
                        <p className="text-saffron-800 font-medium">{currentEntry.prompt}</p>
                      </div>
                    </div>

                    {/* Mood Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Current Mood
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {moodOptions.map((option) => (
                          <button
                            key={option.mood}
                            onClick={() => setCurrentEntry(prev => ({ ...prev, mood: option.mood }))}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                              currentEntry.mood === option.mood
                                ? 'border-saffron-300 bg-saffron-50'
                                : 'border-gray-200 hover:border-saffron-200'
                            }`}
                          >
                            <span className="text-xl">{option.icon}</span>
                            <span className="text-sm">{option.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Reflection Text */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Reflection
                      </label>
                      <textarea
                        value={currentEntry.reflection}
                        onChange={(e) => setCurrentEntry(prev => ({ ...prev, reflection: e.target.value }))}
                        placeholder="Share your thoughts, experiences, and spiritual insights..."
                        className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent resize-none"
                      />
                    </div>

                    {/* Insights */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Key Insights
                        </label>
                        <button
                          onClick={addInsight}
                          className="text-sm text-saffron-600 hover:text-saffron-700 flex items-center space-x-1"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Insight</span>
                        </button>
                      </div>
                      <div className="space-y-2">
                        {currentEntry.insights.map((insight, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={insight}
                              onChange={(e) => updateInsight(index, e.target.value)}
                              placeholder="What did you learn or realize?"
                              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                            />
                            {currentEntry.insights.length > 1 && (
                              <button
                                onClick={() => removeInsight(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={cancelEntry}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveEntry}
                        disabled={!currentEntry.reflection.trim()}
                        className="karma-button disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Save Reflection
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Journal Entries */}
            <div className="space-y-4">
              <AnimatePresence>
                {filteredEntries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    className="spiritual-card p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Entry Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className={`text-2xl ${getMoodColor(entry.mood)}`}>
                          {getMoodIcon(entry.mood)}
                        </span>
                        <div>
                          <div className="font-medium text-gray-800">
                            {new Date(entry.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(entry.date).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        entry.mood === 'peaceful' ? 'bg-green-100 text-green-700' :
                        entry.mood === 'joyful' ? 'bg-yellow-100 text-yellow-700' :
                        entry.mood === 'inspired' ? 'bg-purple-100 text-purple-700' :
                        entry.mood === 'conflicted' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {entry.mood}
                      </div>
                    </div>

                    {/* Prompt */}
                    <div className="mb-4 p-3 bg-saffron-50 rounded-lg border-l-4 border-saffron-400">
                      <p className="text-sm font-medium text-saffron-800">{entry.prompt}</p>
                    </div>

                    {/* Reflection */}
                    <div className="mb-4">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {entry.reflection}
                      </p>
                    </div>

                    {/* Insights */}
                    {entry.insights.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <Star className="w-4 h-4 mr-1" />
                          Key Insights
                        </h4>
                        <ul className="space-y-1">
                          {entry.insights.map((insight, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start">
                              <span className="text-saffron-500 mr-2">•</span>
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Karma Context */}
                    {entry.karmaContext.length > 0 && (
                      <div className="border-t pt-3">
                        <h4 className="text-xs font-medium text-gray-500 mb-2">
                          Recent Actions Context
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {entry.karmaContext.map((action) => (
                            <span
                              key={action.id}
                              className={`px-2 py-1 rounded-full text-xs ${
                                action.karmaChange > 0
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {action.action} ({action.karmaChange > 0 ? '+' : ''}{action.karmaChange})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredEntries.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">
                    No journal entries yet
                  </h3>
                  <p className="text-gray-400">
                    Begin your spiritual journaling journey by writing your first reflection
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Calendar Filter */}
            <div className="spiritual-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-saffron-700 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Filter by Date
              </h3>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron-500"
              />
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate('')}
                  className="w-full mt-2 text-sm text-saffron-600 hover:text-saffron-700"
                >
                  Clear Filter
                </button>
              )}
            </div>

            {/* Journal Stats */}
            <div className="spiritual-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-saffron-700">
                Journal Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Entries</span>
                  <span className="font-medium">{journalEntries.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">This Month</span>
                  <span className="font-medium">
                    {journalEntries.filter(entry => 
                      new Date(entry.date).getMonth() === new Date().getMonth()
                    ).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Streak</span>
                  <span className="font-medium">
                    {/* Calculate streak logic here */}
                    {Math.min(7, journalEntries.length)} days
                  </span>
                </div>
              </div>
            </div>

            {/* Daily Wisdom */}
            <div className="spiritual-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-saffron-700">
                Daily Wisdom
              </h3>
              {(() => {
                const quote = getRandomQuote();
                return (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-700 italic">
                      "{quote.translation}"
                    </p>
                    <p className="text-xs text-saffron-600 font-medium">
                      — {quote.source}
                    </p>
                  </div>
                );
              })()}
            </div>

            {/* Mood Trends */}
            <div className="spiritual-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-saffron-700">
                Recent Moods
              </h3>
              <div className="space-y-2">
                {journalEntries.slice(0, 5).map((entry, index) => (
                  <div key={entry.id} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className={getMoodColor(entry.mood)}>
                        {getMoodIcon(entry.mood)}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">
                        {entry.mood}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpiritualJournal;