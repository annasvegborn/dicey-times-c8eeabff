
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

export interface QuestContextType {
  quests: Quest[];
  loading: boolean;
  updateQuestObjective: (questId: string, objectiveId: string, updates: Partial<QuestObjective>) => void;
  completeObjective: (questId: string, objectiveId: string) => void;
  getQuestById: (questId: string) => Quest | undefined;
}
