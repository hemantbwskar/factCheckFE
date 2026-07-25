/**
 * Category options for dropdown selections.
 */
export const CATEGORY_OPTIONS = [
  { value: 'Planning', label: '🚀 Planning' },
  { value: 'Design', label: '🎨 Design' },
  { value: 'Development', label: '⚡ Development' },
  { value: 'Deployment', label: '🌍 Deployment' },
  { value: 'Testing', label: '🧪 Testing' },
  { value: 'Security', label: '🔒 Security' },
  { value: 'Marketing', label: '📢 Marketing' },
  { value: 'Documentation', label: '📝 Documentation' },
  { value: 'Research', label: '🔍 Research' },
  { value: 'Maintenance', label: '🛠️ Maintenance' },
  { value: 'Release', label: '🎉 Release' },
  { value: 'Analytics', label: '📊 Analytics' },
  { value: 'Infrastructure', label: '☁️ Infrastructure' },
  { value: 'Mobile', label: '📱 Mobile' },
  { value: 'Other', label: '📌 Other' },
];

/**
 * Category to Icon mapping dictionary.
 * Maps common project categories to dedicated emojis.
 */
export const CATEGORY_ICON_MAP: Record<string, string> = {
  planning: '🚀',
  design: '🎨',
  development: '⚡',
  deployment: '🌍',
  testing: '🧪',
  qa: '🧪',
  security: '🔒',
  marketing: '📢',
  documentation: '📝',
  research: '🔍',
  maintenance: '🛠️',
  release: '🎉',
  analytics: '📊',
  infrastructure: '☁️',
  mobile: '📱',
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
  return CATEGORY_ICON_MAP[key] || DEFAULT_CATEGORY_ICON;
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
