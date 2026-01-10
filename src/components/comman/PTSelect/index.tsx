import React, { useState } from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import PTText from '../PTText';
import PTCard from '../PTCard';
import PTButton from '../PTButton';

export interface SelectOption {
  label: string;
  value: string | number;
}

interface PTSelectProps {
  /**
   * Label for the select field
   */
  label?: string;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Selected value
   */
  value?: string | number | null;

  /**
   * Array of options
   */
  options: SelectOption[];

  /**
   * Callback when selection changes
   */
  onValueChange: (value: string | number) => void;

  /**
   * Whether field is disabled
   */
  disabled?: boolean;

  /**
   * Error message
   */
  error?: string;

  /**
   * Whether field is required
   */
  required?: boolean;

  /**
   * Whether multiple selection is allowed
   */
  multiple?: boolean;

  /**
   * Selected values (for multiple selection)
   */
  selectedValues?: (string | number)[];

  /**
   * Callback for multiple selection
   */
  onMultipleValueChange?: (values: (string | number)[]) => void;
}

export default function PTSelect({
  label,
  placeholder = 'Select an option',
  value,
  options,
  onValueChange,
  disabled = false,
  error,
  required = false,
  multiple = false,
  selectedValues = [],
  onMultipleValueChange,
}: PTSelectProps) {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (optionValue: string | number) => {
    if (multiple && onMultipleValueChange) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];
      onMultipleValueChange(newValues);
    } else {
      onValueChange(optionValue);
      setModalVisible(false);
    }
  };

  const getDisplayText = () => {
    if (multiple) {
      if (selectedValues.length === 0) {
        return placeholder;
      }
      if (selectedValues.length === 1) {
        const option = options.find((opt) => opt.value === selectedValues[0]);
        return option?.label || placeholder;
      }
      return `${selectedValues.length} items selected`;
    } else {
      if (value === null || value === undefined) {
        return placeholder;
      }
      const option = options.find((opt) => opt.value === value);
      return option?.label || placeholder;
    }
  };

  const isSelected = (optionValue: string | number) => {
    if (multiple) {
      return selectedValues.includes(optionValue);
    }
    return value === optionValue;
  };

  return (
    <View style={{ marginBottom: theme.spacing.md }}>
      {label && (
        <PTText
          variant="caption"
          color="text"
          style={{ marginBottom: theme.spacing.sm, fontWeight: '600' }}
        >
          {label}
          {required && <PTText variant="caption" color="error"> *</PTText>}
        </PTText>
      )}

      <TouchableOpacity
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
        activeOpacity={0.7}
        style={{
          borderWidth: 1,
          borderColor: error ? theme.colors.error : theme.colors.border,
          borderRadius: theme.borderRadius.md,
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.inputPadding,
          backgroundColor: disabled ? theme.colors.backgroundSecondary : theme.colors.surface,
          minHeight: 48,
          justifyContent: 'center',
        }}
      >
        <PTText
          variant="body"
          color={value === null || value === undefined ? 'textTertiary' : 'text'}
        >
          {getDisplayText()}
        </PTText>
      </TouchableOpacity>

      {error && (
        <PTText variant="caption" color="error" style={{ marginTop: theme.spacing.xs }}>
          {error}
        </PTText>
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.overlay,
            justifyContent: 'center',
            alignItems: 'center',
            padding: theme.spacing.lg,
          }}
        >
          <PTCard style={{ width: '100%', maxWidth: 400 }}>
            {label && (
              <PTText variant="h3" color="text" style={{ marginBottom: theme.spacing.md }}>
                {label}
              </PTText>
            )}

            {options.map((option) => {
              const selected = isSelected(option.value);
              return (
                <TouchableOpacity
                  key={String(option.value)}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: theme.spacing.md,
                    paddingHorizontal: theme.spacing.md,
                    marginBottom: theme.spacing.sm,
                    borderRadius: theme.borderRadius.md,
                    backgroundColor: selected
                      ? theme.colors.primary
                      : theme.colors.backgroundSecondary,
                  }}
                  onPress={() => handleSelect(option.value)}
                  activeOpacity={0.7}
                >
                  <PTText
                    variant="body"
                    color={selected ? 'textInverse' : 'text'}
                    style={selected ? { fontWeight: '600' } : {}}
                  >
                    {option.label}
                  </PTText>
                  {selected && (
                    <PTText
                      style={{
                        color: theme.colors.textInverse,
                        fontSize: 18,
                        fontWeight: 'bold',
                      }}
                    >
                      {multiple ? '☑' : '✓'}
                    </PTText>
                  )}
                </TouchableOpacity>
              );
            })}

            {multiple && (
              <PTButton
                title="Done"
                onPress={() => setModalVisible(false)}
                style={{ marginTop: theme.spacing.md }}
              />
            )}

            <TouchableOpacity
              style={{
                marginTop: theme.spacing.md,
                paddingVertical: theme.spacing.md - 4,
                alignItems: 'center',
              }}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.7}
            >
              <PTText variant="body" color="primary" style={{ fontWeight: '600' }}>
                Cancel
              </PTText>
            </TouchableOpacity>
          </PTCard>
        </View>
      </Modal>
    </View>
  );
}

