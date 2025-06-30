import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { MeditationSession } from '../../types';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

const MeditationCenter: React.FC = () => {
  const { avatar, completeMeditation, updateGunas, addNotification } = useGameStore();
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes default
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [meditationType, setMeditationType] = useState<'breathing' | 'mantra' | 'visualization' | 'mindfulness'>('breathing');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const meditationTypes = [
    {
      type: 'breathing' as const,
      title: 'Pranayama',
      description: 'Breath control meditation for inner peace',
      icon: '🌬️',
      benefits: { sattva: 8, focus: 10, peace: 12 }
    },
    {
      type: 'mantra' as const,
      title: 'Mantra Japa',
      description: 'Sacred sound repetition for divine connection',
      icon: '🕉️',
      benefits: { sattva: 12, focus: 8, peace: 10 }
    },
    {
      type: 'visualization' as const,
      title: 'Dhyana',
      description: 'Visualization meditation for clarity',
      icon: '👁️',
      benefits: { sattva: 10, focus: 12, peace: 8 }
    },
    {
      type: 'mindfulness' as const,
      title: 'Vipassana',
      description: 'Mindful awareness of present moment',
      icon: '🧘‍♂️',
      benefits: { sattva: 9, focus: 11, peace: 10 }
    }
  ];

  const durations = [
    { minutes: 3, label: '3 min', difficulty: 1 },
    { minutes: 5, label: '5 min', difficulty: 2 },
    { minutes: 10, label: '10 min', difficulty: 3 },
    { minutes: 15, label: '15 min', difficulty: 4 },
    { minutes: 20, label: '20 min', difficulty: 5 },
    { minutes: 30, label: '30 min', difficulty: 6 }
  ];

  // Breathing cycle timing (4-7-8 technique)
  const breathingCycle = {
    inhale: 4000,
    hold: 7000,
    exhale: 8000,
    pause: 1000
  };

  // Initialize audio on component mount
  useEffect(() => {
    audioRef.current = new Audio('/2 minutes of relaxing music,2 minute meditation music,2 minutes meditation,music 2 minute.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleMeditationComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, handleMeditationComplete]);

  // Breathing animation cycle
  useEffect(() => {
    if (isActive && meditationType === 'breathing') {
      const cycleBreathing = () => {
        setBreathPhase('inhale');
        setTimeout(() => setBreathPhase('hold'), breathingCycle.inhale);
        setTimeout(() => setBreathPhase('exhale'), breathingCycle.inhale + breathingCycle.hold);
        setTimeout(() => setBreathPhase('pause'), breathingCycle.inhale + breathingCycle.hold + breathingCycle.exhale);
      };

      cycleBreathing();
      const breathInterval = setInterval(cycleBreathing, Object.values(breathingCycle).reduce((a, b) => a + b, 0));
      
      return () => clearInterval(breathInterval);
    }
  }, [isActive, meditationType, breathingCycle]);

  const startMeditation = () => {
    setTimeLeft(selectedDuration * 60);
    setIsActive(true);
    
    // Play audio when meditation starts if sound is enabled
    if (soundEnabled && audioRef.current) {
      audioRef.current.play()
        .then(() => console.log('Audio playing successfully'))
        .catch(e => {
          console.error('Audio play failed:', e);
          // Try with the fallback audio element
          const fallbackAudio = document.querySelector('audio');
          if (fallbackAudio) {
            fallbackAudio.play()
              .then(() => console.log('Fallback audio playing'))
              .catch(err => console.error('Fallback audio failed too:', err));
          }
        });
    }
  };

  const pauseMeditation = () => {
    setIsActive(!isActive);
    
    // Pause or play audio based on meditation state
    if (isActive && audioRef.current) {
      audioRef.current.pause();
    } else if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  const resetMeditation = () => {
    setIsActive(false);
    setTimeLeft(selectedDuration * 60);
    setBreathPhase('inhale');
    
    // Stop audio when meditation is reset
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleMeditationComplete = () => {
    if (!avatar) return;

    const selectedType = meditationTypes.find(t => t.type === meditationType)!;
    const duration = durations.find(d => d.minutes === selectedDuration)!;

    const session: MeditationSession = {
      id: `meditation_${Date.now()}`,
      type: meditationType,
      duration: selectedDuration,
      difficulty: duration.difficulty,
      rewards: selectedType.benefits
    };

    completeMeditation(session);
    updateGunas({ sattva: selectedType.benefits.sattva });
    addNotification(`Meditation completed! +${selectedType.benefits.sattva} Sattva gained`);
    
    setIsActive(false);
    setTimeLeft(selectedDuration * 60);
    
    // Stop audio when meditation is complete
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getBreathingInstruction = () => {
    switch (breathPhase) {
      case 'inhale': return 'Breathe In...';
      case 'hold': return 'Hold...';
      case 'exhale': return 'Breathe Out...';
      case 'pause': return 'Pause...';
      default: return 'Breathe...';
    }
  };

  const getChakraColor = (index: number) => {
    const colors = ['#ff0000', '#ff8c00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen pt-20 p-6">
      {/* Hidden audio element as fallback */}
      <audio src="/2 minutes of relaxing music,2 minute meditation music,2 minutes meditation,music 2 minute.mp3" loop preload="auto" style={{ display: 'none' }} />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-spiritual font-bold text-saffron-700 mb-2">
            Meditation Center
          </h1>
          <p className="text-gray-600">
            Find inner peace through ancient practices
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Meditation Setup */}
          <motion.div
            className="lg:col-span-1 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Meditation Type Selection */}
            <div className="spiritual-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-saffron-700">
                Choose Practice
              </h3>
              <div className="space-y-3">
                {meditationTypes.map((type) => (
                  <button
                    key={type.type}
                    onClick={() => setMeditationType(type.type)}
                    disabled={isActive}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      meditationType === type.type
                        ? 'border-saffron-300 bg-saffron-50'
                        : 'border-gray-200 hover:border-saffron-200'
                    } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{type.icon}</span>
                      <div>
                        <div className="font-medium text-gray-800">{type.title}</div>
                        <div className="text-sm text-gray-600">{type.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Selection */}
            <div className="spiritual-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-saffron-700">
                Duration
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {durations.map((duration) => (
                  <button
                    key={duration.minutes}
                    onClick={() => setSelectedDuration(duration.minutes)}
                    disabled={isActive}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      selectedDuration === duration.minutes
                        ? 'border-saffron-300 bg-saffron-50 text-saffron-700'
                        : 'border-gray-200 hover:border-saffron-200'
                    } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="font-medium">{duration.label}</div>
                    <div className="text-xs text-gray-500">
                      Level {duration.difficulty}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="spiritual-card p-6">
              <div className="flex items-center justify-center space-x-4">
                {!isActive ? (
                  <button
                    onClick={startMeditation}
                    className="karma-button flex items-center space-x-2"
                  >
                    <Play className="w-5 h-5" />
                    <span>Begin</span>
                  </button>
                ) : (
                  <button
                    onClick={pauseMeditation}
                    className="karma-button flex items-center space-x-2"
                  >
                    <Pause className="w-5 h-5" />
                    <span>Pause</span>
                  </button>
                )}
                
                <button
                  onClick={resetMeditation}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>

                <button
                  onClick={() => {
                    const newSoundState = !soundEnabled;
                    setSoundEnabled(newSoundState);
                    
                    // Handle audio based on new sound state
                    if (audioRef.current) {
                      if (newSoundState && isActive) {
                        audioRef.current.play().catch(e => console.log('Audio play failed:', e));
                      } else {
                        audioRef.current.pause();
                      }
                    }
                  }}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Meditation Visualization */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="spiritual-card p-8 h-full flex flex-col items-center justify-center min-h-[500px]">
              {/* Timer Display */}
              <motion.div
                className="text-6xl font-mono font-bold text-saffron-700 mb-8"
                animate={{ scale: isActive ? [1, 1.05, 1] : 1 }}
                transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
              >
                {formatTime(timeLeft)}
              </motion.div>

              {/* Meditation Visualization */}
              <div className="relative w-80 h-80 flex items-center justify-center">
                {/* Breathing Circle */}
                {meditationType === 'breathing' && (
                  <motion.div
                    className="absolute w-64 h-64 rounded-full border-4 border-saffron-300 flex items-center justify-center"
                    animate={{
                      scale: breathPhase === 'inhale' ? 1.3 : breathPhase === 'exhale' ? 0.7 : 1,
                      borderColor: breathPhase === 'inhale' ? '#10b981' : breathPhase === 'exhale' ? '#3b82f6' : '#f59e0b'
                    }}
                    transition={{ duration: breathPhase === 'inhale' ? 4 : breathPhase === 'exhale' ? 8 : 1 }}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">🌬️</div>
                      <div className="text-lg font-medium text-gray-700">
                        {getBreathingInstruction()}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Mantra Visualization */}
                {meditationType === 'mantra' && (
                  <motion.div
                    className="text-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <motion.div
                      className="text-8xl mb-4"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      🕉️
                    </motion.div>
                    <div className="sanskrit-text text-2xl text-saffron-700">
                      ॐ मणि पद्मे हूँ
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      Om Mani Padme Hum
                    </div>
                  </motion.div>
                )}

                {/* Chakra Visualization */}
                {meditationType === 'visualization' && (
                  <div className="relative">
                    {[...Array(7)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-12 h-12 rounded-full"
                        style={{
                          backgroundColor: getChakraColor(i),
                          top: `${i * 40}px`,
                          left: '50%',
                          transform: 'translateX(-50%)'
                        }}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3
                        }}
                      />
                    ))}
                    <div className="text-center mt-80">
                      <div className="text-lg font-medium text-gray-700">
                        Visualize energy flowing through chakras
                      </div>
                    </div>
                  </div>
                )}

                {/* Mindfulness Visualization */}
                {meditationType === 'mindfulness' && (
                  <motion.div
                    className="text-center"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <div className="text-6xl mb-4">🧘‍♂️</div>
                    <div className="text-lg font-medium text-gray-700 mb-2">
                      Be present in this moment
                    </div>
                    <div className="text-sm text-gray-600">
                      Observe thoughts without judgment
                    </div>
                  </motion.div>
                )}

                {/* Progress Ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="150"
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth="4"
                  />
                  <motion.circle
                    cx="50%"
                    cy="50%"
                    r="150"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 150}`}
                    strokeDashoffset={`${2 * Math.PI * 150 * (timeLeft / (selectedDuration * 60))}`}
                    transition={{ duration: 1 }}
                  />
                </svg>
              </div>

              {/* Meditation Benefits */}
              {!isActive && (
                <motion.div
                  className="mt-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-sm text-gray-600 mb-2">Benefits of this practice:</div>
                  <div className="flex justify-center space-x-4">
                    {Object.entries(meditationTypes.find(t => t.type === meditationType)?.benefits || {}).map(([benefit, value]) => (
                      <div key={benefit} className="text-center">
                        <div className="text-lg font-bold text-saffron-600">+{value}</div>
                        <div className="text-xs text-gray-500 capitalize">{benefit}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MeditationCenter;