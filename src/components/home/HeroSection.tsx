import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, MapPin, ArrowRight, UtensilsCrossed } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1600&q=85"
          alt="Interior of Charms Café"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-espresso/90 via-espresso/70 to-espresso/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-site py-32 lg:py-40">
        <div className="max-w-2xl">
          {/* Hours badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream/10 border border-cream/20
                       backdrop-blur-sm text-cream text-sm font-medium mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <Clock className="w-4 h-4 opacity-70" />
            Open today · 7:00 AM – 9:00 PM
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-serif text-cream leading-[1.08] mb-6"
          >
            Artisanal Roasts,{' '}
            <span className="text-terracotta-light italic">Handcrafted</span>{' '}
            Moments
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-lg text-cream/75 max-w-lg leading-relaxed mb-10"
          >
            Ethically sourced single-origin coffees, freshly baked pastries, and a cosy community
            corner where every cup tells a story.
          </motion.p>

          {/* Location pill */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="flex items-center gap-1.5 text-sm text-cream/60 mb-10"
          >
            <MapPin className="w-4 h-4 text-terracotta-light" />
            Koramangala, Bengaluru
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/menu" className="btn-primary text-base px-8 py-4">
              <UtensilsCrossed className="w-4 h-4" />
              Explore Our Menu
            </Link>
            <Link to="/checkout" className="inline-flex items-center gap-2 px-8 py-4 rounded-btn border-2
              border-cream/40 text-cream font-semibold text-base hover:bg-cream/10 active:scale-95 transition-all duration-200">
              Order Ahead
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        aria-hidden="true"
      >
        <span className="text-xs text-cream/40 tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="w-0.5 h-8 bg-gradient-to-b from-cream/40 to-transparent rounded-full"
        />
      </motion.div>
    </section>
  );
};
