
import React, { createContext, useContext, ReactNode } from 'react';
import { QuestContextType } from '@/types/quest';
import { useAuth } from '@/contexts/AuthContext';
import { useQuestData } from '@/hooks/useQuestData';

const QuestContext = createContext<QuestContextType | undefined>(undefined);

export const QuestProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const questData = useQuestData(user?.id);

  return (
    <QuestContext.Provider value={questData}>
      {children}
    </QuestContext.Provider>
  );
};

export const useQuests = () => {
  const context = useContext(QuestContext);
  if (context === undefined) {
    throw new Error('useQuests must be used within a QuestProvider');
  }
  return context;
};
