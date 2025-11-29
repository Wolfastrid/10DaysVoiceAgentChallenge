
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface GameContextProps {
  messages: { role: string; content: string }[];
  sendAction: (action: string) => void;
  loading: boolean;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initial session start
    fetch('/api/start_session')
      .then(res => res.json())
      .then(data => setMessages([{ role: 'gm', content: data.opening }]));
  }, []);

  const sendAction = async (action: string) => {
    setLoading(true);
    const res = await fetch('/api/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    const data = await res.json();
    setMessages(prev => [...prev, { role: 'player', content: action }, { role: 'gm', content: data.response }]);
    setLoading(false);
  };

  return (
    <GameContext.Provider value={{ messages, sendAction, loading }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameAgent = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGameAgent must be used inside GameProvider');
  return context;
};
