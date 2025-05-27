
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface CharacterCreationNavigationProps {
  step: number;
  creating: boolean;
  onPrevStep: () => void;
  onNextStep: () => void;
  onCancel: () => void;
  onCompleteCreation: () => void;
}

const CharacterCreationNavigation = ({ 
  step, 
  creating, 
  onPrevStep, 
  onNextStep, 
  onCancel, 
  onCompleteCreation 
}: CharacterCreationNavigationProps) => {
  return (
    <div className="flex justify-between mt-8">
      {step > 1 ? (
        <Button 
          variant="outline"
          onClick={onPrevStep}
          className="flex items-center gap-1 border-amber-600 text-amber-700"
        >
          <ArrowLeft size={16} /> Back
        </Button>
      ) : (
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="flex items-center gap-1 border-amber-600 text-amber-700"
        >
          <ArrowLeft size={16} /> Cancel
        </Button>
      )}
      
      {step < 5 ? (
        <Button 
          onClick={onNextStep}
          className="flex items-center gap-1 bg-amber-600 hover:bg-amber-700"
        >
          Next <ArrowRight size={16} />
        </Button>
      ) : (
        <Button 
          onClick={onCompleteCreation}
          disabled={creating}
          className="flex items-center gap-1 bg-amber-600 hover:bg-amber-700"
        >
          {creating ? "Creating..." : "Create Character"} <ArrowRight size={16} />
        </Button>
      )}
    </div>
  );
};

export default CharacterCreationNavigation;
