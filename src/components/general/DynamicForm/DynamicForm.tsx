import React, { useEffect, useCallback, useMemo } from "react";
import {
  View,
  ViewStyle,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import {
  useForm,
  Controller,
  useFieldArray,
  FieldValues,
  UseFormReturn,
  RegisterOptions,
} from "react-hook-form";
import { Plus, Trash } from "phosphor-react-native";
import { useTheme } from "../../../hooks/useTheme";
import {
  PTButton,
  PTCard,
  PTDatePicker,
  PTInput,
  PTSelect,
  PTSwitch,
  PTText,
} from "../../comman";
import PTFilePicker, { FileData } from "../../comman/PTFilePicker";

// ============================================================================
// Type Definitions
// ============================================================================

export type FormFieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "phone"
  | "tel"
  | "textarea"
  | "switch"
  | "select"
  | "multiselect"
  | "radio"
  | "date"
  | "time"
  | "file";

export interface FormFieldOption {
  label?: string;
  value?: string | number;
  id?: string | number;
  name?: string;
}

export interface RadioOption {
  id: string | number;
  name: string;
  selected?: boolean;
}

export interface FormFieldValidation {
  name:
    | "required"
    | "min"
    | "max"
    | "minLength"
    | "maxLength"
    | "pattern"
    | "minValue"
    | "custom";
  value: any;
  message?: string;
  validator?: (fieldValue: any, allValues: Record<string, any>) => boolean;
}

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
  maxLength?: number;
  // File picker specific options
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  acceptedTypes?: string[];
  onChange?: (value: any) => void;
}

export interface FormSection {
  title?: string;
  id?: string;
  type?: "object" | "array";
  fields: FormField[];
  minItems?: number;
  maxItems?: number;
}

export interface PTDynamicFormRef {
  setValue: (path: string, value: any) => void;
  getValues: () => Record<string, any>;
  validate: () => Promise<boolean>;
  submit: () => void;
  reset: (values?: Record<string, any>) => void;
  watch: UseFormReturn["watch"];
  setFocus: (name: string) => void;
  clearErrors: (name?: string | string[]) => void;
  trigger: (name?: string | string[]) => Promise<boolean>;
  formState: UseFormReturn["formState"];
}

export interface PTDynamicFormProps {
  fields?: FormField[];
  sections?: FormSection[];
  initialValues?: Record<string, any>;
  submitButtonText?: string;
  submitLoading?: boolean;
  submitDisabled?: boolean;
  onSubmit: (values: Record<string, any>) => void;
  /**
   * Callback when any field value changes
   */
  onValueChange?: (
    fieldId: string,
    value: any,
    allValues: Record<string, any>,
    fieldPath?: string,
  ) => void;
  /**
   * Callback when a selection field changes
   */
  onSelectionChange?: (
    fieldId: string,
    selectedValue: any,
    allValues: Record<string, any>,
  ) => void;
  /**
   * Callback when a field loses focus
   */
  onFieldBlur?: (
    fieldId: string,
    value: any,
    allValues: Record<string, any>,
  ) => void;
  /**
   * Callback when a field gains focus
   */
  onFieldFocus?: (fieldId: string, allValues: Record<string, any>) => void;
  /**
   * Validation mode for react-hook-form
   */
  mode?: "onSubmit" | "onBlur" | "onChange" | "onTouched" | "all";
  containerStyle?: ViewStyle;
  scrollable?: boolean;
  customSubmitButton?: React.ReactNode;
  showAddButton?: boolean;
  showRemoveButton?: boolean;
  addButtonText?: string;
  removeButtonText?: string;
}

// ============================================================================
// Utility Functions
// ============================================================================

const getFieldId = (field: FormField): string => {
  return field.id || field.name || "";
};

const getFieldPath = (field: FormField): string => {
  return field.path || field.key || field.id || field.name || "";
};

/**
 * Convert FormFieldValidation array to react-hook-form RegisterOptions
 */
