import type { MenuItem, Testimonial } from '../types/restaurant';

// ─── Menu Data ────────────────────────────────────────────────────────────────

export const menuItems: MenuItem[] = [
  // ── Hot Brews ──────────────────────────────────────────────────────────────
  {
    id: 'hb-01',
    name: 'Charms Signature Espresso',
    description: 'A bold, velvety double shot crafted from single-origin Ethiopian Yirgacheffe beans with a rich crema and notes of dark chocolate and citrus.',
    price: 199,
    category: 'Hot Brews',
    dietaryTags: ['Vegan', 'Gluten-Free'],
    image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600&q=80',
    isAvailable: true,
    isFeatured: true,
    customizable: true,
    addons: [
      {
        id: 'milk', label: 'Milk Alternative',
        options: [
          { id: 'whole', label: 'Whole Milk', priceModifier: 0 },
          { id: 'oat', label: 'Oat Milk', priceModifier: 30 },
          { id: 'almond', label: 'Almond Milk', priceModifier: 30 },
          { id: 'soy', label: 'Soy Milk', priceModifier: 25 },
        ]
      },
      {
        id: 'shots', label: 'Extra Shot',
        options: [
          { id: 'no', label: 'No extra', priceModifier: 0 },
          { id: 'yes', label: '+1 Shot', priceModifier: 60 },
        ]
      }
    ]
  },
  {
    id: 'hb-02',
    name: 'Caramel Latte',
    description: 'Smooth espresso blended with steamed milk and our house-made salted caramel syrup, finished with an artisan caramel drizzle.',
    price: 249,
    category: 'Hot Brews',
    dietaryTags: ['Vegetarian'],
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80',
    isAvailable: true,
    isFeatured: true,
    customizable: true,
    addons: [
      {
        id: 'milk', label: 'Milk Alternative',
        options: [
          { id: 'whole', label: 'Whole Milk', priceModifier: 0 },
          { id: 'oat', label: 'Oat Milk', priceModifier: 30 },
          { id: 'almond', label: 'Almond Milk', priceModifier: 30 },
        ]
      },
      {
        id: 'sweet', label: 'Sweetness Level',
        options: [
          { id: 'low', label: 'Light sweet', priceModifier: 0 },
          { id: 'med', label: 'Medium', priceModifier: 0 },
          { id: 'full', label: 'Full sweet', priceModifier: 0 },
        ]
      }
    ]
  },
  {
    id: 'hb-03',
    name: 'Masala Chai',
    description: 'A warming blend of Assam CTC tea brewed with hand-ground spices — cardamom, ginger, cinnamon — and fresh whole milk.',
    price: 149,
    category: 'Hot Brews',
    dietaryTags: ['Vegetarian', 'Gluten-Free'],
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600&q=80',
    isAvailable: true,
    isFeatured: false,
  },
  {
    id: 'hb-04',
    name: 'Pour-Over Filter Coffee',
    description: 'Single-origin Colombian beans brewed to order via V60, revealing bright fruit notes and a clean honeyed finish.',
    price: 229,
    category: 'Hot Brews',
    dietaryTags: ['Vegan', 'Gluten-Free'],
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
    isAvailable: true,
  },
  {
    id: 'hb-05',
    name: 'Hazelnut Cappuccino',
    description: 'Perfectly pulled espresso and micro-foamed milk with a swirl of roasted hazelnut syrup and dusting of cacao powder.',
    price: 259,
    category: 'Hot Brews',
    dietaryTags: ['Vegetarian'],
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80',
    isAvailable: true,
  },

  // ── Cold Beverages ──────────────────────────────────────────────────────────
  {
    id: 'cb-01',
    name: 'Cold Brew Concentrate',
    description: 'Steeped 18 hours in cold water, this smooth, low-acid cold brew is served over crystal ice with a touch of maple.',
    price: 279,
    category: 'Cold Beverages',
    dietaryTags: ['Vegan', 'Gluten-Free'],
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&q=80',
    isAvailable: true,
    isFeatured: true,
  },
  {
    id: 'cb-02',
    name: 'Mango Matcha Latte',
    description: 'Ceremonial grade matcha whisked into oat milk with a swirl of house-made mango coulis. Vibrant, refreshing, utterly pretty.',
    price: 299,
    category: 'Cold Beverages',
    dietaryTags: ['Vegan', 'Gluten-Free', 'Dairy-Free'],
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80',
    isAvailable: true,
    isFeatured: true,
  },
  {
    id: 'cb-03',
    name: 'Sparkling Hibiscus Lemonade',
    description: 'House-brewed hibiscus tea shaken with fresh lemon juice, honey syrup, and a splash of Perrier. Floral, tart, and alive.',
    price: 219,
    category: 'Cold Beverages',
    dietaryTags: ['Vegan', 'Gluten-Free'],
    image: 'https://images.unsplash.com/photo-1568909344668-6f14a07b56a0?w=600&q=80',
    isAvailable: true,
  },
  {
    id: 'cb-04',
    name: 'Iced Vanilla Shakerato',
    description: 'Double espresso and vanilla bean shaken vigorously with ice until frosty and frothy — Italian espresso bar classic.',
    price: 289,
    category: 'Cold Beverages',
    dietaryTags: ['Vegan', 'Gluten-Free'],
    image: 'https://images.unsplash.com/photo-1579888944880-d98341245702?w=600&q=80',
    isAvailable: true,
  },

  // ── Bakery & Pastries ───────────────────────────────────────────────────────
  {
    id: 'bp-01',
    name: 'Butter Croissant',
    description: 'Hand-laminated with French AOP butter through 27 layers — shatteringly crisp outside, cloud-soft and honeyed within.',
    price: 159,
    category: 'Bakery & Pastries',
    dietaryTags: ['Vegetarian'],
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80',
    isAvailable: true,
    isFeatured: true,
  },
  {
    id: 'bp-02',
    name: 'Cardamom Cinnamon Roll',
    description: 'Pillowy brioche dough spiralled with cardamom-cinnamon butter and crowned with tangy cream cheese frosting.',
    price: 189,
    category: 'Bakery & Pastries',
    dietaryTags: ['Vegetarian'],
    image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=600&q=80',
    isAvailable: true,
  },
  {
    id: 'bp-03',
    name: 'Almond Financier',
    description: 'Browned-butter French tea cakes baked with almond flour and a hint of orange zest. Gluten-free and irresistible.',
    price: 179,
    category: 'Bakery & Pastries',
    dietaryTags: ['Vegetarian', 'Gluten-Free'],
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80',
    isAvailable: true,
  },
  {
    id: 'bp-04',
    name: 'Banana Walnut Loaf',
    description: 'Slow-baked with overripe bananas, toasted walnuts and a ribbon of Medjool date paste. Sliced fresh daily.',
    price: 149,
    category: 'Bakery & Pastries',
    dietaryTags: ['Vegetarian'],
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80',
    isAvailable: true,
  },

  // ── All-Day Brunch ──────────────────────────────────────────────────────────
  {
    id: 'ab-01',
    name: 'Avocado Toast Deluxe',
    description: 'Sourdough toast smashed with fresh avocado, pickled red onion, chilli flakes, micro-greens and a soft poached egg (opt out for vegan).',
    price: 349,
    category: 'All-Day Brunch',
    dietaryTags: ['Vegetarian'],
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=600&q=80',
    isAvailable: true,
    isFeatured: true,
  },
  {
    id: 'ab-02',
    name: 'Shakshuka Bowl',
    description: 'Slow-simmered spiced tomato and pepper sauce with two farm eggs poached right in, finished with feta and fresh herbs.',
    price: 379,
    category: 'All-Day Brunch',
    dietaryTags: ['Vegetarian', 'Gluten-Free'],
    image: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?w=600&q=80',
    isAvailable: true,
  },
  {
    id: 'ab-03',
    name: 'Granola Parfait',
    description: 'Layers of house-toasted oat granola, seasonal fruit compote, thick Greek yoghurt and a drizzle of raw wildflower honey.',
    price: 299,
    category: 'All-Day Brunch',
    dietaryTags: ['Vegetarian', 'Gluten-Free'],
    image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&q=80',
    isAvailable: true,
  },
  {
    id: 'ab-04',
    name: 'Stuffed French Toast',
    description: 'Thick brioche soaked in vanilla custard, pan-fried golden and stuffed with mascarpone & berry coulis. Pure Weekend energy.',
    price: 389,
    category: 'All-Day Brunch',
    dietaryTags: ['Vegetarian'],
    image: 'https://images.unsplash.com/photo-1484723091739-30990106e42a?w=600&q=80',
    isAvailable: true,
  },

  // ── Desserts ────────────────────────────────────────────────────────────────
  {
    id: 'ds-01',
    name: 'Belgian Dark Chocolate Tart',
    description: 'A crisp cocoa sablé shell filled with 72% Valrhona ganache, a fleur de sel crown and a quenelle of crème fraîche.',
    price: 269,
    category: 'Desserts',
    dietaryTags: ['Vegetarian'],
    image: 'https://images.unsplash.com/photo-1611293388250-580b08c4a145?w=600&q=80',
    isAvailable: true,
    isFeatured: true,
  },
  {
    id: 'ds-02',
    name: 'Mango Panna Cotta',
    description: 'Italian cream panna cotta scented with vanilla, topped with Alphonso mango gelée and a tuile biscuit.',
    price: 249,
    category: 'Desserts',
    dietaryTags: ['Vegetarian', 'Gluten-Free'],
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80',
    isAvailable: true,
  },
  {
    id: 'ds-03',
    name: 'Vegan Tahini Brownie',
    description: 'Dense, fudgy and deeply chocolaty — 100% plant-based, sweetened with coconut sugar and swirled with sesame tahini.',
    price: 199,
    category: 'Desserts',
    dietaryTags: ['Vegan', 'Gluten-Free', 'Nut-Free', 'Dairy-Free'],
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80',
    isAvailable: true,
  },
];

