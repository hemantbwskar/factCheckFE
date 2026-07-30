/**
 * Category options tailored for Indian political tracking (Pros, Cons, Scams, Scandals, Claims, Achievements, Elections).
 */
export const CATEGORY_OPTIONS = [
  { value: 'Achievements', label: '🏆 Achievements (Pros)' },
  { value: 'Policy & Schemes', label: '📜 Policy & Schemes' },
  { value: 'Claims & Promises', label: '📢 Claims & Promises' },
  { value: 'Scams & Corruption', label: '🚨 Scams & Corruption' },
  { value: 'Scandals & Controversies', label: '⚠️ Scandals & Controversies' },
  { value: 'Criticisms & Cons', label: '📉 Criticisms & Cons' },
  { value: 'Elections & Campaigns', label: '🗳️ Elections & Campaigns' },
  { value: 'Party & Governance', label: '🏛️ Party & Governance' },
  { value: 'General', label: '📌 General' },
];

/**
 * Category to Icon mapping dictionary.
 * Maps political categories, aliases, and legacy categories to dedicated emojis.
 */
export const CATEGORY_ICON_MAP: Record<string, string> = {
  // Political Categories & Keywords
  achievements: '🏆',
  achievement: '🏆',
  pros: '🏆',
  policy: '📜',
  schemes: '📜',
  scheme: '📜',
  claims: '📢',
  promises: '📢',
  scams: '🚨',
  corruption: '🚨',
  scandals: '⚠️',
  controversies: '⚠️',
  criticisms: '📉',
  cons: '📉',
  elections: '🗳️',
  campaigns: '🗳️',
  party: '🏛️',
  governance: '🏛️',
  political: '🏛️',
  general: '📌',

 
};

/**
 * Default fallback icon when no category matches.
 */
export const DEFAULT_CATEGORY_ICON = '📌';

/**
 * Returns the mapped icon for a given category string, or DEFAULT_CATEGORY_ICON.
 */
export const getIconForCategory = (categoryName?: string): string => {
  if (!categoryName) return DEFAULT_CATEGORY_ICON;
  const key = categoryName.trim().toLowerCase();

  if (CATEGORY_ICON_MAP[key]) {
    return CATEGORY_ICON_MAP[key];
  }

  // Partial keyword matching for political tags
  if (key.includes('achievement') || key.includes('pro')) return '🏆';
  if (key.includes('scheme') || key.includes('policy')) return '📜';
  if (key.includes('claim') || key.includes('promise')) return '📢';
  if (key.includes('scam') || key.includes('corrupt')) return '🚨';
  if (key.includes('scandal') || key.includes('controversy')) return '⚠️';
  if (key.includes('criticism') || key.includes('con')) return '📉';
  if (key.includes('election') || key.includes('campaign') || key.includes('poll')) return '🗳️';
  if (key.includes('party') || key.includes('governance') || key.includes('parliament')) return '🏛️';

  return DEFAULT_CATEGORY_ICON;
};

/**
 * Returns customIcon if explicitly set, otherwise determines icon from category.
 */
export const getCategoryIcon = (category?: string, customIcon?: string): string => {
  if (customIcon && customIcon.trim() && customIcon !== DEFAULT_CATEGORY_ICON) {
    return customIcon;
  }
  return getIconForCategory(category);
};

/**
 * Normalizes tags from any input format (Array, comma-separated string, or Postgres string '{a,b}') into string[].
 */
export const normalizeTags = (tagsInput: any): string[] => {
  if (!tagsInput) return [];
  if (Array.isArray(tagsInput)) {
    return tagsInput
      .map((t) => String(t).trim().replace(/^#/, ''))
      .filter(Boolean);
  }
  if (typeof tagsInput === 'string') {
    const cleaned = tagsInput.replace(/^\{|\}$/g, '');
    return cleaned
      .split(',')
      .map((t) => t.trim().replace(/^["'#]/g, '').replace(/["']$/g, ''))
      .filter(Boolean);
  }
  return [];
};
