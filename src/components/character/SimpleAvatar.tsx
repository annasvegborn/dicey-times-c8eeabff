
import { memo } from 'react';

interface SimpleAvatarProps {
  race: string;
  characterClass: string;
  skinTone?: 'light' | 'dark';
  size?: number;
}

const SimpleAvatar = memo(({ 
  race, 
  characterClass, 
  skinTone = 'light',
  size = 32
}: SimpleAvatarProps) => {
  // Define simple color schemes based on race and class
  const getAvatarColors = () => {
    const skinColor = skinTone === 'light' ? '#fdbcb4' : '#8b4513';
    
    const classColors = {
      cleric: '#fbbf24', // Yellow for cleric
      wizard: '#8b5cf6', // Purple for wizard
      warrior: '#ef4444', // Red for warrior
    };

    const hairColor = race === 'elf' ? '#d97706' : '#92400e'; // Orange for elf, brown for human
    
    return {
      skin: skinColor,
      hair: hairColor,
      class: classColors[characterClass as keyof typeof classColors] || '#6b7280'
    };
  };

  const colors = getAvatarColors();
  const halfSize = size / 2;
  const hairSize = size * 0.4;

  return (
    <div 
      className="relative rounded-full overflow-hidden border-2 border-white shadow-sm"
      style={{ width: size, height: size }}
    >
      {/* Background/Skin */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: colors.skin }}
      />
      
      {/* Hair */}
      <div 
        className="absolute rounded-full"
        style={{ 
          backgroundColor: colors.hair,
          width: hairSize,
          height: hairSize,
          top: size * 0.1,
          left: (size - hairSize) / 2
        }}
      />
      
      {/* Class indicator (bottom accent) */}
      <div 
        className="absolute bottom-0 left-0 right-0 rounded-b-full"
        style={{ 
          backgroundColor: colors.class,
          height: size * 0.3
        }}
      />
    </div>
  );
});

SimpleAvatar.displayName = 'SimpleAvatar';

export default SimpleAvatar;