// ─── Testimonials ──────────────────────────────────────────────────────────────

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Priya Sharma',
    rating: 5,
    quote: '"The Signature Espresso alone is worth the trip. I\'ve tried cafes across three cities — Charms is simply in a different league. The ambience is pure poetry on a rainy afternoon."',
    date: 'October 2026',
    avatar: 'https://i.pravatar.cc/80?img=47',
  },
  {
    id: 't2',
    name: 'Arjun Mehta',
    rating: 5,
    quote: '"The Avocado Toast and the Cold Brew together? Absolute perfection. The team here clearly cares deeply about every single detail, from the ceramic mugs to the playlist."',
    date: 'September 2026',
    avatar: 'https://i.pravatar.cc/80?img=12',
  },
  {
    id: 't3',
    name: 'Lena Okonkwo',
    rating: 5,
    quote: '"As someone who is dairy-free and gluten-sensitive, finding somewhere with this many genuinely delicious options is a dream. The Tahini Brownie should be illegal."',
    date: 'September 2026',
    avatar: 'https://i.pravatar.cc/80?img=32',
  },
];

// ─── Operating Hours ───────────────────────────────────────────────────────────

export const operatingHours = [
  { day: 'Monday – Friday', hours: '7:00 AM – 9:00 PM' },
  { day: 'Saturday', hours: '8:00 AM – 10:00 PM' },
  { day: 'Sunday', hours: '9:00 AM – 8:00 PM' },
];

export const cafeInfo = {
  address: '12 Blossom Lane, Koramangala 5th Block, Bengaluru – 560034',
  phone: '+91 98765 43210',
  email: 'hello@charmscafe.in',
  instagram: 'https://instagram.com/charmscafe',
  twitter: 'https://twitter.com/charmscafe',
  facebook: 'https://facebook.com/charmscafe',
};