const convertValidations = (field: FormField): RegisterOptions => {
  const rules: RegisterOptions = {};

  // Handle deprecated required prop
  if (field.required) {
    rules.required = `${field.label || getFieldId(field)} is required`;
  }

  // Built-in email validation
  if (field.type === "email") {
    rules.pattern = {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address",
    };
  }

  // Process validations array
  if (field.validations && Array.isArray(field.validations)) {
    for (const validation of field.validations) {
      switch (validation.name) {
        case "required":
          if (validation.value) {
            rules.required =
              validation.message ||
              `${field.label || getFieldId(field)} is required`;
          }
          break;

        case "min":
          rules.min = {
            value: validation.value,
            message:
              validation.message ||
              `Value must be at least ${validation.value}`,
          };
          break;

        case "max":
          rules.max = {
            value: validation.value,
            message:
              validation.message || `Value must not exceed ${validation.value}`,
          };
          break;

        case "minLength":
          rules.minLength = {
            value: validation.value,
            message:
              validation.message ||
              `Must be at least ${validation.value} characters`,
          };
          break;

        case "maxLength":
          rules.maxLength = {
            value: validation.value,
            message:
              validation.message ||
              `Must not exceed ${validation.value} characters`,
          };
          break;

        case "pattern":
          const regex =
            validation.value instanceof RegExp
              ? validation.value
              : new RegExp(validation.value);
          rules.pattern = {
            value: regex,
            message: validation.message || "Invalid format",
          };
          break;

        case "minValue":
          rules.min = {
            value: validation.value,
            message:
              validation.message ||
              `Value must be at least ${validation.value}`,
          };
          break;

        case "custom":
          if (validation.validator) {
            rules.validate = {
              custom: (value: any, formValues: FieldValues) => {
                const isValid = validation.validator!(value, formValues);
                return isValid || validation.message || "Validation failed";
              },
            };
          }
          break;
      }
    }
  }

  return rules;
};

/**
 * Check if a field is required
 */
const isFieldRequired = (field: FormField): boolean => {
  if (field.required) return true;
  return (
    field.validations?.some((v) => v.name === "required" && v.value) || false
  );
};

/**
 * Get label with required indicator if needed
 */
const getFieldLabel = (field: FormField): string => {
  if (!field.label) return "";
  return isFieldRequired(field) ? `${field.label} *` : field.label;
};

/**
 * Get default value for a field based on its type
 */
const getDefaultValue = (field: FormField): any => {
  if (field.value !== undefined) return field.value;
  if (field.defaultValue !== undefined) return field.defaultValue;

  switch (field.type) {
    case "switch":
      return false;
    case "radio":
      return field.values?.find((v) => v.selected)?.id || "";
    case "multiselect":
      return [];
    case "file":
      return field.multiple ? [] : null;
    case "number":
      const minValidation = field.validations?.find((v) => v.name === "min");
      return minValidation?.value ?? "";
    default:
      return "";
  }
};

// ============================================================================
// Array Section Component (extracted to prevent re-creation on each render)
// ============================================================================

interface ArraySectionProps {
  section: FormSection;
  sectionIndex: number;
  control: any;
  renderField: (field: FormField, fieldPath: string) => React.ReactNode;
  showAddButton: boolean;
  showRemoveButton: boolean;
  addButtonText: string;
  removeButtonText: string;
  theme: any;
}

