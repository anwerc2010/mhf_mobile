# PTDynamicForm Component

A powerful, flexible dynamic form component that renders form fields based on configuration. Supports multiple field types, validation, and comprehensive callback system.

## 📍 Location

`/src/components/comman/PTDynamicForm.tsx`

## ✨ Features

- ✅ **Multiple Field Types** - Text, email, password, number, phone, textarea, switch, select, multiselect
- ✅ **Form Validation** - Built-in and custom validation
- ✅ **Submit Callback** - Handle form submission with validated data
- ✅ **setValue Callback** - Programmatically set field values
- ✅ **onValueChange Callback** - Track all field value changes
- ✅ **onSelectionChange Callback** - Track select/multiselect changes
- ✅ **Ref-based API** - Programmatic form control
- ✅ **Error Handling** - Per-field error display
- ✅ **Initial Values** - Pre-populate form fields
- ✅ **Disabled Fields** - Disable individual fields
- ✅ **Help Text** - Display help text below fields
- ✅ **Themed Styling** - Fully integrated with theme system
- ✅ **Keyboard Handling** - KeyboardAvoidingView support
- ✅ **Scrollable** - Optional scroll view for long forms
- ✅ **TypeScript Support** - Fully typed with generics

## 📦 Installation

The component is already available in the project. Import it like this:

```tsx
import PTDynamicForm from '../components/comman/PTDynamicForm';
// or
import { PTDynamicForm } from '../components/comman';
```

## 🚀 Basic Usage

### Simple Form

```tsx
import React from 'react';
import PTDynamicForm from '../components/comman/PTDynamicForm';

function LoginForm() {
  const formFields = [
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'Enter your email',
      validations: [
        { name: 'required', value: true, message: 'Email is required' },
      ],
    },
    {
      name: 'password',
      type: 'password',
      label: 'Password',
      placeholder: 'Enter your password',
      validations: [
        { name: 'required', value: true, message: 'Password is required' },
      ],
    },
  ];

  return (
    <PTDynamicForm
      fields={formFields}
      onSubmit={(values) => {
        console.log('Form submitted:', values);
        // Handle login
      }}
    />
  );
}
```

### With All Callbacks

```tsx
<PTDynamicForm
  fields={formFields}
  onSubmit={(values) => {
    console.log('Form submitted:', values);
    handleSubmit(values);
  }}
  setValue={(name, value) => {
    console.log(`Setting ${name} to:`, value);
    // Additional logic when value is set programmatically
  }}
  onValueChange={(name, value, allValues) => {
    console.log(`${name} changed to:`, value);
    console.log('All form values:', allValues);
    // React to value changes
  }}
  onSelectionChange={(name, selectedValue, allValues) => {
    console.log(`${name} selection changed:`, selectedValue);
    // Handle selection changes (for select/multiselect fields)
  }}
/>
```

### With Select Fields

```tsx
const formFields = [
  {
    name: 'country',
    type: 'select',
    label: 'Country',
    placeholder: 'Select a country',
    validations: [
      { name: 'required', value: true, message: 'Country is required' },
    ],
    options: [
      { label: 'United States', value: 'us' },
      { label: 'Canada', value: 'ca' },
      { label: 'United Kingdom', value: 'uk' },
      { label: 'Australia', value: 'au' },
    ],
  },
  {
    name: 'interests',
    type: 'multiselect',
    label: 'Interests',
    placeholder: 'Select your interests',
    options: [
      { label: 'Sports', value: 'sports' },
      { label: 'Music', value: 'music' },
      { label: 'Travel', value: 'travel' },
      { label: 'Reading', value: 'reading' },
    ],
  },
];

<PTDynamicForm
  fields={formFields}
  onSubmit={(values) => console.log(values)}
  onSelectionChange={(name, selectedValue) => {
    console.log(`${name} selected:`, selectedValue);
  }}
/>
```

### Using Ref for Programmatic Control

```tsx
import React, { useRef } from 'react';
import PTDynamicForm, { PTDynamicFormRef } from '../components/comman/PTDynamicForm';

function FormWithRef() {
  const formRef = useRef<PTDynamicFormRef>(null);

  // Set a field value programmatically
  const handleSetEmail = () => {
    formRef.current?.setValue('email', 'new@email.com');
  };

  // Get all form values
  const handleGetValues = () => {
    const values = formRef.current?.getValues();
    console.log('Current form values:', values);
  };

  // Validate the form
  const handleValidate = () => {
    const isValid = formRef.current?.validate();
    if (isValid) {
      console.log('Form is valid!');
    } else {
      console.log('Form has validation errors');
    }
  };

  // Submit the form programmatically
  const handleSubmit = () => {
    formRef.current?.submit();
  };

  return (
    <>
      <PTDynamicForm
        ref={formRef}
        fields={formFields}
        onSubmit={(values) => console.log('Submitted:', values)}
      />
      
      {/* Control buttons */}
      <PTButton title="Set Email" onPress={handleSetEmail} />
      <PTButton title="Get Values" onPress={handleGetValues} />
      <PTButton title="Validate" onPress={handleValidate} />
      <PTButton title="Submit" onPress={handleSubmit} />
    </>
  );
}
```

