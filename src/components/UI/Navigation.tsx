import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { 
  Home, 
  User, 
  Brain, 
  BookOpen, 
  Map, 
  Target,
  Settings,
  Bell
} from 'lucide-react';

const Navigation: React.FC = () => {
  const { currentView, setCurrentView, avatar, notifications } = useGameStore();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'avatar', label: 'Avatar', icon: User },
    { id: 'meditation', label: 'Meditation', icon: Brain },
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'world', label: 'World', icon: Map },
    { id: 'quests', label: 'Quests', icon: Target },
  ];

  if (!avatar) return null;

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-saffron-200/50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-2xl">🕉️</div>
            <div>
              <h1 className="font-spiritual font-bold text-saffron-700">
                KarmaVerse
              </h1>
              <p className="text-xs text-gray-500">
                Spiritual Journey Simulator
              </p>
            </div>
          </motion.div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as any)}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-saffron-100 text-saffron-700'
                      : 'text-gray-600 hover:text-saffron-600 hover:bg-saffron-50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium hidden md:block">
                    {item.label}
                  </span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-1/2 w-1 h-1 bg-saffron-500 rounded-full"
                      layoutId="activeIndicator"
                      style={{ x: '-50%' }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Right Side - Avatar Info & Notifications */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <motion.button
              className="relative p-2 text-gray-600 hover:text-saffron-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                />
              )}
            </motion.button>

            {/* Avatar Quick Info */}
            <motion.div
              className="flex items-center space-x-3 bg-saffron-50 rounded-lg px-3 py-2"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-saffron-400 to-saffron-600 flex items-center justify-center text-white text-sm">
                {avatar.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium text-gray-800">
                  {avatar.name}
                </div>
                <div className="text-xs text-gray-500">
                  Level {avatar.level} • {avatar.stats.karma.total} Karma
                </div>
              </div>
            </motion.div>

            {/* Settings */}
            <motion.button
              className="p-2 text-gray-600 hover:text-saffron-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Karma Bar */}
      <div className="h-1 bg-gray-200">
        <motion.div
          className={`h-full transition-all duration-500 ${
            avatar.stats.karma.total >= 0 ? 'bg-green-500' : 'bg-red-500'
          }`}
          style={{
            width: `${Math.min(100, Math.max(0, (avatar.stats.karma.total + 1000) / 20))}%`
          }}
          initial={{ width: 0 }}
          animate={{
            width: `${Math.min(100, Math.max(0, (avatar.stats.karma.total + 1000) / 20))}%`
          }}
        />
      </div>
    </motion.nav>
  );
};

export default Navigation;