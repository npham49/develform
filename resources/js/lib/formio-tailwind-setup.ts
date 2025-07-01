import { Templates } from 'formiojs';
import tailwindTemplates from '@tsed/tailwind-formio';

// Initialize Formio with Tailwind templates
// Use addTemplate for each template individually
const tailwindTemp = tailwindTemplates.templates.tailwind;
Object.keys(tailwindTemp).forEach((templateName) => {
  if (typeof tailwindTemp[templateName] === 'object' && tailwindTemp[templateName].form) {
    Templates.addTemplate(templateName, tailwindTemp[templateName].form);
  }
});

export default tailwindTemplates;