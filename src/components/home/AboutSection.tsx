import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Heart, Users } from 'lucide-react';

const pillars = [
  {
    icon: Leaf,
    title: 'Ethically Sourced',
    desc: 'Every bean we use is directly traded from small-holder farms. We pay a living wage and visit our partners annually.',
  },
  {
    icon: Heart,
    title: 'Baked Fresh Daily',
    desc: "Our bakers arrive at 4 AM so you never eat yesterday's pastry. From croissants to sourdoughs — always oven-warm.",
  },
  {
    icon: Users,
    title: 'Community First',
    desc: '10% of profits support local literacy programmes and we host free weekend workshops for aspiring baristas.',
  },
];

export const AboutSection: React.FC = () => (
  <section className="py-24 bg-cream" aria-labelledby="about-heading">
    <div className="container-site">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="rounded-2xl overflow-hidden aspect-[4/3]">
            <img
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80"
              alt="Barista crafting coffee at Charms Café"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Floating badge */}
          <div className="absolute -bottom-5 -right-5 bg-terracotta text-cream rounded-2xl px-5 py-4 shadow-xl">
            <p className="text-3xl font-serif font-bold">5+</p>
            <p className="text-xs opacity-80 mt-0.5">Years of craft</p>
          </div>
          {/* Accent block */}
          <div className="absolute -top-4 -left-4 w-24 h-24 rounded-2xl bg-sage/20 -z-10" />
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="text-terracotta text-sm font-semibold tracking-widest uppercase">Our Story</span>
          <h2 id="about-heading" className="text-4xl lg:text-5xl font-serif text-espresso mt-3 mb-6 leading-tight">
            Brewed with intention, served with warmth
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Charms Café was born from a simple belief: that great coffee and great company can
            transform an ordinary Tuesday into something memorable. Founded in 2019 by Ananya and
            Ravi Krishnan — coffee obsessives and amateur bakers — we started as a 12-seat corner
            spot in Koramangala.
          </p>
          <p className="text-gray-600 leading-relaxed mb-10">
            Today we're still that corner spot at heart, just with a bigger kitchen and a loyal
            community of regulars who feel more like family.
          </p>

          {/* Pillars */}
          <div className="space-y-5">
            {pillars.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-terracotta/10 flex items-center justify-center mt-0.5">
                  <Icon className="w-5 h-5 text-terracotta" />
                </div>
                <div>
                  <p className="font-semibold text-espresso text-sm">{title}</p>
                  <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);
