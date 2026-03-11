import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Character {
  id: string;
  name: string;
  level: number;
  race: string;
  class: string;
  xp: number;
  xp_to_next_level: number;
  fitness_level: string;
  progression_mode: string;
  avatar_race: string;
  avatar_body_shape: string;
  avatar_hair_style: string;
  avatar_skin_tone: string;
}

export interface CharacterStats {
  strength_value: number;
  strength_progress: number;
  dexterity_value: number;
  dexterity_progress: number;
  constitution_value: number;
  constitution_progress: number;
  intelligence_value: number;
  intelligence_progress: number;
  wisdom_value: number;
  wisdom_progress: number;
  charisma_value: number;
  charisma_progress: number;
}

const STORAGE_KEY = 'dicey-times-character';
const STATS_KEY = 'dicey-times-stats';
const TRAITS_KEY = 'dicey-times-traits';
const FEATURES_KEY = 'dicey-times-features';

export const useCharacter = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [character, setCharacter] = useState<Character | null>(null);
  const [stats, setStats] = useState<CharacterStats | null>(null);
  const [traits, setTraits] = useState<string[]>([]);
  const [features, setFeatures] = useState<Array<{name: string, description: string}>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCharacter();
  }, [user]);

  const loadCharacter = async () => {
    try {
      setLoading(true);
      const savedChar = localStorage.getItem(STORAGE_KEY);
      const savedStats = localStorage.getItem(STATS_KEY);
      const savedTraits = localStorage.getItem(TRAITS_KEY);
      const savedFeatures = localStorage.getItem(FEATURES_KEY);

      if (savedChar) {
        const parsed = JSON.parse(savedChar);
        setCharacter({ ...parsed, avatar_skin_tone: parsed.avatar_skin_tone || 'light' });
      }
      if (savedStats) setStats(JSON.parse(savedStats));
      if (savedTraits) setTraits(JSON.parse(savedTraits));
      if (savedFeatures) setFeatures(JSON.parse(savedFeatures));
    } catch (error: any) {
      console.error('Error loading character:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCharacter = async (characterData: Partial<Character>) => {
    try {
      const newCharacter: Character = {
        id: 'char-' + Date.now(),
        name: characterData.name || 'Adventurer',
        level: 1,
        race: characterData.race || 'human',
        class: characterData.class || 'warrior',
        xp: 0,
        xp_to_next_level: 100,
        fitness_level: characterData.fitness_level || 'moderate',
        progression_mode: characterData.progression_mode || 'xp',
        avatar_race: characterData.avatar_race || characterData.race || 'human',
        avatar_body_shape: characterData.avatar_body_shape || 'medium',
        avatar_hair_style: characterData.avatar_hair_style || 'short',
        avatar_skin_tone: characterData.avatar_skin_tone || 'light',
      };

      const newStats: CharacterStats = {
        strength_value: characterData.class === 'warrior' ? 14 : 10,
        dexterity_value: characterData.class === 'rogue' ? 14 : 10,
        constitution_value: characterData.class === 'warrior' ? 12 : 10,
        intelligence_value: characterData.class === 'mage' ? 14 : 8,
        wisdom_value: characterData.class === 'cleric' ? 14 : 10,
        charisma_value: 9,
        strength_progress: characterData.class === 'warrior' ? 30 : 0,
        dexterity_progress: characterData.class === 'rogue' ? 30 : 0,
        constitution_progress: 15,
        intelligence_progress: characterData.class === 'mage' ? 30 : 0,
        wisdom_progress: characterData.class === 'cleric' ? 30 : 0,
        charisma_progress: 5,
      };

      const defaultTraits = ['Determined', 'Cautious'];
      const defaultFeatures = [
        { name: 'Basic Attack', description: 'A simple attack using your main weapon. Deals 1d6 + STR modifier damage.' },
        { name: 'Shield Block', description: 'Use your shield to block incoming attacks. Reduces damage by 1d4 + CON modifier.' }
      ];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCharacter));
      localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
      localStorage.setItem(TRAITS_KEY, JSON.stringify(defaultTraits));
      localStorage.setItem(FEATURES_KEY, JSON.stringify(defaultFeatures));

      setCharacter(newCharacter);
      setStats(newStats);
      setTraits(defaultTraits);
      setFeatures(defaultFeatures);

      toast({ title: "Character created!", description: "Your adventure begins now." });
      return newCharacter;
    } catch (error: any) {
      toast({ title: "Error creating character", description: error.message, variant: "destructive" });
      throw error;
    }
  };

  const updateCharacterAppearance = async (characterId: string, appearance: {
    race: string;
    bodyShape: string;
    hairStyle: string;
    skinTone: string;
  }) => {
    try {
      const updated = character ? {
        ...character,
        avatar_race: appearance.race,
        avatar_body_shape: appearance.bodyShape,
        avatar_hair_style: appearance.hairStyle,
        avatar_skin_tone: appearance.skinTone
      } : null;

      if (updated) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setCharacter(updated);
      }

      toast({ title: "Appearance updated!", description: "Your character's look has been changed." });
    } catch (error: any) {
      toast({ title: "Error updating appearance", description: error.message, variant: "destructive" });
      throw error;
    }
  };

  return {
    character,
    stats,
    traits,
    features,
    loading,
    createCharacter,
    loadCharacter,
    updateCharacterAppearance
  };
};
