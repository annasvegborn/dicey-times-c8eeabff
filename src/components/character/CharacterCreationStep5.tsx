
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface CharacterCreationStep5Props {
  progressionMode: string;
  onProgressionModeChange: (progressionMode: string) => void;
}

const CharacterCreationStep5 = ({ progressionMode, onProgressionModeChange }: CharacterCreationStep5Props) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium text-amber-700">Choose Progression Mode</h2>
      
      <RadioGroup 
        value={progressionMode} 
        onValueChange={onProgressionModeChange}
        className="space-y-3"
      >
        <div>
          <RadioGroupItem value="xp" id="xp" className="peer sr-only" />
          <Label 
            htmlFor="xp" 
            className="flex justify-between items-center border-2 rounded-lg p-4 cursor-pointer peer-data-[state=checked]:border-amber-600 peer-data-[state=checked]:bg-amber-50"
          >
            <div>
              <div className="font-medium">XP-Based</div>
              <div className="text-sm text-gray-500">Progress by completing workouts</div>
            </div>
            <span className="text-xl">⭐</span>
          </Label>
        </div>
        
        <div>
          <RadioGroupItem value="stat" id="stat" className="peer sr-only" />
          <Label 
            htmlFor="stat" 
            className="flex justify-between items-center border-2 rounded-lg p-4 cursor-pointer peer-data-[state=checked]:border-amber-600 peer-data-[state=checked]:bg-amber-50"
          >
            <div>
              <div className="font-medium">Stat-Based</div>
              <div className="text-sm text-gray-500">Progress by real fitness achievements</div>
            </div>
            <span className="text-xl">📊</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default CharacterCreationStep5;
