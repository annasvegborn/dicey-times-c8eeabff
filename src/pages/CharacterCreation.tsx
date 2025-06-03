
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCharacter } from "@/hooks/useCharacter";
import CharacterRenderer from "@/components/character/CharacterRenderer";
import CharacterCreationStep1 from "@/components/character/CharacterCreationStep1";
import CharacterCreationStep2 from "@/components/character/CharacterCreationStep2";
import CharacterCreationStep3 from "@/components/character/CharacterCreationStep3";
import CharacterCreationStep4 from "@/components/character/CharacterCreationStep4";
import CharacterCreationStep5 from "@/components/character/CharacterCreationStep5";
import CharacterCreationNavigation from "@/components/character/CharacterCreationNavigation";

const CharacterCreation = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { createCharacter } = useCharacter();
  const [step, setStep] = useState(1);
  const [creating, setCreating] = useState(false);
  const [showDebugGrid, setShowDebugGrid] = useState(false);
  const [character, setCharacter] = useState({
    name: "Adventurer",
    avatar: "human",
    class: "cleric",
    fitnessLevel: "moderate",
    progressionMode: "xp",
    avatarCustomization: {
      race: "human",
      bodyShape: "medium",
      hairStyle: "short",
      skinTone: "light"
    }
  });

  // Define which skin tones are available for each race
  const getAvailableSkinTones = (race: string): string[] => {
    switch (race) {
      case 'human':
        return ['light', 'dark'];
      case 'elf':
        return ['light', 'dark'];
      default:
        return ['light'];
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleChange = (field: string, value: string) => {
    setCharacter(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (field: string, value: string) => {
    setCharacter(prev => ({
      ...prev,
      avatarCustomization: {
        ...prev.avatarCustomization,
        [field]: value
      }
    }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const completeCreation = async () => {
    setCreating(true);
    try {
      await createCharacter({
        name: character.name,
        race: character.avatarCustomization.race,
        class: character.class,
        fitness_level: character.fitnessLevel,
        progression_mode: character.progressionMode,
        avatar_race: character.avatarCustomization.race,
        avatar_body_shape: character.avatarCustomization.bodyShape,
        avatar_hair_style: character.avatarCustomization.hairStyle
      });
      navigate("/character-sheet");
    } catch (error) {
      console.error("Error creating character:", error);
    } finally {
      setCreating(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-parchment-100 flex items-center justify-center">
        <div className="text-parchment-900 text-xl font-serif">Loading...</div>
      </div>
    );
  }

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return (
          <CharacterCreationStep1
            characterName={character.name}
            onNameChange={(name) => handleChange("name", name)}
          />
        );
      case 2:
        return (
          <CharacterCreationStep2
            race={character.avatarCustomization.race}
            skinTone={character.avatarCustomization.skinTone}
            hairStyle={character.avatarCustomization.hairStyle}
            onRaceChange={(race) => handleAvatarChange("race", race)}
            onSkinToneChange={(skinTone) => handleAvatarChange("skinTone", skinTone)}
            onHairStyleChange={(hairStyle) => handleAvatarChange("hairStyle", hairStyle)}
            getAvailableSkinTones={getAvailableSkinTones}
          />
        );
      case 3:
        return (
          <CharacterCreationStep3
            characterClass={character.class}
            onClassChange={(characterClass) => handleChange("class", characterClass)}
          />
        );
      case 4:
        return (
          <CharacterCreationStep4
            fitnessLevel={character.fitnessLevel}
            onFitnessLevelChange={(fitnessLevel) => handleChange("fitnessLevel", fitnessLevel)}
          />
        );
      case 5:
        return (
          <CharacterCreationStep5
            progressionMode={character.progressionMode}
            onProgressionModeChange={(progressionMode) => handleChange("progressionMode", progressionMode)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-parchment-100 p-4">
      <div className="max-w-2xl mx-auto bg-parchment-50 rounded-lg shadow-lg p-6 border-2 border-parchment-500">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-parchment-900 font-serif">Create Your Character</h1>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs text-parchment-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showDebugGrid}
                onChange={(e) => setShowDebugGrid(e.target.checked)}
                className="w-3 h-3"
              />
              Debug Grid
            </label>
            <div className="text-sm text-parchment-600">Step {step}/5</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column - Character Preview */}
          <div className="flex justify-center items-start">
            <CharacterRenderer
              race={character.avatarCustomization.race}
              bodyShape={character.avatarCustomization.bodyShape}
              hairStyle={character.avatarCustomization.hairStyle}
              characterClass={character.class}
              skinTone={character.avatarCustomization.skinTone as 'light' | 'dark'}
              size={256}
              showDebugGrid={showDebugGrid}
            />
          </div>

          {/* Right column - Character Options */}
          <div>
            {renderCurrentStep()}
          </div>
        </div>

        <CharacterCreationNavigation
          step={step}
          creating={creating}
          onPrevStep={prevStep}
          onNextStep={nextStep}
          onCancel={() => navigate("/")}
          onCompleteCreation={completeCreation}
        />
      </div>
    </div>
  );
};

export default CharacterCreation;
