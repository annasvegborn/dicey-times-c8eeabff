
import { useEffect, useRef } from 'react';

interface CharacterRendererProps {
  race: string;
  bodyShape: string; // We'll use 'medium' for now since that's what's in the atlas
  hairStyle: string;
  characterClass: string;
  skinTone?: 'light' | 'dark';
  size?: number;
}

interface SpriteData {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface AtlasData {
  layerOrder: string[];
  medium: Record<string, SpriteData>;
}

const CharacterRenderer = ({ 
  race, 
  bodyShape, 
  hairStyle, 
  characterClass, 
  skinTone = 'light',
  size = 192 
}: CharacterRendererProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Atlas data - in a real app, you'd load this from the JSON file
  const atlasData: AtlasData = {
    "layerOrder": [
      "hair_back",
      "body",
      "outfit",
      "hair_front"
    ],
    "medium": {
      "human_body_light": { "x": 0, "y": 0, "w": 384, "h": 384 },
      "human_body_dark": { "x": 384, "y": 0, "w": 384, "h": 384 },
      "elf_body_light": { "x": 768, "y": 0, "w": 384, "h": 384 },
      "elf_body_dark": { "x": 1152, "y": 0, "w": 384, "h": 384 },
      "hair_short_back": { "x": 0, "y": 384, "w": 384, "h": 384 },
      "hair_short_front": { "x": 384, "y": 384, "w": 384, "h": 384 },
      "hair_long_back": { "x": 768, "y": 384, "w": 384, "h": 384 },
      "hair_long_front": { "x": 1152, "y": 384, "w": 384, "h": 384 },
      "outfit_cleric": { "x": 0, "y": 768, "w": 384, "h": 384 },
      "outfit_wizard": { "x": 384, "y": 768, "w": 384, "h": 384 }
    }
  };

  useEffect(() => {
    const loadImage = () => {
      if (!imageRef.current) {
        imageRef.current = new Image();
        imageRef.current.onload = () => renderCharacter();
        imageRef.current.src = '/lovable-uploads/c01a8329-36e6-4ea6-b04a-ae9e8c22895a.png';
      } else {
        renderCharacter();
      }
    };

    loadImage();
  }, [race, bodyShape, hairStyle, characterClass, skinTone, size]);

  const renderCharacter = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    
    if (!canvas || !image) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Build the sprite keys for this character
    const bodyKey = `${race}_body_${skinTone}`;
    const hairBackKey = `hair_${hairStyle}_back`;
    const hairFrontKey = `hair_${hairStyle}_front`;
    const outfitKey = `outfit_${characterClass}`;

    // Create layer mapping
    const layerSprites = {
      hair_back: hairBackKey,
      body: bodyKey,
      outfit: outfitKey,
      hair_front: hairFrontKey
    };

    // Render layers in order
    atlasData.layerOrder.forEach(layerName => {
      const spriteKey = layerSprites[layerName as keyof typeof layerSprites];
      const spriteData = atlasData.medium[spriteKey];
      
      if (spriteData) {
        ctx.drawImage(
          image,
          spriteData.x,
          spriteData.y,
          spriteData.w,
          spriteData.h,
          0,
          0,
          size,
          size
        );
      }
    });
  };

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="border-2 border-amber-600 rounded-lg bg-amber-50"
        style={{ imageRendering: 'pixelated' }}
      />
      <div className="text-xs text-gray-500 mt-2 text-center">
        Live Preview
      </div>
    </div>
  );
};

export default CharacterRenderer;
