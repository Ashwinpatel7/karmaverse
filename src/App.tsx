import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import Dashboard from './components/Dashboard/Dashboard';
import AvatarCreation from './components/Avatar/AvatarCreation';
import MeditationCenter from './components/Meditation/MeditationCenter';
import SpiritualJournal from './components/Journal/SpiritualJournal';
import WorldExplorer from './components/World/WorldExplorer';
import QuestSystem from './components/Quests/QuestSystem';
import Navigation from './components/UI/Navigation';
import './App.css';

function App() {
  const { currentView, avatar, notifications, clearNotifications } = useGameStore();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'avatar':
        return <AvatarCreation />;
      case 'meditation':
        return <MeditationCenter />;
      case 'journal':
        return <SpiritualJournal />;
      case 'quests':
        return <QuestSystem />;
      case 'world':
        return <WorldExplorer />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="App min-h-screen bg-gradient-to-br from-sacred-50 via-lotus-50 to-saffron-50">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ed7611' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Navigation */}
      {avatar && <Navigation />}

      {/* Notifications */}
      <AnimatePresence>
        {notifications.length > 0 && (
          <motion.div
            className="fixed top-4 right-4 z-50 space-y-2"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            {notifications.map((notification, index) => (
              <motion.div
                key={index}
                className="bg-white/90 backdrop-blur-sm border border-saffron-200 rounded-lg p-4 shadow-lg max-w-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{notification}</span>
                  <button
                    onClick={clearNotifications}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Om Symbol Floating Animation */}
      <motion.div
        className="fixed bottom-8 left-8 text-6xl opacity-10 pointer-events-none"
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        🕉️
      </motion.div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-saffron-300 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100],
              opacity: [0.2, 0, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default App;