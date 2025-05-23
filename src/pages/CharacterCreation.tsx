
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

const CharacterCreation = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [character, setCharacter] = useState({
    avatar: "human",
    class: "warrior",
    fitnessLevel: "moderate",
    progressionMode: "xp",
  });

  const handleChange = (field: string, value: string) => {
    setCharacter(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const completeCreation = () => {
    // In a real app, we would store this character data
    // For now, just navigate to the character sheet
    navigate("/character-sheet");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800 p-4">
      <div className="max-w-md mx-auto bg-stone-100 rounded-lg shadow-lg p-6 border-2 border-amber-700">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-amber-800 font-serif">Create Your Character</h1>
          <div className="text-sm text-gray-500">Step {step}/4</div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-medium text-amber-700">Choose Your Avatar</h2>
            
            <RadioGroup 
              value={character.avatar} 
              onValueChange={(value) => handleChange("avatar", value)}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem value="human" id="human" className="peer sr-only" />
                <Label 
                  htmlFor="human" 
                  className="flex flex-col items-center justify-center border-2 rounded-lg p-4 cursor-pointer peer-data-[state=checked]:border-amber-600 peer-data-[state=checked]:bg-amber-50"
                >
                  <span className="text-4xl">👤</span>
                  <span className="mt-2">Human</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem value="elf" id="elf" className="peer sr-only" />
                <Label 
                  htmlFor="elf" 
                  className="flex flex-col items-center justify-center border-2 rounded-lg p-4 cursor-pointer peer-data-[state=checked]:border-amber-600 peer-data-[state=checked]:bg-amber-50"
                >
                  <span className="text-4xl">🧝</span>
                  <span className="mt-2">Elf</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem value="dwarf" id="dwarf" className="peer sr-only" />
                <Label 
                  htmlFor="dwarf" 
                  className="flex flex-col items-center justify-center border-2 rounded-lg p-4 cursor-pointer peer-data-[state=checked]:border-amber-600 peer-data-[state=checked]:bg-amber-50"
                >
                  <span className="text-4xl">🧔</span>
                  <span className="mt-2">Dwarf</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem value="halfling" id="halfling" className="peer sr-only" />
                <Label 
                  htmlFor="halfling" 
                  className="flex flex-col items-center justify-center border-2 rounded-lg p-4 cursor-pointer peer-data-[state=checked]:border-amber-600 peer-data-[state=checked]:bg-amber-50"
                >
                  <span className="text-4xl">🧒</span>
                  <span className="mt-2">Halfling</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-medium text-amber-700">Choose Your Class</h2>
            
            <RadioGroup 
              value={character.class} 
              onValueChange={(value) => handleChange("class", value)}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem value="warrior" id="warrior" className="peer sr-only" />
                <Label 
                  htmlFor="warrior" 
                  className="flex flex-col items-center justify-center border-2 rounded-lg p-4 cursor-pointer peer-data-[state=checked]:border-amber-600 peer-data-[state=checked]:bg-amber-50"
                >
                  <span className="text-4xl">⚔️</span>
                  <span className="mt-2">Warrior</span>
                  <span className="text-xs text-gray-500">Strength focus</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem value="rogue" id="rogue" className="peer sr-only" />
                <Label 
                  htmlFor="rogue" 
                  className="flex flex-col items-center justify-center border-2 rounded-lg p-4 cursor-pointer peer-data-[state=checked]:border-amber-600 peer-data-[state=checked]:bg-amber-50"
                >
                  <span className="text-4xl">🏹</span>
                  <span className="mt-2">Rogue</span>
                  <span className="text-xs text-gray-500">Dexterity focus</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem value="mage" id="mage" className="peer sr-only" />
                <Label 
                  htmlFor="mage" 
                  className="flex flex-col items-center justify-center border-2 rounded-lg p-4 cursor-pointer peer-data-[state=checked]:border-amber-600 peer-data-[state=checked]:bg-amber-50"
                >
                  <span className="text-4xl">🧙</span>
                  <span className="mt-2">Mage</span>
                  <span className="text-xs text-gray-500">Intelligence focus</span>
                </Label>
              </div>
              
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
            </RadioGroup>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-medium text-amber-700">Your Fitness Level</h2>
            
            <RadioGroup 
              value={character.fitnessLevel} 
              onValueChange={(value) => handleChange("fitnessLevel", value)}
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
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-medium text-amber-700">Choose Progression Mode</h2>
            
            <RadioGroup 
              value={character.progressionMode} 
              onValueChange={(value) => handleChange("progressionMode", value)}
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
        )}

        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <Button 
              variant="outline"
              onClick={prevStep}
              className="flex items-center gap-1 border-amber-600 text-amber-700"
            >
              <ArrowLeft size={16} /> Back
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
              className="flex items-center gap-1 border-amber-600 text-amber-700"
            >
              <ArrowLeft size={16} /> Cancel
            </Button>
          )}
          
          {step < 4 ? (
            <Button 
              onClick={nextStep}
              className="flex items-center gap-1 bg-amber-600 hover:bg-amber-700"
            >
              Next <ArrowRight size={16} />
            </Button>
          ) : (
            <Button 
              onClick={completeCreation}
              className="flex items-center gap-1 bg-amber-600 hover:bg-amber-700"
            >
              Create Character <ArrowRight size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterCreation;
