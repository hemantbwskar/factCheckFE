export type Theme = 'light' | 'dark';

/**
 * Returns initial theme from localStorage or system prefers-color-scheme.
 */
export const getInitialTheme = (): Theme => {
  const saved = localStorage.getItem('factcheck_theme');
  if (saved === 'dark' || saved === 'light') {
    return saved;
  }
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

/**
 * Applies data-theme attribute on document root and persists in localStorage.
 */
export const applyTheme = (theme: Theme): void => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('factcheck_theme', theme);
};
