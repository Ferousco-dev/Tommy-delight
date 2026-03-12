import React from 'react';
import { motion } from 'framer-motion';
import { getProxiedImageUrl } from '../utils';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 360],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative w-28 h-28 p-1 rounded-full bg-gradient-to-tr from-primary via-accent to-primary shadow-2xl"
      >
        <div className="w-full h-full bg-white rounded-full p-1 overflow-hidden">
          <img
            src={getProxiedImageUrl("https://files.catbox.moe/rywtuf.jpg")}
            alt="Loading..."
            className="w-full h-full object-cover rounded-full"
            referrerPolicy="no-referrer"
          />
        </div>
        
        {/* Orbiting element */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-2 border-2 border-dashed border-accent/30 rounded-full"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mt-8 text-center"
      >
        <p className="text-primary font-bold tracking-[0.2em] uppercase text-xs mb-1">
          Tommy Delights
        </p>
        <p className="text-dark/40 font-medium text-[10px] uppercase tracking-widest">
          Loading Excellence...
        </p>
      </motion.div>
    </div>
  );
}
