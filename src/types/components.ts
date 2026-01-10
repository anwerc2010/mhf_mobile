import { TextInputProps, TextProps, ViewStyle, FlatListProps } from 'react-native';
import React from 'react';

// Button Component
export interface PTButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

// Input Component
export interface PTInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

// Select Component
export interface SelectOption {
  label: string;
  value: string | number;
}

export interface PTSelectProps {
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
}

// Text Component
export interface PTTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  bold?: boolean;
  color?: 'primary' | 'secondary' | 'text' | 'textSecondary' | 'textTertiary' | 'error' | 'success';
}

// Avatar Component
export interface PTAvatarProps {
  source?: { uri: string } | number;
  name?: string;
  size?: number;
  variant?: 'circle' | 'rounded' | 'square';
  style?: ViewStyle;
}

// Card Component
export interface PTCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

// Badge Component
export interface PTBadgeProps {
  count: number | string;
  maxCount?: number;
  variant?: 'primary' | 'secondary' | 'error' | 'success' | 'warning';
  size?: 'small' | 'medium' | 'large';
  showZero?: boolean;
  style?: ViewStyle;
}

// Modal Component
export interface PTModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  animationType?: 'none' | 'slide' | 'fade';
  transparent?: boolean;
  style?: ViewStyle;
}

// Header Component
export interface PTHeaderProps {
  title: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftPress?: () => void;
  onRightPress?: () => void;
}

// List Item Component
export interface PTListItemProps {
  title: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  avatar?: { uri: string } | number | string;
  badge?: number | string;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

// Empty State Component
export interface PTEmptyStateProps {
  title: string;
  message?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

// Container Component
export interface PTContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  safeArea?: boolean;
}

// Switch Component
export interface PTSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

// Divider Component
export interface PTDividerProps {
  orientation?: 'horizontal' | 'vertical';
  spacing?: number;
  style?: ViewStyle;
}

// Date Picker Component
export interface PTDatePickerProps {
  label?: string;
  placeholder?: string;
  value?: Date | string | null;
  onDateChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  mode?: 'date' | 'datetime' | 'time';
  disabled?: boolean;
  error?: string;
  required?: boolean;
  style?: ViewStyle;
}

// Time Picker Component
export interface PTTimePickerProps {
  label?: string;
  placeholder?: string;
  value?: Date | string | { hour: number; minute: number } | null;
  onTimeChange: (time: { hour: number; minute: number }) => void;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  style?: ViewStyle;
}

// Image Picker Component
export interface PTImagePickerProps {
  label?: string;
  value?: string | null;
  onImageSelect: (uri: string) => void;
  onImageRemove?: () => void;
  allowRemove?: boolean;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  style?: ViewStyle;
}

// Stepper Component
export interface PTStepperProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange: (value: number) => void;
  disabled?: boolean;
  style?: ViewStyle;
}

// Progress Bar Component
export interface PTProgressBarProps {
  progress: number;
  height?: number;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  showPercentage?: boolean;
  animated?: boolean;
  style?: ViewStyle;
}

// Tooltip Component
export interface PTTooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  style?: ViewStyle;
}

// Toast Component
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface PTToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
  position?: 'top' | 'bottom';
}

// Tabs Component
export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  badge?: number | string;
  disabled?: boolean;
}

export interface PTTabsProps {
  tabs: TabItem[];
  initialTabId?: string;
  onTabChange?: (tabId: string) => void;
  variant?: 'default' | 'pills';
  position?: 'top' | 'bottom';
  scrollable?: boolean;
  style?: ViewStyle;
}

// Accordion Component
export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  defaultExpanded?: boolean;
  disabled?: boolean;
}

export interface PTAccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  onItemToggle?: (itemId: string, isExpanded: boolean) => void;
  style?: ViewStyle;
}

// Custom List Component
export interface PTCustomListProps<T> extends Omit<FlatListProps<T>, 'data' | 'renderItem'> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactElement;
  onItemPress?: (item: T, index: number) => void;
  emptyState?: {
    title?: string;
    message?: string;
    icon?: React.ReactNode;
    actionLabel?: string;
    onAction?: () => void;
  };
  loading?: boolean;
  error?: string | null;
  refreshing?: boolean;
  onRefresh?: () => void;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  loadingMore?: boolean;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
  showSeparator?: boolean;
  ItemSeparatorComponent?: React.ComponentType<any> | null;
  containerStyle?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  numColumns?: number;
  keyExtractor?: (item: T, index: number) => string;
}

