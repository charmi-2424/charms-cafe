import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Minus, Check, SlidersHorizontal, X } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { DietaryBadge } from '../components/ui/DietaryBadge';
import { Modal } from '../components/ui/Modal';
import { useCartStore } from '../store/cartStore';
import { formatINR } from '../lib/utils';
import { useDebounce } from '../hooks/useDebounce';
import { menuItems } from '../data/menuData';
import type { MenuItem, Category, DietaryTag } from '../types/restaurant';

const CATEGORIES: Category[] = [
  'Hot Brews',
  'Cold Beverages',
  'Bakery & Pastries',
  'All-Day Brunch',
  'Desserts',
];

const DIETARY_FILTERS: DietaryTag[] = ['Vegan', 'Vegetarian', 'Gluten-Free'];

// ─── Menu Item Card ───────────────────────────────────────────────────────────
const MenuCard: React.FC<{ item: MenuItem; onCustomize: (item: MenuItem) => void }> = ({ item, onCustomize }) => {
  const { items, addItem, updateQuantity } = useCartStore();
  const cartEntry = items.find(ci => ci.menuItem.id === item.id);
  const qty = cartEntry?.quantity ?? 0;
  const [justAdded, setJustAdded] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleAdd = () => {
    if (item.customizable && item.addons?.length) {
      onCustomize(item);
      return;
    }
    addItem(item);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className={`card card-hover flex flex-col ${!item.isAvailable ? 'opacity-50 pointer-events-none' : ''}`}
      aria-label={item.name}
    >
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden relative">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-espresso/60 flex items-center justify-center">
            <span className="text-cream font-semibold text-sm bg-espresso/80 px-3 py-1 rounded-full">
              Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Dietary badges */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {item.dietaryTags.map(tag => <DietaryBadge key={tag} tag={tag} />)}
        </div>

        <h3 className="font-semibold text-espresso text-base leading-tight mb-1">{item.name}</h3>

        {/* Description with expand toggle */}
        <div className="mb-3 flex-1">
          <p className={`text-sm text-gray-500 leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
            {item.description}
          </p>
          {item.description.length > 100 && (
            <button
              onClick={() => setExpanded(v => !v)}
              className="text-xs text-terracotta font-medium mt-1 hover:text-terracotta-dark transition-colors"
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        {/* Price + Cart Controls */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-cream-dark">
          <span className="text-lg font-bold text-espresso">{formatINR(item.price)}</span>

          <AnimatePresence mode="wait">
            {qty === 0 ? (
              <motion.button
                key="add-btn"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                whileTap={{ scale: 0.93 }}
                onClick={handleAdd}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                  ${justAdded ? 'bg-green-500 text-white' : 'bg-terracotta text-cream hover:bg-terracotta-dark'}`}
                aria-label={`Add ${item.name} to cart`}
              >
                {justAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {justAdded ? 'Added!' : 'Add'}
              </motion.button>
            ) : (
              <motion.div
                key="qty-ctrl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="flex items-center gap-2 bg-cream-dark rounded-xl px-1 py-1"
              >
                <button
                  onClick={() => updateQuantity(item.id, qty - 1)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center font-bold text-espresso text-sm">{qty}</span>
                <button
                  onClick={() => updateQuantity(item.id, qty + 1)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.article>
  );
};

// ─── Customization Modal ──────────────────────────────────────────────────────
const CustomizeModal: React.FC<{
  item: MenuItem | null;
  onClose: () => void;
  onAdd: (item: MenuItem, addons: Record<string, string>) => void;
}> = ({ item, onClose, onAdd }) => {
  const [selections, setSelections] = useState<Record<string, string>>({});

  if (!item) return null;

  const handleSelect = (addonId: string, optionId: string) => {
    setSelections(prev => ({ ...prev, [addonId]: optionId }));
  };

  const priceModifier = item.addons?.reduce((sum, addon) => {
    const optionId = selections[addon.id];
    if (!optionId) return sum;
    const option = addon.options.find(o => o.id === optionId);
    return sum + (option?.priceModifier ?? 0);
  }, 0) ?? 0;

  return (
    <Modal isOpen={!!item} onClose={onClose} title={item.name} maxWidth="max-w-md">
      <div className="space-y-5">
        <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded-xl" />
        <p className="text-sm text-gray-600">{item.description}</p>

        {item.addons?.map(addon => (
          <div key={addon.id}>
            <p className="text-sm font-semibold text-espresso mb-2">{addon.label}</p>
            <div className="grid grid-cols-2 gap-2">
              {addon.options.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(addon.id, opt.id)}
                  className={`px-3 py-2 rounded-xl border text-sm font-medium text-left transition-all
                    ${selections[addon.id] === opt.id
                      ? 'border-terracotta bg-terracotta/10 text-terracotta'
                      : 'border-gray-200 text-gray-700 hover:border-terracotta/50'
                    }`}
                >
                  <span>{opt.label}</span>
                  {opt.priceModifier > 0 && (
                    <span className="text-xs text-gray-400 ml-1">+{formatINR(opt.priceModifier)}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-3 border-t border-cream-dark flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Total price</p>
            <p className="text-xl font-bold text-espresso">{formatINR(item.price + priceModifier)}</p>
          </div>
          <button
            onClick={() => { onAdd(item, selections); onClose(); }}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" /> Add to Order
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ─── Menu Page ────────────────────────────────────────────────────────────────
const MenuPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDietaryFilters, setActiveDietaryFilters] = useState<DietaryTag[]>([]);
  const [customizeItem, setCustomizeItem] = useState<MenuItem | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const debouncedSearch = useDebounce(searchQuery, 280);
  const addItem = useCartStore(s => s.addItem);

  const toggleDietaryFilter = (tag: DietaryTag) => {
    setActiveDietaryFilters(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchSearch = debouncedSearch
        ? item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          item.description.toLowerCase().includes(debouncedSearch.toLowerCase())
        : true;
      const matchDietary = activeDietaryFilters.length === 0 ||
        activeDietaryFilters.every(tag => item.dietaryTags.includes(tag));
      return matchCategory && matchSearch && matchDietary;
    });
  }, [activeCategory, debouncedSearch, activeDietaryFilters]);

  const groupedItems = useMemo(() => {
    if (activeCategory !== 'All') return { [activeCategory]: filteredItems };
    return CATEGORIES.reduce((acc, cat) => {
      const items = filteredItems.filter(i => i.category === cat);
      if (items.length > 0) acc[cat] = items;
      return acc;
    }, {} as Record<string, MenuItem[]>);
  }, [filteredItems, activeCategory]);

  return (
    <>
      <Header />
      <main className="pt-20" id="main-content">
        {/* Page header */}
        <div className="bg-espresso py-16">
          <div className="container-site text-center">
            <span className="text-terracotta text-sm font-semibold tracking-widest uppercase">Our Menu</span>
            <h1 className="text-4xl lg:text-5xl font-serif text-cream mt-2 mb-3">
              Crafted with care, served with love
            </h1>
            <p className="text-cream/60 max-w-lg mx-auto text-sm">
              Every item on our menu is made fresh daily with seasonal, locally sourced ingredients.
            </p>
          </div>
        </div>

        {/* Sticky filter bar */}
        <div className="sticky top-16 md:top-20 z-20 bg-cream/95 backdrop-blur-md border-b border-cream-dark shadow-sm">
          <div className="container-site py-3">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={searchRef}
                  type="search"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search menu..."
                  className="input-field pl-9 py-2.5"
                  aria-label="Search menu items"
                />
              </div>

              {/* Category pills */}
              <div className="flex gap-2 overflow-x-auto pb-1 flex-1 scrollbar-hide">
                {(['All', ...CATEGORIES] as (Category | 'All')[]).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all
                      ${activeCategory === cat
                        ? 'bg-terracotta text-cream shadow-sm'
                        : 'bg-cream-dark text-espresso hover:bg-cream border border-cream-dark'
                      }`}
                    aria-pressed={activeCategory === cat}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Dietary filter toggle */}
              <button
                onClick={() => setFiltersOpen(v => !v)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all flex-shrink-0
                  ${activeDietaryFilters.length > 0
                    ? 'border-terracotta bg-terracotta/10 text-terracotta'
                    : 'border-cream-dark text-espresso hover:border-terracotta/40'
                  }`}
                aria-expanded={filtersOpen}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeDietaryFilters.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-terracotta text-cream text-xs flex items-center justify-center font-bold">
                    {activeDietaryFilters.length}
                  </span>
                )}
              </button>
            </div>

            {/* Dietary toggles (expanded) */}
            <AnimatePresence>
              {filtersOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden pt-3 flex gap-2 flex-wrap"
                >
                  {DIETARY_FILTERS.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleDietaryFilter(tag)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                        ${activeDietaryFilters.includes(tag)
                          ? 'bg-sage text-white border-sage'
                          : 'border-gray-200 text-gray-600 hover:border-sage'
                        }`}
                      aria-pressed={activeDietaryFilters.includes(tag)}
                    >
                      {activeDietaryFilters.includes(tag) && <Check className="w-3 h-3" />}
                      {tag}
                    </button>
                  ))}
                  {activeDietaryFilters.length > 0 && (
                    <button
                      onClick={() => setActiveDietaryFilters([])}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
                    >
                      <X className="w-3 h-3" /> Clear
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Menu content */}
        <div className="container-site py-10">
          {Object.keys(groupedItems).length === 0 ? (
            <div className="text-center py-24">
              <p className="text-4xl mb-3">☕</p>
              <p className="text-lg font-semibold text-espresso">No items found</p>
              <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filters</p>
              <button onClick={() => { setSearchQuery(''); setActiveDietaryFilters([]); setActiveCategory('All'); }} className="btn-secondary mt-5 text-sm">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedItems).map(([category, items]) => (
                <section key={category} aria-labelledby={`cat-${category}`}>
                  <h2 id={`cat-${category}`} className="text-2xl font-serif text-espresso mb-6 pb-3 border-b border-cream-dark">
                    {category}
                    <span className="ml-2 text-base font-sans font-normal text-gray-400">({items.length})</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    <AnimatePresence>
                      {items.map(item => (
                        <MenuCard key={item.id} item={item} onCustomize={setCustomizeItem} />
                      ))}
                    </AnimatePresence>
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Customization Modal */}
      <CustomizeModal
        item={customizeItem}
        onClose={() => setCustomizeItem(null)}
        onAdd={(item, addons) => addItem(item, addons)}
      />
    </>
  );
};

export default MenuPage;
