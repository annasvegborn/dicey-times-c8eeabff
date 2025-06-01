
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
  const imagesRef = useRef<Map<string, HTMLImageElement>>(new Map());

  // Available PNG sprites in the project:
  const sprites = {
    // Body sprites
    "human_body_light": "/lovable-uploads/abafa214-22f1-4452-b38f-9e8742505419.png",
    "human_body_dark": "/lovable-uploads/54564193-b186-4fa7-b2e5-4d412ed631d4.png", 
    "elf_body_light": "/lovable-uploads/d6faf838-b1e7-486f-b827-e8a4d8db47cf.png",
    "elf_body_dark": "/lovable-uploads/be07cca1-9bfe-4be2-a6c0-f5d0b3ea2aad.png",
    
    // Brown hair sprites (for short hair)
    "brown_hair_back": "/lovable-uploads/53655382-4a79-432b-8fbf-b65697641782.png", // Main brown hair
    "brown_hair_front": "/lovable-uploads/217f7599-bc08-46e7-94c0-c4139c572ad5.png", // Short brown hair bangs
    
    // Orange hair sprites (for long hair)
    "orange_hair_back": "/lovable-uploads/0f56c26b-feb0-4971-b037-89635ec59e8c.png", // Long orange hair back
    "orange_hair_front": "/lovable-uploads/25e059d8-9e36-4ebc-b09e-f84824662f0b.png", // Short orange hair bangs
    
    // Additional sprites (Sprites-5 and Sprites-6)
    "sprites_5": "/lovable-uploads/c01a8329-36e6-4ea6-b04a-ae9e8c22895a.png",
    "sprites_6": "/lovable-uploads/9bd70a6d-18e6-4449-9959-072ee5dbb719.png",
    
    // Outfit sprites
    "outfit_cleric": "/lovable-uploads/18a93aac-f03d-4f4e-8dc9-85bc61348996.png",
    "outfit_wizard": "/lovable-uploads/eb86753c-4da5-4ea2-aff1-1001c2f8c7af.png"
  };

  useEffect(() => {
    loadImages();
  }, [race, bodyShape, hairStyle, characterClass, skinTone, size, showDebugGrid]);

  const loadImages = async () => {
    const bodyKey = `${race}_body_${skinTone}`;
    const outfitKey = `outfit_${characterClass}`;
    
    // Determine hair sprites based on hair style
    let hairBackKey, hairFrontKey;
    if (hairStyle === 'short') {
      hairBackKey = 'brown_hair_back';
      hairFrontKey = 'brown_hair_front';
    } else if (hairStyle === 'long') {
      hairBackKey = 'orange_hair_back';
      hairFrontKey = 'orange_hair_front';
    }

    const requiredSprites = [bodyKey, hairBackKey, hairFrontKey, outfitKey].filter(Boolean);
    const loadPromises: Promise<void>[] = [];

    requiredSprites.forEach(spriteKey => {
      const spriteSrc = sprites[spriteKey as keyof typeof sprites];
      if (spriteSrc && !imagesRef.current.has(spriteKey)) {
        const promise = new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            imagesRef.current.set(spriteKey, img);
            console.log(`Loaded sprite: ${spriteKey}`);
            resolve();
          };
          img.onerror = () => {
            console.error(`Failed to load sprite: ${spriteKey}`);
            reject(new Error(`Failed to load ${spriteKey}`));
          };
          img.src = spriteSrc;
        });
        loadPromises.push(promise);
      }
    });

    try {
      await Promise.all(loadPromises);
      renderCharacter();
    } catch (error) {
      console.error('Error loading images:', error);
    }
  };

  const renderCharacter = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.warn('Canvas not ready');
      return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    console.log(`Canvas size: ${size}x${size}`);

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
    }

    // Build the sprite keys for this character
    const bodyKey = `${race}_body_${skinTone}`;
    const outfitKey = `outfit_${characterClass}`;
    
    // Determine hair sprites based on hair style
    let hairBackKey, hairFrontKey;
    if (hairStyle === 'short') {
      hairBackKey = 'brown_hair_back';
      hairFrontKey = 'brown_hair_front';
    } else if (hairStyle === 'long') {
      hairBackKey = 'orange_hair_back';
      hairFrontKey = 'orange_hair_front';
    }

    // Create layer mapping with sprites (in rendering order)
    const layerSprites = [
      { key: hairBackKey, layer: 0 }, // Hair back layer
      { key: bodyKey, layer: 1 },     // Body layer
      { key: outfitKey, layer: 2 },   // Outfit layer
      { key: hairFrontKey, layer: 3 } // Hair front layer
    ];

    console.log('Rendering character with layers:', layerSprites);

    // Sort by layer order and render
    layerSprites
      .filter(sprite => sprite.key && sprites[sprite.key as keyof typeof sprites])
      .sort((a, b) => a.layer - b.layer)
      .forEach(({ key }) => {
        const image = imagesRef.current.get(key!);
        if (image) {
          console.log(`Drawing layer ${key}`);
          
          try {
            // Draw the sprite centered in the canvas
            ctx.drawImage(
              image,
              0,                    // Source X 
              0,                    // Source Y
              image.width,          // Source width
              image.height,         // Source height
              0,                    // Destination X
              0,                    // Destination Y
              size,                 // Destination width (scaled to canvas)
              size                  // Destination height (scaled to canvas)
            );
          } catch (error) {
            console.error(`Error drawing sprite ${key}:`, error);
          }
        } else {
          console.warn(`Missing image for ${key}`);
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
