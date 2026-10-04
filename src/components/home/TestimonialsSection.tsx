import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import type { Testimonial } from '../../types/restaurant';

interface TestimonialsProps {
  testimonials: Testimonial[];
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-gold fill-gold' : 'text-gray-200 fill-gray-200'}`}
      />
    ))}
  </div>
);

export const TestimonialsSection: React.FC<TestimonialsProps> = ({ testimonials }) => (
  <section className="py-24 bg-espresso" aria-labelledby="reviews-heading">
    <div className="container-site">
      <div className="text-center mb-14">
        <span className="text-terracotta text-sm font-semibold tracking-widest uppercase">
          What Guests Say
        </span>
        <h2 id="reviews-heading" className="text-4xl lg:text-5xl font-serif text-cream mt-2">
          Love from our community
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.blockquote
            key={t.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative bg-white/5 border border-cream/10 rounded-2xl p-6 flex flex-col gap-4"
          >
            {/* Decorative quote mark */}
            <span className="absolute top-4 right-5 text-5xl font-serif text-cream/10 leading-none select-none" aria-hidden="true">
              "
            </span>

            <StarRating rating={t.rating} />

            <p className="text-cream/80 text-sm leading-relaxed flex-1 italic">
              {t.quote}
            </p>

            <footer className="flex items-center gap-3 pt-2 border-t border-cream/10">
              {t.avatar && (
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <div>
                <cite className="text-cream font-semibold text-sm not-italic">{t.name}</cite>
                <p className="text-cream/40 text-xs">{t.date}</p>
              </div>
            </footer>
          </motion.blockquote>
        ))}
      </div>
    </div>
  </section>
);
