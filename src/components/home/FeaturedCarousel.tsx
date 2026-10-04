import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { MenuItem } from '../../types/restaurant';
import { useCartStore } from '../../store/cartStore';
import { formatINR } from '../../lib/utils';
import { DietaryBadge } from '../ui/DietaryBadge';

interface FeaturedCarouselProps {
  items: MenuItem[];
}

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ items }) => {
  const [current, setCurrent] = useState(0);
  const [added, setAdded] = useState<Record<string, boolean>>({});
  const addItem = useCartStore(s => s.addItem);

  const visible = items.slice(0, 4);

  const handleAdd = (item: MenuItem) => {
    addItem(item);
    setAdded(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => setAdded(prev => ({ ...prev, [item.id]: false })), 2000);
  };

  const prevSlide = () => setCurrent(c => (c === 0 ? visible.length - 1 : c - 1));
  const nextSlide = () => setCurrent(c => (c === visible.length - 1 ? 0 : c + 1));

  return (
    <section className="py-24 bg-cream-dark" aria-labelledby="featured-heading">
      <div className="container-site">
        {/* Heading */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-terracotta text-sm font-semibold tracking-widest uppercase">
              Chef's Picks
            </span>
            <h2 id="featured-heading" className="text-4xl lg:text-5xl font-serif text-espresso mt-2">
              Seasonal Favourites
            </h2>
          </div>
          <Link to="/menu" className="hidden sm:flex items-center gap-2 text-sm font-medium text-terracotta hover:text-terracotta-dark transition-colors">
            View full menu
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Desktop Grid */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-6">
          {visible.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="card card-hover group"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <div className="flex gap-1.5 flex-wrap mb-2">
                  {item.dietaryTags.slice(0, 2).map(tag => (
                    <DietaryBadge key={tag} tag={tag} />
                  ))}
                </div>
                <h3 className="font-semibold text-espresso text-sm leading-tight mb-1">{item.name}</h3>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-espresso">{formatINR(item.price)}</span>
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handleAdd(item)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
                      ${added[item.id]
                        ? 'bg-green-500 text-white'
                        : 'bg-terracotta text-cream hover:bg-terracotta-dark'
                      }`}
                    aria-label={`Add ${item.name} to cart`}
                  >
                    <AnimatePresence mode="wait">
                      {added[item.id] ? (
                        <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Added
                        </motion.span>
                      ) : (
                        <motion.span key="add" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1">
                          <Plus className="w-3.5 h-3.5" /> Quick Add
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="sm:hidden relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              className="card"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img src={visible[current].image} alt={visible[current].name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-espresso mb-1">{visible[current].name}</h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{visible[current].description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-espresso">{formatINR(visible[current].price)}</span>
                  <button
                    onClick={() => handleAdd(visible[current])}
                    className="btn-primary text-xs px-4 py-2"
                  >
                    <Plus className="w-3.5 h-3.5" /> Quick Add
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex items-center justify-between mt-4">
            <button onClick={prevSlide} className="p-2 rounded-full bg-cream-dark hover:bg-cream border border-cream-dark" aria-label="Previous">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-1.5">
              {visible.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-terracotta w-4' : 'bg-cream-dark'}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <button onClick={nextSlide} className="p-2 rounded-full bg-cream-dark hover:bg-cream border border-cream-dark" aria-label="Next">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