const ArraySectionComponent: React.FC<ArraySectionProps> = ({
  section,
  sectionIndex,
  control,
  renderField,
  showAddButton,
  showRemoveButton,
  addButtonText,
  removeButtonText,
  theme,
}) => {
  const sectionId = section.id || `section-${sectionIndex}`;
  const {
    fields: arrayFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: sectionId,
  });

  const minItems = section.minItems || 1;
  const maxItems = section.maxItems || Infinity;

  const handleAdd = useCallback(() => {
    if (arrayFields.length < maxItems) {
      const newItem: Record<string, any> = {};
      section.fields.forEach((field) => {
        newItem[getFieldId(field)] = getDefaultValue(field);
      });
      append(newItem);
    }
  }, [arrayFields.length, maxItems, section.fields, append]);

  const handleRemove = useCallback(
    (index: number) => {
      if (arrayFields.length > minItems) {
        remove(index);
      }
    },
    [arrayFields.length, minItems, remove],
  );

  return (
    <View style={{ marginBottom: theme.spacing.lg }}>
      {section.title && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: theme.spacing.md,
            paddingBottom: theme.spacing.sm,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.primaryLight,
          }}
        >
          <PTText variant="h3" color="text" style={{ fontWeight: "600" }}>
            {section.title}
          </PTText>
          {showAddButton && arrayFields.length < maxItems && (
            <TouchableOpacity
              onPress={handleAdd}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: theme.spacing.sm,
                paddingHorizontal: theme.spacing.md,
                borderRadius: theme.borderRadius.round,
                backgroundColor: theme.colors.primary,
                ...theme.shadows.sm,
              }}
              activeOpacity={0.7}
            >
              <Plus size={16} color={theme.colors.textInverse} weight="bold" />
              <PTText
                variant="caption"
                color="textTertiary"
                style={{ marginLeft: theme.spacing.xs, fontWeight: "600" }}
              >
                {addButtonText}
              </PTText>
            </TouchableOpacity>
          )}
        </View>
      )}

      {arrayFields.map((arrayField, index) => (
        <PTCard
          key={arrayField.id}
          style={{
            marginBottom: theme.spacing.md,
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.lg,
            borderLeftWidth: 4,
            borderLeftColor: theme.colors.primary,
            ...theme.shadows.sm,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: theme.spacing.md,
              paddingBottom: theme.spacing.sm,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.primaryLight,
            }}
          >
            <View
              style={{
                backgroundColor: theme.colors.primaryLight,
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.xs,
                borderRadius: theme.borderRadius.round,
              }}
            >
              <PTText variant="caption" color="primary" bold>
                Item {index + 1}
              </PTText>
            </View>
            {showRemoveButton && arrayFields.length > minItems && (
              <TouchableOpacity
                onPress={() => handleRemove(index)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: theme.spacing.xs,
                  paddingHorizontal: theme.spacing.sm,
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: theme.colors.errorBackground,
                }}
                activeOpacity={0.7}
              >
                <Trash size={16} color={theme.colors.error} />
                <PTText
                  variant="caption"
                  color="error"
                  style={{ marginLeft: theme.spacing.xs, fontWeight: "500" }}
                >
                  {removeButtonText}
                </PTText>
              </TouchableOpacity>
            )}
          </View>

          {section.fields.map((field) => {
            const fieldId = getFieldId(field);
            const fieldPath = `${sectionId}.${index}.${fieldId}`;
            return (
              <View
                key={fieldPath}
                style={{
                  paddingVertical: theme.spacing.xs,
                }}
              >
                {renderField(field, fieldPath)}
              </View>
            );
          })}
        </PTCard>
      ))}
    </View>
  );
};

// ============================================================================
// Main Component
// ============================================================================

