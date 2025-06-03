
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dices } from "lucide-react";

type DiceRollerProps = {
  sides: number;
  modifier?: number;
  label: string;
  onRoll: (result: number, roll: number) => void;
  disabled?: boolean;
}

const DiceRoller = ({ sides, modifier = 0, label, onRoll, disabled }: DiceRollerProps) => {
  const [isRolling, setIsRolling] = useState(false);
  const [lastRoll, setLastRoll] = useState<{ roll: number; result: number } | null>(null);

  const handleRoll = () => {
    if (disabled) return;
    
    setIsRolling(true);
    
    // Simulate rolling animation
    setTimeout(() => {
      const roll = Math.floor(Math.random() * sides) + 1;
      const result = roll + modifier;
      setLastRoll({ roll, result });
      setIsRolling(false);
      onRoll(result, roll);
    }, 800);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        onClick={handleRoll}
        disabled={disabled || isRolling}
        className="bg-parchment-600 hover:bg-parchment-700 text-parchment-50 border-2 border-parchment-800 rounded-xl font-serif flex items-center gap-2"
      >
        <Dices size={16} />
        {isRolling ? "Rolling..." : label}
      </Button>
      
      {lastRoll && (
        <div className="text-center">
          <div className="text-2xl font-bold text-parchment-800 font-serif">
            {lastRoll.roll}
          </div>
          <div className="text-xs text-parchment-700 font-serif">
            d{sides} + {modifier} = {lastRoll.result}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiceRoller;
