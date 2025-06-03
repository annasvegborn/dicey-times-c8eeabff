
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Shield, Sword, Zap, Brain, Heart, Target } from "lucide-react";

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
  
  const addLogMessage = (message: string) => {
    setLog(prev => [...prev.slice(-2), message]);
  };
  
  const rollDice = (sides: number) => Math.floor(Math.random() * sides) + 1;
  
  const executeAction = (actionType: "attack" | "defend" | "special" | "heal") => {
    let playerDamage = 0;
    let playerHealing = 0;
    let enemyDamage = rollDice(12) + 5; // Enemy always attacks back
    
    // Player action
    switch (actionType) {
      case "attack":
        playerDamage = rollDice(20) + 10;
        addLogMessage(`You strike for ${playerDamage} damage!`);
        break;
      case "defend":
        enemyDamage = Math.max(1, enemyDamage - 8);
        addLogMessage(`You defend, reducing incoming damage!`);
        break;
      case "special":
        if (rollDice(20) > 10) {
          playerDamage = rollDice(25) + 15;
          addLogMessage(`Critical hit! You deal ${playerDamage} damage!`);
        } else {
          addLogMessage(`Your special attack misses!`);
        }
        break;
      case "heal":
        playerHealing = rollDice(15) + 10;
        addLogMessage(`You recover ${playerHealing} health!`);
        enemyDamage = Math.floor(enemyDamage * 1.5); // Enemy hits harder when you heal
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
        setTimeout(() => onVictory(), 2000);
      } else if (newPlayerHealth <= 0) {
        addLogMessage(`Defeat! ${enemyName} has bested you!`);
        setPhase("defeat");
        setTimeout(() => onDefeat(), 2000);
      } else {
        setRoundCount(prev => prev + 1);
      }
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto bg-parchment-50 rounded-3xl p-6 border-4 border-parchment-800 text-parchment-900 shadow-2xl">
      {/* Health bars */}
      <div className="flex justify-between mb-6">
        <div>
          <div className="text-parchment-800 font-serif font-bold">Hero</div>
          <div className="w-24 h-4 bg-parchment-200 rounded-full mt-1 border-2 border-parchment-700">
            <div 
              className="h-full bg-green-600 rounded-full transition-all duration-500" 
              style={{ width: `${playerHealth}%` }}
            ></div>
          </div>
          <div className="text-xs text-parchment-700 mt-1 font-serif">{playerHealth}/100</div>
        </div>
        
        <div className="text-2xl">⚔️</div>
        
        <div className="text-right">
          <div className="text-parchment-800 font-serif font-bold">{enemyName}</div>
          <div className="w-24 h-4 bg-parchment-200 rounded-full mt-1 ml-auto border-2 border-parchment-700">
            <div 
              className="h-full bg-red-600 rounded-full transition-all duration-500" 
              style={{ width: `${enemyHealth}%` }}
            ></div>
          </div>
          <div className="text-xs text-parchment-700 mt-1 font-serif">{enemyHealth}/100</div>
        </div>
      </div>
      
      {/* Enemy display */}
      <div className="flex justify-center mb-6">
        <div className="text-6xl bg-parchment-100 rounded-full p-4 border-3 border-parchment-600">
          {enemyImage}
        </div>
      </div>
      
      {/* Combat log */}
      <div className="bg-parchment-100 border-3 border-parchment-600 rounded-2xl p-4 mb-6 h-24 overflow-y-auto">
        {log.map((message, index) => (
          <div key={index} className="text-sm mb-1 font-serif text-parchment-800">
            {message}
          </div>
        ))}
      </div>
      
      {/* Round counter */}
      <div className="text-center text-parchment-700 font-serif font-bold mb-4">
        Round {roundCount}
      </div>
      
      {/* Action buttons */}
      {phase === "combat" && (
        <div className="grid grid-cols-2 gap-3">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button 
                className="bg-parchment-600 hover:bg-parchment-700 text-parchment-50 border-2 border-parchment-800 rounded-xl font-serif flex items-center gap-2"
                onClick={() => executeAction("attack")}
              >
                <Sword size={16} /> Attack
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-64 bg-parchment-100 text-parchment-800 border-parchment-700 font-serif">
              <p className="text-sm">A reliable strike. Deals 1d20+10 damage.</p>
            </HoverCardContent>
          </HoverCard>
          
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button 
                className="bg-parchment-600 hover:bg-parchment-700 text-parchment-50 border-2 border-parchment-800 rounded-xl font-serif flex items-center gap-2"
                onClick={() => executeAction("defend")}
              >
                <Shield size={16} /> Defend
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-64 bg-parchment-100 text-parchment-800 border-parchment-700 font-serif">
              <p className="text-sm">Reduce incoming damage by 8 points.</p>
            </HoverCardContent>
          </HoverCard>
          
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button 
                className="bg-parchment-700 hover:bg-parchment-800 text-parchment-50 border-2 border-parchment-900 rounded-xl font-serif flex items-center gap-2"
                onClick={() => executeAction("special")}
              >
                <Target size={16} /> Special
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-64 bg-parchment-100 text-parchment-800 border-parchment-700 font-serif">
              <p className="text-sm">Risky but powerful! 50% chance for 1d25+15 damage.</p>
            </HoverCardContent>
          </HoverCard>
          
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button 
                className="bg-green-700 hover:bg-green-800 text-parchment-50 border-2 border-parchment-800 rounded-xl font-serif flex items-center gap-2"
                onClick={() => executeAction("heal")}
              >
                <Heart size={16} /> Heal
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-64 bg-parchment-100 text-parchment-800 border-parchment-700 font-serif">
              <p className="text-sm">Restore 1d15+10 health, but enemy attacks harder!</p>
            </HoverCardContent>
          </HoverCard>
        </div>
      )}
      
      {(phase === "victory" || phase === "defeat") && (
        <div className="text-center">
          <div className={`text-2xl font-serif font-bold ${phase === "victory" ? "text-green-700" : "text-red-700"}`}>
            {phase === "victory" ? "Victory!" : "Defeat!"}
          </div>
          <div className="text-parchment-700 font-serif mt-2">
            {phase === "victory" ? "Returning to quest..." : "Try again when you're stronger..."}
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveBattleScene;
