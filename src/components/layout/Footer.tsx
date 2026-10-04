import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Coffee, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { cafeInfo } from '../../data/menuData';

// Simple social media icon components
const Instagram: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
);

const Twitter: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);

const Facebook: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 3.667h-3.533v7.98H9.101z"/></svg>
);

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-espresso text-cream/80">
      <div className="container-site py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-full bg-terracotta flex items-center justify-center">
                <Coffee className="w-5 h-5 text-cream" />
              </div>
              <div>
                <span className="font-serif text-xl font-bold text-cream leading-none block">Charms</span>
                <span className="text-[10px] tracking-widest text-sage-light uppercase leading-none">Café</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-cream/60 mb-5">
              Ethically sourced beans, freshly baked pastries, and a space that feels like home.
              Serving Bengaluru since 2019.
            </p>
            <div className="flex gap-3">
              {[
                { href: cafeInfo.instagram, icon: Instagram, label: 'Instagram' },
                { href: cafeInfo.twitter, icon: Twitter, label: 'Twitter' },
                { href: cafeInfo.facebook, icon: Facebook, label: 'Facebook' },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-cream/20 flex items-center justify-center
                             hover:border-terracotta hover:text-terracotta transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-cream font-semibold mb-4 text-sm tracking-wider uppercase">Explore</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Home' },
                { to: '/menu', label: 'Our Menu' },
                { to: '/checkout', label: 'Order Now' },
              ].map(link => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className="text-sm text-cream/60 hover:text-terracotta transition-colors"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-cream font-semibold mb-4 text-sm tracking-wider uppercase">Find Us</h3>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <MapPin className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
                <span className="text-sm text-cream/60 leading-relaxed">{cafeInfo.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
                <a href={`tel:${cafeInfo.phone}`} className="text-sm text-cream/60 hover:text-terracotta transition-colors">
                  {cafeInfo.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
                <a href={`mailto:${cafeInfo.email}`} className="text-sm text-cream/60 hover:text-terracotta transition-colors">
                  {cafeInfo.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-cream font-semibold mb-4 text-sm tracking-wider uppercase">Stay in the Loop</h3>
            <p className="text-sm text-cream/60 mb-4 leading-relaxed">
              Weekly specials, seasonal menus, and exclusive member offers.
            </p>
            {subscribed ? (
              <p className="text-sm text-terracotta font-medium">🎉 You're on the list! Thank you.</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-3 py-2.5 rounded-lg bg-white/10 border border-cream/20 text-cream text-sm
                             placeholder-cream/40 focus:outline-none focus:border-terracotta transition-colors"
                  aria-label="Email for newsletter"
                />
                <button type="submit" className="p-2.5 rounded-lg bg-terracotta hover:bg-terracotta-dark transition-colors" aria-label="Subscribe">
                  <ArrowRight className="w-4 h-4 text-cream" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-site py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-cream/40">
          <p>© {new Date().getFullYear()} Charms Café. All rights reserved.</p>
          <p>Made with ☕ in Bengaluru</p>
        </div>
      </div>
    </footer>
  );
};
