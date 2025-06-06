
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Shield, Sword, Target, Heart } from "lucide-react";

type BattleProps = {
  enemyName: string;
  enemyImage: string;
  onVictory: () => void;
  onDefeat: () => void;
}

type BattlePhase = "combat" | "victory" | "defeat";

const InteractiveBattleScene = ({ enemyName, enemyImage, onVictory, onDefeat }: BattleProps) => {
  const [phase, setPhase] = useState<BattlePhase>("combat");
  const [playerHealth, setPlayerHealth] = useState(100);
  const [enemyHealth, setEnemyHealth] = useState(100);
  const [log, setLog] = useState<string[]>([`Battle begins against ${enemyName}!`]);
  const [roundCount, setRoundCount] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const addLogMessage = (message: string) => {
    setLog(prev => [...prev.slice(-2), message]);
  };
  
  const rollDice = (sides: number) => Math.floor(Math.random() * sides) + 1;
  
  const executeAction = (actionType: "attack" | "defend" | "special" | "heal") => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    let playerDamage = 0;
    let playerHealing = 0;
    let enemyDamage = rollDice(8) + 3; // Reduced enemy damage for faster battles
    
    // Player action
    switch (actionType) {
      case "attack":
        playerDamage = rollDice(15) + 8; // Increased damage for faster battles
        addLogMessage(`You strike for ${playerDamage} damage!`);
        break;
      case "defend":
        enemyDamage = Math.max(1, enemyDamage - 6);
        addLogMessage(`You defend, reducing incoming damage!`);
        break;
      case "special":
        if (rollDice(20) > 8) { // Better chance for special attacks
          playerDamage = rollDice(20) + 12;
          addLogMessage(`Critical hit! You deal ${playerDamage} damage!`);
        } else {
          addLogMessage(`Your special attack misses!`);
        }
        break;
      case "heal":
        playerHealing = rollDice(12) + 8;
        addLogMessage(`You recover ${playerHealing} health!`);
        enemyDamage = Math.floor(enemyDamage * 1.3); // Reduced penalty for healing
        break;
    }
    
    // Apply damage and healing
    const newEnemyHealth = Math.max(0, enemyHealth - playerDamage);
    const newPlayerHealth = Math.min(100, Math.max(0, playerHealth + playerHealing - enemyDamage));
    
    setEnemyHealth(newEnemyHealth);
    setPlayerHealth(newPlayerHealth);
    
    // Enemy counterattack message
    if (newEnemyHealth > 0) {
      addLogMessage(`${enemyName} retaliates for ${enemyDamage} damage!`);
    }
    
    // Check win/lose conditions
    setTimeout(() => {
      if (newEnemyHealth <= 0) {
        addLogMessage(`Victory! You defeated ${enemyName}!`);
        setPhase("victory");
        setTimeout(() => onVictory(), 1500);
      } else if (newPlayerHealth <= 0) {
        addLogMessage(`Defeat! ${enemyName} has bested you!`);
        setPhase("defeat");
        setTimeout(() => onDefeat(), 1500);
      } else {
        setRoundCount(prev => prev + 1);
      }
      setIsProcessing(false);
    }, 1000); // Reduced delay for faster battles
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl p-6 shadow-xl text-slate-800">
      {/* Health bars */}
      <div className="flex justify-between mb-6">
        <div className="w-24">
          <div className="text-slate-800 font-serif font-bold">Hero</div>
          <div className="w-24 h-4 bg-slate-200 rounded-full mt-1 border-2 border-slate-300">
            <div 
              className="h-full bg-green-500 rounded-full transition-all duration-500" 
              style={{ width: `${playerHealth}%` }}
            ></div>
          </div>
          <div className="text-xs text-slate-600 mt-1 font-serif">{playerHealth}/100</div>
        </div>
        
        <div className="text-2xl">⚔️</div>
        
        <div className="text-right w-24">
          <div className="text-slate-800 font-serif font-bold">{enemyName}</div>
          <div className="w-24 h-4 bg-slate-200 rounded-full mt-1 ml-auto border-2 border-slate-300">
            <div 
              className="h-full bg-red-500 rounded-full transition-all duration-500" 
              style={{ width: `${enemyHealth}%` }}
            ></div>
          </div>
          <div className="text-xs text-slate-600 mt-1 font-serif">{enemyHealth}/100</div>
        </div>
      </div>
      
      {/* Enemy display */}
      <div className="flex justify-center mb-6">
        <div className="text-6xl bg-slate-100 rounded-full p-4 border-3 border-slate-300 shadow-lg">
          {enemyImage}
        </div>
      </div>
      
      {/* Combat log */}
      <div className="bg-slate-100 border-3 border-slate-300 rounded-2xl p-4 mb-6 h-24 overflow-y-auto shadow-inner">
        {log.map((message, index) => (
          <div key={index} className="text-sm mb-1 font-serif text-slate-700">
            {message}
          </div>
        ))}
      </div>
      
      {/* Round counter */}
      <div className="text-center text-slate-600 font-serif font-bold mb-4">
        Round {roundCount}
      </div>
      
      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3 h-32">
        {phase === "combat" && (
          <>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button 
                  className="bg-slate-600 hover:bg-slate-700 text-white border-2 border-slate-300 rounded-xl font-serif flex items-center gap-2 shadow-sm"
                  onClick={() => executeAction("attack")}
                  disabled={isProcessing}
                >
                  <Sword size={16} /> Attack
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-64 bg-white text-slate-800 border-slate-300 font-serif shadow-lg">
                <p className="text-sm">A reliable strike. Deals 1d15+8 damage.</p>
              </HoverCardContent>
            </HoverCard>
            
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button 
                  className="bg-slate-600 hover:bg-slate-700 text-white border-2 border-slate-300 rounded-xl font-serif flex items-center gap-2 shadow-sm"
                  onClick={() => executeAction("defend")}
                  disabled={isProcessing}
                >
                  <Shield size={16} /> Defend
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-64 bg-white text-slate-800 border-slate-300 font-serif shadow-lg">
                <p className="text-sm">Reduce incoming damage by 6 points.</p>
              </HoverCardContent>
            </HoverCard>
            
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white border-2 border-slate-300 rounded-xl font-serif flex items-center gap-2 shadow-sm"
                  onClick={() => executeAction("special")}
                  disabled={isProcessing}
                >
                  <Target size={16} /> Special
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-64 bg-white text-slate-800 border-slate-300 font-serif shadow-lg">
                <p className="text-sm">Risky but powerful! 60% chance for 1d20+12 damage.</p>
              </HoverCardContent>
            </HoverCard>
            
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white border-2 border-slate-300 rounded-xl font-serif flex items-center gap-2 shadow-sm"
                  onClick={() => executeAction("heal")}
                  disabled={isProcessing}
                >
                  <Heart size={16} /> Heal
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-64 bg-white text-slate-800 border-slate-300 font-serif shadow-lg">
                <p className="text-sm">Restore 1d12+8 health, but enemy attacks harder!</p>
              </HoverCardContent>
            </HoverCard>
          </>
        )}
        
        {(phase === "victory" || phase === "defeat") && (
          <div className="col-span-2 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-2xl font-serif font-bold ${phase === "victory" ? "text-green-600" : "text-red-600"}`}>
                {phase === "victory" ? "Victory!" : "Defeat!"}
              </div>
              <div className="text-slate-600 font-serif mt-2">
                {phase === "victory" ? "Returning to quest..." : "Try again when you're stronger..."}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveBattleScene;
