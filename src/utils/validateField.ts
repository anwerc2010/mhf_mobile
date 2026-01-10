// utils/validateField.ts
export const validateField = (value: any, validations = []) => {
    for (const rule of validations) {
        switch (rule.name) {
            case 'required':
                if (!value) return rule.message || 'This field is required';
                break;

            case 'minLength':
                if (value?.length < rule.value)
                    return `Minimum ${rule.value} characters required`;
                break;

            case 'maxLength':
                if (value?.length > rule.value)
                    return `Maximum ${rule.value} characters allowed`;
                break;

            case 'pattern':
                if (!rule.value.test(value))
                    return rule.message || 'Invalid format';
                break;

            case 'min':
                if (+value < rule.value)
                    return rule.message || `Minimum value ${rule.value}`;
                break;

            case 'max':
                if (+value > rule.value)
                    return rule.message || `Maximum value ${rule.value}`;
                break;
        }
    }
    return null;
};
