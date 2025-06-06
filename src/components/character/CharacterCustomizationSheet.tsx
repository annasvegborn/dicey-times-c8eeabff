
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
    <div className="flex flex-col h-full bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        {/* Left column - Character Preview */}
        <div className="flex justify-center items-start p-4">
          <div className="bg-white rounded-3xl p-6 shadow-lg">
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
              <h3 className="text-xl font-bold text-gray-700 font-serif">Race & Appearance</h3>
              
              {/* Race Selection */}
              <div>
                <h4 className="text-lg font-semibold text-gray-600 mb-3 font-serif">Race</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'human', name: 'Human', emoji: '👤' },
                    { id: 'elf', name: 'Elf', emoji: '🧝' }
                  ].map((race) => (
                    <Button
                      key={race.id}
                      variant={appearance.race === race.id ? "default" : "outline"}
                      className={`flex items-center gap-2 h-12 font-serif text-base rounded-2xl shadow-md hover:shadow-lg transition-shadow ${
                        appearance.race === race.id 
                          ? "bg-slate-600 text-white" 
                          : "bg-white text-gray-700 hover:bg-gray-100"
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
                <h4 className="text-lg font-semibold text-gray-600 mb-3 font-serif">Skin Tone</h4>
                <div className="grid grid-cols-2 gap-2">
                  {getAvailableSkinTones(appearance.race).map((tone) => (
                    <Button
                      key={tone}
                      variant={appearance.skinTone === tone ? "default" : "outline"}
                      className={`h-10 capitalize font-serif rounded-2xl shadow-md hover:shadow-lg transition-shadow ${
                        appearance.skinTone === tone 
                          ? "bg-slate-600 text-white" 
                          : "bg-white text-gray-700 hover:bg-gray-100"
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
                <h4 className="text-lg font-semibold text-gray-600 mb-3 font-serif">Hair Style</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'short', name: 'Short', emoji: '✂️' },
                    { id: 'long', name: 'Long', emoji: '🦱' }
                  ].map((hair) => (
                    <Button
                      key={hair.id}
                      variant={appearance.hairStyle === hair.id ? "default" : "outline"}
                      className={`flex items-center gap-2 h-12 font-serif text-base rounded-2xl shadow-md hover:shadow-lg transition-shadow ${
                        appearance.hairStyle === hair.id 
                          ? "bg-slate-600 text-white" 
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => handleChange('hairStyle', hair.id)}
                    >
                      <span className="text-lg">{hair.emoji}</span>
                      {hair.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 p-4 bg-gray-50 shadow-lg">
        <Button 
          variant="outline" 
          onClick={onCancel} 
          className="flex-1 font-serif text-lg py-3 rounded-2xl text-gray-700 hover:bg-gray-100 shadow-md hover:shadow-lg transition-shadow"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-serif text-lg py-3 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default CharacterCustomizationSheet;
