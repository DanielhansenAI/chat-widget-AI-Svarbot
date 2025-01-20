import React from 'react';
import { motion } from 'framer-motion';
import { IoMdChatboxes } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';

interface ChatButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export const ChatButton: React.FC<ChatButtonProps> = ({ onClick, isOpen }) => {
  return (
    <motion.button
      className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      aria-label={isOpen ? "Close chat" : "Open chat"}
    >
      {isOpen ? (
        <IoClose className="w-6 h-6" />
      ) : (
        <IoMdChatboxes className="w-6 h-6" />
      )}
    </motion.button>
  );
};