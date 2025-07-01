# EJS Template Pre-compilation with Vite

This document explains the EJS pre-compilation system implemented for FormIO templates using a custom Vite plugin.

## 🎯 Problem Solved

The FormIO library uses EJS templates that need to be compiled into JavaScript modules for import. The original issue was:

```typescript
// This import was failing:
import form from "./form.ejs.js";

// Error: Cannot find module './form.ejs.js' or its corresponding type declarations.
```

## 🚀 Solution Overview

We implemented a custom Vite plugin (`vite-plugin-ejs-formio.ts`) that automatically:

1. **Discovers** all `.ejs` files in the FormIO templates directory
2. **Compiles** them using the EJS compiler with FormIO-specific settings
3. **Generates** `.ejs.js` modules that can be imported normally
4. **Watches** for changes during development and recompiles automatically

## 📁 File Structure

```
resources/js/lib/tailwind-formio/src/templates/tailwind/
├── wizardNav/
│   ├── form.ejs           # Source template
│   ├── form.ejs.js        # Auto-generated (gitignored)
│   └── index.ts           # Imports the compiled template
├── button/
│   ├── form.ejs
│   ├── form.ejs.js        # Auto-generated
│   ├── html.ejs
│   ├── html.ejs.js        # Auto-generated
│   └── index.ts
└── ... (79 template files total)
```

## 🔧 How It Works

### 1. Vite Plugin Configuration

The plugin is configured in `vite.config.ts`:

```typescript
import { ejsFormioPlugin } from './vite-plugin-ejs-formio';

export default defineConfig({
  plugins: [
    // ... other plugins
    ejsFormioPlugin({
      templateDir: 'resources/js/lib/tailwind-formio/src/templates',
      templateExtension: '.ejs',
      watch: true
    }),
  ],
});
```

### 2. Template Compilation Process

Each `.ejs` file like this:

```html
<!-- form.ejs -->
<ul class="formio-wizard-nav-container list-inline" id="{{ ctx.wizardKey }}-nav">
  {% ctx.buttonOrder.forEach(function(button) { %}
    {% if (button === 'cancel' && ctx.buttons.cancel) { %}
    <li>
      <button class="btn btn-secondary btn-wizard-nav-cancel" ref="{{ctx.wizardKey}}-cancel">
        {{ctx.t('cancel')}}
      </button>
    </li>
    {% } %}
  {% }) %}
</ul>
```

**FormIO Delimiter Conversion**: The plugin automatically converts FormIO's custom syntax to standard EJS:
- `{% %}` → `<% %>` (JavaScript code execution)
- `{{ }}` → `<%- %>` (HTML unescaped output) 
- `{{{ }}}` → `<%= %>` (HTML escaped output)

This matches the original gulp-template implementation and ensures HTML content renders properly without double-escaping.

Gets compiled to a JavaScript module:

```javascript
// form.ejs.js (auto-generated)
const template = function anonymous(ctx, escapeFn, include, rethrow) {
  // ... compiled EJS function
};

export default function(ctx = {}) {
  // Provide default context values commonly used in FormIO templates
  const defaultCtx = {
    wizardKey: 'wizard',
    buttonOrder: ['previous', 'next', 'cancel', 'submit'],
    buttons: {
      cancel: true,
      previous: true,
      next: true,
      submit: true
    },
    disableWizardSubmit: false,
    t: (key) => {
      // Simple translation fallback
      const translations = {
        cancel: 'Cancel',
        previous: 'Previous',
        next: 'Next',
        submit: 'Submit',
        // ... more translations
      };
      return translations[key] || key;
    },
    ...ctx
  };

  return template(defaultCtx);
}
```

### 3. Import and Usage

The compiled templates can be imported normally:

```typescript
// index.ts
import form from "./form.ejs.js";
export default { form };
```

And used in your application:

```typescript
const htmlOutput = form({
  wizardKey: 'my-wizard',
  buttons: { next: true, previous: false }
});
```

## 🛠️ Plugin Features

### Automatic Discovery
- Scans the entire FormIO templates directory recursively
- Processes all `.ejs` files found