const PTDynamicForm = React.forwardRef<PTDynamicFormRef, PTDynamicFormProps>(
  (
    {
      fields,
      sections,
      initialValues = {},
      submitButtonText = "Submit",
      submitLoading = false,
      submitDisabled = false,
      onSubmit,
      onValueChange,
      onSelectionChange,
      onFieldBlur,
      onFieldFocus,
      mode = "onBlur",
      containerStyle,
      scrollable = true,
      customSubmitButton,
      showAddButton = true,
      showRemoveButton = true,
      addButtonText = "Add Item",
      removeButtonText = "Remove",
    },
    ref,
  ) => {
    const theme = useTheme();

    // Compute all fields from sections or direct fields prop
    const allFields = useMemo(() => {
      if (sections && sections.length > 0) {
        return sections.flatMap((section) => section.fields);
      }
      return fields || [];
    }, [sections, fields]);

    // Build default values
    const defaultValues = useMemo(() => {
      const values: Record<string, any> = { ...initialValues };

      // Set defaults for flat fields
      allFields.forEach((field) => {
        const fieldPath = getFieldPath(field);
        if (values[fieldPath] === undefined) {
          values[fieldPath] = getDefaultValue(field);
        }
      });

      // Initialize array sections
      if (sections) {
        sections.forEach((section) => {
          if (section.type === "array" && section.id) {
            if (!values[section.id] || !Array.isArray(values[section.id])) {
              const defaultItem: Record<string, any> = {};
              section.fields.forEach((field) => {
                defaultItem[getFieldId(field)] = getDefaultValue(field);
              });
              values[section.id] = [defaultItem];
            }
          }
        });
      }

      return values;
    }, [allFields, initialValues, sections]);

    // Initialize react-hook-form
    const {
      control,
      handleSubmit,
      watch,
      setValue,
      getValues,
      reset,
      setFocus,
      clearErrors,
      trigger,
      formState: { errors, isSubmitting, isDirty, isValid },
    } = useForm({
      defaultValues,
      mode,
    });

    // Get full formState for ref
    const formState = { errors, isSubmitting, isDirty, isValid };

    // Expose form methods via ref
    React.useImperativeHandle(
      ref,
      () => ({
        setValue: (path: string, value: any) =>
          setValue(path, value, { shouldValidate: true }),
        getValues,
        validate: () => trigger(),
        submit: () => handleSubmit(onSubmit)(),
        reset,
        watch,
        setFocus,
        clearErrors,
        trigger,
        formState: formState as UseFormReturn["formState"],
      }),
      [
        setValue,
        getValues,
        trigger,
        handleSubmit,
        onSubmit,
        reset,
        watch,
        setFocus,
        clearErrors,
        formState,
      ],
    );

    // Watch all form values for callbacks
    const watchedValues = watch();

    // Handle value change callback
    const handleValueChange = useCallback(
      (
        fieldId: string,
        value: any,
        fieldPath: string,
        isSelection: boolean = false,
      ) => {
        const allValues = getValues();

        if (onValueChange) {
          onValueChange(fieldId, value, allValues, fieldPath);
        }

        if (isSelection && onSelectionChange) {
          onSelectionChange(fieldId, value, allValues);
        }
      },
      [getValues, onValueChange, onSelectionChange],
    );

    // Handle field blur callback
    const handleFieldBlur = useCallback(
      (fieldId: string, value: any) => {
        if (onFieldBlur) {
          onFieldBlur(fieldId, value, getValues());
        }
      },
      [getValues, onFieldBlur],
    );

    // Handle field focus callback
    const handleFieldFocus = useCallback(
      (fieldId: string) => {
        if (onFieldFocus) {
          onFieldFocus(fieldId, getValues());
        }
      },
      [getValues, onFieldFocus],
    );

    // Render a form field based on its type
    const renderField = useCallback(
      (field: FormField, fieldPath: string) => {
        const fieldId = getFieldId(field);
        const rules = convertValidations(field);
        const fieldError = fieldPath
          .split(".")
          .reduce((acc: any, key) => acc?.[key], errors);
        const errorMessage = fieldError?.message as string | undefined;

        switch (field.type) {
          case "text":
          case "email":
          case "password":
          case "phone":
          case "tel":
          case "number":
            return (
              <Controller
                key={fieldPath}
                control={control}
                name={fieldPath}
                rules={rules}
                render={({ field: { onChange, onBlur, value } }) => (
                  <PTInput
                    label={getFieldLabel(field)}
                    placeholder={field.placeholder}
                    value={
                      value !== null && value !== undefined ? String(value) : ""
                    }
                    onChangeText={(text) => {
                      const processedValue =
                        field.type === "number"
                          ? text === ""
                            ? ""
                            : Number(text)
                          : text;
                      onChange(processedValue);
                      handleValueChange(fieldId, processedValue, fieldPath);
                    }}
                    onBlur={() => {
                      onBlur();
                      handleFieldBlur(fieldId, value);
                    }}
                    onFocus={() => handleFieldFocus(fieldId)}
                    error={errorMessage || field.error}
                    editable={!field.disabled}
                    secureTextEntry={field.type === "password"}
                    keyboardType={
                      field.type === "email"
                        ? "email-address"
                        : field.type === "phone" || field.type === "tel"
                        ? "phone-pad"
                        : field.type === "number"
                        ? "numeric"
                        : "default"
                    }
                    autoCapitalize={
                      field.type === "email" ? "none" : "sentences"
                    }
                    maxLength={
                      field.maxLength ||
                      field.validations?.find((v) => v.name === "maxLength")
                        ?.value
                    }
                    style={field.style}
                  />
                )}
              />
            );
          case "textarea":
            return (
              <Controller
                key={fieldPath}
                control={control}
                name={fieldPath}
                rules={rules}
                render={({ field: { onChange, onBlur, value } }) => (
                  <PTInput
                    label={getFieldLabel(field)}
                    placeholder={field.placeholder}
                    value={
                      value !== null && value !== undefined ? String(value) : ""
                    }
                    onChangeText={(text) => {
                      onChange(text);
                      handleValueChange(fieldId, text, fieldPath);
                    }}
                    onBlur={() => {
                      onBlur();
                      handleFieldBlur(fieldId, value);
                    }}
                    onFocus={() => handleFieldFocus(fieldId)}
                    error={errorMessage || field.error}
                    editable={!field.disabled}
                    multiline
                    numberOfLines={4}
                    style={[{ minHeight: 100 }, field.style]}
                    maxLength={
                      field.maxLength ||
                      field.validations?.find((v) => v.name === "maxLength")
                        ?.value
                    }
                  />
                )}
              />
            );

          case "switch":
            return (
              <Controller
                key={fieldPath}
                control={control}
                name={fieldPath}
                rules={rules}
                render={({ field: { onChange, value } }) => (
                  <View
                    style={[{ marginBottom: theme.spacing.md }, field.style]}
                  >
                    <PTSwitch
                      value={Boolean(value)}
                      onValueChange={(newValue) => {
                        onChange(newValue);
                        handleValueChange(fieldId, newValue, fieldPath);
                      }}
                      label={getFieldLabel(field)}
                      disabled={field.disabled}
                    />
                    {(errorMessage || field.error) && (
                      <PTText
                        variant="caption"
                        color="error"
                        style={{ marginTop: theme.spacing.xs }}
                      >
                        {errorMessage || field.error}
                      </PTText>
                    )}
                    {field.helpText && !(errorMessage || field.error) && (
                      <PTText
                        variant="caption"
                        color="textSecondary"
                        style={{ marginTop: theme.spacing.xs }}
                      >
                        {field.helpText}
                      </PTText>
                    )}
                  </View>
                )}
              />
            );

          case "radio":
            return (
              <Controller
                key={fieldPath}
                control={control}
                name={fieldPath}
                rules={rules}
                render={({ field: { onChange, value } }) => (
                  <View
                    style={[{ marginBottom: theme.spacing.md }, field.style]}
                  >
                    {field.label && (
                      <PTText
                        variant="caption"
                        color="text"
                        style={{
                          marginBottom: theme.spacing.sm,
                          fontWeight: "600",
                        }}
                      >
                        {field.label}
                        {isFieldRequired(field) && (
                          <PTText
                            variant="caption"
                            style={{ color: theme.colors.error }}
                          >
                            {" "}
                            *
                          </PTText>
                        )}
                      </PTText>
                    )}
                    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                      {field.values?.map((option) => (
                        <TouchableOpacity
                          key={String(option.id)}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            paddingVertical: theme.spacing.sm,
                            paddingHorizontal: theme.spacing.md,
                            marginRight: theme.spacing.md,
                            marginBottom: theme.spacing.xs,
                            borderRadius: theme.borderRadius.md,
                            backgroundColor:
                              value === option.id
                                ? theme.colors.primaryLight
                                : theme.colors.backgroundSecondary,
                            borderWidth: value === option.id ? 1 : 0,
                            borderColor: theme.colors.primary,
                          }}
                          onPress={() => {
                            onChange(option.id);
                            handleValueChange(
                              fieldId,
                              option.id,
                              fieldPath,
                              true,
                            );
                          }}
                          activeOpacity={0.7}
                        >
                          <View
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: 10,
                              borderWidth: 2,
                              borderColor:
                                value === option.id
                                  ? theme.colors.primary
                                  : theme.colors.border,
                              backgroundColor:
                                value === option.id
                                  ? theme.colors.primary
                                  : "transparent",
                              marginRight: theme.spacing.sm,
                              alignItems: "center",
                              justifyContent: "center",
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
                          <PTText
                            variant="body"
                            color={value === option.id ? "primary" : "text"}
                          >
                            {option.name}
                          </PTText>
                        </TouchableOpacity>
                      ))}
                    </View>
                    {(errorMessage || field.error) && (
                      <PTText
                        variant="caption"
                        color="error"
                        style={{ marginTop: theme.spacing.xs }}
                      >
                        {errorMessage || field.error}
                      </PTText>
                    )}
                  </View>
                )}
              />
            );

          case "date":
            return (
              <Controller
                key={fieldPath}
                control={control}
                name={fieldPath}
                rules={rules}
                render={({ field: { onChange, value } }) => (
                  <View style={field.style}>
                    <PTDatePicker
                      label={getFieldLabel(field)}
                      placeholder={field.placeholder || "Select date"}
                      value={value ? new Date(value) : null}
                      onDateChange={(date) => {
                        const isoDate = date.toISOString();
                        onChange(isoDate);
                        handleValueChange(fieldId, isoDate, fieldPath, true);
                      }}
                      disabled={field.disabled}
                      error={errorMessage || field.error}
                      required={field.validations?.some(
                        (v) => v.name === "required",
                      )}
                    />
                  </View>
                )}
              />
            );

          case "select":
            const selectOptions = (field.options || []).map((opt) => ({
              label:
                opt.label ||
                opt.name ||
                String(opt.value !== undefined ? opt.value : opt.id),
              value: opt.value !== undefined ? opt.value : opt.id,
            }));

            return (
              <Controller
                key={fieldPath}
                control={control}
                name={fieldPath}
                rules={rules}
                render={({ field: { onChange, value } }) => (
                  <View style={field.style}>
                    <PTSelect
                      label={getFieldLabel(field)}
                      placeholder={field.placeholder || "Select an option"}
                      value={value}
                      options={selectOptions as any}
                      onValueChange={(selectedValue) => {
                        onChange(selectedValue);
                        handleValueChange(
                          fieldId,
                          selectedValue,
                          fieldPath,
                          true,
                        );
                        if (field.onChange) {
                          field.onChange(selectedValue);
                        }
                      }}
                      disabled={field.disabled}
                      error={errorMessage || field.error}
                      required={field.validations?.some(
                        (v) => v.name === "required",
                      )}
                    />
                    {field.helpText && !(errorMessage || field.error) && (
                      <PTText
                        variant="caption"
                        color="textSecondary"
                        style={{ marginTop: theme.spacing.xs }}
                      >
                        {field.helpText}
                      </PTText>
                    )}
                  </View>
                )}
              />
            );

          case "multiselect":
            // Support both 'options' and 'values' for consistency with radio
            const multiselectSource = field.values || field.options || [];
            const multiselectOptions = multiselectSource.map((opt: any) => ({
              label:
                opt.label ||
                opt.name ||
                String(opt.value !== undefined ? opt.value : opt.id),
              value: opt.value !== undefined ? opt.value : opt.id,
            }));

            return (
              <Controller
                key={fieldPath}
                control={control}
                name={fieldPath}
                rules={rules}
                render={({ field: { onChange, value } }) => (
                  <View style={field.style}>
                    <PTSelect
                      label={getFieldLabel(field)}
                      placeholder={field.placeholder || "Select options"}
                      value={null}
                      options={multiselectOptions as any}
                      onValueChange={() => {}}
                      disabled={field.disabled}
                      error={errorMessage || field.error}
                      required={field.validations?.some(
                        (v) => v.name === "required",
                      )}
                      multiple={true}
                      selectedValues={Array.isArray(value) ? value : []}
                      onMultipleValueChange={(selectedValues) => {
                        onChange(selectedValues);
                        handleValueChange(
                          fieldId,
                          selectedValues,
                          fieldPath,
                          true,
                        );
                      }}
                    />
                    {field.helpText && !(errorMessage || field.error) && (
                      <PTText
                        variant="caption"
                        color="textSecondary"
                        style={{ marginTop: theme.spacing.xs }}
                      >
                        {field.helpText}
                      </PTText>
                    )}
                  </View>
                )}
              />
            );

          case "file":
            return (
              <Controller
                key={fieldPath}
                control={control}
                name={fieldPath}
                rules={rules}
                render={({ field: { onChange, value } }) => (
                  <View style={field.style}>
                    <PTFilePicker
                      label={getFieldLabel(field)}
                      value={value as FileData | FileData[] | null}
                      onFileSelect={(files) => {
                        onChange(files);
                        handleValueChange(fieldId, files, fieldPath, true);
                      }}
                      onFileRemove={(file) => {
                        if (field.multiple && Array.isArray(value)) {
                          const filtered = value.filter(
                            (f: FileData) => f.uri !== file.uri,
                          );
                          onChange(filtered.length > 0 ? filtered : null);
                          handleValueChange(fieldId, filtered, fieldPath, true);
                        } else {
                          onChange(null);
                          handleValueChange(fieldId, null, fieldPath, true);
                        }
                      }}
                      multiple={field.multiple}
                      maxFiles={field.maxFiles}
                      maxSize={field.maxSize}
                      acceptedTypes={field.acceptedTypes}
                      disabled={field.disabled}
                      error={errorMessage || field.error}
                      helpText={field.helpText}
                    />
                  </View>
                )}
              />
            );

          default:
            return null;
        }
      },
      [
        control,
        errors,
        handleValueChange,
        handleFieldBlur,
        handleFieldFocus,
        theme,
      ],
    );

    // Render object section
    const renderObjectSection = (
      section: FormSection,
      sectionIndex: number,
    ) => {
      return (
        <View
          key={section.id || sectionIndex}
          style={{ marginBottom: theme.spacing.lg }}
        >
          {section.title && (
            <View
              style={{
                marginBottom: theme.spacing.md,
                paddingBottom: theme.spacing.sm,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.primaryLight,
              }}
            >
              <PTText variant="body" color="text" style={{ fontWeight: "600" }}>
                {section.title}
              </PTText>
            </View>
          )}
          <PTCard
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.lg,
              ...theme.shadows.sm,
            }}
          >
            {section.fields.map((field, fieldIndex) => {
              const fieldPath = getFieldPath(field);
              return (
                <View
                  key={fieldPath || fieldIndex}
                  style={{
                    paddingVertical: theme.spacing.xs,
                  }}
                >
                  {renderField(field, fieldPath)}
                </View>
              );
            })}
          </PTCard>
        </View>
      );
    };

    const formContent = (
      <View
        style={[
          {
            padding: theme.spacing.lg,
            backgroundColor: theme.colors.background,
          },
          containerStyle,
        ]}
      >
        {sections && sections.length > 0 ? (
          // Render sections
          sections.map((section, sectionIndex) => {
            if (section.type === "array") {
              return (
                <ArraySectionComponent
                  key={section.id || sectionIndex}
                  section={section}
                  sectionIndex={sectionIndex}
                  control={control}
                  renderField={renderField}
                  showAddButton={showAddButton}
                  showRemoveButton={showRemoveButton}
                  addButtonText={addButtonText}
                  removeButtonText={removeButtonText}
                  theme={theme}
                />
              );
            }
            return renderObjectSection(section, sectionIndex);
          })
        ) : (
          // Render flat fields in a card
          <PTCard
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.lg,
              ...theme.shadows.sm,
            }}
          >
            {allFields.map((field, index) => {
              const fieldPath = getFieldPath(field);
              return (
                <View
                  key={fieldPath || index}
                  style={{
                    paddingVertical: theme.spacing.xs,
                  }}
                >
                  {renderField(field, fieldPath)}
                </View>
              );
            })}
          </PTCard>
        )}

        {customSubmitButton || (
          <View
            style={{
              marginTop: theme.spacing.xl,
              paddingTop: theme.spacing.md,
            }}
          >
            <PTButton
              title={submitButtonText}
              onPress={handleSubmit(onSubmit)}
              loading={submitLoading || isSubmitting}
              disabled={submitDisabled}
            />
          </View>
        )}
      </View>
    );

    if (scrollable) {
      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
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
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {formContent}
      </KeyboardAvoidingView>
    );
  },
);

PTDynamicForm.displayName = "PTDynamicForm";

export default PTDynamicForm;
