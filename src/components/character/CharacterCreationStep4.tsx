
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface CharacterCreationStep4Props {
  fitnessLevel: string;
  onFitnessLevelChange: (fitnessLevel: string) => void;
}

const CharacterCreationStep4 = ({ fitnessLevel, onFitnessLevelChange }: CharacterCreationStep4Props) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium text-amber-700">Your Fitness Level</h2>
      
      <RadioGroup 
        value={fitnessLevel} 
        onValueChange={onFitnessLevelChange}
        className="space-y-3"
      >
        <div>
          <RadioGroupItem value="beginner" id="beginner" className="peer sr-only" />
          <Label 
            htmlFor="beginner" 
            className="flex justify-between items-center border-2 rounded-lg p-4 cursor-pointer peer-data-[state=checked]:border-amber-600 peer-data-[state=checked]:bg-amber-50"
          >
            <div>
              <div className="font-medium">Beginner</div>
              <div className="text-sm text-gray-500">New to fitness or returning after a break</div>
            </div>
            <span className="text-xl">🌱</span>
          </Label>
        </div>
        
        <div>
          <RadioGroupItem value="moderate" id="moderate" className="peer sr-only" />
          <Label 
            htmlFor="moderate" 
            className="flex justify-between items-center border-2 rounded-lg p-4 cursor-pointer peer-data-[state=checked]:border-amber-600 peer-data-[state=checked]:bg-amber-50"
          >
            <div>
              <div className="font-medium">Moderate</div>
              <div className="text-sm text-gray-500">Exercise 1-3 times per week</div>
            </div>
            <span className="text-xl">⚡</span>
          </Label>
        </div>
        
        <div>
          <RadioGroupItem value="advanced" id="advanced" className="peer sr-only" />
          <Label 
            htmlFor="advanced" 
            className="flex justify-between items-center border-2 rounded-lg p-4 cursor-pointer peer-data-[state=checked]:border-amber-600 peer-data-[state=checked]:bg-amber-50"
          >
            <div>
              <div className="font-medium">Advanced</div>
              <div className="text-sm text-gray-500">Exercise 4+ times per week</div>
            </div>
            <span className="text-xl">🔥</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default CharacterCreationStep4;
