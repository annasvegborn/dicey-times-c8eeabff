
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface SkinToneSelectorProps {
  value: string;
  onChange: (value: string) => void;
  availableTones?: string[];
}

const SkinToneSelector = ({ value, onChange, availableTones = ['light', 'dark'] }: SkinToneSelectorProps) => {
  const allSkinTones = [
    { id: 'light', name: 'Light', color: '#F5DEB3' },
    { id: 'dark', name: 'Dark', color: '#8B4513' }
  ];

  // Filter skin tones based on what's available for the current race
  const skinTones = allSkinTones.filter(tone => availableTones.includes(tone.id));

  // If current value is not available for this race, reset to first available
  if (!availableTones.includes(value) && skinTones.length > 0) {
    onChange(skinTones[0].id);
  }

  return (
    <div>
      <h3 className="text-lg font-medium text-amber-700 mb-4">Skin Tone</h3>
      <RadioGroup 
        value={value} 
        onValueChange={onChange}
        className="grid grid-cols-2 gap-3"
      >
        {skinTones.map((tone) => (
          <div key={tone.id}>
            <RadioGroupItem value={tone.id} id={`skin-${tone.id}`} className="peer sr-only" />
            <Label 
              htmlFor={`skin-${tone.id}`} 
              className="flex flex-col items-center justify-center border-2 rounded-lg p-3 cursor-pointer peer-data-[state=checked]:border-amber-600 peer-data-[state=checked]:bg-amber-50 hover:bg-amber-25"
            >
              <div 
                className="w-8 h-8 rounded-full border-2 border-gray-300 mb-1"
                style={{ backgroundColor: tone.color }}
              />
              <span className="text-sm font-medium">{tone.name}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default SkinToneSelector;
