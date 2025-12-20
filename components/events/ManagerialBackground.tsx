'use client';

import { useEffect, useRef } from 'react';

interface SymbolFallingProps {
  /** Number of symbol columns (default: 100) */
  density?: number;
  /** Symbol color (default: '#0f0' - green) */
  // color?: string;
  /** Background color (default: '#000' - black) */
  backgroundColor?: string;
  /** Font size in pixels (default: 16) */
  fontSize?: number;
  /** Animation speed multiplier (default: 1) */
  speed?: number;
  /** Opacity (default: 1) */
  opacity?: number;
}

class MatrixSymbol {
  x: number;
  y: number;
  value: string;
  speed: number;
  characters: string;
  canvasHeight: number;
  baseColor: string;
  brightColor: string;
  isFlashing: boolean;
  flashTimer: number;

  constructor(x: number, y: number, characters: string, canvasHeight: number, speedMultiplier: number = 1, baseColor: string, brightColor: string) {
    this.x = x;
    this.y = y;
    this.characters = characters;
    this.canvasHeight = canvasHeight;
    this.value = characters.charAt(Math.floor(Math.random() * characters.length));
    this.speed = (Math.random() * 2 + 1) * speedMultiplier;
    this.baseColor = baseColor;
    this.brightColor = brightColor;
    this.isFlashing = false;
    this.flashTimer = 0;
  }

  draw(ctx: CanvasRenderingContext2D, fontSize: number) {
    ctx.fillStyle = this.isFlashing ? this.brightColor : this.baseColor;
    ctx.font = `${fontSize}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.value, this.x, this.y);
  }

  update(canvasWidth: number) {
    // Update position
    this.y += this.speed;
    if (this.y > this.canvasHeight) {
      this.y = -16;
      this.x = Math.random() * canvasWidth;
      // Change character when resetting
      this.value = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
    }

    // Handle flashing effect
    if (this.isFlashing) {
      this.flashTimer--;
      if (this.flashTimer <= 0) {
        this.isFlashing = false;
      }
    } else {
      // Randomly trigger flash (1% chance per frame)
      if (Math.random() < 0.01) {
        this.isFlashing = true;
        this.flashTimer = Math.random() * 10 + 5; // Flash for 5-15 frames
      }
    }
  }
}

const ManagerialBackground: React.FC<SymbolFallingProps> = ({
  density = 100,
  backgroundColor = '#000',
  fontSize = 16,
  speed = 1,
  opacity = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number>(null);
  const symbolsRef = useRef<MatrixSymbol[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters
    // const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const characters = "₹$€£¥₿%∑∏∫∂√∆∇∞≠≈≡≤≥⊂⊃↗↘⟁";

    // Initialize symbols with alternating colors and bright flash colors
    symbolsRef.current = [];
    const tealBase = '#0d5c6b';
    const tealBright = '#24a4bd';
    const greenBase = '#0d6b31';
    const greenBright = '#19d439';
    
    for (let i = 0; i < density; i++) {
      const isTeal = i % 2 === 0;
      symbolsRef.current.push(
        new MatrixSymbol(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          characters,
          canvas.height,
          speed,
          isTeal ? tealBase : greenBase,
          isTeal ? tealBright : greenBright
        )
      );
    }

    // Animation loop
    const animate = () => {
      // Fill background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw and update symbols
      symbolsRef.current.forEach((symbol) => {
        symbol.draw(ctx, fontSize);
        symbol.update(canvas.width);
      });

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [density, backgroundColor, fontSize, speed]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: opacity,
        zIndex: 0,
      }}
    />
  );
};

export default ManagerialBackground;
