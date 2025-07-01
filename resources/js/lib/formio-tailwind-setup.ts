import { Templates } from 'formiojs';
import tailwindTemplates from '@tsed/tailwind-formio';

// Initialize Formio with Tailwind templates
Templates.addTemplates(tailwindTemplates.templates.tailwind);

export default tailwindTemplates;