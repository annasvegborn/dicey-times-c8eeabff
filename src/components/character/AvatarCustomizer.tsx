
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface AvatarCustomizerProps {
  values: {
    race: string;
    bodyShape: string;
    hairStyle: string;
  };
  onChange: (field: string, value: string) => void;
}

const AvatarCustomizer = ({ values, onChange }: AvatarCustomizerProps) => {
  const races = [
    { id: 'human', name: 'Human', emoji: '👤' },
    { id: 'elf', name: 'Elf', emoji: '🧝' },
    { id: 'dwarf', name: 'Dwarf', emoji: '🧔' },
    { id: 'halfling', name: 'Halfling', emoji: '🧒' }
  ];

  const bodyShapes = [
    { id: 'slim', name: 'Slim', emoji: '🏃' },
    { id: 'medium', name: 'Medium', emoji: '🚶' },
    { id: 'muscular', name: 'Muscular', emoji: '💪' },
    { id: 'heavy', name: 'Heavy', emoji: '🧍' }
  ];

  const hairStyles = [
    { id: 'short', name: 'Short', emoji: '✂️' },
    { id: 'long', name: 'Long', emoji: '🦱' },
    { id: 'curly', name: 'Curly', emoji: '🌀' },
    { id: 'bald', name: 'Bald', emoji: '🥚' },
    { id: 'braided', name: 'Braided', emoji: '🎀' },
    { id: 'ponytail', name: 'Ponytail', emoji: '🎪' }
  ];

  return (
    <div className="space-y-8">
      {/* Race Selection */}
      <div>
        <h3 className="text-lg font-medium text-amber-700 mb-4">Race</h3>
        <RadioGroup 
          value={values.race} 
          onValueChange={(value) => onChange("race", value)}
          className="grid grid-cols-2 gap-3"
        >
          {races.map((race) => (
            <div key={race.id}>
              <RadioGroupItem value={race.id} id={race.id} className="peer sr-only" />
              <Label 
                htmlFor={race.id} 
                className="flex flex-col items-center justify-center border-2 rounded-lg p-3 cursor-pointer peer-data-[state=checked]:border-amber-600 peer-data-[state=checked]:bg-amber-50 hover:bg-amber-25"
              >
                <span className="text-2xl mb-1">{race.emoji}</span>
                <span className="text-sm font-medium">{race.name}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Body Shape Selection */}
      <div>
        <h3 className="text-lg font-medium text-amber-700 mb-4">Body Shape</h3>
        <RadioGroup 
          value={values.bodyShape} 
          onValueChange={(value) => onChange("bodyShape", value)}
          className="grid grid-cols-2 gap-3"
        >
          {bodyShapes.map((shape) => (
            <div key={shape.id}>
              <RadioGroupItem value={shape.id} id={`body-${shape.id}`} className="peer sr-only" />
              <Label 
                htmlFor={`body-${shape.id}`} 
                className="flex flex-col items-center justify-center border-2 rounded-lg p-3 cursor-pointer peer-data-[state=checked]:border-amber-600 peer-data-[state=checked]:bg-amber-50 hover:bg-amber-25"
              >
                <span className="text-2xl mb-1">{shape.emoji}</span>
                <span className="text-sm font-medium">{shape.name}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Hair Style Selection */}
      <div>
        <h3 className="text-lg font-medium text-amber-700 mb-4">Hair Style</h3>
        <RadioGroup 
          value={values.hairStyle} 
          onValueChange={(value) => onChange("hairStyle", value)}
          className="grid grid-cols-3 gap-3"
        >
          {hairStyles.map((hair) => (
            <div key={hair.id}>
              <RadioGroupItem value={hair.id} id={`hair-${hair.id}`} className="peer sr-only" />
              <Label 
                htmlFor={`hair-${hair.id}`} 
                className="flex flex-col items-center justify-center border-2 rounded-lg p-3 cursor-pointer peer-data-[state=checked]:border-amber-600 peer-data-[state=checked]:bg-amber-50 hover:bg-amber-25"
              >
                <span className="text-xl mb-1">{hair.emoji}</span>
                <span className="text-xs font-medium">{hair.name}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default AvatarCustomizer;
