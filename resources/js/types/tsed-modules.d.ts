declare module '@tsed/react-formio' {
  import { ComponentSchema } from 'formiojs';
  import { Component } from 'react';

  export interface FormBuilderProps {
    components: ComponentSchema[];
    display?: string;
    options?: any;
    builder?: any;
    onChange?: (components: ComponentSchema[]) => void;
    onAddComponent?: Function;
    onUpdateComponent?: Function;
    onRemoveComponent?: Function;
    onSaveComponent?: Function;
    onCancelComponent?: Function;
    onMoveComponent?: Function;
    onEditComponent?: Function;
    onEditJson?: Function;
    onCopyComponent?: Function;
    onPasteComponent?: Function;
  }

  export interface FormProps<Data = any> {
    name?: string;
    className?: string;
    src?: string;
    url?: string;
    form?: object;
    submission?: object;
    options?: any;
    onPrevPage?: (...args: any[]) => any;
    onNextPage?: (...args: any[]) => any;
    onCancel?: (...args: any[]) => any;
    onChange?: (...args: any[]) => any;
    onCustomEvent?: (...args: any[]) => any;
    onComponentChange?: (...args: any[]) => any;
    onSubmit?: (...args: any[]) => any;
    onAsyncSubmit?: (...args: any[]) => any;
    onSubmitDone?: (...args: any[]) => any;
    onFormLoad?: (...args: any[]) => any;
    onError?: (...args: any[]) => any;
    onRender?: (...args: any[]) => any;
    onAttach?: (...args: any[]) => any;
    onBuild?: (...args: any[]) => any;
    onFocus?: (...args: any[]) => any;
    onBlur?: (...args: any[]) => any;
    onInitialized?: (...args: any[]) => any;
    onFormReady?: (...args: any[]) => any;
    formioform?: any;
  }

  export declare class FormBuilder extends Component<FormBuilderProps> {}
  export declare function Form<Data = any>(props: Partial<FormProps<Data>>): JSX.Element;
}

declare module '@tsed/tailwind-formio' {
  const value: {
    framework: string;
    templates: {
      tailwind: any;
    };
  };
  export default value;
}