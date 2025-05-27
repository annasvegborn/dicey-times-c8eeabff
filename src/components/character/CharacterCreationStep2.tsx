
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import SkinToneSelector from "@/components/character/SkinToneSelector";

interface CharacterCreationStep2Props {
  race: string;
  skinTone: string;
  hairStyle: string;
  onRaceChange: (race: string) => void;
  onSkinToneChange: (skinTone: string) => void;
  onHairStyleChange: (hairStyle: string) => void;
  getAvailableSkinTones: (race: string) => string[];
}

const CharacterCreationStep2 = ({ 
  race, 
  skinTone, 
  hairStyle, 
  onRaceChange, 
  onSkinToneChange, 
  onHairStyleChange,
  getAvailableSkinTones 
}: CharacterCreationStep2Props) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium text-amber-700">Choose Your Race</h2>
      
      <RadioGroup 
        value={race} 
        onValueChange={onRaceChange}
        className="grid grid-cols-2 gap-3"
      >
        <div>
          <RadioGroupItem value="human" id="human" className="peer sr-only" />
          <Label 
            htmlFor="human" 
            className="flex flex-col items-center justify-center border-2 rounded-lg p-3 cursor-pointer peer-data-[state=checked]:border-amber-600 peer-data-[state=checked]:bg-amber-50 hover:bg-amber-25"
          >
            <span className="text-2xl mb-1">👤</span>
            <span className="text-sm font-medium">Human</span>
          </Label>
        </div>
        
        <div>
          <RadioGroupItem value="elf" id="elf" className="peer sr-only" />
          <Label 
            htmlFor="elf" 
            className="flex flex-col items-center justify-center border-2 rounded-lg p-3 cursor-pointer peer-data-[state=checked]:border-amber-600 peer-data-[state=checked]:bg-amber-50 hover:bg-amber-25"
          >
            <span className="text-2xl mb-1">🧝</span>
            <span className="text-sm font-medium">Elf</span>
          </Label>
        </div>
      </RadioGroup>

      <SkinToneSelector
        value={skinTone}
        onChange={onSkinToneChange}
        availableTones={getAvailableSkinTones(race)}
      />

      <div>
        <h3 className="text-lg font-medium text-amber-700 mb-4">Hair Style</h3>
        <RadioGroup 
          value={hairStyle} 
          onValueChange={onHairStyleChange}
          className="grid grid-cols-2 gap-3"
        >
          <div>
            <RadioGroupItem value="short" id="hair-short" className="peer sr-only" />
            <Label 
              htmlFor="hair-short" 
              className="flex flex-col items-center justify-center border-2 rounded-lg p-3 cursor-pointer peer-data-[state=checked]:border-amber-600 peer-data-[state=checked]:bg-amber-50 hover:bg-amber-25"
            >
              <span className="text-xl mb-1">✂️</span>
              <span className="text-sm font-medium">Short</span>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem value="long" id="hair-long" className="peer sr-only" />
            <Label 
              htmlFor="hair-long" 
              className="flex flex-col items-center justify-center border-2 rounded-lg p-3 cursor-pointer peer-data-[state=checked]:border-amber-600 peer-data-[state=checked]:bg-amber-50 hover:bg-amber-25"
            >
              <span className="text-xl mb-1">🦱</span>
              <span className="text-sm font-medium">Long</span>
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default CharacterCreationStep2;
