import React, { useState } from 'react';
import { ChatButton } from './ChatButton';
import { ChatWindow } from './ChatWindow';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleMinimize = () => {
    setIsMinimized(true);
    setIsOpen(false);
  };

  const handleToggle = () => {
    if (isMinimized) {
      setIsMinimized(false);
      setIsOpen(true);
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <>
      <ChatWindow 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        onMinimize={handleMinimize}
      />
      <ChatButton onClick={handleToggle} isOpen={isOpen} />
    </>
  );
};