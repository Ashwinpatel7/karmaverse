import { KarmaAction, GunaBalance, VirtueTree, Avatar } from '../types';

export class KarmaEngine {
  static calculateKarmaImpact(
    action: string,
    context: string,
    userLevel: number = 1
  ): { karma: number; gunaEffect: Partial<GunaBalance> } {
    const baseKarma = this.getBaseKarmaForAction(action);
    const contextMultiplier = this.getContextMultiplier(context);
    const levelMultiplier = Math.max(0.5, 1 + (userLevel - 1) * 0.1);
    
    const finalKarma = Math.round(baseKarma * contextMultiplier * levelMultiplier);
    const gunaEffect = this.calculateGunaEffect(action, finalKarma);
    
    return { karma: finalKarma, gunaEffect };
  }

  private static getBaseKarmaForAction(action: string): number {
    const actionLower = action.toLowerCase();
    
    if (this.containsWords(actionLower, ['help', 'assist', 'support', 'aid'])) return 15;
    if (this.containsWords(actionLower, ['donate', 'give', 'charity', 'generous'])) return 20;
    if (this.containsWords(actionLower, ['meditate', 'pray', 'worship', 'devotion'])) return 12;
    if (this.containsWords(actionLower, ['forgive', 'compassion', 'mercy', 'kindness'])) return 18;
    if (this.containsWords(actionLower, ['truth', 'honest', 'sincere', 'authentic'])) return 16;
    
    if (this.containsWords(actionLower, ['lie', 'deceive', 'cheat', 'fraud'])) return -20;
    if (this.containsWords(actionLower, ['steal', 'theft', 'rob', 'take'])) return -25;
    if (this.containsWords(actionLower, ['harm', 'hurt', 'violence', 'attack'])) return -30;
    if (this.containsWords(actionLower, ['anger', 'rage', 'fury', 'wrath'])) return -12;
    
    return Math.random() > 0.7 ? 5 : 0;
  }

  private static getContextMultiplier(context: string): number {
    const contextLower = context.toLowerCase();
    
    if (contextLower.includes('temple') || contextLower.includes('sacred')) return 1.5;
    if (contextLower.includes('festival') || contextLower.includes('celebration')) return 1.3;
    if (contextLower.includes('crisis') || contextLower.includes('emergency')) return 1.4;
    if (contextLower.includes('family') || contextLower.includes('loved ones')) return 1.2;
    
    return 1.0;
  }

  private static calculateGunaEffect(action: string, karma: number): Partial<GunaBalance> {
    const actionLower = action.toLowerCase();
    const effect: Partial<GunaBalance> = {};
    
    if (karma > 0) {
      effect.sattva = Math.min(10, Math.abs(karma) / 2);
      
      if (this.containsWords(actionLower, ['meditate', 'pray', 'study', 'wisdom'])) {
        effect.sattva = Math.min(15, Math.abs(karma));
        effect.tamas = -Math.min(5, Math.abs(karma) / 3);
      }
    } else if (karma < 0) {
      if (this.containsWords(actionLower, ['anger', 'violence', 'harm', 'attack'])) {
        effect.rajas = Math.min(15, Math.abs(karma));
        effect.tamas = Math.min(8, Math.abs(karma) / 2);
        effect.sattva = -Math.min(10, Math.abs(karma) / 2);
      }
    }
    
    return effect;
  }

  static calculateVirtueImpact(action: string, karma: number): Partial<VirtueTree> {
    const actionLower = action.toLowerCase();
    const virtues: Partial<VirtueTree> = {};
    const baseImpact = Math.min(5, Math.abs(karma) / 4);
    
    if (karma > 0) {
      if (this.containsWords(actionLower, ['help', 'assist', 'support', 'care'])) {
        virtues.compassion = baseImpact;
      }
      if (this.containsWords(actionLower, ['truth', 'honest', 'sincere', 'authentic'])) {
        virtues.truthfulness = baseImpact;
      }
      if (this.containsWords(actionLower, ['brave', 'courage', 'stand up', 'defend'])) {
        virtues.courage = baseImpact;
      }
    }
    
    return virtues;
  }

  static shouldReincarnate(avatar: Avatar): boolean {
    const totalKarma = avatar.stats.karma.total;
    const spiritualLevel = avatar.stats.spiritualLevel;
    const avgVirtue = Object.values(avatar.stats.virtues).reduce((sum, val) => sum + val, 0) / 8;
    
    const hasHighSpiritual = spiritualLevel >= 80;
    const hasPositiveKarma = totalKarma >= 500;
    const hasHighVirtues = avgVirtue >= 80;
    const hasHighSattva = avatar.stats.gunas.sattva >= 85;
    
    const conditionsMet = [hasHighSpiritual, hasPositiveKarma, hasHighVirtues, hasHighSattva].filter(Boolean).length;
    
    return conditionsMet < 3;
  }

  private static containsWords(text: string, words: string[]): boolean {
    return words.some(word => text.includes(word));
  }

  static calculateWorldImpact(collectiveKarma: number): {
    harmony: number;
    prosperity: number;
    spirituality: number;
    conflict: number;
  } {
    const normalizedKarma = Math.max(0, Math.min(100, (collectiveKarma + 1000) / 20));
    
    return {
      harmony: Math.max(10, Math.min(95, normalizedKarma * 0.8 + 10)),
      prosperity: Math.max(20, Math.min(90, normalizedKarma * 0.7 + 20)),
      spirituality: Math.max(15, Math.min(98, normalizedKarma * 0.9 + 5)),
      conflict: Math.max(5, Math.min(85, 90 - normalizedKarma * 0.8))
    };
  }
}