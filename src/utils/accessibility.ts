import { AccessibilityRole } from 'react-native';

/**
 * Accessibility helpers for WCAG 2.1 AA compliance
 */

export interface A11yProps {
  accessible: boolean;
  accessibilityRole: AccessibilityRole;
  accessibilityLabel: string;
  accessibilityHint?: string;
}

/**
 * Create accessibility props for a button
 */
export const buttonA11y = (label: string, hint?: string): A11yProps => ({
  accessible: true,
  accessibilityRole: 'button',
  accessibilityLabel: label,
  accessibilityHint: hint,
});

/**
 * Create accessibility props for a link/pressable
 */
export const linkA11y = (label: string, hint?: string): A11yProps => ({
  accessible: true,
  accessibilityRole: 'link',
  accessibilityLabel: label,
  accessibilityHint: hint,
});

/**
 * Create accessibility props for a checkbox
 */
export const checkboxA11y = (label: string, isChecked: boolean): A11yProps => ({
  accessible: true,
  accessibilityRole: 'checkbox',
  accessibilityLabel: label,
  accessibilityHint: isChecked ? 'Checked' : 'Unchecked',
});

/**
 * Create accessibility props for a toggle
 */
export const toggleA11y = (label: string, isEnabled: boolean): A11yProps => ({
  accessible: true,
  accessibilityRole: 'switch',
  accessibilityLabel: label,
  accessibilityHint: isEnabled ? 'Enabled' : 'Disabled',
});

/**
 * Create accessibility props for text input
 */
export const textInputA11y = (label: string, placeholder?: string): A11yProps => ({
  accessible: true,
  accessibilityRole: 'text',
  accessibilityLabel: label,
  accessibilityHint: placeholder || 'Text input field',
});

/**
 * Create accessibility props for a list item
 */
export const listItemA11y = (label: string, position?: string): A11yProps => ({
  accessible: true,
  accessibilityRole: 'button',
  accessibilityLabel: label,
  accessibilityHint: position ? `Item ${position}` : undefined,
});

/**
 * Create accessibility props for a heading
 */
export const headingA11y = (level: number, text: string): A11yProps => ({
  accessible: true,
  accessibilityRole: 'header',
  accessibilityLabel: text,
  accessibilityHint: `Heading level ${level}`,
});

/**
 * Create accessibility props for a tab
 */
export const tabA11y = (label: string, isSelected: boolean, position?: number): A11yProps => ({
  accessible: true,
  accessibilityRole: 'tab',
  accessibilityLabel: label,
  accessibilityHint: isSelected ? 'Selected' + (position ? `, Tab ${position}` : '') : `Tab${position ? ` ${position}` : ''}`,
});

/**
 * Create accessibility props for an image
 */
export const imageA11y = (altText: string): A11yProps => ({
  accessible: true,
  accessibilityRole: 'image',
  accessibilityLabel: altText,
});

/**
 * Color contrast helper (returns ratio of luminance)
 * WCAG AA requires 4.5:1 for normal text, 3:1 for large text
 * WCAG AAA requires 7:1 for normal text, 4.5:1 for large text
 */
export const getColorContrast = (hex1: string, hex2: string): number => {
  const getLuminance = (hex: string): number => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;

    const rsRGB = r / 255;
    const gsRGB = g / 255;
    const bsRGB = b / 255;

    const r2 = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
    const g2 = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
    const b2 = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

    return 0.2126 * r2 + 0.7152 * g2 + 0.0722 * b2;
  };

  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Check if color contrast meets WCAG standards
 */
export const meetsWCAGAA = (hex1: string, hex2: string, fontSize: number = 16): boolean => {
  const contrast = getColorContrast(hex1, hex2);
  // Large text (18pt+) requires 3:1, normal text requires 4.5:1
  const minContrast = fontSize >= 18 ? 3 : 4.5;
  return contrast >= minContrast;
};

export const meetsWCAGAAA = (hex1: string, hex2: string, fontSize: number = 16): boolean => {
  const contrast = getColorContrast(hex1, hex2);
  // Large text (18pt+) requires 4.5:1, normal text requires 7:1
  const minContrast = fontSize >= 18 ? 4.5 : 7;
  return contrast >= minContrast;
};
