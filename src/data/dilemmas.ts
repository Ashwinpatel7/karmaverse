import { DharmaDilemma } from '../types';

export const dharmaDilemmas: DharmaDilemma[] = [
  {
    id: 'honesty_vs_kindness',
    title: 'Truth or Compassion?',
    scenario: 'Your friend has prepared a meal with great love and effort, but it tastes terrible. They ask for your honest opinion, clearly hoping for praise. What do you do?',
    options: [
      {
        id: 'brutal_honesty',
        text: 'Tell them honestly that the food needs improvement',
        consequences: {
          karma: -5,
          gunaChanges: { rajas: 5, tamas: 2 },
          description: 'Your honesty hurts their feelings deeply, though it may help them improve.',
          scriptureReference: 'Truth without compassion can be harmful - Mahabharata'
        }
      },
      {
        id: 'kind_lie',
        text: 'Praise the meal to make them happy',
        consequences: {
          karma: -10,
          gunaChanges: { tamas: 8, rajas: 2 },
          description: 'Your lie brings temporary happiness but prevents their growth and creates inner conflict.',
          scriptureReference: 'Satyam vada - Speak the truth (Taittiriya Upanishad)'
        }
      },
      {
        id: 'compassionate_truth',
        text: 'Appreciate their effort while gently suggesting improvements',
        consequences: {
          karma: 15,
          gunaChanges: { sattva: 10, rajas: -3 },
          description: 'You honor both truth and compassion, helping them grow while preserving their dignity.',
          scriptureReference: 'Satyam bruyat priyam bruyat - Speak truth that is pleasant (Mahabharata)'
        }
      }
    ],
    context: {
      yuga: 'satya',
      personalContext: 'A test of balancing truthfulness with compassion'
    }
  },
  {
    id: 'duty_vs_desire',
    title: 'Family Duty vs Personal Dreams',
    scenario: 'Your aging parents need care, but you have an opportunity to pursue your lifelong dream career in another city. Your family expects you to stay and fulfill your duty as their child.',
    options: [
      {
        id: 'abandon_duty',
        text: 'Follow your dreams and move to the city',
        consequences: {
          karma: -25,
          gunaChanges: { rajas: 10, tamas: 5 },
          description: 'You achieve personal success but carry the weight of abandoning your dharmic duty.',
          scriptureReference: 'One who abandons prescribed duties falls from the spiritual path'
        }
      },
      {
        id: 'sacrifice_dreams',
        text: 'Stay home and care for your parents',
        consequences: {
          karma: 20,
          gunaChanges: { sattva: 8, tamas: 3 },
          description: 'You fulfill your dharma but may harbor resentment and unfulfilled desires.',
          scriptureReference: 'Matru devo bhava, pitru devo bhava - Mother and father are divine'
        }
      },
      {
        id: 'creative_solution',
        text: 'Find a way to pursue your career while ensuring parents are cared for',
        consequences: {
          karma: 30,
          gunaChanges: { sattva: 15, rajas: 5 },
          description: 'You honor both duty and personal growth through creative problem-solving.',
          scriptureReference: 'Dharma exists to support both individual and collective welfare'
        }
      }
    ],
    context: {
      yuga: 'treta',
      personalContext: 'Balancing personal aspirations with family obligations'
    }
  },
  {
    id: 'wealth_distribution',
    title: 'The Found Treasure',
    scenario: 'While walking, you find a bag containing a large sum of money with no identification. You could really use this money for your family\'s needs, but someone else has clearly lost it.',
    options: [
      {
        id: 'keep_money',
        text: 'Keep the money for your family\'s needs',
        consequences: {
          karma: -30,
          gunaChanges: { tamas: 15, rajas: 5 },
          description: 'Material gain through dishonesty creates karmic debt and inner guilt.',
          scriptureReference: 'Paropakara punyaya papaya parapidanam - Helping others is virtue, harming is sin'
        }
      },
      {
        id: 'turn_in_police',
        text: 'Turn the money in to the authorities',
        consequences: {
          karma: 25,
          gunaChanges: { sattva: 12, rajas: -2 },
          description: 'Your honesty creates positive karma and inner peace, though financial struggles continue.',
          scriptureReference: 'Honesty is the highest dharma - Mahabharata'
        }
      },
      {
        id: 'find_owner',
        text: 'Make effort to find the rightful owner',
        consequences: {
          karma: 35,
          gunaChanges: { sattva: 18, rajas: 2 },
          description: 'Your extra effort to do right creates maximum positive karma and divine blessings.',
          scriptureReference: 'Going beyond duty in righteousness brings divine grace'
        }
      }
    ],
    context: {
      yuga: 'dvapara',
      personalContext: 'Testing honesty when facing personal hardship'
    }
  },
  {
    id: 'forgiveness_test',
    title: 'The Betraying Friend',
    scenario: 'Your close friend has betrayed your trust by sharing your secrets and spreading false rumors about you. They now ask for forgiveness, claiming they were influenced by others.',
    options: [
      {
        id: 'seek_revenge',
        text: 'Expose their secrets in return and cut all ties',
        consequences: {
          karma: -20,
          gunaChanges: { rajas: 12, tamas: 8 },
          description: 'Revenge brings temporary satisfaction but perpetuates the cycle of negativity.',
          scriptureReference: 'An eye for an eye makes the whole world blind'
        }
      },
      {
        id: 'conditional_forgiveness',
        text: 'Forgive them but maintain distance and caution',
        consequences: {
          karma: 10,
          gunaChanges: { sattva: 5, rajas: 3 },
          description: 'Practical forgiveness protects you while avoiding revenge, but may limit healing.',
          scriptureReference: 'Forgiveness is virtue, but wisdom is also necessary'
        }
      },
      {
        id: 'complete_forgiveness',
        text: 'Forgive completely and work to rebuild the friendship',
        consequences: {
          karma: 25,
          gunaChanges: { sattva: 15, rajas: -5 },
          description: 'Complete forgiveness frees your heart and may transform both of you.',
          scriptureReference: 'Kshama veerasya bhushanam - Forgiveness is the ornament of the brave'
        }
      }
    ],
    context: {
      yuga: 'kali',
      personalContext: 'Testing the power of forgiveness in the face of betrayal'
    }
  },
  {
    id: 'environmental_choice',
    title: 'Progress vs Nature',
    scenario: 'You work for a company planning to build a factory that will provide jobs for your struggling community but will also destroy a sacred grove that has been preserved for generations.',
    options: [
      {
        id: 'support_development',
        text: 'Support the factory for economic progress',
        consequences: {
          karma: -15,
          gunaChanges: { rajas: 8, tamas: 5 },
          description: 'Short-term economic gain at the cost of environmental and spiritual heritage.',
          scriptureReference: 'Destroying nature destroys the foundation of life itself'
        }
      },
      {
        id: 'oppose_project',
        text: 'Oppose the project to protect the sacred grove',
        consequences: {
          karma: 20,
          gunaChanges: { sattva: 10, rajas: 2 },
          description: 'You protect sacred nature but the community continues to struggle economically.',
          scriptureReference: 'The Earth is our mother and we are her children - Atharva Veda'
        }
      },
      {
        id: 'seek_alternative',
        text: 'Propose alternative locations and sustainable development',
        consequences: {
          karma: 30,
          gunaChanges: { sattva: 15, rajas: 5 },
          description: 'Your creative solution honors both human needs and environmental protection.',
          scriptureReference: 'True progress considers the welfare of all beings'
        }
      }
    ],
    context: {
      yuga: 'kali',
      personalContext: 'Balancing material progress with spiritual and environmental values'
    }
  },
  {
    id: 'charity_dilemma',
    title: 'The Beggar\'s Request',
    scenario: 'A beggar approaches you asking for money. You suspect they might use it for alcohol or drugs rather than food, but they claim to be hungry. You have limited money yourself.',
    options: [
      {
        id: 'give_money',
        text: 'Give money without questioning their intentions',
        consequences: {
          karma: 15,
          gunaChanges: { sattva: 8, rajas: -2 },
          description: 'Your compassionate giving is pure, regardless of how it\'s used.',
          scriptureReference: 'Dana (giving) purifies the giver, regardless of the receiver\'s actions'
        }
      },
      {
        id: 'refuse_money',
        text: 'Refuse to give money to avoid enabling harmful behavior',
        consequences: {
          karma: -5,
          gunaChanges: { rajas: 3, tamas: 2 },
          description: 'Your practical concern may be wise but lacks compassionate action.',
          scriptureReference: 'Sometimes tough love is necessary, but compassion should guide us'
        }
      },
      {
        id: 'offer_food',
        text: 'Offer to buy them food instead of giving money',
        consequences: {
          karma: 25,
          gunaChanges: { sattva: 12, rajas: 3 },
          description: 'You show compassion while ensuring your help serves their true needs.',
          scriptureReference: 'Annam brahma - Food is divine, feeding the hungry is sacred service'
        }
      }
    ],
    context: {
      yuga: 'kali',
      personalContext: 'Testing compassion and wisdom in charitable giving'
    }
  },
  {
    id: 'workplace_ethics',
    title: 'The Corrupt Boss',
    scenario: 'Your boss asks you to falsify reports to hide company losses. Refusing might cost you your job, which your family depends on. Complying would be dishonest but would protect your livelihood.',
    options: [
      {
        id: 'comply_corruption',
        text: 'Comply to protect your job and family',
        consequences: {
          karma: -35,
          gunaChanges: { tamas: 20, rajas: 5 },
          description: 'Financial security comes at the cost of integrity and creates heavy karmic debt.',
          scriptureReference: 'Dharma lost for the sake of artha (wealth) destroys both'
        }
      },
      {
        id: 'refuse_directly',
        text: 'Refuse directly and face the consequences',
        consequences: {
          karma: 30,
          gunaChanges: { sattva: 15, rajas: 5 },
          description: 'Your integrity remains intact, though you face material hardship.',
          scriptureReference: 'Better to die in one\'s own dharma than to live in another\'s'
        }
      },
      {
        id: 'seek_solution',
        text: 'Seek legal advice and report the corruption while looking for new employment',
        consequences: {
          karma: 40,
          gunaChanges: { sattva: 20, rajas: 8 },
          description: 'You uphold dharma while taking practical steps to protect yourself and others.',
          scriptureReference: 'Courage in upholding truth protects society and brings divine support'
        }
      }
    ],
    context: {
      yuga: 'kali',
      personalContext: 'Maintaining integrity in corrupt environments'
    }
  }
];

export const getDilemmaByYuga = (yuga: string): DharmaDilemma[] => {
  return dharmaDilemmas.filter(dilemma => dilemma.context.yuga === yuga);
};

export const getRandomDilemma = (): DharmaDilemma => {
  return dharmaDilemmas[Math.floor(Math.random() * dharmaDilemmas.length)];
};

export const getDilemmasByContext = (context: string): DharmaDilemma[] => {
  return dharmaDilemmas.filter(dilemma => 
    dilemma.context.personalContext.toLowerCase().includes(context.toLowerCase())
  );
};