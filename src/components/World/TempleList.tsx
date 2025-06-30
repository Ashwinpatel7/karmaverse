import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import EnchantingAnimation from './EnchantingAnimation';

interface Temple {
  id: string;
  name: string;
  image: string;
  description: string;
  location: string;
  benefits: {
    karma: number;
    sattva: number;
    devotion: number;
  };
  yugaOrigin: 'satya' | 'treta' | 'dvapara' | 'kali' | 'all';
}

const temples: Temple[] = [
  {
    id: 'kedarnath',
    name: 'Kedarnath Temple',
    image: '/images/temples/kedarnath.jpg',
    description: 'One of the twelve Jyotirlingas dedicated to Lord Shiva, located in the Himalayas.',
    location: 'Uttarakhand, India',
    benefits: {
      karma: 15,
      sattva: 12,
      devotion: 10
    },
    yugaOrigin: 'satya'
  },
  {
    id: 'badrinath',
    name: 'Badrinath Temple',
    image: '/images/temples/badrinath.jpg',
    description: 'Sacred to Lord Vishnu, one of the Char Dham pilgrimage sites.',
    location: 'Uttarakhand, India',
    benefits: {
      karma: 14,
      sattva: 10,
      devotion: 12
    },
    yugaOrigin: 'satya'
  },
  {
    id: 'rameshwaram',
    name: 'Rameshwaram Temple',
    image: '/images/temples/rameshwaram.jpg',
    description: 'Associated with Lord Rama and houses one of the twelve Jyotirlingas.',
    location: 'Tamil Nadu, India',
    benefits: {
      karma: 12,
      sattva: 8,
      devotion: 15
    },
    yugaOrigin: 'treta'
  },
  {
    id: 'dwarka',
    name: 'Dwarkadhish Temple',
    image: '/images/temples/dwarka.jpg',
    description: 'Built where Krishna established his kingdom of Dwarka.',
    location: 'Gujarat, India',
    benefits: {
      karma: 13,
      sattva: 9,
      devotion: 14
    },
    yugaOrigin: 'dvapara'
  },
  {
    id: 'kashi',
    name: 'Kashi Vishwanath',
    image: '/images/temples/kashi.jpg',
    description: 'One of the most famous Hindu temples dedicated to Lord Shiva.',
    location: 'Varanasi, India',
    benefits: {
      karma: 18,
      sattva: 15,
      devotion: 18
    },
    yugaOrigin: 'all'
  },
  {
    id: 'tirupati',
    name: 'Tirupati Balaji',
    image: '/images/temples/tirupati.jpg',
    description: 'One of the richest and most visited religious sites in the world.',
    location: 'Andhra Pradesh, India',
    benefits: {
      karma: 16,
      sattva: 14,
      devotion: 20
    },
    yugaOrigin: 'kali'
  }
];

const TempleList: React.FC<{ onClose: () => void, onVisit: (temple: Temple) => void }> = ({ onClose, onVisit }) => {
  const { worldState } = useGameStore();
  const currentYuga = worldState.currentYuga;
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  
  // Filter temples based on yuga
  const availableTemples = temples.filter(temple => 
    temple.yugaOrigin === 'all' || temple.yugaOrigin === currentYuga
  );

  // Yuga-specific styles
  const yugaStyles = {
    satya: {
      bgGradient: 'from-yellow-100 to-green-100',
      borderColor: 'border-green-300',
      textColor: 'text-green-800',
      pattern: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23228B22' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
    },
    treta: {
      bgGradient: 'from-yellow-100 to-orange-100',
      borderColor: 'border-orange-300',
      textColor: 'text-orange-800',
      pattern: "url(\"data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ed7611' fill-opacity='0.1'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
    },
    dvapara: {
      bgGradient: 'from-blue-100 to-purple-100',
      borderColor: 'border-purple-300',
      textColor: 'text-purple-800',
      pattern: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M0 0h20L0 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
    },
    kali: {
      bgGradient: 'from-gray-100 to-gray-200',
      borderColor: 'border-gray-300',
      textColor: 'text-gray-800',
      pattern: "url(\"data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 5v1H5z'/%3E%3C/g%3E%3C/svg%3E\")"
    }
  };

  const currentStyle = yugaStyles[currentYuga];

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={`spiritual-card p-6 max-w-4xl w-full bg-gradient-to-br ${currentStyle.bgGradient} border-2 ${currentStyle.borderColor}`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: currentStyle.pattern }} />
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-bold ${currentStyle.textColor}`}>Sacred Temples</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableTemples.map((temple, index) => (
              <motion.div
                key={temple.id}
                className="bg-white/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="h-40 bg-gray-200 relative overflow-hidden">
                  <img 
                    src={temple.image} 
                    alt={temple.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-4xl fallback-icon hidden">
                    🏛️
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white font-bold text-lg">{temple.name}</h3>
                    <p className="text-white/80 text-xs">{temple.location}</p>
                  </div>
                </div>
                
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-4">{temple.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2 text-xs">
                      <span className="text-green-600">+{temple.benefits.karma} Karma</span>
                      <span className="text-yellow-600">+{temple.benefits.sattva} Sattva</span>
                      <span className="text-purple-600">+{temple.benefits.devotion} Devotion</span>
                    </div>
                    
                    <button
                      onClick={() => {
                        setSelectedTemple(temple);
                        setShowAnimation(true);
                      }}
                      className="karma-button text-sm py-1 px-3"
                    >
                      Visit
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {availableTemples.length === 0 && (
            <div className="text-center py-10">
              <p className={`${currentStyle.textColor} text-lg`}>
                No temples are accessible in this yuga. Try transitioning to a different yuga.
              </p>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Enchanting Animation */}
      <AnimatePresence>
        {showAnimation && selectedTemple && (
          <EnchantingAnimation 
            onComplete={() => {
              setShowAnimation(false);
              onVisit(selectedTemple);
            }} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TempleList;