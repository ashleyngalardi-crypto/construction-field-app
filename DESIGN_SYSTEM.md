# Gravel Log Design System

## Overview

Gravel Log is the complete design system for the Construction Field App, providing a cohesive visual language, typography system, color palette, and component library for both mobile and web platforms.

## Brand Identity

### Logo

The Gravel Log brand features a distinctive monogram combined with a structured wordmark:

- **Monogram**: GL in Barlow Condensed 900 weight, enclosed in a bordered square with a corner accent dot
- **Wordmark**: GRAVEL LOG in uppercase, using Barlow Condensed 800 weight with 1px letter spacing
- **Primary Color**: #E8601C (Safety Orange)

**Usage:**
```tsx
import { GravelLogLogo } from '@/components/common/GravelLogLogo';

// Large logo without wordmark (auth screens)
<GravelLogLogo size="lg" showWordmark={false} />

// Small logo with wordmark (headers)
<GravelLogLogo size="sm" showWordmark={true} />
```

## Color System

### Brand Colors

```css
--gl-orange: #E8601C          /* Primary brand orange */
--gl-orange-dark: #C44E15     /* Darker shade for active states */
--gl-orange-light: #F4845F    /* Lighter shade for backgrounds */
--gl-orange-tint: #FFF3ED     /* Very light tint for highlights */
```

### Neutral Palette

```css
--gl-black: #1A1A1A           /* Primary text */
--gl-charcoal: #2C2A26        /* Secondary text */
--gl-gray: #9A9A9A            /* Tertiary text & borders */
--gl-sand: #E8E5E0            /* Light borders & dividers */
--gl-cream: #F5F3EF           /* Background color */
```

### Usage in React Native

```tsx
import { COLORS } from '@/theme';

<View style={{ backgroundColor: COLORS.brand }}>
  <Text style={{ color: COLORS.text }}>Content</Text>
</View>
```

### Usage on Web

CSS variables are automatically injected via `src/web/globals.css`:

```css
background-color: var(--gl-orange);
color: var(--gl-text);
```

## Typography System

### Font Families

- **Brand/Headings**: Barlow Condensed (weights: 700, 800, 900)
- **Body/UI**: DM Sans (weights: 400, 500, 600, 700, 800)
- **Code/Mono**: JetBrains Mono (weights: 400, 500, 600, 700)

### Heading Styles

```tsx
import { TEXT_STYLES } from '@/theme';

// H1: 32px, weight 800, line-height 40px
<Text style={TEXT_STYLES.h1}>Main Heading</Text>

// H2: 28px, weight 800, line-height 36px
<Text style={TEXT_STYLES.h2}>Section Heading</Text>

// H3: 24px, weight 800, line-height 32px
<Text style={TEXT_STYLES.h3}>Subsection</Text>

// H4: 20px, weight 700, line-height 28px
<Text style={TEXT_STYLES.h4}>Card Title</Text>
```

### Body Styles

```tsx
// Body16: 16px, weight 400, line-height 24px (main content)
<Text style={TEXT_STYLES.body16}>Body text</Text>

// Body14: 14px, weight 400, line-height 22px (secondary)
<Text style={TEXT_STYLES.body14}>Secondary text</Text>

// Body12: 12px, weight 400, line-height 18px (tertiary)
<Text style={TEXT_STYLES.body12}>Help text</Text>
```

### Label Styles

```tsx
// Label: 13px, weight 700, uppercase, 6% letter spacing
<Text style={TEXT_STYLES.label}>ACTION LABEL</Text>

// Label13, Label12, Label11, Label10: various sizes
<Text style={TEXT_STYLES.label13}>Regular Label</Text>
```

### Button Style

```tsx
// Button: 15px, weight 800, line-height 20px
<Text style={TEXT_STYLES.button}>BUTTON TEXT</Text>
```

## Spacing System

Consistent spacing scale ensures visual harmony:

```tsx
import { SPACING } from '@/theme';

SPACING.xs    // 4px   - Minimal gaps
SPACING.sm    // 8px   - Small gaps
SPACING.md    // 12px  - Medium gaps (default component spacing)
SPACING.lg    // 16px  - Large gaps (section spacing)
SPACING.xl    // 20px  - Extra large gaps
SPACING.xxl   // 24px  - Double extra large
SPACING.xxxl  // 32px  - Triple extra large
```

