import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMdClose, IoMdSend } from 'react-icons/io';
import { FaRobot } from 'react-icons/fa';
import { BsPersonCircle } from 'react-icons/bs';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! I'm here to help you with any questions you might have.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 right-4 w-96 bg-white rounded-lg shadow-xl flex flex-col max-h-[600px]"
        >
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center bg-blue-600 text-white rounded-t-lg">
            <div className="flex items-center gap-2">
              <FaRobot className="w-6 h-6" />
              <div>
                <h2 className="font-semibold">AI Support</h2>
                <p className="text-sm text-blue-100">Always here to help</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-blue-700"
              aria-label="Close chat"
            >
              <IoMdClose className="w-6 h-6" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                } items-end gap-2`}
              >
                {message.sender === 'ai' && (
                  <FaRobot className="w-6 h-6 text-blue-600" />
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}
                >
                  {message.text}
                </div>
                {message.sender === 'user' && (
                  <BsPersonCircle className="w-6 h-6 text-blue-600" />
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2">
                <FaRobot className="w-6 h-6 text-blue-600" />
                <div className="bg-gray-100 p-3 rounded-lg rounded-tl-none">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-4 border-t bg-gray-50">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!input.trim()}
              >
                <IoMdSend className="w-6 h-6" />
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};