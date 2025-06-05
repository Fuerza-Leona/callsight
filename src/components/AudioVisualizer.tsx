'use client';
import { useEffect, useRef, useState } from 'react';

type Props = {
  analyserNode: React.RefObject<AnalyserNode | null>;
};

export default function AudioVisualizer({ analyserNode }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size for better quality
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    const draw = () => {
      const analyser = analyserNode.current;

      if (!analyser) {
        // Clear canvas and show inactive state
        ctx.clearRect(0, 0, rect.width, rect.height);
        ctx.fillStyle = '#e5e7eb';
        ctx.fillRect(0, rect.height - 20, rect.width, 20);
        setIsActive(false);
        animationIdRef.current = requestAnimationFrame(draw);
        return;
      }

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      // Check if there's actual audio data
      const hasAudio = dataArray.some((value) => value > 0);
      const maxValue = Math.max(...dataArray);

      // Debug logging (remove in production)
      if (Math.random() < 0.01) {
        // Log 1% of the time to avoid spam
        console.log('Visualizer data:', { hasAudio, maxValue, bufferLength });
      }

      setIsActive(hasAudio);

      // Clear canvas
      ctx.clearRect(0, 0, rect.width, rect.height);

      if (hasAudio) {
        // Draw frequency bars
        const barWidth = (rect.width / bufferLength) * 2;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * rect.height * 0.8;

          // Create gradient effect
          const gradient = ctx.createLinearGradient(
            0,
            rect.height,
            0,
            rect.height - barHeight
          );
          /* gradient.addColorStop(0, '#13202A'); 
          gradient.addColorStop(1, '#8bafce');  */
          gradient.addColorStop(0, '#13202A');
          gradient.addColorStop(1, '#8bafce');
          gradient.addColorStop(1, '#697987');

          ctx.fillStyle = gradient;
          ctx.fillRect(x, rect.height - barHeight, barWidth - 1, barHeight);
          x += barWidth;
        }
      } else {
        // Draw flat line when no audio
        ctx.fillStyle = '#d1d5db';
        ctx.fillRect(0, rect.height - 4, rect.width, 4);
      }

      animationIdRef.current = requestAnimationFrame(draw);
    };

    // Start animation
    draw();

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [analyserNode]);

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Cliente simulado
          </h3>
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
              }`}
            />
            <span className="text-sm text-gray-600">
              {isActive ? 'Audio activo' : 'Audio inactivo'}
            </span>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          className="w-full h-32 bg-gray-50 rounded border"
          style={{ width: '100%', height: '128px' }}
        />

        <div className="mt-4 text-sm text-gray-500 text-center">
          {isActive
            ? 'Visualizando audio en tiempo real'
            : 'Esperando respuesta de audio...'}
        </div>
      </div>
    </div>
  );
}
