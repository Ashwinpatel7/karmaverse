import { AIResponse, Avatar, KarmaAction, ScriptureQuote } from '../types';
import { getQuoteByContext, getRandomQuote } from '../data/scriptures';

// Configuration for different AI services
const AI_SERVICES = {
  HUGGING_FACE: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large',
  OPENROUTER: 'https://openrouter.ai/api/v1/chat/completions',
  GROQ: 'https://api.groq.com/openai/v1/chat/completions'
};

interface AIServiceConfig {
  apiKey: string;
  service: keyof typeof AI_SERVICES;
  maxTokens: number;
  temperature: number;
}

class AIService {
  private config: AIServiceConfig;
  private requestCount: number = 0;
  private maxRequestsPerDay: number = 50; // Conservative limit for free tiers

  constructor() {
    this.config = {
      apiKey: process.env.REACT_APP_AI_API_KEY || '',
      service: 'OPENROUTER', // Default to OpenRouter
      maxTokens: 300,
      temperature: 0.7
    };
  }

  private canMakeRequest(): boolean {
    return this.requestCount < this.maxRequestsPerDay && Boolean(this.config.apiKey);
  }

  private buildSpiritualPrompt(question: string, avatar: Avatar | null): string {
    const contextInfo = avatar ? `
    Seeker's Context:
    - Name: ${avatar.name}
    - Spiritual Path: ${avatar.stats.yogaPath} yoga
    - Karma Level: ${avatar.stats.karma.total}
    - Dominant Guna: ${avatar.stats.gunas.sattva > avatar.stats.gunas.rajas && avatar.stats.gunas.sattva > avatar.stats.gunas.tamas ? 'Sattva' : 
                      avatar.stats.gunas.rajas > avatar.stats.gunas.tamas ? 'Rajas' : 'Tamas'}
    - Spiritual Level: ${avatar.stats.spiritualLevel}
    - Recent Actions: ${avatar.stats.karma.recent.slice(0, 3).map(a => a.action).join(', ')}
    ` : '';

    return `You are a wise Hindu sage and spiritual guide, well-versed in the Bhagavad Gita, Upanishads, and Vedantic philosophy. 
    
    A spiritual seeker asks: "${question}"
    
    ${contextInfo}
    
    Please provide guidance that:
    1. References relevant verses from Hindu scriptures (Gita, Upanishads, etc.)
    2. Explains the spiritual principles involved
    3. Offers practical steps for spiritual growth
    4. Considers their current spiritual state and chosen yoga path
    5. Maintains compassion and wisdom in your response
    
    Keep your response concise but profound, like the great sages of tradition.`;
  }

