
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Shield, Sword, Zap, Brain } from "lucide-react";

type BattleProps = {
  enemyName: string;
  enemyImage: string; // emoji or icon
  onVictory: () => void;
  onDefeat: () => void;
}

const BattleScene = ({ enemyName, enemyImage, onVictory, onDefeat }: BattleProps) => {
  const [round, setRound] = useState(1);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [enemyHealth, setEnemyHealth] = useState(100);
  const [log, setLog] = useState<string[]>(["Battle begins!"]);
  const [initiative, setInitiative] = useState<"player" | "enemy" | null>(null);
  
  const rollDice = (sides: number): number => {
    return Math.floor(Math.random() * sides) + 1;
  };
  
  const addLogMessage = (message: string) => {
    setLog(prev => [...prev, message]);
  };
  
  const handleInitiative = () => {
    const playerRoll = rollDice(20) + 2; // Adding DEX modifier
    const enemyRoll = rollDice(20) + 1;
    
    let winner: "player" | "enemy";
    if (playerRoll >= enemyRoll) {
      winner = "player";
      addLogMessage(`You rolled ${playerRoll} vs enemy's ${enemyRoll}. You go first!`);
    } else {
      winner = "enemy";
      addLogMessage(`You rolled ${playerRoll} vs enemy's ${enemyRoll}. Enemy goes first!`);
    }
    
    setInitiative(winner);
    setRound(2);
  };
  
  const handleAttack = (attackType: "heavy" | "quick") => {
    // Player attack
    let damage;
    if (attackType === "heavy") {
      const roll = rollDice(8) + 3; // STR modifier
      damage = roll;
      addLogMessage(`You unleash a heavy strike for ${roll} damage!`);
    } else {
      const roll = rollDice(6) + 2; // DEX modifier
      damage = roll;
      addLogMessage(`You deliver a quick jab for ${roll} damage!`);
    }
    
    setEnemyHealth(prev => Math.max(0, prev - damage));
    
    // Check if enemy defeated
    if (enemyHealth - damage <= 0) {
      addLogMessage(`You defeated the ${enemyName}!`);
      setTimeout(() => onVictory(), 1500);
      return;
    }
    
    // Enemy counterattack
    setTimeout(() => {
      const enemyDamage = rollDice(6) + 1;
      addLogMessage(`${enemyName} attacks for ${enemyDamage} damage!`);
      setPlayerHealth(prev => Math.max(0, prev - enemyDamage));
      
      // Check if player defeated
      if (playerHealth - enemyDamage <= 0) {
        addLogMessage(`You were defeated!`);
        setTimeout(() => onDefeat(), 1500);
        return;
      }
      
      setRound(3);
    }, 1000);
  };
  
  const handleDefense = (defenseType: "block" | "counter") => {
    if (defenseType === "block") {
      const reduction = rollDice(4) + 2; // CON modifier
      addLogMessage(`You brace yourself, reducing damage by ${reduction}!`);
      
      // Enemy attack with reduced damage
      const enemyDamage = Math.max(1, rollDice(6) + 1 - reduction);
      addLogMessage(`${enemyName} attacks for ${enemyDamage} damage!`);
      setPlayerHealth(prev => Math.max(0, prev - enemyDamage));
    } else {
      // Wisdom-based counter
      const counterChance = rollDice(20) + 1; // WIS modifier
      
      if (counterChance > 12) {
        const counterDamage = rollDice(4) + 1;
        addLogMessage(`You cleverly counter the attack, dealing ${counterDamage} damage!`);
        setEnemyHealth(prev => Math.max(0, prev - counterDamage));
        
        // Reduced enemy damage
        const enemyDamage = Math.floor(rollDice(6) / 2);
        addLogMessage(`${enemyName} still hits for ${enemyDamage} damage!`);
        setPlayerHealth(prev => Math.max(0, prev - enemyDamage));
      } else {
        addLogMessage(`Your counter fails!`);
        
        // Full enemy damage
        const enemyDamage = rollDice(6) + 1;
        addLogMessage(`${enemyName} attacks for ${enemyDamage} damage!`);
        setPlayerHealth(prev => Math.max(0, prev - enemyDamage));
      }
    }
    
    // Check victory/defeat conditions
    if (enemyHealth <= 0) {
      addLogMessage(`You defeated the ${enemyName}!`);
      setTimeout(() => onVictory(), 1500);
      return;
    }
    
    if (playerHealth <= 0) {
      addLogMessage(`You were defeated!`);
      setTimeout(() => onDefeat(), 1500);
      return;
    }
    
    // Back to round 1 for next turn
    setRound(1);
  };

  return (
    <div className="max-w-md mx-auto bg-stone-900 rounded-lg p-4 border-2 border-amber-700 text-stone-100">
      <div className="flex justify-between mb-6">
        <div>
          <div className="text-amber-400 font-medium">You</div>
          <div className="w-24 h-3 bg-gray-700 rounded-full mt-1">
            <div 
              className="h-full bg-green-600 rounded-full" 
              style={{ width: `${playerHealth}%` }}
            ></div>
          </div>
          <div className="text-xs text-green-400 mt-1">{playerHealth}/100</div>
        </div>
        
        <div className="text-xl">⚔️</div>
        
        <div className="text-right">
          <div className="text-red-400 font-medium">{enemyName}</div>
          <div className="w-24 h-3 bg-gray-700 rounded-full mt-1 ml-auto">
            <div 
              className="h-full bg-red-600 rounded-full" 
              style={{ width: `${enemyHealth}%` }}
            ></div>
          </div>
          <div className="text-xs text-red-400 mt-1">{enemyHealth}/100</div>
        </div>
      </div>
      
      <div className="flex justify-center mb-6">
        <div className="text-5xl">{enemyImage}</div>
      </div>
      
      <div className="bg-stone-800 border border-amber-900 rounded-lg p-3 mb-6 h-28 overflow-y-auto">
        {log.map((message, index) => (
          <div key={index} className="text-sm mb-1">
            {message}
          </div>
        ))}
      </div>
      
      <div className="mb-4">
        <div className="text-center text-amber-400 font-medium mb-2">
          Round {round}: {round === 1 ? 'Initiative' : round === 2 ? 'Attack' : 'Defense'}
        </div>
        
        {round === 1 && (
          <div className="flex justify-center">
            <Button 
              className="bg-amber-600 hover:bg-amber-700 flex items-center gap-2"
              onClick={handleInitiative}
            >
              <Zap size={16} /> Roll for Initiative
            </Button>
          </div>
        )}
        
        {round === 2 && (
          <div className="grid grid-cols-2 gap-3">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button 
                  className="bg-red-700 hover:bg-red-800 flex items-center gap-2"
                  onClick={() => handleAttack("heavy")}
                >
                  <Sword size={16} /> Heavy Strike
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-64 bg-stone-800 text-stone-100 border-amber-900">
                <p className="text-sm">A powerful attack using your Strength. Deals 1d8+3 damage.</p>
              </HoverCardContent>
            </HoverCard>
            
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button 
                  className="bg-blue-700 hover:bg-blue-800 flex items-center gap-2"
                  onClick={() => handleAttack("quick")}
                >
                  <Zap size={16} /> Quick Jab
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-64 bg-stone-800 text-stone-100 border-amber-900">
                <p className="text-sm">A fast attack using your Dexterity. Deals 1d6+2 damage.</p>
              </HoverCardContent>
            </HoverCard>
          </div>
        )}
        
        {round === 3 && (
          <div className="grid grid-cols-2 gap-3">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button 
                  className="bg-amber-600 hover:bg-amber-700 flex items-center gap-2"
                  onClick={() => handleDefense("block")}
                >
                  <Shield size={16} /> Shield Block
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-64 bg-stone-800 text-stone-100 border-amber-900">
                <p className="text-sm">Use your Constitution to block damage. Reduces incoming damage by 1d4+2.</p>
              </HoverCardContent>
            </HoverCard>
            
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button 
                  className="bg-purple-700 hover:bg-purple-800 flex items-center gap-2"
                  onClick={() => handleDefense("counter")}
                >
                  <Brain size={16} /> Wise Counter
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-64 bg-stone-800 text-stone-100 border-amber-900">
                <p className="text-sm">Use your Wisdom to attempt a counter. 40% chance to deal 1d4+1 damage and reduce incoming damage.</p>
              </HoverCardContent>
            </HoverCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default BattleScene;