## Border Radius System

```tsx
import { RADIUS } from '@/theme';

RADIUS.sm     // 6px    - Slight rounding
RADIUS.md     // 10px   - Standard rounding
RADIUS.lg     // 14px   - Gravel Log standard (buttons, cards)
RADIUS.xl     // 18px   - Large rounding
RADIUS.round  // 999px  - Fully rounded (pills, circles)
```

**Gravel Log Standard**: Use `RADIUS.lg` (14px) for primary buttons, cards, and containers.

## Elevation & Shadows

Three elevation levels provide depth:

```tsx
import { ELEVATION } from '@/theme';

// Subtle shadow for cards and containers
ELEVATION.subtle
// opacity: 0.06, radius: 3, offset: (0, 1)

// Medium shadow for modals and overlays
ELEVATION.medium
// opacity: 0.12, radius: 16, offset: (0, 4)

// High shadow for floating elements
ELEVATION.high
// opacity: 0.16, radius: 24, offset: (0, 8)
```

## Component Library

### GravelLogLogo

Responsive logo component for all contexts:

```tsx
<GravelLogLogo
  size="lg"              // 'sm' | 'lg'
  showWordmark={true}    // Show/hide wordmark
/>
```

Sizes:
- `lg`: 48x48px monogram, with optional wordmark for desktop
- `sm`: 32x32px monogram for compact layouts

## Web & Mobile Integration

### Web (React Native Web)

Web-specific fonts and CSS variables are automatically loaded from `src/web/globals.css`:

- Google Fonts are imported with CORS
- CSS custom properties for all colors and typography
- Base styles for HTML elements
- Touch interaction optimizations

### Native (iOS/Android)

Typography uses system fonts with fallbacks:

```tsx
// Native platforms load system fonts automatically
fontFamily: FONTS.body  // Falls back to system font
fontFamily: FONTS.brand // Uses Barlow Condensed if available
```

## Best Practices

### 1. Color Usage
- Use `COLORS.brand` for primary actions and CTAs
- Use `COLORS.text` for primary content
- Use `COLORS.textLight` for secondary/disabled states
- Use `COLORS.border` for dividers and outlines

### 2. Typography
- Headings: Always use `FONTS.brand` with weight 800-900
- Body text: Use `FONTS.body` with weight 400-600
- Code/Technical: Use `FONTS.mono` for inline code, file paths, etc.

### 3. Spacing
- Apply consistent `SPACING.lg` (16px) between major sections
- Use `SPACING.md` (12px) between related components
- Use `SPACING.sm` (8px) within component groups

### 4. Consistency
- Always import from `@/theme` for colors, fonts, and spacing
- Use predefined `TEXT_STYLES` instead of inline fontSize definitions
- Maintain minimum touch target of 44px (`TOUCH_TARGET.min`)

## Migration Guide

Converting existing code to Gravel Log:

```tsx
// ❌ Before
<Text style={{ fontSize: 28, fontWeight: '800', color: '#1A1A1A' }}>
  Heading
</Text>

// ✅ After
<Text style={[TEXT_STYLES.h2, { color: COLORS.text }]}>
  Heading
</Text>

// ❌ Before
backgroundColor: '#E8601C',
borderRadius: 10,
padding: 16,

// ✅ After
backgroundColor: COLORS.brand,
borderRadius: RADIUS.lg,
padding: SPACING.lg,
```

## Files Reference

- **Theme Configuration**: `/src/theme/`
  - `colors.ts` - Color definitions
  - `typography.ts` - Font and text styles
  - `spacing.ts` - Spacing, radius, and elevation
  - `index.ts` - Theme exports

- **Logo Component**: `/src/components/common/GravelLogLogo.tsx`

- **Web Styles**: `/src/web/globals.css`
  - Google Fonts imports
  - CSS custom properties
  - Base HTML styling

- **App Configuration**: `app.json`
  - App name: "Gravel Log"
  - Icon and favicon with GL branding
  - Color schemes for iOS and Android

## Support

For design system questions or updates, refer to this document or check the theme configuration files directly.
