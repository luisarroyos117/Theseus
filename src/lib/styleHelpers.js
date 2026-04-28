/**
 * Get styles array from a design, handling backward compatibility with style_key
 */
export function getDesignStyles(design) {
  if (!design) return [];
  // Use styles array if available, fallback to style_key
  if (design.styles && Array.isArray(design.styles) && design.styles.length > 0) {
    return design.styles;
  }
  if (design.style_key) {
    return [design.style_key];
  }
  return [];
}

/**
 * Check if a design matches a style filter
 */
export function designMatchesStyleFilter(design, filterKey) {
  if (filterKey === 'all') return true;
  const styles = getDesignStyles(design);
  return styles.includes(filterKey);
}

/**
 * Get localized style name
 */
export function getStyleLabel(styleKey, lang = 'en') {
  const labels = {
    modern: { en: 'Modern', es: 'Moderno' },
    industrial: { en: 'Industrial', es: 'Industrial' },
    classic: { en: 'Classic', es: 'Clásico' },
    biophilic: { en: 'Biophilic', es: 'Biofílico' },
    minimalist: { en: 'Minimalist', es: 'Minimalista' },
  };
  return labels[styleKey]?.[lang] || styleKey;
}