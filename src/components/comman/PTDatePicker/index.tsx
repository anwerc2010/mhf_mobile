import React, { useState } from 'react';
import { View, ViewStyle, Platform } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import PTInput from '../PTInput';
import PTModal from '../PTModal';
import PTButton from '../PTButton';
import PTText from '../PTText';

interface PTDatePickerProps {
  /**
   * Label for the date picker
   */
  label?: string;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Selected date value (Date object or ISO string)
   */
  value?: Date | string | null;

  /**
   * Callback when date is selected
   */
  onDateChange: (date: Date) => void;

  /**
   * Minimum selectable date
   */
  minimumDate?: Date;

  /**
   * Maximum selectable date
   */
  maximumDate?: Date;

  /**
   * Date format for display (default: 'MM/DD/YYYY')
   */
  displayFormat?: string;

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
   * Custom style
   */
  style?: ViewStyle;
}

export default function PTDatePicker({
  label,
  placeholder = 'Select date',
  value,
  onDateChange,
  minimumDate,
  maximumDate,
  displayFormat = 'MM/DD/YYYY',
  disabled = false,
  error,
  required = false,
  style,
}: PTDatePickerProps) {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? (value instanceof Date ? value : new Date(value)) : null
  );

  const formatDate = (date: Date): string => {
    if (!date) return '';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return displayFormat
      .replace('DD', day)
      .replace('MM', month)
      .replace('YYYY', year.toString())
      .replace('YY', year.toString().slice(-2));
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onDateChange(date);
    setModalVisible(false);
  };

  const getDisplayValue = () => {
    if (selectedDate) {
      return formatDate(selectedDate);
    }
    return '';
  };

  // Simple date picker UI (for iOS/Android, you'd use @react-native-community/datetimepicker)
  const renderDatePicker = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const days: (number | null)[] = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return (
      <View style={{ padding: theme.spacing.md }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: theme.spacing.md,
            alignItems: 'center',
          }}
        >
          <PTText variant="h3" color="text">
            {new Date(currentYear, currentMonth).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </PTText>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: theme.spacing.md }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <View
              key={day}
              style={{
                width: '14.28%',
                alignItems: 'center',
                paddingVertical: theme.spacing.sm,
              }}
            >
              <PTText variant="caption" color="textSecondary">
                {day}
              </PTText>
            </View>
          ))}
          {days.map((day, index) => {
            if (day === null) {
              return <View key={`empty-${index}`} style={{ width: '14.28%' }} />;
            }

            const date = new Date(currentYear, currentMonth, day);
            const isSelected =
              selectedDate &&
              selectedDate.getDate() === day &&
              selectedDate.getMonth() === currentMonth &&
              selectedDate.getFullYear() === currentYear;
            const isToday = day === currentDay;
            const isDisabled =
              (minimumDate && date < minimumDate) || (maximumDate && date > maximumDate);

            return (
              <PTButton
                key={day}
                title={day.toString()}
                onPress={() => !isDisabled && handleDateSelect(date)}
                disabled={isDisabled}
                variant={isSelected ? 'primary' : 'outline'}
                style={{
                  width: '14.28%',
                  minHeight: 40,
                  paddingVertical: theme.spacing.xs,
                  margin: 2,
                  backgroundColor: isSelected
                    ? theme.colors.primary
                    : isToday
                    ? theme.colors.primaryLight
                    : 'transparent',
                }}
              />
            );
          })}
        </View>

        <PTButton
          title="Today"
          onPress={() => handleDateSelect(new Date())}
          variant="outline"
          style={{ marginTop: theme.spacing.md }}
        />
      </View>
    );
  };

  return (
    <View style={style}>
      <PTInput
        label={label}
        placeholder={placeholder}
        value={getDisplayValue()}
        onFocus={() => !disabled && setModalVisible(true)}
        editable={false}
        error={error}
        style={{ marginBottom: 0 }}
      />
      {required && (
        <PTText variant="caption" color="error" style={{ marginTop: theme.spacing.xs }}>
          *
        </PTText>
      )}

      <PTModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Select Date"
        style={{ maxWidth: 400 }}
      >
        {renderDatePicker()}
      </PTModal>
    </View>
  );
}

