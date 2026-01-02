'use client';

import React, { useEffect, useRef } from 'react';

type AgentState = 'idle' | 'listening' | 'processing' | 'speaking';

interface AudioVisualizerProps {
  state: AgentState;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ state }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // Start animation
    const animate = (timestamp: number) => {
      if (!canvas || !ctx) return;

      // Update time for animation
      timeRef.current = timestamp * 0.001; // Convert to seconds

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set up wave properties based on state
      let amplitude: number;
      let speed: number;
      let color: string;

      switch (state) {
        case 'idle':
          amplitude = 10;
          speed = 0.5;
          color = '#6B7280'; // gray-500
          break;
        case 'listening':
          amplitude = 30;
          speed = 1.0;
          color = '#06B6D4'; // cyan-500
          break;
        case 'processing':
          amplitude = 25;
          speed = 1.5;
          color = '#8B5CF6'; // violet-500
          break;
        case 'speaking':
          amplitude = 50;
          speed = 2.0;
          color = '#06B6D4'; // cyan-500
          break;
        default:
          amplitude = 10;
          speed = 0.5;
          color = '#6B7280'; // gray-500
      }

      // Draw wave with optimized points for smoother animation
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = color;
      ctx.shadowBlur = 20;
      ctx.shadowColor = color;

      const centerY = canvas.height / 2;
      const width = canvas.width;
      const pointCount = Math.max(100, width / 4); // Adjust point density based on canvas width

      // Draw the combined wave with optimized points
      for (let i = 0; i <= pointCount; i++) {
        const x = (i / pointCount) * width;

        // Normalize x for wave calculation
        const normalizedX = (x / width) * Math.PI * 4;

        // Calculate the combined wave using 3 sine functions
        let wave1 = Math.sin(normalizedX + timeRef.current * speed);
        let wave2 = Math.sin(normalizedX * 2 - timeRef.current * speed * 1.5);
        let wave3 = Math.sin(normalizedX * 0.5 + timeRef.current * speed * 0.5);

        // Combine the waves with different weights
        const combinedWave = (wave1 * 0.5 + wave2 * 0.3 + wave3 * 0.2) * amplitude;

        const y = centerY + combinedWave;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();

      // Add a subtle gradient fill under the wave for more depth
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = color;
      ctx.lineTo(width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1.0;

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [state]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 to-violet-500/10 blur-2xl opacity-40"></div>
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-xl relative z-10 bg-gray-900/30"
      />
    </div>
  );
};

export default AudioVisualizer;