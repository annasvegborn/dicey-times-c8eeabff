
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Shield, Sword, Zap, Brain } from "lucide-react";
import DiceRoller from "./DiceRoller";

type BattleProps = {
  enemyName: string;
  enemyImage: string;
  onVictory: () => void;
  onDefeat: () => void;
}

type BattlePhase = "initiative" | "player-attack" | "enemy-turn" | "player-defense" | "victory" | "defeat";

const InteractiveBattleScene = ({ enemyName, enemyImage, onVictory, onDefeat }: BattleProps) => {
  const [phase, setPhase] = useState<BattlePhase>("initiative");
  const [playerHealth, setPlayerHealth] = useState(100);
  const [enemyHealth, setEnemyHealth] = useState(100);
  const [log, setLog] = useState<string[]>(["Battle begins! Roll for initiative!"]);
  const [playerWonInitiative, setPlayerWonInitiative] = useState<boolean | null>(null);
  const [pendingAttack, setPendingAttack] = useState<"heavy" | "quick" | null>(null);
  
  const addLogMessage = (message: string) => {
    setLog(prev => [...prev, message]);
  };
  
  const handleInitiativeRoll = (result: number, roll: number) => {
    const enemyRoll = Math.floor(Math.random() * 20) + 1;
    const enemyResult = enemyRoll + 1; // Enemy DEX modifier
    
    if (result >= enemyResult) {
      setPlayerWonInitiative(true);
      addLogMessage(`You rolled ${roll}+2=${result} vs enemy's ${enemyRoll}+1=${enemyResult}. You go first!`);
      setTimeout(() => setPhase("player-attack"), 1500);
    } else {
      setPlayerWonInitiative(false);
      addLogMessage(`You rolled ${roll}+2=${result} vs enemy's ${enemyRoll}+1=${enemyResult}. Enemy goes first!`);
      setTimeout(() => handleEnemyAttack(), 1500);
    }
  };
  
  const handleAttackChoice = (attackType: "heavy" | "quick") => {
    setPendingAttack(attackType);
    addLogMessage(`You prepare a ${attackType === "heavy" ? "Heavy Strike" : "Quick Jab"}. Roll for attack!`);
  };
  
  const handleAttackRoll = (result: number, roll: number) => {
    if (!pendingAttack) return;
    
    // Simple hit/miss system - need 8+ to hit
    if (result >= 8) {
      let damage;
      if (pendingAttack === "heavy") {
        damage = Math.floor(Math.random() * 8) + 1 + 3; // 1d8+3
        addLogMessage(`Hit! Your heavy strike deals ${damage} damage!`);
      } else {
        damage = Math.floor(Math.random() * 6) + 1 + 2; // 1d6+2
        addLogMessage(`Hit! Your quick jab deals ${damage} damage!`);
      }
      
      const newEnemyHealth = Math.max(0, enemyHealth - damage);
      setEnemyHealth(newEnemyHealth);
      
      if (newEnemyHealth <= 0) {
        addLogMessage(`You defeated the ${enemyName}!`);
        setPhase("victory");
        setTimeout(() => onVictory(), 2000);
        return;
      }
    } else {
      addLogMessage(`Miss! Your attack fails to connect.`);
    }
    
    setPendingAttack(null);
    setTimeout(() => handleEnemyAttack(), 1500);
  };
  
  const handleEnemyAttack = () => {
    setPhase("enemy-turn");
    addLogMessage(`${enemyName} attacks!`);
    
    setTimeout(() => {
      const damage = Math.floor(Math.random() * 6) + 1 + 1; // 1d6+1
      addLogMessage(`${enemyName} deals ${damage} damage!`);
      
      const newPlayerHealth = Math.max(0, playerHealth - damage);
      setPlayerHealth(newPlayerHealth);
      
      if (newPlayerHealth <= 0) {
        addLogMessage(`You were defeated!`);
        setPhase("defeat");
        setTimeout(() => onDefeat(), 2000);
        return;
      }
      
      setTimeout(() => setPhase("player-defense"), 1000);
    }, 1000);
  };
  
  const handleDefenseChoice = (defenseType: "block" | "counter") => {
    if (defenseType === "block") {
      addLogMessage("You raise your shield and prepare for the next round!");
    } else {
      addLogMessage("You study your opponent, looking for an opening to counter!");
    }
    
    setTimeout(() => setPhase("player-attack"), 1500);
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
      
      <div className="bg-stone-800 border border-amber-900 rounded-lg p-3 mb-6 h-32 overflow-y-auto">
        {log.map((message, index) => (
          <div key={index} className="text-sm mb-1">
            {message}
          </div>
        ))}
      </div>
      
      <div className="mb-4">
        <div className="text-center text-amber-400 font-medium mb-4">
          {phase === "initiative" && "Roll for Initiative"}
          {phase === "player-attack" && "Your Attack"}
          {phase === "enemy-turn" && "Enemy Turn"}
          {phase === "player-defense" && "Choose Defense"}
          {(phase === "victory" || phase === "defeat") && "Battle Complete"}
        </div>
        
        {phase === "initiative" && (
          <div className="flex justify-center">
            <DiceRoller
              sides={20}
              modifier={2}
              label="Roll Initiative (d20+2)"
              onRoll={handleInitiativeRoll}
            />
          </div>
        )}
        
        {phase === "player-attack" && !pendingAttack && (
          <div className="grid grid-cols-2 gap-3">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button 
                  className="bg-red-700 hover:bg-red-800 flex items-center gap-2"
                  onClick={() => handleAttackChoice("heavy")}
                >
                  <Sword size={16} /> Heavy Strike
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-64 bg-stone-800 text-stone-100 border-amber-900">
                <p className="text-sm">A powerful attack using your Strength. Deals 1d8+3 damage. Needs 8+ to hit.</p>
              </HoverCardContent>
            </HoverCard>
            
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button 
                  className="bg-blue-700 hover:bg-blue-800 flex items-center gap-2"
                  onClick={() => handleAttackChoice("quick")}
                >
                  <Zap size={16} /> Quick Jab
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-64 bg-stone-800 text-stone-100 border-amber-900">
                <p className="text-sm">A fast attack using your Dexterity. Deals 1d6+2 damage. Needs 8+ to hit.</p>
              </HoverCardContent>
            </HoverCard>
          </div>
        )}
        
        {phase === "player-attack" && pendingAttack && (
          <div className="flex justify-center">
            <DiceRoller
              sides={20}
              modifier={pendingAttack === "heavy" ? 3 : 2}
              label={`Roll Attack (d20+${pendingAttack === "heavy" ? 3 : 2})`}
              onRoll={handleAttackRoll}
            />
          </div>
        )}
        
        {phase === "enemy-turn" && (
          <div className="text-center text-stone-300">
            <div className="animate-pulse">Enemy is attacking...</div>
          </div>
        )}
        
        {phase === "player-defense" && (
          <div className="grid grid-cols-2 gap-3">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button 
                  className="bg-amber-600 hover:bg-amber-700 flex items-center gap-2"
                  onClick={() => handleDefenseChoice("block")}
                >
                  <Shield size={16} /> Prepare Defense
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-64 bg-stone-800 text-stone-100 border-amber-900">
                <p className="text-sm">Ready yourself for the next round of combat.</p>
              </HoverCardContent>
            </HoverCard>
            
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button 
                  className="bg-purple-700 hover:bg-purple-800 flex items-center gap-2"
                  onClick={() => handleDefenseChoice("counter")}
                >
                  <Brain size={16} /> Study Enemy
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-64 bg-stone-800 text-stone-100 border-amber-900">
                <p className="text-sm">Analyze your opponent's fighting style for the next attack.</p>
              </HoverCardContent>
            </HoverCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveBattleScene;
