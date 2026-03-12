import React from 'react';
import { motion } from 'framer-motion';

export default function FloatingShapes() {
  const shapes = [
    { size: 300, x: '5%', y: '15%', color: 'var(--color-accent)', delay: 0, duration: 25 },
    { size: 450, x: '75%', y: '5%', color: 'var(--color-primary)', delay: 2, duration: 30 },
    { size: 200, x: '35%', y: '65%', color: 'var(--color-accent)', delay: 5, duration: 22 },
    { size: 350, x: '65%', y: '75%', color: 'var(--color-primary)', delay: 1, duration: 28 },
    { size: 250, x: '10%', y: '55%', color: 'var(--color-accent)', delay: 3, duration: 35 },
  ];

  // Side circles that "come out" from the edges
  const sideCircles = [
    { side: 'left', top: '20%', size: 400, color: 'var(--color-primary)', delay: 0 },
    { side: 'right', top: '50%', size: 500, color: 'var(--color-accent)', delay: 1.5 },
    { side: 'left', top: '80%', size: 350, color: 'var(--color-primary)', delay: 3 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Main Floating Shapes with "Gravity" feel */}
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          initial={{ 
            x: shape.x, 
            y: shape.y, 
            opacity: 0,
            scale: 0.8,
          }}
          animate={{ 
            // Subtle, slow drifting movement
            x: [shape.x, `${parseFloat(shape.x) + 3}%`, `${parseFloat(shape.x) - 2}%`, shape.x],
            y: [shape.y, `${parseFloat(shape.y) + 5}%`, `${parseFloat(shape.y) - 3}%`, shape.y],
            opacity: [0.03, 0.08, 0.03],
            scale: [0.9, 1.05, 0.95, 0.9],
          }}
          transition={{ 
            duration: shape.duration, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: shape.delay
          }}
          style={{
            position: 'absolute',
            width: shape.size,
            height: shape.size,
            borderRadius: '50%',
            backgroundColor: shape.color,
            filter: 'blur(100px)',
          }}
        />
      ))}

      {/* Side Circles coming out from edges */}
      {sideCircles.map((circle, index) => (
        <motion.div
          key={`side-${index}`}
          initial={{ 
            x: circle.side === 'left' ? '-60%' : '60%',
            opacity: 0,
            scale: 0.5
          }}
          whileInView={{ 
            x: circle.side === 'left' ? '-30%' : '30%',
            opacity: 0.1,
            scale: 1
          }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ 
            duration: 2.5, 
            ease: [0.2, 1, 0.3, 1],
            delay: circle.delay
          }}
          style={{
            position: 'absolute',
            top: circle.top,
            width: circle.size,
            height: circle.size,
            borderRadius: '50%',
            backgroundColor: circle.color,
            filter: 'blur(80px)',
            [circle.side]: 0,
          }}
        />
      ))}
      
      {/* Subtle "Dust" particles / Glitters */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`dust-${i}`}
          initial={{ 
            x: `${Math.random() * 100}%`, 
            y: `${Math.random() * 100}%`,
            opacity: 0,
            scale: 0
          }}
          animate={{ 
            y: ['-10%', '110%'],
            x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
            opacity: [0, 0.4, 0],
            scale: [0, 1, 0]
          }}
          transition={{ 
            duration: 10 + Math.random() * 15, 
            repeat: Infinity, 
            ease: "linear",
            delay: Math.random() * 10
          }}
          className="absolute w-1.5 h-1.5 bg-white rounded-full blur-[1px] shadow-[0_0_10px_rgba(255,255,255,0.8)]"
        />
      ))}
    </div>
  );
}
