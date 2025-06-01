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

  // Available PNG sprites in the project with descriptive names:
  const sprites = {
    // Body sprites
    "human_body_light": "/lovable-uploads/body-human-skin1.png",
    "human_body_dark": "/lovable-uploads/body-human-skin2.png", 
    "elf_body_light": "/lovable-uploads/body-elf-skin1.png",
    "elf_body_dark": "/lovable-uploads/body-elf-skin2.png",
    
    // Brown hair sprites (for short hair)
    "brown_hair_back": "/lovable-uploads/hair1-brown-back.png",
    "brown_hair_front": "/lovable-uploads/hair1-brown-front.png",
    
    // Orange hair sprites (for long hair)
    "orange_hair_back": "/lovable-uploads/hair2-orange-back.png",
    "orange_hair_front": "/lovable-uploads/hair2-orange-front.png",
    
    // Outfit sprites
    "outfit_cleric": "/lovable-uploads/outfit-cleric.png",
    "outfit_wizard": "/lovable-uploads/outfit-wizard.png"
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
