import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { Yuga } from '../../types';

interface YugaDetailsProps {
  onClose: () => void;
  onTransition: (yuga: Yuga) => void;
}

const YugaDetails: React.FC<YugaDetailsProps> = ({ onClose, onTransition }) => {
  const { worldState } = useGameStore();
  
  const yugaInfo = {
    satya: {
      name: 'Satya Yuga',
      title: 'The Golden Age of Truth',
      description: 'The age of truth and perfection. Humans are honest, youthful, vigorous, and virtuous. There is no agriculture or mining as the earth yields those riches on its own. Weather is pleasant and everyone is happy. There is no disease or hatred.',
      characteristics: [
        'Perfect righteousness prevails',
        'Humans live up to 100,000 years',
        'No ignorance or fear exists',
        'Direct communion with the divine',
        'Meditation is the primary spiritual practice',
        'Complete harmony with nature'
      ],
      deities: 'Lord Vishnu in white form',
      scriptures: 'Vedas in their purest form',
      duration: '1,728,000 years',
      color: 'from-yellow-200 to-green-200',
      textColor: 'text-green-800',
      borderColor: 'border-green-300',
      icon: '🌅',
      pattern: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23228B22' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
    },
    treta: {
      name: 'Treta Yuga',
      title: 'The Silver Age of Sacrifice',
      description: 'Virtue diminishes slightly. Agriculture, labor and mining become necessary. People become slightly less honest and need sacred rituals. Emperors rise to defend dharma, and great sacrifices are performed.',
      characteristics: [
        'Three-quarters virtue remains',
        'Humans live up to 10,000 years',
        'Introduction of agriculture',
        'Sacred fire rituals emerge',
        'Kings and kingdoms established',
        'Heroic deeds and legends'
      ],
      deities: 'Lord Vishnu as Rama',
      scriptures: 'Treta-Samhita of the Vedas',
      duration: '1,296,000 years',
      color: 'from-yellow-100 to-orange-200',
      textColor: 'text-orange-800',
      borderColor: 'border-orange-300',
      icon: '🌞',
      pattern: "url(\"data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ed7611' fill-opacity='0.1'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
    },
    dvapara: {
      name: 'Dvapara Yuga',
      title: 'The Bronze Age of Duality',
      description: 'Virtue is reduced by half. People become tainted with qualities like greed and dishonesty. Diseases appear and weather begins to change according to the seasons. Knowledge becomes divided and conflicts arise.',
      characteristics: [
        'Half virtue remains',
        'Humans live up to 1,000 years',
        'Division of knowledge',
        'Rise of material desires',
        'Emergence of disease and conflict',
        'Balance of good and evil'
      ],
      deities: 'Lord Vishnu as Krishna',
      scriptures: 'Dvapara-Samhita of the Vedas',
      duration: '864,000 years',
      color: 'from-blue-100 to-purple-200',
      textColor: 'text-purple-800',
      borderColor: 'border-purple-300',
      icon: '🌆',
      pattern: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M0 0h20L0 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
    },
    kali: {
      name: 'Kali Yuga',
      title: 'The Iron Age of Darkness',
      description: 'The age of darkness and ignorance. People become sinful, lack virtue, and are driven by animalistic instincts. Lifespan decreases, and the environment deteriorates. Yet, spiritual liberation is most accessible in this age.',
      characteristics: [
        'Quarter virtue remains',
        'Humans live up to 100 years',
        'Widespread ignorance and conflict',
        'Material obsession dominates',
        'Spiritual knowledge is hidden',
        'Easy liberation through devotion'
      ],
      deities: 'Lord Vishnu as Kalki (future)',
      scriptures: 'Kali-Samhita of the Vedas',
      duration: '432,000 years',
      color: 'from-gray-200 to-gray-400',
      textColor: 'text-gray-800',
      borderColor: 'border-gray-300',
      icon: '🌃',
      pattern: "url(\"data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 5v1H5z'/%3E%3C/g%3E%3C/svg%3E\")"
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="max-w-4xl w-full bg-white rounded-xl overflow-hidden shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Sidebar with Yuga Selection */}
          <div className="bg-gray-50 p-6">
            <h3 className="text-lg font-semibold mb-4 text-saffron-700">
              Cosmic Cycles
            </h3>
            <div className="space-y-2">
              {Object.entries(yugaInfo).map(([yuga, info]) => (
                <button
                  key={yuga}
                  onClick={() => onTransition(yuga as Yuga)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    worldState.currentYuga === yuga
                      ? `${info.borderColor} bg-${info.color.split('-')[1]}-50`
                      : 'border-gray-200 hover:border-saffron-200'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{info.icon}</span>
                    <div>
                      <div className="font-medium text-gray-800">{info.name}</div>
                      <div className="text-xs text-gray-600">{info.title}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-2 p-6">
            {(() => {
              const info = yugaInfo[worldState.currentYuga];
              return (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                      <span className="text-4xl mr-3">{info.icon}</span>
                      <div>
                        <h2 className={`text-2xl font-bold ${info.textColor}`}>
                          {info.name}
                        </h2>
                        <p className={`text-sm ${info.textColor} opacity-80`}>
                          {info.title}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={onClose}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>

                  <div className={`p-4 rounded-lg bg-gradient-to-br ${info.color} mb-6`} style={{ backgroundImage: info.pattern }}>
                    <p className={`${info.textColor} leading-relaxed`}>
                      {info.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className={`text-lg font-semibold mb-3 ${info.textColor}`}>Characteristics</h3>
                      <ul className="space-y-2">
                        {info.characteristics.map((char, index) => (
                          <motion.li
                            key={index}
                            className="flex items-center space-x-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className={`w-2 h-2 rounded-full ${info.textColor} opacity-60`} />
                            <span className="text-sm text-gray-700">
                              {char}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className={`text-lg font-semibold mb-2 ${info.textColor}`}>Divine Presence</h3>
                        <p className="text-sm text-gray-700">{info.deities}</p>
                      </div>
                      
                      <div>
                        <h3 className={`text-lg font-semibold mb-2 ${info.textColor}`}>Sacred Texts</h3>
                        <p className="text-sm text-gray-700">{info.scriptures}</p>
                      </div>
                      
                      <div>
                        <h3 className={`text-lg font-semibold mb-2 ${info.textColor}`}>Duration</h3>
                        <p className="text-sm text-gray-700">{info.duration}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => onTransition(worldState.currentYuga)}
                      className="karma-button"
                    >
                      Experience This Yuga
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default YugaDetails;