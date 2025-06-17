
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface QuestObjective {
  id: string;
  text: string;
  completed: boolean;
  activityType: "walk" | "strength" | "cardio" | "stretch" | "other" | "conversation";
  target?: number;
  progress?: number;
}

export interface Quest {
  id: string;
  title: string;
  location: string;
  description: string;
  status: "available" | "active" | "completed";
  difficulty: "easy" | "medium" | "hard";
  xpReward: number;
  objectives: QuestObjective[];
  rewards: string[];
  background?: string;
  conversations?: { [key: string]: string[] };
  progress: number;
  maxProgress: number;
}

interface QuestContextType {
  quests: Quest[];
  updateQuestObjective: (questId: string, objectiveId: string, updates: Partial<QuestObjective>) => void;
  completeObjective: (questId: string, objectiveId: string) => void;
  getQuestById: (questId: string) => Quest | undefined;
}

const QuestContext = createContext<QuestContextType | undefined>(undefined);

const initialQuests: Quest[] = [
  {
    id: "village-siege",
    title: "Village Under Siege",
    location: "Orc Army",
    description: "Defend the village from an attack by mysterious bandits who appeared from the western mountains. The village elder has called upon you for help.",
    status: "available",
    difficulty: "medium",
    xpReward: 100,
    progress: 0,
    maxProgress: 3,
    background: "bg-amber-900",
    objectives: [
      { id: "train-1", text: "Complete a strength training workout", completed: false, activityType: "strength" },
      { id: "walk-1", text: "Walk 1km to patrol the village", completed: false, activityType: "walk", target: 1000, progress: 0 },
      { id: "fight-1", text: "Defeat the bandit leader (complete workout)", completed: false, activityType: "strength" }
    ],
    rewards: ["Silver Sword", "50 XP", "Village Hero title"]
  },
  {
    id: "forest-disturbance",
    title: "Forest Disturbance",
    location: "Whisperwind Forest",
    description: "Something is causing animals to flee from the forest. The local druids are concerned about an unknown dark presence.",
    status: "available",
    difficulty: "medium",
    xpReward: 250,
    progress: 0,
    maxProgress: 4,
    background: "bg-green-900",
    objectives: [
      { id: "talk-druid", text: "Speak with the forest druid", completed: false, activityType: "conversation" },
      { id: "walk-2", text: "Walk 2km to search the forest", completed: false, activityType: "walk", target: 2000, progress: 0 },
      { id: "find-1", text: "Find evidence of disturbance (10 min cardio)", completed: false, activityType: "cardio" },
      { id: "talk-animals", text: "Communicate with the forest animals", completed: false, activityType: "conversation" }
    ],
    rewards: ["Forest Map", "40 XP", "Nature's Friend trait"],
    conversations: {
      "talk-druid": [
        "Druid: 'Welcome, traveler. The forest speaks of dark magic stirring within its depths.'",
        "You: 'What kind of disturbance are we dealing with?'",
        "Druid: 'The trees whisper of shadows that shouldn't exist. Animals flee in terror. Something unnatural has taken root here.'"
      ],
      "talk-animals": [
        "A frightened rabbit approaches: 'The shadows... they move wrong! They hurt the old oak!'",
        "You: 'Can you show me where?'",
        "The rabbit nods: 'Follow the dead leaves, but be careful. The darkness grows stronger there.'"
      ]
    }
  },
  {
    id: "chapel-mystery",
    title: "The Silent Chapel",
    location: "Chapel",
    description: "The old chapel has been silent for months. No bells ring, no prayers are heard. Investigate what has happened to the holy site.",
    status: "available",
    difficulty: "medium",
    xpReward: 300,
    progress: 0,
    maxProgress: 4,
    background: "bg-purple-900",
    objectives: [
      { id: "approach-chapel", text: "Approach the chapel carefully", completed: false, activityType: "walk", target: 500, progress: 0 },
      { id: "investigate-interior", text: "Investigate the chapel interior (strength training)", completed: false, activityType: "strength" },
      { id: "find-clues", text: "Search for clues (cardio workout)", completed: false, activityType: "cardio" },
      { id: "confront-presence", text: "Confront the dark presence", completed: false, activityType: "other" }
    ],
    rewards: ["Holy Symbol", "60 XP", "Divine Protection blessing"]
  }
];

export const QuestProvider = ({ children }: { children: ReactNode }) => {
  const [quests, setQuests] = useState<Quest[]>(initialQuests);

  const updateQuestObjective = (questId: string, objectiveId: string, updates: Partial<QuestObjective>) => {
    setQuests(prevQuests => 
      prevQuests.map(quest => {
        if (quest.id === questId) {
          const updatedObjectives = quest.objectives.map(obj => 
            obj.id === objectiveId ? { ...obj, ...updates } : obj
          );
          
          const completedObjectives = updatedObjectives.filter(obj => obj.completed).length;
          const newStatus = completedObjectives === 0 ? "available" : 
                           completedObjectives === updatedObjectives.length ? "completed" : "active";
          
          return {
            ...quest,
            objectives: updatedObjectives,
            progress: completedObjectives,
            status: newStatus
          };
        }
        return quest;
      })
    );
  };

  const completeObjective = (questId: string, objectiveId: string) => {
    updateQuestObjective(questId, objectiveId, { completed: true });
  };

  const getQuestById = (questId: string) => {
    return quests.find(quest => quest.id === questId);
  };

  return (
    <QuestContext.Provider value={{
      quests,
      updateQuestObjective,
      completeObjective,
      getQuestById
    }}>
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
