import React, { useCallback } from 'react';
import {
  FlatList,
  FlatListProps,
  View,
  ViewStyle,
  RefreshControl,
  ListRenderItem,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import PTEmptyState from '../PTEmptyState';
import PTSpinner from '../PTSpinner';
import PTText from '../PTText';

export interface PTCustomListProps<T> extends Omit<FlatListProps<T>, 'data' | 'renderItem'> {
  /**
   * Array of data items to render
   */
  data: T[];

  /**
   * Callback function to render each item
   * @param item - The item data
   * @param index - The index of the item
   * @returns React element to render
   */
  renderItem: (item: T, index: number) => React.ReactElement;

  /**
   * Callback function when an item is pressed
   * @param item - The pressed item
   * @param index - The index of the pressed item
   */
  onItemPress?: (item: T, index: number) => void;

  /**
   * Empty state configuration
   */
  emptyState?: {
    title?: string;
    message?: string;
    icon?: React.ReactNode;
    actionLabel?: string;
    onAction?: () => void;
  };

  /**
   * Loading state
   */
  loading?: boolean;

  /**
   * Error state
   */
  error?: string | null;

  /**
   * Pull to refresh functionality
   */
  refreshing?: boolean;
  onRefresh?: () => void;

  /**
   * Pagination support
   */
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  loadingMore?: boolean;

  /**
   * List header component
   */
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;

  /**
   * List footer component
   */
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;

  /**
   * Show separator between items
   */
  showSeparator?: boolean;

  /**
   * Custom separator component
   */
  ItemSeparatorComponent?: React.ComponentType<any> | null;

  /**
   * Container style
   */
  containerStyle?: ViewStyle;

  /**
   * Content container style
   */
  contentContainerStyle?: ViewStyle;

  /**
   * Number of columns (for grid layout)
   */
  numColumns?: number;

  /**
   * Key extractor function
   */
  keyExtractor?: (item: T, index: number) => string;
}

/**
 * PTCustomList - A customizable list component built on FlatList
 * 
 * Features:
 * - Custom item rendering
 * - Item press handling
 * - Loading states
 * - Empty states
 * - Pull to refresh
 * - Pagination support
 * - Error handling
 * - Themed styling
 * - Separator support
 * 
 * @example
 * ```tsx
 * <PTCustomList
 *   data={users}
 *   renderItem={(user) => (
 *     <PTListItem
 *       title={user.name}
 *       subtitle={user.email}
 *       onPress={() => handleUserPress(user)}
 *     />
 *   )}
 *   onItemPress={(user) => console.log('Pressed:', user)}
 *   emptyState={{
 *     title: "No users found",
 *     message: "Try refreshing the list"
 *   }}
 *   refreshing={refreshing}
 *   onRefresh={handleRefresh}
 *   onEndReached={handleLoadMore}
 *   loadingMore={loadingMore}
 * />
 * ```
 */
export default function PTCustomList<T extends any>({
  data,
  renderItem,
  onItemPress,
  emptyState,
  loading = false,
  error = null,
  refreshing = false,
  onRefresh,
  onEndReached,
  onEndReachedThreshold = 0.5,
  loadingMore = false,
  ListHeaderComponent,
  ListFooterComponent,
  showSeparator = true,
  ItemSeparatorComponent,
  containerStyle,
  contentContainerStyle,
  numColumns,
  keyExtractor,
  ...flatListProps
}: PTCustomListProps<T>) {
  const theme = useTheme();

  // Memoized render item function
  const handleRenderItem: ListRenderItem<T> = useCallback(
    ({ item, index }) => {
      const renderedItem = renderItem(item, index);

      // If onItemPress is provided and the rendered item doesn't have onPress, wrap it
      if (onItemPress) {
        // Check if the rendered item already has onPress
        const hasOnPress =
          renderedItem &&
          typeof renderedItem === 'object' &&
          'props' in renderedItem &&
          renderedItem.props &&
          typeof renderedItem.props === 'object' &&
          'onPress' in renderedItem.props &&
          renderedItem.props.onPress !== undefined;

        if (!hasOnPress) {
          // Wrap in a TouchableOpacity if it's a View-based component
          return (
            <TouchableOpacity
              onPress={() => onItemPress(item, index)}
              activeOpacity={0.7}
            >
              {renderedItem}
            </TouchableOpacity>
          );
        }
      }

      return renderedItem;
    },
    [renderItem, onItemPress]
  );

  // Default key extractor
  const defaultKeyExtractor = useCallback(
    (item: T, index: number) => {
      if (keyExtractor) {
        return keyExtractor(item, index);
      }
      // Try to use id if available
      if (item && typeof item === 'object' && 'id' in item) {
        return String((item as any).id);
      }
      return `item-${index}`;
    },
    [keyExtractor]
  );

  // Default separator component
  const DefaultSeparator = useCallback(
    () => (
      <View
        style={{
          height: 1,
          backgroundColor: theme.colors.borderLight,
          marginLeft: theme.spacing.md,
        }}
      />
    ),
    [theme]
  );

  // Loading state
  if (loading && data.length === 0) {
    return (
      <View style={[{ flex: 1 }, containerStyle]}>
        <PTSpinner />
      </View>
    );
  }

  // Error state
  if (error && data.length === 0) {
    return (
      <View style={[{ flex: 1 }, containerStyle]}>
        <PTEmptyState
          title={emptyState?.title || 'Error'}
          message={error || emptyState?.message || 'Something went wrong'}
          icon={emptyState?.icon}
          actionLabel={emptyState?.actionLabel || 'Retry'}
          onAction={emptyState?.onAction || onRefresh}
        />
      </View>
    );
  }

  // Empty state
  if (!loading && data.length === 0) {
    return (
      <View style={[{ flex: 1 }, containerStyle]}>
        {ListHeaderComponent && (
          <View>
            {typeof ListHeaderComponent === 'function' ? (
              <ListHeaderComponent />
            ) : (
              ListHeaderComponent
            )}
          </View>
        )}
        <PTEmptyState
          title={emptyState?.title || 'No items found'}
          message={emptyState?.message || 'There are no items to display'}
          icon={emptyState?.icon}
          actionLabel={emptyState?.actionLabel}
          onAction={emptyState?.onAction}
        />
      </View>
    );
  }

  // List footer with loading indicator
  const renderFooter = () => {
    if (!loadingMore) {
      return ListFooterComponent ? (
        typeof ListFooterComponent === 'function' ? (
          <ListFooterComponent />
        ) : (
          ListFooterComponent
        )
      ) : null;
    }

    return (
      <View style={{ paddingVertical: theme.spacing.lg, alignItems: 'center' }}>
        <PTSpinner />
        <PTText variant="caption" color="textSecondary" style={{ marginTop: theme.spacing.sm }}>
          Loading more...
        </PTText>
      </View>
    );
  };

  return (
    <View style={[{ flex: 1, backgroundColor: theme.colors.background }, containerStyle]}>
      <FlatList
        data={data}
        renderItem={handleRenderItem}
        keyExtractor={defaultKeyExtractor}
        numColumns={numColumns}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={renderFooter()}
        ItemSeparatorComponent={
          showSeparator
            ? ItemSeparatorComponent || DefaultSeparator
            : null
        }
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
              colors={[theme.colors.primary]}
            />
          ) : undefined
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        contentContainerStyle={[
          {
            paddingBottom: theme.spacing.md,
            flexGrow: data.length === 0 ? 1 : 0,
          },
          contentContainerStyle,
        ]}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={false}
        {...flatListProps}
      />
    </View>
  );
}

