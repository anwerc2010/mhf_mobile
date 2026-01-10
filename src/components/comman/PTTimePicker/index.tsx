import React, { useState } from 'react';
import { View, ViewStyle, ScrollView } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import PTInput from '../PTInput';
import PTModal from '../PTModal';
import PTButton from '../PTButton';
import PTText from '../PTText';

interface PTTimePickerProps {
  /**
   * Label for the time picker
   */
  label?: string;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Selected time value (Date object, ISO string, or {hour, minute} object)
   */
  value?: Date | string | { hour: number; minute: number } | null;

  /**
   * Callback when time is selected
   */
  onTimeChange: (time: { hour: number; minute: number }) => void;

  /**
   * Time format: '12h' or '24h'
   */
  format?: '12h' | '24h';

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

export default function PTTimePicker({
  label,
  placeholder = 'Select time',
  value,
  onTimeChange,
  format = '12h',
  disabled = false,
  error,
  required = false,
  style,
}: PTTimePickerProps) {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHour, setSelectedHour] = useState<number>(0);
  const [selectedMinute, setSelectedMinute] = useState<number>(0);

  React.useEffect(() => {
    if (value) {
      let hour = 0;
      let minute = 0;

      if (value instanceof Date) {
        hour = value.getHours();
        minute = value.getMinutes();
      } else if (typeof value === 'string') {
        const date = new Date(value);
        hour = date.getHours();
        minute = date.getMinutes();
      } else if (typeof value === 'object' && 'hour' in value && 'minute' in value) {
        hour = value.hour;
        minute = value.minute;
      }

      setSelectedHour(hour);
      setSelectedMinute(minute);
    }
  }, [value]);

  const formatTime = (hour: number, minute: number): string => {
    const paddedMinute = minute.toString().padStart(2, '0');
    
    if (format === '24h') {
      const paddedHour = hour.toString().padStart(2, '0');
      return `${paddedHour}:${paddedMinute}`;
    } else {
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const paddedHour = displayHour.toString().padStart(2, '0');
      return `${paddedHour}:${paddedMinute} ${period}`;
    }
  };

  const handleTimeSelect = (hour: number, minute: number) => {
    setSelectedHour(hour);
    setSelectedMinute(minute);
    onTimeChange({ hour, minute });
    setModalVisible(false);
  };

  const getDisplayValue = () => {
    if (value) {
      if (typeof value === 'object' && 'hour' in value && 'minute' in value) {
        return formatTime(value.hour, value.minute);
      }
      const date = value instanceof Date ? value : new Date(value);
      return formatTime(date.getHours(), date.getMinutes());
    }
    return '';
  };

  const renderTimePicker = () => {
    const hours = format === '24h' ? Array.from({ length: 24 }, (_, i) => i) : Array.from({ length: 12 }, (_, i) => i + 1);
    const minutes = Array.from({ length: 60 }, (_, i) => i);

    return (
      <View style={{ padding: theme.spacing.md, maxHeight: 400 }}>
        <PTText variant="h3" color="text" style={{ marginBottom: theme.spacing.md, textAlign: 'center' }}>
          Select Time
        </PTText>

        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: theme.spacing.lg }}>
          <View style={{ flex: 1, marginRight: theme.spacing.sm }}>
            <PTText variant="body" color="textSecondary" style={{ marginBottom: theme.spacing.sm, textAlign: 'center' }}>
              Hour
            </PTText>
            <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={false}>
              {hours.map((hour) => {
                const displayHour = format === '12h' ? (hour === 12 ? 12 : hour) : hour;
                // For 12h format: hour 12 = 0 (midnight), hour 1-11 = 1-11, hour 12 = 12 (noon)
                // For display: show 1-12
                // For storage: 0-23
                const actualHour = format === '12h' ? (hour === 12 ? (selectedHour >= 12 ? 12 : 0) : hour) : hour;
                const isSelected = format === '12h' 
                  ? (selectedHour === 0 && hour === 12) || (selectedHour === hour && hour !== 12) || (selectedHour === 12 && hour === 12)
                  : selectedHour === hour;
                
                return (
                  <PTButton
                    key={hour}
                    title={displayHour.toString().padStart(2, '0')}
                    onPress={() => {
                      handleTimeSelect(actualHour, selectedMinute);
                    }}
                    variant={isSelected ? 'primary' : 'outline'}
                    style={{
                      marginBottom: theme.spacing.xs,
                      minHeight: 40,
                    }}
                  />
                );
              })}
            </ScrollView>
          </View>

          <View style={{ flex: 1, marginLeft: theme.spacing.sm }}>
            <PTText variant="body" color="textSecondary" style={{ marginBottom: theme.spacing.sm, textAlign: 'center' }}>
              Minute
            </PTText>
            <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={false}>
              {minutes.map((minute) => {
                const isSelected = selectedMinute === minute;
                return (
                  <PTButton
                    key={minute}
                    title={minute.toString().padStart(2, '0')}
                    onPress={() => handleTimeSelect(selectedHour, minute)}
                    variant={isSelected ? 'primary' : 'outline'}
                    style={{
                      marginBottom: theme.spacing.xs,
                      minHeight: 40,
                    }}
                  />
                );
              })}
            </ScrollView>
          </View>

          {format === '12h' && (
            <View style={{ flex: 0.5, marginLeft: theme.spacing.sm }}>
              <PTText variant="body" color="textSecondary" style={{ marginBottom: theme.spacing.sm, textAlign: 'center' }}>
                Period
              </PTText>
              <View>
                <PTButton
                  title="AM"
                  onPress={() => {
                    if (selectedHour >= 12) {
                      handleTimeSelect(selectedHour - 12, selectedMinute);
                    }
                  }}
                  variant={selectedHour < 12 ? 'primary' : 'outline'}
                  style={{
                    marginBottom: theme.spacing.xs,
                    minHeight: 40,
                  }}
                />
                <PTButton
                  title="PM"
                  onPress={() => {
                    if (selectedHour < 12) {
                      handleTimeSelect(selectedHour + 12, selectedMinute);
                    }
                  }}
                  variant={selectedHour >= 12 ? 'primary' : 'outline'}
                  style={{
                    minHeight: 40,
                  }}
                />
              </View>
            </View>
          )}
        </View>

        <PTButton
          title="Set Current Time"
          onPress={() => {
            const now = new Date();
            handleTimeSelect(now.getHours(), now.getMinutes());
          }}
          variant="outline"
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
        title="Select Time"
        style={{ maxWidth: 400 }}
      >
        {renderTimePicker()}
      </PTModal>
    </View>
  );
}

