
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface CharacterCreationStep3Props {
  characterClass: string;
  onClassChange: (characterClass: string) => void;
}

const CharacterCreationStep3 = ({ characterClass, onClassChange }: CharacterCreationStep3Props) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium text-amber-700">Choose Your Class</h2>
      
      <RadioGroup 
        value={characterClass} 
        onValueChange={onClassChange}
        className="grid grid-cols-2 gap-4"
      >
        <div>
          <RadioGroupItem value="cleric" id="cleric" className="peer sr-only" />
          <Label 
            htmlFor="cleric" 
            className="flex flex-col items-center justify-center border-2 rounded-lg p-4 cursor-pointer peer-data-[state=checked]:border-amber-600 peer-data-[state=checked]:bg-amber-50"
          >
            <span className="text-4xl">🛡️</span>
            <span className="mt-2">Cleric</span>
            <span className="text-xs text-gray-500">Wisdom focus</span>
          </Label>
        </div>
        
        <div>
          <RadioGroupItem value="wizard" id="wizard" className="peer sr-only" />
          <Label 
            htmlFor="wizard" 
            className="flex flex-col items-center justify-center border-2 rounded-lg p-4 cursor-pointer peer-data-[state=checked]:border-amber-600 peer-data-[state=checked]:bg-amber-50"
          >
            <span className="text-4xl">🧙</span>
            <span className="mt-2">Wizard</span>
            <span className="text-xs text-gray-500">Intelligence focus</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default CharacterCreationStep3;
