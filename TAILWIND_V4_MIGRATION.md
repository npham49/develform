# Tailwind CSS v4 Migration Guide

This document outlines the conversion of your legacy Tailwind CSS configuration to the new v4 format.

## Overview

Tailwind CSS v4 introduces a completely new configuration system using CSS `@theme` blocks instead of JavaScript configuration files. All your legacy settings have been converted and are available in the new format.

## What's Been Converted

### 🎨 Colors

Your legacy color system has been converted to the new oklch color format:

- **Primary colors**: `primary-50` through `primary-900` (blue tones)
- **Secondary colors**: `secondary-50` through `secondary-900` (teal tones)
- **Legacy gray system**: `gray-lighter`, `gray-light`, `gray-medium`, `gray-dark`, `gray-darker`
- **Special colors**: `primary-active` (maps to secondary color)

#### Usage Examples:
```html
<!-- Legacy colors still work -->
<div class="bg-primary text-white">Primary background</div>
<div class="bg-gray-lighter border-gray-light">Gray styling</div>
<button class="bg-primary-active">Active state</button>
```

### 📏 Spacing

All your custom spacing values are preserved:
- Fractional values: `1.5`, `2.5`, `7.5` (0.375rem, 0.625rem, 1.875rem)
- Extended scale: up to `68` (17rem)

#### Usage Examples:
```html
<div class="p-1.5 m-2.5">Custom spacing</div>
<div class="gap-7.5">Custom gap</div>
```

### 🖼️ Typography

Your Source Sans Pro font family system is preserved:
- `font-brand`, `font-sans`, `font-serif` → Source Sans Pro
- `font-inconsolata` → Inconsolata
- `font-source` → Source Code Pro family

#### Custom Font Sizes:
- `text-micro` (0.5rem)
- `text-xxs` (0.625rem)
- `text-md` (1.125rem)
- `text-7xl` (3.75rem)
- `text-11xl` (4.75rem)

#### Usage Examples:
```html
<h1 class="text-11xl font-brand">Large heading</h1>
<code class="text-micro font-source">Tiny code</code>
```

### 📱 Responsive Breakpoints

Your custom breakpoints are maintained:
- `sm`: 40.01em (640px)
- `md`: 50.01em (800px)
- `lg`: 64.01em (1024px)
- `xl`: 76.26em (1220px)

### 🎯 Sizing Utilities

#### Width Utilities:
- `w-1/5`, `w-3/10`, `w-7/10`, `w-9/10`, `w-12/25`
- `w-arrow` (0.8rem)

#### Min/Max Width Utilities:
- Input sizes: `min-w-input-mini`, `min-w-input-small`, etc.
- Button sizes: `min-w-button-mini`, `min-w-button-small`, etc.
- Site layouts: `max-w-site`, `max-w-site-large`, etc.

#### Usage Examples:
```html
<input class="min-w-input-medium" />
<button class="min-w-button-large">Button</button>
<div class="max-w-site mx-auto">Site container</div>
```

### 🎨 Border & Effects

- Border widths: `border-1`, `border-5`
- Border radius: `rounded-half` (50%)
- Custom z-index: `z-1` through `z-6`

### 🔄 Transform & Layout

Legacy transform utilities (replacing `tailwindcss-transforms` plugin):
- `translate-down` → translateY(-100%)
- `translate-right-up` → translate(100%, -100%)
- `translate-3d` → translate3d(40px, -60px, -130px)

Flex utilities:
- `flex-2`, `flex-3` for custom flex grow values

## File Structure

The configuration is now organized in:

1. **`resources/css/app.css`** - Main theme configuration with `@theme` block
2. **`resources/css/styles/legacy-utilities.css`** - Utility classes for legacy values
3. **`resources/css/styles/index.css`** - Imports all style files

## Key Differences from Legacy Config

### ✅ What's New and Improved:
- **Modern color format**: Using oklch() for better color accuracy
- **CSS-based configuration**: No more JavaScript config files
- **Better performance**: Faster builds and smaller CSS output
- **Type safety**: Better IDE support and error checking

### ⚠️ Changes to Be Aware Of:
- **Plugin system**: The `tailwindcss-transforms` plugin functionality is now built into utilities
- **Default border color**: Changed to `currentColor` (compatibility layer added)
- **Purge → Content**: Old purge configuration is no longer needed

## Migration Steps Completed

1. ✅ Converted all color values from hsla to oklch
2. ✅ Migrated spacing, typography, and layout values
3. ✅ Created utility classes for custom values
4. ✅ Replaced plugin functionality with native utilities
5. ✅ Updated import structure

## Usage Notes

- All your existing class names should continue to work
- Legacy color names are preserved (e.g., `gray-lighter`, `primary-active`)
- Custom spacing and sizing utilities are available
- Transform utilities now work without external plugins

## Testing

After migration, test these key areas:
- Color usage across components
- Custom spacing and sizing
- Typography with custom fonts
- Transform animations
- Responsive breakpoints

## Support

If you encounter any issues with the migrated configuration, check:
1. Import order in `resources/css/styles/index.css`
2. CSS custom properties in browser dev tools
3. Utility class availability

The new system provides the same functionality as your legacy configuration while being more maintainable and performant. 