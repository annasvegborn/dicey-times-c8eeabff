
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
  size = 256,
  showDebugGrid = false
}: CharacterRendererProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<Map<string, HTMLImageElement>>(new Map());

  // For small thumbnails, use a higher internal resolution and scale down
  const internalSize = size < 64 ? size * 4 : size;

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

    // Clear canvas with transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    console.log(`Canvas size: ${internalSize}x${internalSize}`);

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
            // For small thumbnails, use smoother scaling
            if (size < 64) {
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = 'high';
            }
            
            // Draw the sprite centered in the canvas
            ctx.drawImage(
              image,
              0,                    // Source X 
              0,                    // Source Y
              image.width,          // Source width
              image.height,         // Source height
              0,                    // Destination X
              0,                    // Destination Y
              internalSize,         // Destination width (scaled to canvas)
              internalSize          // Destination height (scaled to canvas)
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
        width={internalSize}
        height={internalSize}
        className="rounded-lg"
        style={{ 
          imageRendering: size < 64 ? 'auto' : 'auto',
          maxWidth: '100%',
          height: 'auto',
          width: `${size}px`,
          height: `${size}px`
        }}
      />
    </div>
  );
};

export default CharacterRenderer;
