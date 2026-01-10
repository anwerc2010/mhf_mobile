import React, { useState } from 'react';
import { View, ViewStyle, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import PTText from '../PTText';

export interface TabItem {
  /**
   * Tab identifier
   */
  id: string;

  /**
   * Tab label
   */
  label: string;

  /**
   * Tab content
   */
  content: React.ReactNode;

  /**
   * Badge count (optional)
   */
  badge?: number | string;

  /**
   * Whether tab is disabled
   */
  disabled?: boolean;
}

interface PTTabsProps {
  /**
   * Array of tab items
   */
  tabs: TabItem[];

  /**
   * Initial active tab ID
   */
  initialTabId?: string;

  /**
   * Callback when tab changes
   */
  onTabChange?: (tabId: string) => void;

  /**
   * Tab variant: 'default' or 'pills'
   */
  variant?: 'default' | 'pills';

  /**
   * Tab position: 'top' or 'bottom'
   */
  position?: 'top' | 'bottom';

  /**
   * Whether tabs are scrollable
   */
  scrollable?: boolean;

  /**
   * Custom style
   */
  style?: ViewStyle;
}

export default function PTTabs({
  tabs,
  initialTabId,
  onTabChange,
  variant = 'default',
  position = 'top',
  scrollable = false,
  style,
}: PTTabsProps) {
  const theme = useTheme();
  const [activeTabId, setActiveTabId] = useState<string>(
    initialTabId || tabs[0]?.id || ''
  );

  const handleTabPress = (tabId: string) => {
    const tab = tabs.find((t) => t.id === tabId);
    if (tab && !tab.disabled) {
      setActiveTabId(tabId);
      if (onTabChange) {
        onTabChange(tabId);
      }
    }
  };

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  const renderTabBar = () => {
    const tabBarContent = tabs.map((tab) => {
      const isActive = tab.id === activeTabId;
      const isDisabled = tab.disabled;

      const tabStyle = {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        marginRight: theme.spacing.xs,
        borderRadius: variant === 'pills' ? theme.borderRadius.full : theme.borderRadius.md,
        backgroundColor: isActive
          ? theme.colors.primary
          : variant === 'pills'
          ? theme.colors.backgroundSecondary
          : 'transparent',
        borderBottomWidth: variant === 'default' && isActive ? 2 : 0,
        borderBottomColor: theme.colors.primary,
        opacity: isDisabled ? 0.5 : 1,
      };

      return (
        <TouchableOpacity
          key={tab.id}
          onPress={() => handleTabPress(tab.id)}
          disabled={isDisabled}
          activeOpacity={0.7}
          style={tabStyle}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <PTText
              variant="body"
              color={isActive ? (variant === 'pills' ? 'textInverse' : 'primary') : 'text'}
              style={{ fontWeight: isActive ? '600' : 'normal' }}
            >
              {tab.label}
            </PTText>
            {tab.badge !== undefined && (
              <View
                style={{
                  marginLeft: theme.spacing.xs,
                  backgroundColor: isActive
                    ? theme.colors.textInverse
                    : theme.colors.error,
                  borderRadius: theme.borderRadius.full,
                  minWidth: 20,
                  height: 20,
                  paddingHorizontal: theme.spacing.xs,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PTText
                  variant="caption"
                  color={isActive ? 'primary' : 'textInverse'}
                  style={{ fontSize: 10, fontWeight: 'bold' }}
                >
                  {tab.badge}
                </PTText>
              </View>
            )}
          </View>
        </TouchableOpacity>
      );
    });

    const tabBar = (
      <View
        style={{
          flexDirection: 'row',
          borderBottomWidth: variant === 'default' ? 1 : 0,
          borderBottomColor: theme.colors.borderLight,
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
        }}
      >
        {scrollable ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {tabBarContent}
          </ScrollView>
        ) : (
          tabBarContent
        )}
      </View>
    );

    return tabBar;
  };

  return (
    <View style={[{ flex: 1 }, style]}>
      {position === 'top' && renderTabBar()}
      <View style={{ flex: 1 }}>{activeTab?.content}</View>
      {position === 'bottom' && renderTabBar()}
    </View>
  );
}

