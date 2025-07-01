import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
  setup({ el, App, props }) {
    const root = createRoot(el);

    root.render(<App {...props} />);
  },
  progress: {
    color: '#4B5563',
  },
});

// This will set light / dark mode on load...
initializeTheme();

// Add Bootstrap-style collapse functionality for FormIO
document.addEventListener('DOMContentLoaded', function() {
  // Handle data-toggle="collapse" functionality for FormIO sidebars
  function handleCollapseToggle() {
    document.addEventListener('click', function(event) {
      if (!event.target) return;
      
      const button = (event.target as Element).closest('[data-toggle="collapse"]') as HTMLElement;
      if (!button) return;
      
      event.preventDefault();
      
      const targetSelector = button.getAttribute('data-target');
      if (!targetSelector) return;
      
      const targetElement = document.querySelector(targetSelector) as HTMLElement;
      if (!targetElement) return;
      
      const isExpanded = targetElement.classList.contains('show');
      
      // Close other panels in the same accordion (data-parent)
      const parent = button.getAttribute('data-parent');
      if (parent) {
        const parentElement = document.querySelector(parent);
        if (parentElement) {
          parentElement.querySelectorAll('.collapse.show').forEach((openPanel: Element) => {
            if (openPanel !== targetElement) {
              openPanel.classList.remove('show');
              const relatedButton = parentElement.querySelector(`[data-target="#${openPanel.id}"]`) as HTMLElement;
              if (relatedButton) {
                relatedButton.setAttribute('aria-expanded', 'false');
              }
            }
          });
        }
      }
      
      // Toggle the target element
      if (isExpanded) {
        targetElement.classList.remove('show');
        button.setAttribute('aria-expanded', 'false');
      } else {
        targetElement.classList.add('show');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  }
  
  // Initialize collapse functionality
  handleCollapseToggle();
  
  // Re-initialize when FormIO rebuilds the sidebar (for dynamic content)
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Check if any added nodes contain FormIO builder sidebars
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            const hasBuilderSidebar = element.querySelector?.('.builder-sidebar') || 
                                     element.classList?.contains('builder-sidebar');
            if (hasBuilderSidebar) {
              // Re-initialize collapse functionality for new content
              handleCollapseToggle();
            }
          }
        });
      }
    });
  });
  
  // Observe changes to the document body
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});
