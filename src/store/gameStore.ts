import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  Avatar, 
  WorldState, 
  GameSettings, 
  KarmaAction, 
  GunaBalance, 
  VirtueTree, 
  Yuga,
  GameEvent,
  JournalEntry,
  MeditationSession,
  DharmaDilemma
} from '../types';

interface GameStore {
  // Core game state
  avatar: Avatar | null;
  worldState: WorldState;
  settings: GameSettings;
  
  // UI state
  currentView: 'dashboard' | 'meditation' | 'journal' | 'quests' | 'avatar' | 'world';
  isLoading: boolean;
  notifications: string[];
  
  // Game data
  journalEntries: JournalEntry[];
  completedMeditations: MeditationSession[];
  currentDilemma: DharmaDilemma | null;
  
  // Actions
  initializeAvatar: (name: string, yogaPath: 'karma' | 'bhakti' | 'jnana' | 'raja') => void;
  updateKarma: (action: KarmaAction) => void;
  updateGunas: (changes: Partial<GunaBalance>) => void;
  updateVirtues: (changes: Partial<VirtueTree>) => void;
  transitionYuga: (newYuga: Yuga) => void;
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  completeMeditation: (session: MeditationSession) => void;
  setCurrentView: (view: GameStore['currentView']) => void;
  addNotification: (message: string) => void;
  clearNotifications: () => void;
  dispatchEvent: (event: GameEvent) => void;
  
  // Computed values
  getKarmaLevel: () => 'very_negative' | 'negative' | 'neutral' | 'positive' | 'very_positive';
  getDominantGuna: () => keyof GunaBalance;
  getSpiritualLevel: () => number;
}

const createInitialAvatar = (name: string, yogaPath: 'karma' | 'bhakti' | 'jnana' | 'raja'): Avatar => ({
  id: `avatar_${Date.now()}`,
  name,
  level: 1,
  incarnation: 1,
  appearance: {
    form: 'human',
    aura: 'dim',
    accessories: [],
    colors: {
      primary: '#f6b871',
      secondary: '#fdecd4',
      aura: '#ed7611'
    }
  },
  stats: {
    karma: {
      total: 0,
      positive: 0,
      negative: 0,
      recent: []
    },
    gunas: {
      sattva: 33,
      rajas: 33,
      tamas: 34
    },
    virtues: {
      compassion: 10,
      wisdom: 10,
      courage: 10,
      temperance: 10,
      justice: 10,
      devotion: 10,
      detachment: 10,
      truthfulness: 10
    },
    yogaPath,
    spiritualLevel: 1
  },
  currentLife: {
    id: `life_${Date.now()}`,
    startKarma: 0,
    endKarma: 0,
    majorActions: [],
    lessons: [],
    achievements: [],
    duration: 0
  },
  pastLives: []
});