### With Validation

```tsx
const formFields = [
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    validations: [
      { name: 'required', value: true, message: 'Email is required' },
    ],
  },
  {
    name: 'age',
    type: 'number',
    label: 'Age',
    placeholder: 'Enter your age',
    validations: [
      { name: 'required', value: true, message: 'Age is required' },
      { name: 'min', value: 0, message: 'Value must be at least 0' },
      { name: 'max', value: 120, message: 'Value must not exceed 120' },
    ],
  },
  {
    name: 'username',
    type: 'text',
    label: 'Username',
    placeholder: 'Enter username',
    validations: [
      { name: 'required', value: true, message: 'Username is required' },
      { name: 'minLength', value: 3, message: 'Username must be at least 3 characters' },
      { name: 'maxLength', value: 20, message: 'Username must not exceed 20 characters' },
      {
        name: 'custom',
        value: true,
        message: 'Username can only contain letters, numbers, and underscores',
        validator: (value) => /^[a-zA-Z0-9_]+$/.test(value),
      },
    ],
  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
    placeholder: 'Enter password',
    validations: [
      { name: 'required', value: true, message: 'Password is required' },
      { name: 'minLength', value: 8, message: 'Password must be at least 8 characters' },
    ],
    helpText: 'Password must be at least 8 characters',
  },
];
```

### With Initial Values

```tsx
<PTDynamicForm
  fields={formFields}
  initialValues={{
    email: 'user@example.com',
    notifications: true,
    country: 'us',
    interests: ['sports', 'music'],
  }}
  onSubmit={(values) => console.log(values)}
/>
```

### With Switch Fields

```tsx
const formFields = [
  {
    name: 'notifications',
    type: 'switch',
    label: 'Enable Notifications',
    defaultValue: false,
  },
  {
    name: 'darkMode',
    type: 'switch',
    label: 'Dark Mode',
    defaultValue: false,
  },
];

<PTDynamicForm
  fields={formFields}
  onSubmit={(values) => {
    console.log('Notifications:', values.notifications);
    console.log('Dark Mode:', values.darkMode);
  }}
  onValueChange={(name, value) => {
    if (name === 'darkMode') {
      // Toggle theme immediately
      toggleTheme(value);
    }
  }}
/>
```

### With Textarea

```tsx
const formFields = [
  {
    name: 'description',
    type: 'textarea',
    label: 'Description',
    placeholder: 'Enter description',
    validations: [
      { name: 'maxLength', value: 500, message: 'Description must not exceed 500 characters' },
    ],
    helpText: 'Maximum 500 characters',
  },
];
```

### With Disabled Fields

```tsx
const formFields = [
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    value: 'user@example.com',
    disabled: true, // Field is read-only
  },
  {
    name: 'name',
    type: 'text',
    label: 'Name',
    validations: [
      { name: 'required', value: true, message: 'Name is required' },
    ],
  },
];
```

### With Custom Submit Button

```tsx
<PTDynamicForm
  fields={formFields}
  onSubmit={(values) => console.log(values)}
  customSubmitButton={
    <View style={{ flexDirection: 'row', gap: 16 }}>
      <PTButton
        title="Cancel"
        variant="outline"
        onPress={() => navigation.goBack()}
      />
      <PTButton
        title="Save"
        onPress={() => formRef.current?.submit()}
        loading={isSubmitting}
      />
    </View>
  }
/>
```

## 📋 Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `fields` | `FormField[]` | ✅ Yes | - | Array of field definitions |
| `onSubmit` | `(values) => void` | ✅ Yes | - | Submit callback |
| `setValue` | `(name, value) => void` | ❌ No | - | Set value callback |
| `onValueChange` | `(name, value, allValues) => void` | ❌ No | - | Value change callback |
| `onSelectionChange` | `(name, selectedValue, allValues) => void` | ❌ No | - | Selection change callback |
| `initialValues` | `Record<string, any>` | ❌ No | `{}` | Initial form values |
| `submitButtonText` | `string` | ❌ No | `'Submit'` | Submit button text |
| `submitLoading` | `boolean` | ❌ No | `false` | Submit button loading state |
| `submitDisabled` | `boolean` | ❌ No | `false` | Submit button disabled state |
| `scrollable` | `boolean` | ❌ No | `true` | Enable scroll view |
| `customSubmitButton` | `ReactNode` | ❌ No | - | Custom submit button |
| `containerStyle` | `ViewStyle` | ❌ No | - | Container style |
| `formRef` | `Ref<PTDynamicFormRef>` | ❌ No | - | Ref for programmatic control |

