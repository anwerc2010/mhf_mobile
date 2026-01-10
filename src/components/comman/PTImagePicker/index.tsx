import React, { useState } from 'react';
import { View, Image, TouchableOpacity, ViewStyle, ImageStyle, Alert, Platform } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import PTText from '../PTText';
import PTModal from '../PTModal';
import PTButton from '../PTButton';

interface PTImagePickerProps {
  /**
   * Label for the image picker
   */
  label?: string;

  /**
   * Selected image URI
   */
  value?: string | null;

  /**
   * Callback when image is selected
   */
  onImageSelect: (uri: string) => void;

  /**
   * Callback when image is removed
   */
  onImageRemove?: () => void;

  /**
   * Whether to allow image removal
   */
  allowRemove?: boolean;

  /**
   * Image width
   */
  width?: number;

  /**
   * Image height
   */
  height?: number;

  /**
   * Whether field is disabled
   */
  disabled?: boolean;

  /**
   * Error message
   */
  error?: string;

  /**
   * Custom style
   */
  style?: ViewStyle;

  /**
   * Custom image style
   */
  imageStyle?: ImageStyle;
}

export default function PTImagePicker({
  label,
  value,
  onImageSelect,
  onImageRemove,
  allowRemove = true,
  width = 200,
  height = 200,
  disabled = false,
  error,
  style,
  imageStyle,
}: PTImagePickerProps) {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const handleImageSource = () => {
    // In a real implementation, you would use react-native-image-picker
    // or expo-image-picker here
    Alert.alert(
      'Select Image Source',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: () => {
            // Open camera
            // For now, we'll simulate with a placeholder
            onImageSelect('https://via.placeholder.com/200');
            setModalVisible(false);
          },
        },
        {
          text: 'Gallery',
          onPress: () => {
            // Open gallery
            // For now, we'll simulate with a placeholder
            onImageSelect('https://via.placeholder.com/200');
            setModalVisible(false);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => setModalVisible(false),
        },
      ],
      { cancelable: true }
    );
  };

  const handleRemove = () => {
    if (onImageRemove) {
      onImageRemove();
    } else {
      onImageSelect('');
    }
  };

  return (
    <View style={style}>
      {label && (
        <PTText
          variant="caption"
          color="text"
          style={{ marginBottom: theme.spacing.sm, fontWeight: '600' }}
        >
          {label}
        </PTText>
      )}

      <View
        style={{
          borderWidth: 1,
          borderColor: error ? theme.colors.error : theme.colors.border,
          borderRadius: theme.borderRadius.md,
          overflow: 'hidden',
          width,
          height,
        }}
      >
        {value ? (
          <View style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Image
              source={{ uri: value }}
              style={[
                {
                  width: '100%',
                  height: '100%',
                  resizeMode: 'cover',
                },
                imageStyle,
              ]}
            />
            {!disabled && allowRemove && (
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  top: theme.spacing.xs,
                  right: theme.spacing.xs,
                  backgroundColor: theme.colors.error,
                  borderRadius: theme.borderRadius.full,
                  width: 24,
                  height: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={handleRemove}
                activeOpacity={0.7}
              >
                <PTText variant="caption" color="textInverse" style={{ fontSize: 14 }}>
                  ×
                </PTText>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <TouchableOpacity
            style={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.colors.backgroundSecondary,
            }}
            onPress={() => !disabled && handleImageSource()}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <PTText variant="body" color="textSecondary" style={{ textAlign: 'center' }}>
              Tap to select image
            </PTText>
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <PTText variant="caption" color="error" style={{ marginTop: theme.spacing.xs }}>
          {error}
        </PTText>
      )}

      {value && !disabled && (
        <View style={{ marginTop: theme.spacing.sm, flexDirection: 'row', gap: theme.spacing.sm }}>
          <PTButton
            title="Change Image"
            onPress={handleImageSource}
            variant="outline"
            style={{ flex: 1 }}
          />
          {allowRemove && (
            <PTButton
              title="Remove"
              onPress={handleRemove}
              variant="outline"
              style={{ flex: 1 }}
            />
          )}
        </View>
      )}
    </View>
  );
}

