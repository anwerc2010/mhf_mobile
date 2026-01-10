import React, { useState, useEffect, useCallback } from 'react';
import { View, ViewStyle, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import PTInput from '../PTInput';
import PTButton from '../PTButton';
import PTSwitch from '../PTSwitch';
import PTText from '../PTText';
import PTDivider from '../PTDivider';
import PTSelect from '../PTSelect';

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
  | 'time';

export interface FormFieldOption {
  label: string;
  value: string | number;
  id?: string | number;
  name?: string;
}

export interface RadioOption {
  id: string | number;
  name: string;
  selected?: boolean;
}

export interface FormField {
  /**
   * Unique identifier for the field (alternative to name)
   */
  id?: string;

  /**
   * Unique identifier for the field
   */
  name?: string;

  /**
   * Key/path for nested form values (e.g., 'propertyUnit.propertyUnitId')
   */
  key?: string;

  /**
   * Path for nested form values (alternative to key)
   */
  path?: string;

  /**
   * Field type
   */
  type: FormFieldType;

  /**
   * Field label
   */
  label?: string;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Default value
   */
  defaultValue?: any;

  /**
   * Initial value
   */
  value?: any;

  /**
   * Whether field is required
   */
  required?: boolean;

  /**
   * Whether field is disabled
   */
  disabled?: boolean;

  /**
   * Validation error message
   */
  error?: string;

  /**
   * Options for select/multiselect fields
   */
  options?: FormFieldOption[];

  /**
   * Values for radio button fields
   */
  values?: RadioOption[];

  /**
   * Validation rules array
   * Each validation object contains:
   * - name: validation type ('required', 'min', 'max', 'minLength', 'maxLength', 'pattern', 'custom')
   * - value: validation value (e.g., true for required, 0 for min, 120 for max, regex for pattern)
   * - message: error message to display when validation fails
   */
  validations?: Array<{
    name: 'required' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'minValue' | 'custom';
    value: any;
    message?: string;
    /**
     * Custom validation function (only used when name is 'custom')
     * @param fieldValue - The current value of the field
     * @param allValues - All current form values
     * @returns true if valid, false if invalid
     */
    validator?: (fieldValue: any, allValues: Record<string, any>) => boolean;
  }>;

  /**
   * Custom style for the field container
   */
  style?: ViewStyle;

  /**
   * Help text to display below field
   */
  helpText?: string;

  /**
   * Whether to show separator after field
   */
  showSeparator?: boolean;
}

export interface PTDynamicFormRef {
  /**
   * Set a field value programmatically
   */
  setValue: (name: string, value: any) => void;

  /**
   * Get all current form values
   */
  getValues: () => Record<string, any>;

  /**
   * Validate the form
   * @returns true if valid, false otherwise
   */
  validate: () => boolean;

  /**
   * Submit the form programmatically
   */
  submit: () => void;
}

export interface FormSection {
  /**
   * Section title
   */
  title?: string;

  /**
   * Section identifier
   */
  id?: string;

  /**
   * Section type: 'object' for nested object, 'array' for repeating fields
   */
  type?: 'object' | 'array';

  /**
   * Array of form field definitions in this section
   */
  fields: FormField[];
}

export interface PTDynamicFormProps {
  /**
   * Array of form field definitions (for flat form structure)
   */
  fields?: FormField[];

  /**
   * Array of form sections (for sectioned form structure)
   */
  sections?: FormSection[];

  /**
   * Initial form values
   */
  initialValues?: Record<string, any>;

  /**
   * Submit button text
   */
  submitButtonText?: string;

  /**
   * Whether submit button is loading
   */
  submitLoading?: boolean;

  /**
   * Whether submit button is disabled
   */
  submitDisabled?: boolean;

  /**
   * Callback when form is submitted
   * @param values - Current form values
   */
  onSubmit: (values: Record<string, any>) => void;

  /**
   * Callback to set a field value programmatically
   * @param name - Field name
   * @param value - New value
   */
  setValue?: (name: string, value: any) => void;

  /**
   * Callback when any field value changes
   * @param name - Field name
   * @param value - New value
   * @param allValues - All current form values
   */
  onValueChange?: (name: string, value: any, allValues: Record<string, any>) => void;

  /**
   * Callback when a select/multiselect field selection changes
   * @param name - Field name
   * @param selectedValue - Selected value(s)
   * @param allValues - All current form values
   */
  onSelectionChange?: (name: string, selectedValue: any, allValues: Record<string, any>) => void;

  /**
   * Container style
   */
  containerStyle?: ViewStyle;

  /**
   * Whether to show scroll view
   */
  scrollable?: boolean;

  /**
   * Custom submit button component
   */
  customSubmitButton?: React.ReactNode;
}

/**
 * PTDynamicForm - A dynamic form component that renders fields based on configuration
 * 
 * Features:
 * - Multiple field types (text, email, password, number, switch, select, etc.)
 * - Form validation
 * - Value change callbacks
 * - Selection change callbacks
 * - Programmatic value setting
 * - Themed styling
 * - Error handling
 * 
 * @example
 * ```tsx
 * <PTDynamicForm
 *   fields={[
 *     { name: 'email', type: 'email', label: 'Email', required: true },
 *     { name: 'password', type: 'password', label: 'Password', required: true },
 *     { name: 'notifications', type: 'switch', label: 'Enable Notifications' },
 *   ]}
 *   onSubmit={(values) => console.log('Form submitted:', values)}
 *   onValueChange={(name, value) => console.log(`${name} changed:`, value)}
 * />
 * ```
 */
const PTDynamicForm = React.forwardRef<PTDynamicFormRef, PTDynamicFormProps>(
  (
    {
      fields,
      sections,
      initialValues = {},
      submitButtonText = 'Submit',
      submitLoading = false,
      submitDisabled = false,
      onSubmit,
      setValue: externalSetValue,
      onValueChange,
      onSelectionChange,
      containerStyle,
      scrollable = true,
      customSubmitButton,
    },
    ref
  ) => {
  const theme = useTheme();

  // Initialize form values from initialValues and field defaults
  const initializeValues = useCallback(() => {
    const values: Record<string, any> = { ...initialValues };
    
    allFields.forEach((field) => {
      const fieldId = getFieldId(field);
      const fieldPath = getFieldPath(field);
      
      // Check if value already exists at path
      const existingValue = getNestedValue(values, fieldPath);
      
      if (existingValue === undefined) {
        if (field.value !== undefined) {
          setNestedValue(values, fieldPath, field.value);
        } else if (field.defaultValue !== undefined) {
          setNestedValue(values, fieldPath, field.defaultValue);
        } else {
          // Set default based on field type
          switch (field.type) {
            case 'switch':
            case 'radio':
              setNestedValue(values, fieldPath, field.values?.find(v => v.selected)?.id || '');
              break;
            case 'multiselect':
              setNestedValue(values, fieldPath, []);
              break;
            case 'number':
              const minValidation = field.validations?.find((v) => v.name === 'min');
              setNestedValue(values, fieldPath, minValidation?.value ?? 0);
              break;
            default:
              setNestedValue(values, fieldPath, '');
          }
        }
      }
    });
    return values;
  }, [allFields, initialValues]);

  const [formValues, setFormValues] = useState<Record<string, any>>(initializeValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form values when initialValues change
  useEffect(() => {
    setFormValues(initializeValues());
  }, [initializeValues]);

  // Internal setValue function
  const internalSetValue = useCallback((nameOrPath: string, value: any) => {
    setFormValues((prev) => {
      const field = allFields.find((f) => {
        const fieldId = getFieldId(f);
        const path = getFieldPath(f);
        return fieldId === nameOrPath || path === nameOrPath || f.name === nameOrPath;
      });
      
      if (field) {
        const actualPath = getFieldPath(field);
        const newValues = { ...prev };
        setNestedValue(newValues, actualPath, value);
        return newValues;
      } else {
        // Fallback: try to set directly
        const newValues = { ...prev };
        setNestedValue(newValues, nameOrPath, value);
        return newValues;
      }
    });
  }, [allFields]);

  // Validate a single field
  const validateField = useCallback((field: FormField, value: any, allValues: Record<string, any> = {}): string | undefined => {
    // Backward compatibility: support deprecated required prop
    if (field.required) {
      if (value === null || value === undefined || value === '') {
        return `${field.label || field.name} is required`;
      }
      if (Array.isArray(value) && value.length === 0) {
        return `${field.label || field.name} is required`;
      }
    }

    // Type-specific built-in validation (email)
    if (value !== null && value !== undefined && value !== '' && field.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(String(value))) {
        return 'Please enter a valid email address';
      }
    }

    // Process validation rules array
    if (field.validations && Array.isArray(field.validations)) {
      for (const validation of field.validations) {
        let isValid = true;

        switch (validation.name) {
          case 'required':
            if (value === null || value === undefined || value === '') {
              isValid = false;
            } else if (Array.isArray(value) && value.length === 0) {
              isValid = false;
            }
            break;

          case 'min':
            if (value !== null && value !== undefined && value !== '') {
              const numValue = Number(value);
              if (isNaN(numValue) || numValue < validation.value) {
                isValid = false;
              }
            }
            break;

          case 'max':
            if (value !== null && value !== undefined && value !== '') {
              const numValue = Number(value);
              if (isNaN(numValue) || numValue > validation.value) {
                isValid = false;
              }
            }
            break;

          case 'minLength':
            if (value !== null && value !== undefined && value !== '') {
              const strValue = String(value);
              if (strValue.length < validation.value) {
                isValid = false;
              }
            }
            break;

          case 'maxLength':
            if (value !== null && value !== undefined && value !== '') {
              const strValue = String(value);
              if (strValue.length > validation.value) {
                isValid = false;
              }
            }
            break;

          case 'pattern':
            if (value !== null && value !== undefined && value !== '') {
              const regex = validation.value instanceof RegExp 
                ? validation.value 
                : new RegExp(validation.value);
              if (!regex.test(String(value))) {
                isValid = false;
              }
            }
            break;

          case 'minValue':
            if (value !== null && value !== undefined && value !== '') {
              const numValue = Number(value);
              if (isNaN(numValue) || numValue < validation.value) {
                isValid = false;
              }
            }
            break;

          case 'custom':
            if (validation.validator) {
              isValid = validation.validator(value, allValues);
            }
            break;
        }

        if (!isValid) {
          return validation.message;
        }
      }
    }

    return undefined;
  }, []);

  // Handle field value change
  const handleValueChange = useCallback(
    (fieldPath: string, value: any) => {
      const field = allFields.find((f) => {
        const fieldId = getFieldId(f);
        const path = getFieldPath(f);
        return fieldId === fieldPath || path === fieldPath || f.name === fieldPath;
      });
      if (!field) return;

      const actualPath = getFieldPath(field);

      // Update form values using nested path
      setFormValues((prev) => {
        const newValues = { ...prev };
        setNestedValue(newValues, actualPath, value);
        return newValues;
      });

      // Clear error for this field
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[actualPath];
        return newErrors;
      });

      // Get updated values for callbacks
      const updatedValues = { ...formValues };
      setNestedValue(updatedValues, actualPath, value);

      // Call onValueChange callback if provided
      if (onValueChange) {
        const fieldId = getFieldId(field);
        onValueChange(fieldId || actualPath, value, updatedValues);
      }

      // Call onSelectionChange for select/multiselect/radio fields
      if ((field.type === 'select' || field.type === 'multiselect' || field.type === 'radio') && onSelectionChange) {
        const fieldId = getFieldId(field);
        onSelectionChange(fieldId || actualPath, value, updatedValues);
      }
    },
    [allFields, formValues, onValueChange, onSelectionChange]
  );

  // Handle form submission
  const handleSubmit = useCallback(() => {
    // Validate all fields
    const newErrors: Record<string, string> = {};
    let isValid = true;

    allFields.forEach((field) => {
      const fieldPath = getFieldPath(field);
      const value = getNestedValue(formValues, fieldPath);
      const error = validateField(field, value, formValues);
      if (error) {
        newErrors[fieldPath] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);

    if (isValid) {
      onSubmit(formValues);
    }
  }, [allFields, formValues, validateField, onSubmit]);

  // Expose form methods via ref
  React.useImperativeHandle(
    ref,
    () => ({
      setValue: internalSetValue,
      getValues: () => formValues,
      validate: () => {
        const newErrors: Record<string, string> = {};
        allFields.forEach((field) => {
          const fieldPath = getFieldPath(field);
          const value = getNestedValue(formValues, fieldPath);
          const error = validateField(field, value, formValues);
          if (error) {
            newErrors[fieldPath] = error;
          }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      },
      submit: handleSubmit,
    }),
    [internalSetValue, formValues, allFields, validateField, handleSubmit]
  );

  // Render a form field based on its type
  const renderField = useCallback(
    (field: FormField) => {
      const fieldPath = getFieldPath(field);
      const fieldId = getFieldId(field);
      const value = getNestedValue(formValues, fieldPath);
      const error = errors[fieldPath] || field.error;

      switch (field.type) {
        case 'text':
        case 'email':
        case 'password':
        case 'phone':
        case 'tel':
        case 'number':
          return (
            <PTInput
              key={fieldId || fieldPath}
              label={field.label}
              placeholder={field.placeholder}
              value={value !== null && value !== undefined ? String(value) : ''}
              onChangeText={(text) => {
                const processedValue =
                  field.type === 'number' ? (text === '' ? '' : Number(text)) : text;
                handleValueChange(fieldPath, processedValue);
              }}
              error={error}
              editable={!field.disabled}
              secureTextEntry={field.type === 'password'}
              keyboardType={
                field.type === 'email'
                  ? 'email-address'
                  : field.type === 'phone' || field.type === 'tel'
                  ? 'phone-pad'
                  : field.type === 'number'
                  ? 'numeric'
                  : 'default'
              }
              autoCapitalize={field.type === 'email' ? 'none' : 'sentences'}
              maxLength={field.validations?.find((v) => v.name === 'maxLength')?.value}
              style={field.style}
            />
          );

        case 'textarea':
          return (
            <PTInput
              key={fieldId || fieldPath}
              label={field.label}
              placeholder={field.placeholder}
              value={value !== null && value !== undefined ? String(value) : ''}
              onChangeText={(text) => handleValueChange(fieldPath, text)}
              error={error}
              editable={!field.disabled}
              multiline
              numberOfLines={4}
              style={[{ minHeight: 100 }, field.style]}
              maxLength={field.validations?.find((v) => v.name === 'maxLength')?.value}
            />
          );

        case 'switch':
          return (
            <View key={fieldId || fieldPath} style={[{ marginBottom: theme.spacing.md }, field.style]}>
              <PTSwitch
                value={Boolean(value)}
                onValueChange={(newValue) => handleValueChange(fieldPath, newValue)}
                label={field.label}
                disabled={field.disabled}
              />
              {error && (
                <PTText variant="caption" color="error" style={{ marginTop: theme.spacing.xs }}>
                  {error}
                </PTText>
              )}
              {field.helpText && !error && (
                <PTText
                  variant="caption"
                  color="textSecondary"
                  style={{ marginTop: theme.spacing.xs }}
                >
                  {field.helpText}
                </PTText>
              )}
            </View>
          );

        case 'radio':
          return (
            <View key={fieldId || fieldPath} style={[{ marginBottom: theme.spacing.md }, field.style]}>
              {field.label && (
                <PTText
                  variant="caption"
                  color="text"
                  style={{ marginBottom: theme.spacing.sm, fontWeight: '600' }}
                >
                  {field.label}
                </PTText>
              )}
              {field.values?.map((option) => (
                <TouchableOpacity
                  key={String(option.id)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: theme.spacing.sm,
                    paddingHorizontal: theme.spacing.md,
                    marginBottom: theme.spacing.xs,
                    borderRadius: theme.borderRadius.md,
                    backgroundColor: value === option.id ? theme.colors.primaryLight : 'transparent',
                  }}
                  onPress={() => handleValueChange(fieldPath, option.id)}
                  activeOpacity={0.7}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor: value === option.id ? theme.colors.primary : theme.colors.border,
                      backgroundColor: value === option.id ? theme.colors.primary : 'transparent',
                      marginRight: theme.spacing.sm,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {value === option.id && (
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: theme.colors.textInverse,
                        }}
                      />
                    )}
                  </View>
                  <PTText variant="body" color={value === option.id ? 'primary' : 'text'}>
                    {option.name}
                  </PTText>
                </TouchableOpacity>
              ))}
              {error && (
                <PTText variant="caption" color="error" style={{ marginTop: theme.spacing.xs }}>
                  {error}
                </PTText>
              )}
              {field.helpText && !error && (
                <PTText
                  variant="caption"
                  color="textSecondary"
                  style={{ marginTop: theme.spacing.xs }}
                >
                  {field.helpText}
                </PTText>
              )}
            </View>
          );

        case 'date':
          return (
            <PTInput
              key={fieldId || fieldPath}
              label={field.label}
              placeholder={field.placeholder || 'Select date'}
              value={value ? new Date(value).toLocaleDateString() : ''}
              onChangeText={() => {
                // Date picker would be handled by a modal or native date picker
                // For now, this is a placeholder
              }}
              error={error}
              editable={false}
              onFocus={() => {
                // Open date picker modal
                // This would need a date picker component
              }}
              style={field.style}
            />
          );

        case 'select':
          // Convert options format if needed (support both {label, value} and {id, name})
          const selectOptions = (field.options || []).map((opt) => ({
            label: opt.label || opt.name || String(opt.value !== undefined ? opt.value : opt.id),
            value: opt.value !== undefined ? opt.value : opt.id,
          }));
          
          return (
            <View key={fieldId || fieldPath} style={field.style}>
              <PTSelect
                label={field.label}
                placeholder={field.placeholder || 'Select an option'}
                value={value}
                options={selectOptions}
                onValueChange={(selectedValue) => handleValueChange(fieldPath, selectedValue)}
                disabled={field.disabled}
                error={error}
                required={field.validations?.some((v) => v.name === 'required')}
              />
              {field.helpText && !error && (
                <PTText
                  variant="caption"
                  color="textSecondary"
                  style={{ marginTop: theme.spacing.xs }}
                >
                  {field.helpText}
                </PTText>
              )}
            </View>
          );

        case 'multiselect':
          // Convert options format if needed
          const multiselectOptions = (field.options || []).map((opt) => ({
            label: opt.label || opt.name || String(opt.value !== undefined ? opt.value : opt.id),
            value: opt.value !== undefined ? opt.value : opt.id,
          }));
          
          return (
            <View key={fieldId || fieldPath} style={field.style}>
              <PTSelect
                label={field.label}
                placeholder={field.placeholder || 'Select options'}
                value={null}
                options={multiselectOptions}
                onValueChange={() => {}}
                disabled={field.disabled}
                error={error}
                required={field.validations?.some((v) => v.name === 'required')}
                multiple={true}
                selectedValues={Array.isArray(value) ? value : []}
                onMultipleValueChange={(selectedValues) =>
                  handleValueChange(fieldPath, selectedValues)
                }
              />
              {field.helpText && !error && (
                <PTText
                  variant="caption"
                  color="textSecondary"
                  style={{ marginTop: theme.spacing.xs }}
                >
                  {field.helpText}
                </PTText>
              )}
            </View>
          );

        default:
          return null;
      }
    },
    [formValues, errors, handleValueChange, theme]
  );

  const formContent = (
    <View style={[{ padding: theme.spacing.md }, containerStyle]}>
      {sections && sections.length > 0 ? (
        // Render sections
        sections.map((section, sectionIndex) => (
          <View key={section.id || sectionIndex} style={{ marginBottom: theme.spacing.xl }}>
            {section.title && (
              <PTText
                variant="h3"
                color="text"
                style={{ marginBottom: theme.spacing.lg, fontWeight: 'bold' }}
              >
                {section.title}
              </PTText>
            )}
            {section.fields.map((field, fieldIndex) => {
              const fieldId = getFieldId(field);
              const fieldPath = getFieldPath(field);
              return (
                <React.Fragment key={fieldId || fieldPath || fieldIndex}>
                  {renderField(field)}
                  {field.showSeparator !== false && fieldIndex < section.fields.length - 1 && (
                    <PTDivider spacing={theme.spacing.md} />
                  )}
                </React.Fragment>
              );
            })}
            {sectionIndex < sections.length - 1 && (
              <PTDivider spacing={theme.spacing.xl} />
            )}
          </View>
        ))
      ) : (
        // Render flat fields (backward compatibility)
        allFields.map((field, index) => {
          const fieldId = getFieldId(field);
          const fieldPath = getFieldPath(field);
          return (
            <React.Fragment key={fieldId || fieldPath || index}>
              {renderField(field)}
              {field.showSeparator !== false && index < allFields.length - 1 && (
                <PTDivider spacing={theme.spacing.md} />
              )}
            </React.Fragment>
          );
        })
      )}

      {customSubmitButton || (
        <View style={{ marginTop: theme.spacing.lg }}>
          <PTButton
            title={submitButtonText}
            onPress={handleSubmit}
            loading={submitLoading}
            disabled={submitDisabled}
          />
        </View>
      )}
    </View>
  );

  if (scrollable) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {formContent}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      {formContent}
    </KeyboardAvoidingView>
  );
  }
);

PTDynamicForm.displayName = 'PTDynamicForm';

export default PTDynamicForm;