## 🔧 FormField Interface

```typescript
interface FormField {
  // Required
  name: string;                    // Unique field identifier
  type: FormFieldType;             // Field type

  // Optional
  label?: string;                  // Field label
  placeholder?: string;             // Placeholder text
  defaultValue?: any;              // Default value
  value?: any;                     // Initial value
  required?: boolean;              // **Deprecated** - Use validations array instead
  disabled?: boolean;               // Disable field
  error?: string;                  // Custom error message
  options?: FormFieldOption[];     // Options for select fields
  validations?: Array<{            // Validation rules array
    name: 'required' | 'min' | 'max' | 'minLength' | 'maxLength' | 'custom';
    value: any;                    // Validation value (e.g., true for required, 0 for min)
    message: string;               // Error message when validation fails
    validator?: (fieldValue: any, allValues: Record<string, any>) => boolean; // Custom validator (for 'custom' type)
  }>;
  style?: ViewStyle;               // Custom style
  helpText?: string;               // Help text below field
  showSeparator?: boolean;         // Show separator after field
}
```

## 📝 Field Types

### Text Fields

```tsx
{ 
  name: 'name', 
  type: 'text', 
  label: 'Name', 
  validations: [{ name: 'required', value: true, message: 'Name is required' }] 
}
{ 
  name: 'email', 
  type: 'email', 
  label: 'Email', 
  validations: [{ name: 'required', value: true, message: 'Email is required' }] 
}
{ 
  name: 'password', 
  type: 'password', 
  label: 'Password', 
  validations: [{ name: 'required', value: true, message: 'Password is required' }] 
}
{ name: 'phone', type: 'phone', label: 'Phone Number' }
{ 
  name: 'age', 
  type: 'number', 
  label: 'Age', 
  validations: [
    { name: 'min', value: 0, message: 'Value must be at least 0' },
    { name: 'max', value: 120, message: 'Value must not exceed 120' }
  ] 
}
{ 
  name: 'description', 
  type: 'textarea', 
  label: 'Description', 
  validations: [{ name: 'maxLength', value: 500, message: 'Description must not exceed 500 characters' }] 
}
```

### Switch Field

```tsx
{ 
  name: 'notifications', 
  type: 'switch', 
  label: 'Enable Notifications',
  defaultValue: false 
}
```

### Select Fields

```tsx
{
  name: 'country',
  type: 'select',
  label: 'Country',
  validations: [
    { name: 'required', value: true, message: 'Country is required' },
  ],
  options: [
    { label: 'United States', value: 'us' },
    { label: 'Canada', value: 'ca' },
  ],
}

{
  name: 'interests',
  type: 'multiselect',
  label: 'Interests',
  options: [
    { label: 'Sports', value: 'sports' },
    { label: 'Music', value: 'music' },
  ],
}
```

## 🎯 Callback Examples

### onSubmit Callback

```tsx
<PTDynamicForm
  fields={formFields}
  onSubmit={(values) => {
    // values contains all form field values
    console.log('Email:', values.email);
    console.log('Password:', values.password);
    console.log('Notifications:', values.notifications);
    
    // Submit to API
    submitForm(values);
  }}
/>
```

### setValue Callback

```tsx
<PTDynamicForm
  fields={formFields}
  setValue={(name, value) => {
    console.log(`Field ${name} set to:`, value);
    // Additional logic when value is set programmatically
    if (name === 'country') {
      // Load cities based on country
      loadCities(value);
    }
  }}
/>
```

### onValueChange Callback

```tsx
<PTDynamicForm
  fields={formFields}
  onValueChange={(name, value, allValues) => {
    console.log(`${name} changed to:`, value);
    console.log('All current values:', allValues);
    
    // React to specific field changes
    if (name === 'email') {
      validateEmail(value);
    }
    
    // Auto-save draft
    saveDraft(allValues);
  }}
/>
```

### onSelectionChange Callback

```tsx
<PTDynamicForm
  fields={formFields}
  onSelectionChange={(name, selectedValue, allValues) => {
    console.log(`${name} selection changed:`, selectedValue);
    
    // Handle selection-specific logic
    if (name === 'country') {
      // Update dependent fields
      formRef.current?.setValue('city', '');
      loadCities(selectedValue);
    }
    
    if (name === 'interests') {
      // Update recommendations based on interests
      updateRecommendations(selectedValue);
    }
  }}
/>
```

