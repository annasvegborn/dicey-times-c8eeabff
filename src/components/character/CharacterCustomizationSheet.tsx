
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import CharacterRenderer from './CharacterRenderer';

interface CharacterCustomizationSheetProps {
  currentAppearance: {
    race: string;
    bodyShape: string;
    hairStyle: string;
    skinTone: string;
  };
  characterClass: string;
  onSave: (appearance: {
    race: string;
    bodyShape: string;
    hairStyle: string;
    skinTone: string;
  }) => void;
  onCancel: () => void;
}

const CharacterCustomizationSheet = ({
  currentAppearance,
  characterClass,
  onSave,
  onCancel
}: CharacterCustomizationSheetProps) => {
  const [appearance, setAppearance] = useState(currentAppearance);

  const handleChange = (field: string, value: string) => {
    console.log(`Updating ${field} to ${value}`);
    setAppearance(prev => {
      const updated = {
        ...prev,
        [field]: value
      };
      console.log('Updated appearance state:', updated);
      return updated;
    });
  };

  const handleSave = () => {
    console.log('Saving appearance:', appearance);
    onSave(appearance);
  };

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

  return (
    <div className="flex flex-col h-full p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        {/* Left column - Character Preview */}
        <div className="flex justify-center items-start">
          <CharacterRenderer
            race={appearance.race}
            bodyShape={appearance.bodyShape}
            hairStyle={appearance.hairStyle}
            characterClass={characterClass}
            skinTone={appearance.skinTone as 'light' | 'dark'}
            size={200}
          />
        </div>

        {/* Right column - Customization Options */}
        <div className="space-y-6 overflow-y-auto">
          <h3 className="text-lg font-medium text-amber-700">Race & Appearance</h3>
          
          {/* Race Selection */}
          <div>
            <h4 className="text-md font-medium text-amber-600 mb-3">Race</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'human', name: 'Human', emoji: '👤' },
                { id: 'elf', name: 'Elf', emoji: '🧝' }
              ].map((race) => (
                <Button
                  key={race.id}
                  variant={appearance.race === race.id ? "default" : "outline"}
                  className="flex items-center gap-2 h-12"
                  onClick={() => handleChange('race', race.id)}
                >
                  <span className="text-lg">{race.emoji}</span>
                  {race.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Skin Tone Selection */}
          <div>
            <h4 className="text-md font-medium text-amber-600 mb-3">Skin Tone</h4>
            <div className="grid grid-cols-2 gap-2">
              {getAvailableSkinTones(appearance.race).map((tone) => (
                <Button
                  key={tone}
                  variant={appearance.skinTone === tone ? "default" : "outline"}
                  className="h-10 capitalize"
                  onClick={() => handleChange('skinTone', tone)}
                >
                  {tone}
                </Button>
              ))}
            </div>
          </div>

          {/* Hair Style Selection */}
          <div>
            <h4 className="text-md font-medium text-amber-600 mb-3">Hair Style</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'short', name: 'Short', emoji: '✂️' },
                { id: 'long', name: 'Long', emoji: '🦱' }
              ].map((hair) => (
                <Button
                  key={hair.id}
                  variant={appearance.hairStyle === hair.id ? "default" : "outline"}
                  className="flex items-center gap-2 h-12"
                  onClick={() => handleChange('hairStyle', hair.id)}
                >
                  <span className="text-lg">{hair.emoji}</span>
                  {hair.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Body Shape Selection */}
          <div>
            <h4 className="text-md font-medium text-amber-600 mb-3">Body Shape</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'slim', name: 'Slim', emoji: '🏃' },
                { id: 'medium', name: 'Medium', emoji: '🚶' },
                { id: 'muscular', name: 'Muscular', emoji: '💪' },
                { id: 'heavy', name: 'Heavy', emoji: '🧍' }
              ].map((shape) => (
                <Button
                  key={shape.id}
                  variant={appearance.bodyShape === shape.id ? "default" : "outline"}
                  className="flex items-center gap-2 h-12"
                  onClick={() => handleChange('bodyShape', shape.id)}
                >
                  <span className="text-lg">{shape.emoji}</span>
                  {shape.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4 border-t">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button onClick={handleSave} className="flex-1 bg-amber-600 hover:bg-amber-700">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default CharacterCustomizationSheet;
