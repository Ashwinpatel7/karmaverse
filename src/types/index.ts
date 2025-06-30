// Core spiritual and philosophical types for KarmaVerse

export interface Avatar {
  id: string;
  name: string;
  level: number;
  incarnation: number;
  appearance: AvatarAppearance;
  stats: AvatarStats;
  currentLife: LifeCycle;
  pastLives: LifeCycle[];
}

export interface AvatarAppearance {
  form: 'human' | 'celestial' | 'animal' | 'divine';
  aura: 'none' | 'dim' | 'bright' | 'radiant' | 'divine';
  accessories: string[];
  colors: {
    primary: string;
    secondary: string;
    aura: string;
  };
}

export interface AvatarStats {
  karma: KarmaScore;
  gunas: GunaBalance;
  virtues: VirtueTree;
  yogaPath: YogaPath;
  spiritualLevel: number;
}

export interface KarmaScore {
  total: number; // -1000 to +1000
  positive: number;
  negative: number;
  recent: KarmaAction[];
}

export interface KarmaAction {
  id: string;
  action: string;
  karmaChange: number;
  gunaEffect: Partial<GunaBalance>;
  timestamp: Date;
  context: string;
}

export interface GunaBalance {
  sattva: number; // 0-100 (purity, harmony, knowledge)
  rajas: number;  // 0-100 (passion, activity, desire)
  tamas: number;  // 0-100 (inertia, ignorance, darkness)
}

export interface VirtueTree {
  compassion: number;
  wisdom: number;
  courage: number;
  temperance: number;
  justice: number;
  devotion: number;
  detachment: number;
  truthfulness: number;
}

export type YogaPath = 'karma' | 'bhakti' | 'jnana' | 'raja';

export interface LifeCycle {
  id: string;
  startKarma: number;
  endKarma: number;
  majorActions: KarmaAction[];
  lessons: string[];
  achievements: string[];
  duration: number; // in game days
}

export type Yuga = 'satya' | 'treta' | 'dvapara' | 'kali';

export interface WorldState {
  currentYuga: Yuga;
  yugaProgress: number; // 0-100
  collectiveKarma: number;
  environment: EnvironmentState;
  availableQuests: Quest[];
}

export interface EnvironmentState {
  harmony: number; // 0-100
  prosperity: number; // 0-100
  spirituality: number; // 0-100
  conflict: number; // 0-100
  colors: {
    sky: string;
    earth: string;
    water: string;
    vegetation: string;
  };
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'dharma' | 'karma' | 'meditation' | 'service' | 'knowledge';
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  rewards: QuestReward;
  requirements: QuestRequirement[];
  yogaPathBonus?: YogaPath;
}

export interface QuestReward {
  karma: number;
  gunaChanges: Partial<GunaBalance>;
  virtuePoints: Partial<VirtueTree>;
  items?: string[];
}

export interface QuestRequirement {
  type: 'karma' | 'virtue' | 'guna' | 'level';
  value: number;
  comparison: 'min' | 'max' | 'exact';
}

export interface DharmaDilemma {
  id: string;
  title: string;
  scenario: string;
  options: DilemmaOption[];
  context: {
    yuga: Yuga;
    yogaPath?: YogaPath;
    personalContext: string;
  };
}

export interface DilemmaOption {
  id: string;
  text: string;
  consequences: {
    karma: number;
    gunaChanges: Partial<GunaBalance>;
    description: string;
    scriptureReference?: string;
  };
}

export interface MeditationSession {
  id: string;
  type: 'breathing' | 'mantra' | 'visualization' | 'mindfulness';
  duration: number; // in minutes
  difficulty: number; // 1-10
  rewards: {
    sattva: number;
    focus: number;
    peace: number;
  };
}

export interface ScriptureQuote {
  id: string;
  text: string;
  source: string; // "Bhagavad Gita 2.47", "Upanishads", etc.
  translation: string;
  context: string;
  relevantSituation: string[];
}

export interface JournalEntry {
  id: string;
  date: Date;
  prompt: string;
  reflection: string;
  mood: 'peaceful' | 'conflicted' | 'inspired' | 'troubled' | 'joyful';
  karmaContext: KarmaAction[];
  insights: string[];
}

export interface SpiritualProgress {
  totalDays: number;
  meditationStreak: number;
  virtueGrowth: VirtueTree;
  karmaHistory: KarmaScore[];
  majorMilestones: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  achievedAt: Date;
  significance: 'minor' | 'major' | 'legendary';
  rewards: QuestReward;
}

// API and external service types
export interface AIResponse {
  message: string;
  guidance: string[];
  scriptureReferences: ScriptureQuote[];
  suggestedActions: string[];
}

export interface GameSettings {
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'sage';
  notifications: boolean;
  soundEnabled: boolean;
  autoSave: boolean;
  language: 'en' | 'hi' | 'sa'; // English, Hindi, Sanskrit
}

// Event system types
export type GameEvent = 
  | { type: 'KARMA_CHANGED'; payload: { change: number; reason: string } }
  | { type: 'GUNA_SHIFTED'; payload: { guna: keyof GunaBalance; change: number } }
  | { type: 'VIRTUE_GAINED'; payload: { virtue: keyof VirtueTree; amount: number } }
  | { type: 'QUEST_COMPLETED'; payload: { questId: string; rewards: QuestReward } }
  | { type: 'YUGA_TRANSITION'; payload: { from: Yuga; to: Yuga } }
  | { type: 'REINCARNATION'; payload: { newLife: LifeCycle } }
  | { type: 'MILESTONE_ACHIEVED'; payload: { milestone: Milestone } };