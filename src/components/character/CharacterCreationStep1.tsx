
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CharacterCreationStep1Props {
  characterName: string;
  onNameChange: (name: string) => void;
}

const CharacterCreationStep1 = ({ characterName, onNameChange }: CharacterCreationStep1Props) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium text-amber-700">Character Name</h2>
      
      <div>
        <Label htmlFor="name">What shall we call you, adventurer?</Label>
        <Input
          id="name"
          value={characterName}
          onChange={(e) => onNameChange(e.target.value)}
          className="mt-2 text-lg font-medium"
          placeholder="Enter your character name"
        />
      </div>
      
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800">
          Choose a name that represents your fitness journey. This will be your identity in the realm!
        </p>
      </div>
    </div>
  );
};

export default CharacterCreationStep1;
