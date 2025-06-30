import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { useAI } from '../../hooks/useAI';
import { MessageCircle, Send, Bot, User, Loader, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  scriptureReferences?: string[];
  guidance?: string[];
}

const SpiritualGuide: React.FC = () => {
  const { avatar } = useGameStore();
  const { getSpiritualGuidance, getRemainingRequests, isLoading, error } = useAI();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      type: 'ai',
      content: 'Namaste! I am your spiritual guide, here to offer wisdom from the sacred texts and help you on your dharmic journey. What spiritual guidance do you seek today?',
      timestamp: new Date(),
      guidance: ['Ask about dharma and righteous living', 'Seek guidance on meditation practices', 'Inquire about karma and its effects', 'Request interpretation of life situations']
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    try {
      const response = await getSpiritualGuidance(inputMessage, avatar);
      
      if (response) {
        const aiMessage: Message = {
          id: `ai_${Date.now()}`,
          type: 'ai',
          content: response.message,
          timestamp: new Date(),
          scriptureReferences: response.scriptureReferences.map(ref => `${ref.source}: "${ref.translation}"`),
          guidance: response.guidance
        };
        
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (err) {
      console.error('Error getting spiritual guidance:', err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "How can I overcome anger and find peace?",
    "What does the Gita say about duty vs desire?",
    "How do I practice detachment in daily life?",
    "What is the meaning of dharma?"
  ];

  const remainingRequests = getRemainingRequests();

  return (
    <>
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-saffron-500 to-saffron-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all z-40"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? '×' : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-xl shadow-2xl border border-saffron-200 z-40 flex flex-col"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
          >
            <div className="bg-gradient-to-r from-saffron-500 to-saffron-600 text-white p-4 rounded-t-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Spiritual Guide</h3>
                  <p className="text-xs opacity-90">
                    {remainingRequests > 0 ? `${remainingRequests} AI requests remaining` : 'Local wisdom mode'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className={`max-w-[80%] ${
                    message.type === 'user' 
                      ? 'bg-saffron-500 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  } rounded-lg p-3`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    
                    {message.guidance && message.guidance.length > 0 && (
                      <div className="mt-2">
                        {message.guidance.map((point, index) => (
                          <div key={index} className="flex items-start space-x-1 mt-1">
                            <Sparkles className="w-3 h-3 mt-0.5 text-saffron-500" />
                            <p className="text-xs text-gray-600">{point}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 flex items-center space-x-2">
                    <Loader className="w-4 h-4 animate-spin text-saffron-600" />
                    <span className="text-sm text-gray-600">Seeking wisdom...</span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {messages.length === 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
                <div className="flex flex-wrap gap-1">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInputMessage(question)}
                      className="text-xs bg-saffron-50 text-saffron-700 px-2 py-1 rounded-full hover:bg-saffron-100 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask for spiritual guidance..."
                  className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                  rows={2}
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="px-3 py-2 bg-saffron-500 text-white rounded-lg hover:bg-saffron-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              
              {error && (
                <p className="text-xs text-red-600 mt-2">{error}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SpiritualGuide;