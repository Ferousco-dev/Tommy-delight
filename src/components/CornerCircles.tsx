import React from 'react';
import { motion } from 'framer-motion';

interface CornerCirclesProps {
  position?: 'top-right' | 'bottom-left';
  color?: string;
  delay?: number;
}

export default function CornerCircles({ 
  position = 'top-right', 
  color = 'var(--color-primary)',
  delay = 0 
}: CornerCirclesProps) {
  const isTopRight = position === 'top-right';
  
  const layers = [
    { size: '100vw', opacity: 0.05, blur: '140px', duration: 6 },
    { size: '80vw', opacity: 0.07, blur: '110px', duration: 5 },
    { size: '60vw', opacity: 0.04, blur: '80px', duration: 4 },
    { size: '40vw', opacity: 0.03, blur: '50px', duration: 3 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {layers.map((layer, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [layer.opacity, layer.opacity * 2, layer.opacity],
            x: isTopRight ? [0, -40, 0] : [0, 40, 0],
            y: isTopRight ? [0, 40, 0] : [0, -40, 0],
          }}
          transition={{ 
            duration: layer.duration + 8, 
            ease: "easeInOut", 
            delay: delay + (index * 0.5),
            repeat: Infinity,
            repeatType: "mirror"
          }}
          style={{
            backgroundColor: color,
            width: layer.size,
            height: layer.size,
            borderRadius: '50%',
            position: 'absolute',
            top: isTopRight ? `-${parseInt(layer.size) / 3}vw` : 'auto',
            right: isTopRight ? `-${parseInt(layer.size) / 3}vw` : 'auto',
            bottom: !isTopRight ? `-${parseInt(layer.size) / 3}vw` : 'auto',
            left: !isTopRight ? `-${parseInt(layer.size) / 3}vw` : 'auto',
            filter: `blur(${layer.blur})`,
          }}
        />
      ))}
    </div>
  );
}
