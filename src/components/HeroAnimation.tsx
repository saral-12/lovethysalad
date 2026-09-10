'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const HeroAnimation = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto aspect-square flex items-center justify-center">
      {/* Soft glowing background circle */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-4 rounded-full bg-gradient-to-tr from-salad-fresh/30 via-salad-accent/20 to-salad-leaf/20 blur-3xl"
      />

      {/* Outer organic ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-8 rounded-full border border-dashed border-salad-leaf/20"
      />

      {/* Main Central Salad Bowl / Delivery Container */}
      <motion.div
        initial={{ scale: 0, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
        className="relative z-20 w-3/4 aspect-square rounded-full shadow-2xl overflow-hidden border-4 border-white/80 bg-white group cursor-pointer"
      >
        <img
          src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80"
          alt="Fresh Avocado Quinoa Salad Bowl"
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-salad-dark/40 via-transparent to-transparent opacity-60" />
        
        {/* Floating badge over bowl */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-salad-leaf/20 flex items-center gap-2 whitespace-nowrap"
        >
          <span className="w-2 h-2 rounded-full bg-salad-fresh animate-ping" />
          <span className="text-xs font-semibold text-salad-dark tracking-wide">
            Prepared Fresh Daily in Baner
          </span>
        </motion.div>
      </motion.div>

      {/* FLOATING FOOD ELEMENT 1: Avocado Slice (Top Left) */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1, y: [0, -12, 0], rotate: [-5, 5, -5] }}
        transition={{
          duration: 0.6,
          delay: 0.2,
          y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute -top-2 left-2 z-30 w-24 h-24 rounded-2xl p-2 shadow-xl glass-card border border-white/80 flex flex-col items-center justify-center text-center"
      >
        <span className="text-3xl mb-1">🥑</span>
        <span className="text-[10px] font-bold text-salad-dark uppercase tracking-wider">Avocado</span>
      </motion.div>

      {/* FLOATING FOOD ELEMENT 2: Cold Pressed Juice Bottle (Top Right) */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1, y: [0, -15, 0], rotate: [5, -5, 5] }}
        transition={{
          duration: 0.6,
          delay: 0.3,
          y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
          rotate: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute top-4 -right-2 z-30 w-28 h-28 rounded-2xl overflow-hidden shadow-xl glass-card border border-white/80 flex flex-col items-center justify-between text-center group cursor-pointer"
      >
        <div className="relative w-full h-16 overflow-hidden">
          <img
            src="/images/cold_pressed_juices.jpg"
            alt="Cold Pressed Juices"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
        <div className="pb-1.5 px-1">
          <span className="text-[10px] font-bold text-salad-dark block uppercase tracking-wider">Cold Juices</span>
          <span className="text-[9px] text-salad-leaf font-bold block">100% Raw</span>
        </div>
      </motion.div>

      {/* FLOATING FOOD ELEMENT 3: Smoothie Jar (Bottom Left) */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1, y: [0, -10, 0], rotate: [-8, 4, -8] }}
        transition={{
          duration: 0.6,
          delay: 0.4,
          y: { duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 },
          rotate: { duration: 4.8, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute bottom-6 -left-4 z-30 w-26 h-26 rounded-2xl p-2.5 shadow-xl glass-card border border-white/80 flex flex-col items-center justify-center text-center"
      >
        <span className="text-3xl mb-1">🫐</span>
        <span className="text-[10px] font-bold text-salad-dark uppercase tracking-wider">Berry Jar</span>
      </motion.div>

      {/* FLOATING FOOD ELEMENT 4: Fresh Mint Leaves & Tomato (Bottom Right) */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1, y: [0, -14, 0], rotate: [4, -8, 4] }}
        transition={{
          duration: 0.6,
          delay: 0.5,
          y: { duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
          rotate: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute -bottom-2 right-4 z-30 w-24 h-24 rounded-2xl p-2 shadow-xl glass-card border border-white/80 flex flex-col items-center justify-center text-center"
      >
        <span className="text-3xl mb-1">🌿</span>
        <span className="text-[10px] font-bold text-salad-dark uppercase tracking-wider">Fresh Basil</span>
      </motion.div>

      {/* Floating Sparkle Chips */}
      <motion.div
        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/4 z-10 text-salad-accent text-xl"
      >
        ✨
      </motion.div>
      <motion.div
        animate={{ scale: [1, 0.7, 1], opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-1/3 right-1/4 z-10 text-salad-fresh text-xl"
      >
        🌱
      </motion.div>
    </div>
  );
};