  private async callHuggingFace(prompt: string): Promise<string> {
    try {
      const response = await fetch(AI_SERVICES.HUGGING_FACE, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_length: this.config.maxTokens,
            temperature: this.config.temperature,
            return_full_text: false
          }
        })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      return data[0]?.generated_text || 'I apologize, but I cannot provide guidance at this moment. Please reflect on the teachings of the Gita and trust your inner wisdom.';
    } catch (error) {
      console.error('Hugging Face API error:', error);
      throw error;
    }
  }

  private async callOpenRouter(prompt: string): Promise<string> {
    try {
      const response = await fetch(AI_SERVICES.OPENROUTER, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.1-8b-instruct:free',
          messages: [
            {
              role: 'system',
              content: 'You are a wise Hindu sage providing spiritual guidance based on authentic Hindu scriptures and philosophy.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature
        })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      return data.choices[0]?.message?.content || 'Seek the truth within yourself, as the Upanishads teach us.';
    } catch (error) {
      console.error('OpenRouter API error:', error);
      throw error;
    }
  }

  private async callGroq(prompt: string): Promise<string> {
    try {
      const response = await fetch(AI_SERVICES.GROQ, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'system',
              content: 'You are an enlightened guru providing wisdom from Hindu scriptures. Always reference specific verses when possible.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature
        })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      return data.choices[0]?.message?.content || 'The answers you seek lie within. Meditate on the eternal truths.';
    } catch (error) {
      console.error('Groq API error:', error);
      throw error;
    }
  }

  private generateLocalWisdom(question: string, avatar: Avatar | null): AIResponse {
    // Fallback wisdom generation using local logic
    const keywords = question.toLowerCase();
    let relevantQuote: ScriptureQuote;
    let guidance: string[] = [];
    let suggestedActions: string[] = [];

    // Context-based quote selection
    if (keywords.includes('anger') || keywords.includes('angry')) {
      relevantQuote = getQuoteByContext('anger_management') || getRandomQuote();
      guidance = [
        'Anger clouds judgment and leads to suffering',
        'Practice breathing meditation to calm the mind',
        'Remember that anger often masks deeper pain or fear'
      ];
      suggestedActions = ['Practice pranayama (breathing exercises)', 'Reflect on the root cause of anger', 'Cultivate patience through daily practice'];
    } else if (keywords.includes('fear') || keywords.includes('afraid')) {
      relevantQuote = getQuoteByContext('fear_release') || getRandomQuote();
      guidance = [
        'Fear arises from attachment and ignorance of our true nature',
        'Surrender to the Divine brings fearlessness',
        'Courage grows through facing our fears with dharma'
      ];
      suggestedActions = ['Chant mantras for protection', 'Study scriptures on fearlessness', 'Take small brave actions daily'];
    } else if (keywords.includes('decision') || keywords.includes('choice')) {
      relevantQuote = getQuoteByContext('decision_making') || getRandomQuote();
      guidance = [
        'Act according to dharma without attachment to results',
        'Consider the welfare of all beings in your decisions',
        'Seek guidance from scriptures and wise counsel'
      ];
      suggestedActions = ['Meditate before important decisions', 'Consult dharmic principles', 'Consider long-term consequences'];
    } else {
      relevantQuote = getRandomQuote();
      guidance = [
        'All experiences are opportunities for spiritual growth',
        'Maintain equanimity in pleasure and pain',
        'Remember your eternal nature beyond temporary circumstances'
      ];
      suggestedActions = ['Practice daily meditation', 'Study sacred texts', 'Serve others selflessly'];
    }

    // Personalize based on avatar's yoga path
    if (avatar) {
      switch (avatar.stats.yogaPath) {
        case 'karma':
          suggestedActions.push('Focus on selfless service and right action');
          break;
        case 'bhakti':
          suggestedActions.push('Deepen your devotional practices and surrender');
          break;
        case 'jnana':
          suggestedActions.push('Study scriptures and practice self-inquiry');
          break;
        case 'raja':
          suggestedActions.push('Intensify meditation and mental discipline');
          break;
      }
    }

    return {
      message: `Based on the eternal wisdom of our scriptures, ${guidance[0]}. ${relevantQuote.translation}`,
      guidance,
      scriptureReferences: [relevantQuote],
      suggestedActions
    };
  }

  async getSpiritualGuidance(question: string, avatar: Avatar | null): Promise<AIResponse> {
    // Always try local wisdom first for instant response
    const localResponse = this.generateLocalWisdom(question, avatar);

    // If we can make API requests, try to enhance with AI
    if (this.canMakeRequest()) {
      try {
        const prompt = this.buildSpiritualPrompt(question, avatar);
        let aiMessage: string;

        switch (this.config.service) {
          case 'HUGGING_FACE':
            aiMessage = await this.callHuggingFace(prompt);
            break;
          case 'OPENROUTER':
            aiMessage = await this.callOpenRouter(prompt);
            break;
          case 'GROQ':
            aiMessage = await this.callGroq(prompt);
            break;
          default:
            throw new Error('Unknown AI service');
        }

        this.requestCount++;
        
        // Combine AI response with local wisdom
        return {
          ...localResponse,
          message: aiMessage,
          guidance: [...localResponse.guidance, 'This guidance comes from both ancient wisdom and modern understanding']
        };
      } catch (error) {
        console.warn('AI service unavailable, using local wisdom:', error);
        // Fall back to local wisdom
        return localResponse;
      }
    }

    return localResponse;
  }

  async analyzeKarmaPattern(karmaHistory: KarmaAction[]): Promise<string> {
    if (!this.canMakeRequest()) {
      // Local analysis
      const recentActions = karmaHistory.slice(0, 10);
      const positiveActions = recentActions.filter(a => a.karmaChange > 0).length;
      const negativeActions = recentActions.filter(a => a.karmaChange < 0).length;
      
      if (positiveActions > negativeActions) {
        return 'Your recent actions show a positive trend toward dharmic living. Continue on this path of righteousness.';
      } else if (negativeActions > positiveActions) {
        return 'Your recent actions suggest areas for improvement. Focus on selfless service and righteous conduct.';
      } else {
        return 'Your actions show balance. Strive to increase positive karma through compassionate service.';
      }
    }

    try {
      const prompt = `Analyze this spiritual seeker's karma pattern and provide guidance:
      
      Recent Actions: ${karmaHistory.slice(0, 10).map(a => `${a.action} (${a.karmaChange > 0 ? '+' : ''}${a.karmaChange})`).join(', ')}
      
      Provide insights on their spiritual progress and suggestions for improvement based on Hindu dharmic principles.`;

      const analysis = await this.callOpenRouter(prompt);
      this.requestCount++;
      return analysis;
    } catch (error) {
      return 'Reflect on your actions with honesty. The path of dharma requires constant self-examination and improvement.';
    }
  }

  // Method to reset daily request count (call this daily)
  resetDailyLimit(): void {
    this.requestCount = 0;
  }

  // Method to check remaining requests
  getRemainingRequests(): number {
    return Math.max(0, this.maxRequestsPerDay - this.requestCount);
  }
}

export const aiService = new AIService();