### Smart Compilation
- Only recompiles when source `.ejs` files are newer than output `.ejs.js` files
- Uses EJS client-side compilation for optimal performance
- Provides FormIO-specific default context values

### Development Experience
- **Hot Module Replacement**: Changes to `.ejs` files trigger automatic recompilation
- **File Watching**: New `.ejs` files are automatically detected and compiled
- **Error Handling**: Clear error messages when compilation fails

### Build Integration
- Runs during Vite's build process
- Integrates with TypeScript checking
- Works with both development and production builds

## 📋 Configuration Options

The plugin accepts these options:

```typescript
interface EjsFormioOptions {
  /**
   * Directory containing EJS templates
   * @default 'resources/js/lib/tailwind-formio/src/templates'
   */
  templateDir?: string;
  
  /**
   * File extension for EJS templates
   * @default '.ejs'
   */
  templateExtension?: string;
  
  /**
   * Watch for changes during development
   * @default true
   */
  watch?: boolean;
}
```

## 🚫 Ignored Files

All `.ejs.js` files are automatically ignored by Git (added to `.gitignore`):

```gitignore
# Auto-generated EJS compiled templates
*.ejs.js
```

This prevents auto-generated files from being committed to the repository.

## 🔄 Development Workflow

1. **Edit** an `.ejs` template file
2. **Save** the file
3. **Plugin automatically**:
   - Detects the change
   - Recompiles the template
   - Generates the new `.ejs.js` file
   - Triggers HMR if needed

## 📦 Dependencies

The solution requires:

- `ejs`: For template compilation
- `vite`: Build tool with plugin system
- TypeScript support for the plugin

Install with:
```bash
npm install --save-dev ejs
```

## 🎯 Benefits

### ✅ Developer Experience
- **Zero Configuration**: Works out of the box with sensible defaults
- **Fast Development**: Hot reloading when templates change
- **Type Safety**: Full TypeScript support for imports

### ✅ Performance
- **Build-time Compilation**: Templates are pre-compiled, not compiled at runtime
- **Optimized Output**: Client-side EJS compilation for minimal bundle size
- **Caching**: Only recompiles when source files change

### ✅ Maintainability
- **Auto-generated**: Never manually edit `.ejs.js` files
- **Version Control Friendly**: Generated files are ignored
- **Clear Separation**: Source templates vs. compiled output

## 🔍 Troubleshooting

### Template Not Found Error
If you see import errors for `.ejs.js` files:

1. **Check** that the corresponding `.ejs` file exists
2. **Verify** the plugin is properly configured in `vite.config.ts`
3. **Restart** the development server to trigger full compilation

### Seeing Raw EJS Syntax in Output
If you see literal `{% %}` or `{{ }}` syntax in your rendered HTML:

1. **Check** that the plugin's delimiter conversion is working
2. **Regenerate** templates by deleting `.ejs.js` files and restarting dev server
3. **Verify** FormIO syntax: `{% %}` for code, `{{ }}` for output

### HTML Escaping Issues
If you see escaped HTML like `&lt;div&gt;` or `&#34;class&#34;` instead of proper HTML:

1. **Verify** delimiter mapping is correct: `{{ }}` should produce unescaped HTML output
2. **Check** that templates using `{{{ }}}` (triple braces) for escaped output are rare
3. **Regenerate** all templates to ensure the correct `<%- %>` vs `<%= %>` conversion

### Compilation Errors
If EJS compilation fails:

1. **Check** the EJS syntax in your template
2. **Look** at the console output for specific error messages
3. **Verify** that the template follows FormIO conventions

### Missing Dependencies
If you see module resolution errors:

```bash
# Ensure EJS is installed
npm install --save-dev ejs

# Check that the plugin is properly imported
# in vite.config.ts
```

## 🚀 Next Steps

This system provides a solid foundation for EJS template compilation. Future enhancements could include:

- **Custom Context Providers**: Allow injection of custom default values
- **Template Validation**: Lint EJS templates for common issues
- **Optimization**: Minify generated templates in production
- **Source Maps**: Generate source maps for better debugging

The current implementation successfully resolves the import issues and provides a seamless development experience for working with FormIO EJS templates. 