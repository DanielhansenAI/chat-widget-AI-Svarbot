import React, { useState } from 'react';
import { ChatButton } from './ChatButton';
import { ChatWindow } from './ChatWindow';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <ChatButton onClick={() => setIsOpen(!isOpen)} isOpen={isOpen} />
    </>
  );
};