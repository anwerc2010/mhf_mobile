import React, { useState } from 'react';
import { View, ViewStyle, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import PTText from '../PTText';
import PTDivider from '../PTDivider';

export interface AccordionItem {
  /**
   * Accordion item identifier
   */
  id: string;

  /**
   * Accordion title
   */
  title: string;

  /**
   * Accordion content
   */
  content: React.ReactNode;

  /**
   * Whether item is initially expanded
   */
  defaultExpanded?: boolean;

  /**
   * Whether item is disabled
   */
  disabled?: boolean;
}

interface PTAccordionProps {
  /**
   * Array of accordion items
   */
  items: AccordionItem[];

  /**
   * Whether multiple items can be expanded at once
   */
  allowMultiple?: boolean;

  /**
   * Callback when item is expanded/collapsed
   */
  onItemToggle?: (itemId: string, isExpanded: boolean) => void;

  /**
   * Custom style
   */
  style?: ViewStyle;
}

export default function PTAccordion({
  items,
  allowMultiple = false,
  onItemToggle,
  style,
}: PTAccordionProps) {
  const theme = useTheme();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(items.filter((item) => item.defaultExpanded).map((item) => item.id))
  );

  const toggleItem = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (item?.disabled) return;

    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      const isExpanded = newSet.has(itemId);

      if (isExpanded) {
        newSet.delete(itemId);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(itemId);
      }

      if (onItemToggle) {
        onItemToggle(itemId, !isExpanded);
      }

      return newSet;
    });
  };

  return (
    <View style={style}>
      {items.map((item, index) => {
        const isExpanded = expandedItems.has(item.id);
        const rotateAnim = React.useRef(new Animated.Value(isExpanded ? 1 : 0)).current;

        React.useEffect(() => {
          Animated.timing(rotateAnim, {
            toValue: isExpanded ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }, [isExpanded, rotateAnim]);

        const rotate = rotateAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg'],
        });

        return (
          <View key={item.id}>
            <TouchableOpacity
              onPress={() => toggleItem(item.id)}
              disabled={item.disabled}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: theme.spacing.md,
                paddingHorizontal: theme.spacing.md,
                backgroundColor: theme.colors.surface,
                opacity: item.disabled ? 0.5 : 1,
              }}
            >
              <PTText variant="body" color="text" style={{ flex: 1, fontWeight: '600' }}>
                {item.title}
              </PTText>
              <Animated.View
                style={{
                  transform: [{ rotate }],
                  marginLeft: theme.spacing.sm,
                }}
              >
                <PTText variant="body" color="textSecondary">
                  ▼
                </PTText>
              </Animated.View>
            </TouchableOpacity>

            {isExpanded && (
              <View
                style={{
                  backgroundColor: theme.colors.backgroundSecondary,
                  paddingHorizontal: theme.spacing.md,
                  paddingVertical: theme.spacing.md,
                }}
              >
                {item.content}
              </View>
            )}

            {index < items.length - 1 && <PTDivider />}
          </View>
        );
      })}
    </View>
  );
}

