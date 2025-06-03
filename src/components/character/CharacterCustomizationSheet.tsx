
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    <div className="flex flex-col h-full bg-amber-50">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        {/* Left column - Character Preview */}
        <div className="flex justify-center items-start p-4">
          <div className="bg-amber-100 rounded-3xl border-4 border-amber-700 p-6 shadow-xl">
            <CharacterRenderer
              race={appearance.race}
              bodyShape={appearance.bodyShape}
              hairStyle={appearance.hairStyle}
              characterClass={characterClass}
              skinTone={appearance.skinTone as 'light' | 'dark'}
              size={200}
            />
          </div>
        </div>

        {/* Right column - Customization Options */}
        <div className="flex flex-col min-h-0">
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-6 pb-4">
              <h3 className="text-xl font-bold text-amber-800 font-serif">Race & Appearance</h3>
              
              {/* Race Selection */}
              <div>
                <h4 className="text-lg font-semibold text-amber-700 mb-3 font-serif">Race</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'human', name: 'Human', emoji: '👤' },
                    { id: 'elf', name: 'Elf', emoji: '🧝' }
                  ].map((race) => (
                    <Button
                      key={race.id}
                      variant={appearance.race === race.id ? "default" : "outline"}
                      className={`flex items-center gap-2 h-12 font-serif text-base rounded-2xl border-2 ${
                        appearance.race === race.id 
                          ? "bg-amber-700 text-amber-100 border-amber-900" 
                          : "bg-amber-100 text-amber-800 border-amber-600 hover:bg-amber-200"
                      }`}
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
                <h4 className="text-lg font-semibold text-amber-700 mb-3 font-serif">Skin Tone</h4>
                <div className="grid grid-cols-2 gap-2">
                  {getAvailableSkinTones(appearance.race).map((tone) => (
                    <Button
                      key={tone}
                      variant={appearance.skinTone === tone ? "default" : "outline"}
                      className={`h-10 capitalize font-serif rounded-2xl border-2 ${
                        appearance.skinTone === tone 
                          ? "bg-amber-700 text-amber-100 border-amber-900" 
                          : "bg-amber-100 text-amber-800 border-amber-600 hover:bg-amber-200"
                      }`}
                      onClick={() => handleChange('skinTone', tone)}
                    >
                      {tone}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Hair Style Selection */}
              <div>
                <h4 className="text-lg font-semibold text-amber-700 mb-3 font-serif">Hair Style</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'short', name: 'Short', emoji: '✂️' },
                    { id: 'long', name: 'Long', emoji: '🦱' }
                  ].map((hair) => (
                    <Button
                      key={hair.id}
                      variant={appearance.hairStyle === hair.id ? "default" : "outline"}
                      className={`flex items-center gap-2 h-12 font-serif text-base rounded-2xl border-2 ${
                        appearance.hairStyle === hair.id 
                          ? "bg-amber-700 text-amber-100 border-amber-900" 
                          : "bg-amber-100 text-amber-800 border-amber-600 hover:bg-amber-200"
                      }`}
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
                <h4 className="text-lg font-semibold text-amber-700 mb-3 font-serif">Body Shape</h4>
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
                      className={`flex items-center gap-2 h-12 font-serif text-base rounded-2xl border-2 ${
                        appearance.bodyShape === shape.id 
                          ? "bg-amber-700 text-amber-100 border-amber-900" 
                          : "bg-amber-100 text-amber-800 border-amber-600 hover:bg-amber-200"
                      }`}
                      onClick={() => handleChange('bodyShape', shape.id)}
                    >
                      <span className="text-lg">{shape.emoji}</span>
                      {shape.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 p-4 border-t-4 border-amber-700 bg-amber-100">
        <Button 
          variant="outline" 
          onClick={onCancel} 
          className="flex-1 font-serif text-lg py-3 rounded-2xl border-2 border-amber-600 text-amber-800 hover:bg-amber-200"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          className="flex-1 bg-amber-700 hover:bg-amber-800 text-amber-100 font-serif text-lg py-3 rounded-2xl border-2 border-amber-900"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default CharacterCustomizationSheet;