## 🔍 Validation

Validation rules are defined using a `validations` array. Each validation object contains:
- `name`: The validation type (`'required'`, `'min'`, `'max'`, `'minLength'`, `'maxLength'`, or `'custom'`)
- `value`: The validation value (e.g., `true` for required, `0` for min, `120` for max)
- `message`: The error message to display when validation fails
- `validator`: (Optional) Custom validation function (only used when `name` is `'custom'`)

### Built-in Validations

- **required**: Field must have a value
  ```tsx
  { name: 'required', value: true, message: 'This field is required' }
  ```

- **min**: Minimum value for number fields
  ```tsx
  { name: 'min', value: 0, message: 'Value must be at least 0' }
  ```

- **max**: Maximum value for number fields
  ```tsx
  { name: 'max', value: 120, message: 'Value must not exceed 120' }
  ```

- **minLength**: Minimum length for text fields
  ```tsx
  { name: 'minLength', value: 3, message: 'Must be at least 3 characters' }
  ```

- **maxLength**: Maximum length for text fields
  ```tsx
  { name: 'maxLength', value: 500, message: 'Must not exceed 500 characters' }
  ```

- **Email**: Email format validation is built-in for `type: 'email'` fields

### Custom Validation

```tsx
{
  name: 'username',
  type: 'text',
  label: 'Username',
  validations: [
    { name: 'required', value: true, message: 'Username is required' },
    { name: 'minLength', value: 3, message: 'Username must be at least 3 characters' },
    {
      name: 'custom',
      value: true,
      message: 'Username can only contain letters, numbers, and underscores',
      validator: (value, allValues) => {
        // Return true if valid, false if invalid
        return /^[a-zA-Z0-9_]+$/.test(value);
      },
    },
  ],
}
```

**Note:** The `validator` function receives both the field value and all form values, allowing for cross-field validation. It should return `true` if valid, `false` if invalid.

## 🎨 Theming

The form automatically uses the current theme:

- Input borders and backgrounds
- Error colors
- Spacing and padding
- All child components are themed

## 📚 Complete Example

```tsx
import React, { useRef, useState } from 'react';
import PTDynamicForm, { PTDynamicFormRef } from '../components/comman/PTDynamicForm';

function UserRegistrationForm() {
  const formRef = useRef<PTDynamicFormRef>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formFields = [
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      validations: [
        { name: 'required', value: true, message: 'Full name is required' },
        { name: 'minLength', value: 2, message: 'Name must be at least 2 characters' },
      ],
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'Enter your email',
      validations: [
        { name: 'required', value: true, message: 'Email is required' },
      ],
    },
    {
      name: 'password',
      type: 'password',
      label: 'Password',
      placeholder: 'Enter password',
      validations: [
        { name: 'required', value: true, message: 'Password is required' },
        { name: 'minLength', value: 8, message: 'Password must be at least 8 characters' },
      ],
      helpText: 'Password must be at least 8 characters',
    },
    {
      name: 'country',
      type: 'select',
      label: 'Country',
      validations: [
        { name: 'required', value: true, message: 'Country is required' },
      ],
      options: [
        { label: 'United States', value: 'us' },
        { label: 'Canada', value: 'ca' },
      ],
    },
    {
      name: 'notifications',
      type: 'switch',
      label: 'Enable Notifications',
      defaultValue: false,
    },
  ];

  const handleSubmit = async (values: Record<string, any>) => {
    setIsSubmitting(true);
    try {
      await registerUser(values);
      console.log('Registration successful');
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PTDynamicForm
      ref={formRef}
      fields={formFields}
      onSubmit={handleSubmit}
      submitButtonText="Register"
      submitLoading={isSubmitting}
      onValueChange={(name, value, allValues) => {
        console.log(`${name} changed:`, value);
      }}
      onSelectionChange={(name, selectedValue) => {
        if (name === 'country') {
          // Load cities for selected country
          loadCities(selectedValue);
        }
      }}
    />
  );
}
```

## 🔗 Related Components

- `PTInput` - Text input component
- `PTSelect` - Select dropdown component
- `PTSwitch` - Switch/toggle component
- `PTButton` - Submit button
- `PTText` - Labels and help text

## 📝 Notes

- Form validation runs automatically on submit
- Errors are cleared when field values change
- Initial values can be set via `initialValues` prop or field `value`/`defaultValue`
- The form supports both controlled and uncontrolled modes
- All callbacks receive the updated form values
- Use `formRef` for programmatic control (setValue, getValues, validate, submit)