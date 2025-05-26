
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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

export const useCharacter = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [character, setCharacter] = useState<Character | null>(null);
  const [stats, setStats] = useState<CharacterStats | null>(null);
  const [traits, setTraits] = useState<string[]>([]);
  const [features, setFeatures] = useState<Array<{name: string, description: string}>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadCharacter();
    }
  }, [user]);

  const loadCharacter = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Load character
      const { data: characterData, error: characterError } = await supabase
        .from('characters')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (characterError && characterError.code !== 'PGRST116') {
        throw characterError;
      }

      if (characterData) {
        setCharacter(characterData);

        // Load stats
        const { data: statsData, error: statsError } = await supabase
          .from('character_stats')
          .select('*')
          .eq('character_id', characterData.id)
          .single();

        if (statsError && statsError.code !== 'PGRST116') {
          throw statsError;
        }

        if (statsData) {
          setStats(statsData);
        }

        // Load traits
        const { data: traitsData, error: traitsError } = await supabase
          .from('character_traits')
          .select('trait_name')
          .eq('character_id', characterData.id);

        if (traitsError) throw traitsError;

        setTraits(traitsData?.map(t => t.trait_name) || []);

        // Load features
        const { data: featuresData, error: featuresError } = await supabase
          .from('character_features')
          .select('feature_name, feature_description')
          .eq('character_id', characterData.id);

        if (featuresError) throw featuresError;

        setFeatures(featuresData?.map(f => ({ name: f.feature_name, description: f.feature_description || '' })) || []);
      }
    } catch (error: any) {
      toast({
        title: "Error loading character",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCharacter = async (characterData: Partial<Character>) => {
    if (!user) return;

    try {
      // Create character
      const { data: newCharacter, error: characterError } = await supabase
        .from('characters')
        .insert({
          user_id: user.id,
          name: characterData.name || 'Adventurer',
          race: characterData.race || 'human',
          class: characterData.class || 'warrior',
          fitness_level: characterData.fitness_level || 'moderate',
          progression_mode: characterData.progression_mode || 'xp',
          avatar_race: characterData.avatar_race || characterData.race || 'human',
          avatar_body_shape: characterData.avatar_body_shape || 'medium',
          avatar_hair_style: characterData.avatar_hair_style || 'short'
        })
        .select()
        .single();

      if (characterError) throw characterError;

      // Create default stats
      const { error: statsError } = await supabase
        .from('character_stats')
        .insert({
          character_id: newCharacter.id,
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
          charisma_progress: 5
        });

      if (statsError) throw statsError;

      // Create default traits
      const defaultTraits = ['Determined', 'Cautious'];
      for (const trait of defaultTraits) {
        await supabase
          .from('character_traits')
          .insert({
            character_id: newCharacter.id,
            trait_name: trait
          });
      }

      // Create default features
      const defaultFeatures = [
        { name: 'Basic Attack', description: 'A simple attack using your main weapon. Deals 1d6 + STR modifier damage.' },
        { name: 'Shield Block', description: 'Use your shield to block incoming attacks. Reduces damage by 1d4 + CON modifier.' }
      ];

      for (const feature of defaultFeatures) {
        await supabase
          .from('character_features')
          .insert({
            character_id: newCharacter.id,
            feature_name: feature.name,
            feature_description: feature.description
          });
      }

      await loadCharacter();
      
      toast({
        title: "Character created!",
        description: "Your adventure begins now.",
      });

      return newCharacter;
    } catch (error: any) {
      toast({
        title: "Error creating character",
        description: error.message,
        variant: "destructive",
      });
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
    loadCharacter
  };
};
