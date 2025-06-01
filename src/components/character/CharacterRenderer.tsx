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
  src: string;
  layer: number;
}

interface AtlasData {
  sprites: Record<string, SpriteData>;
  meta: {
    layerOrder: string[];
  };
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

  // Updated atlas data with correct sprite file mapping
  const atlasData: AtlasData = {
    "sprites": {
      "human_body_light": {
        "src": "/lovable-uploads/abafa214-22f1-4452-b38f-9e8742505419.png",
        "layer": 1
      },
      "human_body_dark": {
        "src": "/lovable-uploads/54564193-b186-4fa7-b2e5-4d412ed631d4.png",
        "layer": 1
      },
      "elf_body_light": {
        "src": "/lovable-uploads/d6faf838-b1e7-486f-b827-e8a4d8db47cf.png",
        "layer": 1
      },
      "elf_body_dark": {
        "src": "/lovable-uploads/be07cca1-9bfe-4be2-a6c0-f5d0b3ea2aad.png",
        "layer": 1
      },
      // Short hair: Sprites-5 (back) and Sprites-6 (front)
      "hair_short_back": {
        "src": "/lovable-uploads/c01a8329-36e6-4ea6-b04a-ae9e8c22895a.png",
        "layer": 0
      },
      "hair_short_front": {
        "src": "/lovable-uploads/9bd70a6d-18e6-4449-9959-072ee5dbb719.png",
        "layer": 3
      },
      // Long orange hair (back layer)
      "hair_long_back": {
        "src": "/lovable-uploads/0f56c26b-feb0-4971-b037-89635ec59e8c.png",
        "layer": 0
      },
      // Long orange hair (front/bangs layer)
      "hair_long_front": {
        "src": "/lovable-uploads/25e059d8-9e36-4ebc-b09e-f84824662f0b.png",
        "layer": 3
      },
      "outfit_cleric": {
        "src": "/lovable-uploads/18a93aac-f03d-4f4e-8dc9-85bc61348996.png",
        "layer": 2
      },
      "outfit_wizard": {
        "src": "/lovable-uploads/eb86753c-4da5-4ea2-aff1-1001c2f8c7af.png",
        "layer": 2
      }
    },
    "meta": {
      "layerOrder": [
        "hair_back",
        "body",
        "outfit",
        "hair_front"
      ]
    }
  };

  useEffect(() => {
    loadImages();
  }, [race, bodyShape, hairStyle, characterClass, skinTone, size, showDebugGrid]);

  const loadImages = async () => {
    const bodyKey = `${race}_body_${skinTone}`;
    const hairBackKey = `hair_${hairStyle}_back`;
    const hairFrontKey = `hair_${hairStyle}_front`;
    const outfitKey = `outfit_${characterClass}`;

    const requiredSprites = [bodyKey, hairBackKey, hairFrontKey, outfitKey];
    const loadPromises: Promise<void>[] = [];

    requiredSprites.forEach(spriteKey => {
      const spriteData = atlasData.sprites[spriteKey];
      if (spriteData && !imagesRef.current.has(spriteKey)) {
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
          img.src = spriteData.src;
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
    const hairBackKey = `hair_${hairStyle}_back`;
    const hairFrontKey = `hair_${hairStyle}_front`;
    const outfitKey = `outfit_${characterClass}`;

    // Create layer mapping with sprites
    const layerSprites = [
      { key: hairBackKey, layer: 0 },
      { key: bodyKey, layer: 1 },
      { key: outfitKey, layer: 2 },
      { key: hairFrontKey, layer: 3 }
    ];

    console.log('Rendering character with layers:', layerSprites);

    // Sort by layer order and render
    layerSprites
      .filter(sprite => atlasData.sprites[sprite.key])
      .sort((a, b) => a.layer - b.layer)
      .forEach(({ key }) => {
        const image = imagesRef.current.get(key);
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
