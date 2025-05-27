
import { useEffect, useRef } from 'react';

interface CharacterRendererProps {
  race: string;
  bodyShape: string;
  hairStyle: string;
  characterClass: string;
  skinTone?: 'light' | 'dark';
  size?: number;
  showDebugGrid?: boolean;
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
  size = 192,
  showDebugGrid = false
}: CharacterRendererProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Atlas data - all sprites are 384x384 with their own positions
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
        imageRef.current.onload = () => {
          console.log('Image loaded successfully');
          renderCharacter();
        };
        imageRef.current.onerror = () => {
          console.error('Failed to load character atlas image');
        };
        imageRef.current.src = '/lovable-uploads/c01a8329-36e6-4ea6-b04a-ae9e8c22895a.png';
      } else {
        renderCharacter();
      }
    };

    loadImage();
  }, [race, bodyShape, hairStyle, characterClass, skinTone, size, showDebugGrid]);

  const renderCharacter = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    
    if (!canvas || !image) {
      console.warn('Canvas or image not ready');
      return;
    }

    if (image.complete && image.naturalWidth === 0) {
      console.error('Image failed to load or is broken');
      return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate the scale factor to fit 384x384 sprites into the canvas
    const spriteSize = 384;
    const scale = size / spriteSize;
    
    // Calculate centering offset to center the scaled sprite in the canvas
    const offsetX = (size - (spriteSize * scale)) / 2;
    const offsetY = (size - (spriteSize * scale)) / 2;

    console.log(`Canvas size: ${size}x${size}, Sprite size: ${spriteSize}x${spriteSize}, Scale: ${scale}, Offset: ${offsetX}, ${offsetY}`);

    // Optional: Draw debug grid
    if (showDebugGrid) {
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
      ctx.lineWidth = 1;
      
      // Draw canvas center lines
      ctx.beginPath();
      ctx.moveTo(size / 2, 0);
      ctx.lineTo(size / 2, size);
      ctx.moveTo(0, size / 2);
      ctx.lineTo(size, size / 2);
      ctx.stroke();
      
      // Draw sprite bounds
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
      ctx.strokeRect(offsetX, offsetY, spriteSize * scale, spriteSize * scale);
      
      // Draw quarter lines within sprite bounds
      ctx.strokeStyle = 'rgba(0, 0, 255, 0.3)';
      const spriteLeft = offsetX;
      const spriteTop = offsetY;
      const spriteRight = offsetX + (spriteSize * scale);
      const spriteBottom = offsetY + (spriteSize * scale);
      const spriteCenterX = offsetX + (spriteSize * scale) / 2;
      const spriteCenterY = offsetY + (spriteSize * scale) / 2;
      
      ctx.beginPath();
      ctx.moveTo(spriteCenterX, spriteTop);
      ctx.lineTo(spriteCenterX, spriteBottom);
      ctx.moveTo(spriteLeft, spriteCenterY);
      ctx.lineTo(spriteRight, spriteCenterY);
      ctx.stroke();
    }

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

    console.log('Rendering character with layers:', layerSprites);

    // Render layers in order - all using the SAME origin point and scale
    atlasData.layerOrder.forEach(layerName => {
      const spriteKey = layerSprites[layerName as keyof typeof layerSprites];
      const spriteData = atlasData.medium[spriteKey];
      
      if (spriteData) {
        console.log(`Drawing layer ${layerName} with sprite ${spriteKey}:`, spriteData);
        
        try {
          // Draw each sprite with the EXACT same destination coordinates
          // This ensures all layers share the same origin and scale
          ctx.drawImage(
            image,
            spriteData.x,        // Source X in atlas
            spriteData.y,        // Source Y in atlas  
            spriteData.w,        // Source width (always 384)
            spriteData.h,        // Source height (always 384)
            offsetX,             // Destination X (same for all layers)
            offsetY,             // Destination Y (same for all layers)
            spriteSize * scale,  // Destination width (same for all layers)
            spriteSize * scale   // Destination height (same for all layers)
          );
        } catch (error) {
          console.error(`Error drawing sprite ${spriteKey}:`, error);
        }
      } else {
        console.warn(`Missing sprite data for ${spriteKey}`);
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
        <br />
        <span className="text-xs">{race} {skinTone} - {hairStyle} - {characterClass}</span>
        {showDebugGrid && <br />}
        {showDebugGrid && <span className="text-xs text-red-500">Debug Grid ON</span>}
      </div>
    </div>
  );
};

export default CharacterRenderer;
