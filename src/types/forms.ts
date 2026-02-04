import { ViewStyle } from 'react-native';
import React from 'react';

// Form Field Types
export type FormFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'phone'
  | 'tel'
  | 'textarea'
  | 'switch'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'date'
  | 'time'
  | 'file';

// Form Field Option
export interface FormFieldOption {
  label: string;
  value: string | number;
  id?: string | number;
  name?: string;
}

// Radio Option
export interface RadioOption {
  id: string | number;
  name: string;
  selected?: boolean;
}

// Form Field Validation
export interface FormFieldValidation {
  name: 'required' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'minValue' | 'custom';
  value: any;
  message?: string;
  validator?: (fieldValue: any, allValues: Record<string, any>) => boolean;
}

// Form Field
export interface FormField {
  id?: string;
  name?: string;
  key?: string;
  path?: string;
  type: FormFieldType;
  label?: string;
  placeholder?: string;
  defaultValue?: any;
  value?: any;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  options?: FormFieldOption[];
  values?: RadioOption[];
  validations?: FormFieldValidation[];
  style?: ViewStyle;
  helpText?: string;
  showSeparator?: boolean;
  // File picker specific properties
  accept?: string[];
  multiple?: boolean;
  maxSizeMB?: number;
}

// Form Section
export interface FormSection {
  title?: string;
  id?: string;
  type?: 'object' | 'array';
  fields: FormField[];
}

// Dynamic Form Ref
export interface PTDynamicFormRef {
  setValue: (name: string, value: any) => void;
  getValues: () => Record<string, any>;
  validate: () => boolean;
  submit: () => void;
}

// Dynamic Form Props
export interface PTDynamicFormProps {
  fields?: FormField[];
  sections?: FormSection[];
  initialValues?: Record<string, any>;
  submitButtonText?: string;
  submitLoading?: boolean;
  submitDisabled?: boolean;
  onSubmit: (values: Record<string, any>) => void;
  setValue?: (name: string, value: any) => void;
  onValueChange?: (name: string, value: any, allValues: Record<string, any>) => void;
  onSelectionChange?: (name: string, selectedValue: any, allValues: Record<string, any>) => void;
  containerStyle?: ViewStyle;
  scrollable?: boolean;
  customSubmitButton?: React.ReactNode;
}

