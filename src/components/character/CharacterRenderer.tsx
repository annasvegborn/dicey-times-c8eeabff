
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

interface SpriteFrame {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface SpriteData {
  frame: SpriteFrame;
  spriteSourceSize: SpriteFrame;
  sourceSize: {
    w: number;
    h: number;
  };
}

interface AtlasData {
  frames: Record<string, SpriteData>;
  meta: {
    size: {
      w: number;
      h: number;
    };
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
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Updated atlas data based on the new sprite layout (384x384px sprites in a grid)
  const atlasData: AtlasData = {
    "frames": {
      "human_body_light": {
        "frame": {
          "x": 0,
          "y": 0,
          "w": 384,
          "h": 384
        },
        "spriteSourceSize": {
          "x": 0,
          "y": 0,
          "w": 384,
          "h": 384
        },
        "sourceSize": {
          "w": 384,
          "h": 384
        }
      },
      "human_body_dark": {
        "frame": {
          "x": 384,
          "y": 0,
          "w": 384,
          "h": 384
        },
        "spriteSourceSize": {
          "x": 0,
          "y": 0,
          "w": 384,
          "h": 384
        },
        "sourceSize": {
          "w": 384,
          "h": 384
        }
      },
      "elf_body_light": {
        "frame": {
          "x": 768,
          "y": 0,
          "w": 384,
          "h": 384
        },
        "spriteSourceSize": {
          "x": 0,
          "y": 0,
          "w": 384,
          "h": 384
        },
        "sourceSize": {
          "w": 384,
          "h": 384
        }
      },
      "elf_body_dark": {
        "frame": {
          "x": 1152,
          "y": 0,
          "w": 384,
          "h": 384
        },
        "spriteSourceSize": {
          "x": 0,
          "y": 0,
          "w": 384,
          "h": 384
        },
        "sourceSize": {
          "w": 384,
          "h": 384
        }
      },
      "hair_short_back": {
        "frame": {
          "x": 0,
          "y": 384,
          "w": 384,
          "h": 384
        },
        "spriteSourceSize": {
          "x": 0,
          "y": 0,
          "w": 384,
          "h": 384
        },
        "sourceSize": {
          "w": 384,
          "h": 384
        }
      },
      "hair_short_front": {
        "frame": {
          "x": 384,
          "y": 384,
          "w": 384,
          "h": 384
        },
        "spriteSourceSize": {
          "x": 0,
          "y": 0,
          "w": 384,
          "h": 384
        },
        "sourceSize": {
          "w": 384,
          "h": 384
        }
      },
      "hair_long_back": {
        "frame": {
          "x": 768,
          "y": 384,
          "w": 384,
          "h": 384
        },
        "spriteSourceSize": {
          "x": 0,
          "y": 0,
          "w": 384,
          "h": 384
        },
        "sourceSize": {
          "w": 384,
          "h": 384
        }
      },
      "hair_long_front": {
        "frame": {
          "x": 1152,
          "y": 384,
          "w": 384,
          "h": 384
        },
        "spriteSourceSize": {
          "x": 0,
          "y": 0,
          "w": 384,
          "h": 384
        },
        "sourceSize": {
          "w": 384,
          "h": 384
        }
      },
      "outfit_cleric": {
        "frame": {
          "x": 0,
          "y": 768,
          "w": 384,
          "h": 384
        },
        "spriteSourceSize": {
          "x": 0,
          "y": 0,
          "w": 384,
          "h": 384
        },
        "sourceSize": {
          "w": 384,
          "h": 384
        }
      },
      "outfit_wizard": {
        "frame": {
          "x": 384,
          "y": 768,
          "w": 384,
          "h": 384
        },
        "spriteSourceSize": {
          "x": 0,
          "y": 0,
          "w": 384,
          "h": 384
        },
        "sourceSize": {
          "w": 384,
          "h": 384
        }
      }
    },
    "meta": {
      "size": {
        "w": 1536,
        "h": 1152
      },
      "layerOrder": [
        "hair_back",
        "body",
        "outfit",
        "hair_front"
      ]
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
        imageRef.current.src = '/lovable-uploads/9bd70a6d-18e6-4449-9959-072ee5dbb719.png';
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

    // Render layers in order using the new atlas format
    atlasData.meta.layerOrder.forEach(layerName => {
      const spriteKey = layerSprites[layerName as keyof typeof layerSprites];
      const spriteData = atlasData.frames[spriteKey];
      
      if (spriteData) {
        console.log(`Drawing layer ${layerName} with sprite ${spriteKey}:`, spriteData);
        
        try {
          // Since sprites are now full 384x384 and positioned in a grid, we can draw them directly
          const destX = offsetX;
          const destY = offsetY;
          const destW = spriteSize * scale;
          const destH = spriteSize * scale;

          // Draw the sprite frame from the atlas
          ctx.drawImage(
            image,
            spriteData.frame.x,    // Source X in atlas
            spriteData.frame.y,    // Source Y in atlas  
            spriteData.frame.w,    // Source width (384px)
            spriteData.frame.h,    // Source height (384px)
            destX,                 // Destination X
            destY,                 // Destination Y
            destW,                 // Destination width (scaled)
            destH                  // Destination height (scaled)
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
