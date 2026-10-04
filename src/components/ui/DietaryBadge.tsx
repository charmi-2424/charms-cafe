import React from 'react';
import type { DietaryTag } from '../../types/restaurant';

const config: Record<DietaryTag, { label: string; bg: string; text: string }> = {
  Vegan: { label: 'Vegan', bg: 'bg-green-100', text: 'text-green-800' },
  Vegetarian: { label: 'Veg', bg: 'bg-emerald-100', text: 'text-emerald-800' },
  'Gluten-Free': { label: 'GF', bg: 'bg-amber-100', text: 'text-amber-800' },
  'Nut-Free': { label: 'Nut-Free', bg: 'bg-sky-100', text: 'text-sky-800' },
  'Dairy-Free': { label: 'DF', bg: 'bg-purple-100', text: 'text-purple-800' },
};

interface DietaryBadgeProps {
  tag: DietaryTag;
}

export const DietaryBadge: React.FC<DietaryBadgeProps> = ({ tag }) => {
  const c = config[tag];
  return (
    <span className={`badge ${c.bg} ${c.text}`} title={tag}>
      {c.label}
    </span>
  );
};
