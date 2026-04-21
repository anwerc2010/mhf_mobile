import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
} from "react-native";
import { useTheme } from "../../../hooks/useTheme";
import PTText from "../PTText";
import PTCard from "../PTCard";
import PTButton from "../PTButton";

export interface SelectOption {
  label: string;
  value: string | number;
}

interface PTSelectProps {
  label?: string;
  placeholder?: string;
  value?: string | number | null;
  options: SelectOption[];
  onValueChange: (value: string | number) => void;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  multiple?: boolean;
  selectedValues?: (string | number)[];
  onMultipleValueChange?: (values: (string | number)[]) => void;
  /** Shows a search input inside the Modal to filter options */
  searchable?: boolean;
}

export default function PTSelect({
  label,
  placeholder = "Select an option",
  value,
  options,
  onValueChange,
  disabled = false,
  error,
  required = false,
  multiple = false,
  selectedValues = [],
  onMultipleValueChange,
  searchable = false,
}: PTSelectProps) {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  const openModal = () => {
    if (disabled) return;
    setSearchText("");
    setModalVisible(true);
  };

  const closeModal = () => {
    setSearchText("");
    setModalVisible(false);
  };

  const visibleOptions = searchable
    ? options.filter((o) =>
        o.label.toLowerCase().includes(searchText.toLowerCase()),
      )
    : options;

  const handleSelect = (optionValue: string | number) => {
    if (multiple && onMultipleValueChange) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];
      onMultipleValueChange(newValues);
    } else {
      onValueChange(optionValue);
      closeModal();
    }
  };

  const getDisplayText = () => {
    if (multiple) {
      if (selectedValues.length === 0) return placeholder;
      if (selectedValues.length === 1) {
        const option = options.find((opt) => opt.value === selectedValues[0]);
        return option?.label || placeholder;
      }
      return `${selectedValues.length} items selected`;
    }
    if (value === null || value === undefined) return placeholder;
    const option = options.find((opt) => opt.value === value);
    return option?.label || placeholder;
  };

  const isSelected = (optionValue: string | number) =>
    multiple ? selectedValues.includes(optionValue) : value === optionValue;

  return (
    <View style={{ marginBottom: theme.spacing.md }}>
      {label && (
        <PTText
          variant="caption"
          color="text"
          style={{ marginBottom: theme.spacing.sm, fontWeight: "600" }}
        >
          {label}
          {required && (
            <PTText variant="caption" color="error">
              {" "}
              *
            </PTText>
          )}
        </PTText>
      )}

      <TouchableOpacity
        onPress={openModal}
        disabled={disabled}
        activeOpacity={0.7}
        style={{
          borderWidth: 1,
          borderColor: error ? theme.colors.error : theme.colors.border,
          borderRadius: theme.borderRadius.md,
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.inputPadding,
          backgroundColor: disabled
            ? theme.colors.backgroundSecondary
            : theme.colors.surface,
          minHeight: 48,
          justifyContent: "center",
        }}
      >
        <PTText
          variant="body"
          color={value === null || value === undefined ? "textTertiary" : "text"}
        >
          {getDisplayText()}
        </PTText>
      </TouchableOpacity>

      {error && (
        <PTText
          variant="caption"
          color="error"
          style={{ marginTop: theme.spacing.xs }}
        >
          {error}
        </PTText>
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.overlay,
            justifyContent: "center",
            alignItems: "center",
            padding: theme.spacing.lg,
          }}
        >
          <PTCard style={{ width: "100%", maxWidth: 400 }}>
            {label && (
              <PTText
                variant="h3"
                color="text"
                style={{ marginBottom: theme.spacing.md }}
              >
                {label}
              </PTText>
            )}

            {searchable && (
              <TextInput
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Search..."
                autoFocus
                style={{
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  borderRadius: theme.borderRadius.md,
                  paddingHorizontal: theme.spacing.md,
                  paddingVertical: theme.spacing.sm,
                  marginBottom: theme.spacing.md,
                  fontSize: 14,
                  color: theme.colors.text,
                }}
              />
            )}

            <FlatList
              data={visibleOptions}
              keyExtractor={(item) => String(item.value)}
              keyboardShouldPersistTaps="handled"
              style={{ maxHeight: 320 }}
              contentContainerStyle={{ paddingBottom: theme.spacing.sm }}
              ListEmptyComponent={
                <View
                  style={{
                    padding: theme.spacing.md,
                    alignItems: "center",
                  }}
                >
                  <PTText variant="body" color="textTertiary">
                    {searchable && searchText
                      ? "No results found"
                      : "No options available"}
                  </PTText>
                </View>
              }
              renderItem={({ item }) => {
                const selected = isSelected(item.value);
                return (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingVertical: theme.spacing.md,
                      paddingHorizontal: theme.spacing.md,
                      marginBottom: theme.spacing.sm,
                      borderRadius: theme.borderRadius.md,
                      backgroundColor: selected
                        ? theme.colors.primary
                        : theme.colors.backgroundSecondary,
                    }}
                    onPress={() => handleSelect(item.value)}
                    activeOpacity={0.7}
                  >
                    <PTText
                      variant="body"
                      color={selected ? "primary" : "text"}
                      style={selected ? { fontWeight: "600" } : {}}
                    >
                      {item.label}
                    </PTText>
                    {selected && (
                      <PTText
                        style={{
                          color: theme.colors.textInverse,
                          fontSize: 18,
                          fontWeight: "bold",
                        }}
                      >
                        {multiple ? "☑" : "✓"}
                      </PTText>
                    )}
                  </TouchableOpacity>
                );
              }}
            />

            {multiple && (
              <View style={{ marginTop: theme.spacing.md }}>
                <PTButton title="Done" onPress={closeModal} />
              </View>
            )}

            <TouchableOpacity
              style={{
                marginTop: theme.spacing.md,
                paddingVertical: theme.spacing.md - 4,
                alignItems: "center",
              }}
              onPress={closeModal}
              activeOpacity={0.7}
            >
              <PTText variant="body" color="primary" style={{ fontWeight: "600" }}>
                Cancel
              </PTText>
            </TouchableOpacity>
          </PTCard>
        </View>
      </Modal>
    </View>
  );
}
