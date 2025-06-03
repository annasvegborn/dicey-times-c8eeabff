
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CharacterCreationStep1Props {
  characterName: string;
  onNameChange: (name: string) => void;
}

const CharacterCreationStep1 = ({ characterName, onNameChange }: CharacterCreationStep1Props) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium text-parchment-900 font-serif">Character Name</h2>
      
      <div>
        <Label htmlFor="name" className="text-parchment-800 font-serif">What shall we call you, adventurer?</Label>
        <Input
          id="name"
          value={characterName}
          onChange={(e) => onNameChange(e.target.value)}
          className="mt-2 text-lg font-medium bg-parchment-200 border-2 border-parchment-500 text-parchment-900 rounded-xl font-serif"
          placeholder="Enter your character name"
        />
      </div>
      
      <div className="p-4 bg-parchment-200 border border-parchment-500 rounded-lg">
        <p className="text-sm text-parchment-800 font-serif">
          Choose a name that represents your fitness journey. This will be your identity in the realm!
        </p>
      </div>
    </div>
  );
};

export default CharacterCreationStep1;