const createInitialWorldState = (): WorldState => ({
  currentYuga: 'satya',
  yugaProgress: 0,
  collectiveKarma: 0,
  environment: {
    harmony: 90,
    prosperity: 85,
    spirituality: 95,
    conflict: 5,
    colors: {
      sky: '#87CEEB',
      earth: '#8FBC8F',
      water: '#4682B4',
      vegetation: '#228B22'
    }
  },
  availableQuests: []
});

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      avatar: null,
      worldState: createInitialWorldState(),
      settings: {
        difficulty: 'beginner',
        notifications: true,
        soundEnabled: true,
        autoSave: true,
        language: 'en'
      },
      currentView: 'dashboard',
      isLoading: false,
      notifications: [],
      journalEntries: [],
      completedMeditations: [],
      currentDilemma: null,

      // Actions
      initializeAvatar: (name: string, yogaPath: 'karma' | 'bhakti' | 'jnana' | 'raja') => {
        const newAvatar = createInitialAvatar(name, yogaPath);
        set({ avatar: newAvatar });
      },

      updateKarma: (action: KarmaAction) => {
        const { avatar } = get();
        if (!avatar) return;

        const newKarma = {
          ...avatar.stats.karma,
          total: avatar.stats.karma.total + action.karmaChange,
          positive: action.karmaChange > 0 
            ? avatar.stats.karma.positive + action.karmaChange 
            : avatar.stats.karma.positive,
          negative: action.karmaChange < 0 
            ? avatar.stats.karma.negative + Math.abs(action.karmaChange) 
            : avatar.stats.karma.negative,
          recent: [action, ...avatar.stats.karma.recent.slice(0, 9)] // Keep last 10 actions
        };

        set({
          avatar: {
            ...avatar,
            stats: {
              ...avatar.stats,
              karma: newKarma
            }
          }
        });

        // Dispatch karma changed event
        get().dispatchEvent({
          type: 'KARMA_CHANGED',
          payload: { change: action.karmaChange, reason: action.action }
        });
      },

      updateGunas: (changes: Partial<GunaBalance>) => {
        const { avatar } = get();
        if (!avatar) return;

        const currentGunas = avatar.stats.gunas;
        const newGunas = {
          sattva: Math.max(0, Math.min(100, currentGunas.sattva + (changes.sattva || 0))),
          rajas: Math.max(0, Math.min(100, currentGunas.rajas + (changes.rajas || 0))),
          tamas: Math.max(0, Math.min(100, currentGunas.tamas + (changes.tamas || 0)))
        };

        // Normalize to ensure they add up to 100
        const total = newGunas.sattva + newGunas.rajas + newGunas.tamas;
        if (total > 0) {
          newGunas.sattva = Math.round((newGunas.sattva / total) * 100);
          newGunas.rajas = Math.round((newGunas.rajas / total) * 100);
          newGunas.tamas = 100 - newGunas.sattva - newGunas.rajas;
        }

        set({
          avatar: {
            ...avatar,
            stats: {
              ...avatar.stats,
              gunas: newGunas
            }
          }
        });
      },

      updateVirtues: (changes: Partial<VirtueTree>) => {
        const { avatar } = get();
        if (!avatar) return;

        const newVirtues = { ...avatar.stats.virtues };
        Object.entries(changes).forEach(([virtue, change]) => {
          if (change !== undefined) {
            newVirtues[virtue as keyof VirtueTree] = Math.max(0, Math.min(100, 
              newVirtues[virtue as keyof VirtueTree] + change
            ));
          }
        });

        set({
          avatar: {
            ...avatar,
            stats: {
              ...avatar.stats,
              virtues: newVirtues
            }
          }
        });
      },

      transitionYuga: (newYuga: Yuga) => {
        const { worldState } = get();
        const oldYuga = worldState.currentYuga;
        
        // Update environment based on new Yuga
        const environmentChanges = {
          satya: { harmony: 90, prosperity: 85, spirituality: 95, conflict: 5 },
          treta: { harmony: 70, prosperity: 75, spirituality: 80, conflict: 20 },
          dvapara: { harmony: 50, prosperity: 65, spirituality: 60, conflict: 40 },
          kali: { harmony: 20, prosperity: 40, spirituality: 30, conflict: 80 }
        };

        const colorChanges = {
          satya: { sky: '#87CEEB', earth: '#8FBC8F', water: '#4682B4', vegetation: '#228B22' },
          treta: { sky: '#B0C4DE', earth: '#9ACD32', water: '#5F9EA0', vegetation: '#32CD32' },
          dvapara: { sky: '#D3D3D3', earth: '#BDB76B', water: '#708090', vegetation: '#6B8E23' },
          kali: { sky: '#696969', earth: '#A0522D', water: '#2F4F4F', vegetation: '#556B2F' }
        };

        set({
          worldState: {
            ...worldState,
            currentYuga: newYuga,
            environment: {
              ...environmentChanges[newYuga],
              colors: colorChanges[newYuga]
            }
          }
        });

        get().dispatchEvent({
          type: 'YUGA_TRANSITION',
          payload: { from: oldYuga, to: newYuga }
        });
      },

      addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => {
        const newEntry: JournalEntry = {
          ...entry,
          id: `journal_${Date.now()}`
        };
        
        set(state => ({
          journalEntries: [newEntry, ...state.journalEntries]
        }));
      },

      completeMeditation: (session: MeditationSession) => {
        set(state => ({
          completedMeditations: [session, ...state.completedMeditations]
        }));

        // Award sattva for meditation
        get().updateGunas({ sattva: session.rewards.sattva });
      },

      setCurrentView: (view: GameStore['currentView']) => {
        set({ currentView: view });
      },

      addNotification: (message: string) => {
        set(state => ({
          notifications: [message, ...state.notifications.slice(0, 4)] // Keep last 5
        }));
      },

      clearNotifications: () => {
        set({ notifications: [] });
      },

      dispatchEvent: (event: GameEvent) => {
        // Handle different event types
        switch (event.type) {
          case 'KARMA_CHANGED':
            get().addNotification(`Karma ${event.payload.change > 0 ? 'increased' : 'decreased'} by ${Math.abs(event.payload.change)}`);
            break;
          case 'YUGA_TRANSITION':
            get().addNotification(`The world has transitioned from ${event.payload.from} Yuga to ${event.payload.to} Yuga`);
            break;
          // Add more event handlers as needed
        }
      },

      // Computed values
      getKarmaLevel: () => {
        const { avatar } = get();
        if (!avatar) return 'neutral';
        
        const karma = avatar.stats.karma.total;
        if (karma >= 500) return 'very_positive';
        if (karma >= 100) return 'positive';
        if (karma <= -500) return 'very_negative';
        if (karma <= -100) return 'negative';
        return 'neutral';
      },

      getDominantGuna: () => {
        const { avatar } = get();
        if (!avatar) return 'sattva';
        
        const { sattva, rajas, tamas } = avatar.stats.gunas;
        if (sattva >= rajas && sattva >= tamas) return 'sattva';
        if (rajas >= tamas) return 'rajas';
        return 'tamas';
      },

      getSpiritualLevel: () => {
        const { avatar } = get();
        if (!avatar) return 1;
        
        const virtueSum = Object.values(avatar.stats.virtues).reduce((sum, value) => sum + value, 0);
        const karmaBonus = Math.max(0, avatar.stats.karma.total / 100);
        const sattvaBonux = avatar.stats.gunas.sattva / 10;
        
        return Math.floor((virtueSum + karmaBonus + sattvaBonux) / 10);
      }
    }),
    {
      name: 'karmaverse-game-state',
      partialize: (state) => ({
        avatar: state.avatar,
        worldState: state.worldState,
        settings: state.settings,
        journalEntries: state.journalEntries,
        completedMeditations: state.completedMeditations
      })
    }
  )
);