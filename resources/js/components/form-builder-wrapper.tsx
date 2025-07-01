import { FormBuilder } from '@formio/react';
import { Formio, Templates } from "@formio/js";
import tailwind from "../lib/tailwind-formio/src"
import '../../css/styles/index.css';

export function FormBuilderWrapper() {
  Formio.use(tailwind);
  Templates.framework = "tailwind";
  return <FormBuilder />;
}
