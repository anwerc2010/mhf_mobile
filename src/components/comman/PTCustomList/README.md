# PTCustomList Component

A powerful, customizable list component built on React Native's `FlatList` with comprehensive features for displaying and interacting with data arrays.

## 📍 Location

`/src/components/comman/PTCustomList.tsx`

## ✨ Features

- ✅ **Custom Item Rendering** - Render items using your own callback function
- ✅ **Item Press Handling** - Handle item clicks with `onItemPress` callback
- ✅ **Loading States** - Built-in loading spinner support
- ✅ **Empty States** - Customizable empty state with PTEmptyState component
- ✅ **Error Handling** - Display error messages with retry functionality
- ✅ **Pull to Refresh** - Built-in RefreshControl integration
- ✅ **Pagination** - Infinite scroll with `onEndReached` support
- ✅ **Separators** - Optional item separators (default or custom)
- ✅ **Grid Layout** - Support for multi-column layouts
- ✅ **Custom Key Extractor** - Flexible key generation
- ✅ **Header/Footer** - ListHeaderComponent and ListFooterComponent support
- ✅ **Themed Styling** - Fully integrated with theme system
- ✅ **TypeScript Support** - Fully typed with generics

## 📦 Installation

The component is already available in the project. Import it like this:

```tsx
import PTCustomList from '../components/comman/PTCustomList';
// or
import { PTCustomList } from '../components/comman';
```

## 🚀 Basic Usage

### Simple List

```tsx
import React from 'react';
import { View } from 'react-native';
import PTCustomList from '../components/comman/PTCustomList';
import PTListItem from '../components/comman/PTListItem';

interface User {
  id: string;
  name: string;
  email: string;
}

function UserList() {
  const users: User[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  ];

  return (
    <PTCustomList
      data={users}
      renderItem={(user) => (
        <PTListItem
          title={user.name}
          subtitle={user.email}
        />
      )}
      onItemPress={(user) => {
        console.log('User pressed:', user);
        // Navigate to user detail screen
      }}
    />
  );
}
```

### With Pull to Refresh

```tsx
import React, { useState } from 'react';
import PTCustomList from '../components/comman/PTCustomList';

function RefreshableList() {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const newData = await fetchData();
      setData(newData);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <PTCustomList
      data={data}
      renderItem={(item) => <PTListItem title={item.name} />}
      onItemPress={(item) => handleItemPress(item)}
      refreshing={refreshing}
      onRefresh={handleRefresh}
    />
  );
}
```

### With Pagination

```tsx
import React, { useState } from 'react';
import PTCustomList from '../components/comman/PTCustomList';

function PaginatedList() {
  const [data, setData] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

  const handleLoadMore = async () => {
    if (loadingMore) return;
    
    setLoadingMore(true);
    try {
      const newData = await fetchMoreData(page + 1);
      setData([...data, ...newData]);
      setPage(page + 1);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <PTCustomList
      data={data}
      renderItem={(item) => <PTListItem title={item.name} />}
      onItemPress={(item) => handleItemPress(item)}
      onEndReached={handleLoadMore}
      loadingMore={loadingMore}
      onEndReachedThreshold={0.5}
    />
  );
}
```

### With Empty State

```tsx
<PTCustomList
  data={items}
  renderItem={(item) => <PTListItem title={item.name} />}
  emptyState={{
    title: "No items found",
    message: "Try refreshing or adding new items",
    actionLabel: "Refresh",
    onAction: handleRefresh,
    icon: <PTText>📭</PTText>, // Optional icon
  }}
/>
```

### With Error State

```tsx
const [error, setError] = useState<string | null>(null);

<PTCustomList
  data={items}
  renderItem={(item) => <PTListItem title={item.name} />}
  error={error}
  onRefresh={handleRefresh}
  emptyState={{
    actionLabel: "Retry",
    onAction: handleRefresh,
  }}
/>
```

### With Loading State

```tsx
const [loading, setLoading] = useState(true);

<PTCustomList
  data={items}
  renderItem={(item) => <PTListItem title={item.name} />}
  loading={loading}
  onItemPress={(item) => handleItemPress(item)}
/>
```

### With Custom Separator

```tsx
import PTDivider from '../components/comman/PTDivider';

<PTCustomList
  data={items}
  renderItem={(item) => <PTListItem title={item.name} />}
  ItemSeparatorComponent={() => <PTDivider spacing={16} />}
  showSeparator={true}
/>
```

### With Grid Layout

```tsx
<PTCustomList
  data={items}
  renderItem={(item) => (
    <PTCard style={{ flex: 1, margin: 8 }}>
      <PTText>{item.name}</PTText>
    </PTCard>
  )}
  numColumns={2}
  onItemPress={(item) => handleItemPress(item)}
/>
```

### With Header and Footer

```tsx
<PTCustomList
  data={items}
  renderItem={(item) => <PTListItem title={item.name} />}
  ListHeaderComponent={
    <PTText variant="h2" style={{ padding: 16 }}>
      Items List
    </PTText>
  }
  ListFooterComponent={
    <PTText variant="caption" style={{ padding: 16, textAlign: 'center' }}>
      End of list
    </PTText>
  }
/>
```

### With Custom Key Extractor

```tsx
<PTCustomList
  data={items}
  renderItem={(item) => <PTListItem title={item.name} />}
  keyExtractor={(item, index) => `custom-key-${item.id}-${index}`}
  onItemPress={(item) => handleItemPress(item)}
/>
```

## 📋 Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `data` | `T[]` | ✅ Yes | - | Array of data items to render |
| `renderItem` | `(item: T, index: number) => ReactElement` | ✅ Yes | - | Function to render each item |
| `onItemPress` | `(item: T, index: number) => void` | ❌ No | - | Callback when item is pressed |
| `loading` | `boolean` | ❌ No | `false` | Shows loading spinner (when data is empty) |
| `error` | `string \| null` | ❌ No | `null` | Error message to display |
| `refreshing` | `boolean` | ❌ No | `false` | Pull to refresh state |
| `onRefresh` | `() => void` | ❌ No | - | Refresh callback |
| `onEndReached` | `() => void` | ❌ No | - | Pagination callback |
| `loadingMore` | `boolean` | ❌ No | `false` | Loading more indicator |
| `onEndReachedThreshold` | `number` | ❌ No | `0.5` | Threshold for pagination trigger |
| `emptyState` | `object` | ❌ No | - | Empty state configuration |
| `showSeparator` | `boolean` | ❌ No | `true` | Show separators between items |
| `ItemSeparatorComponent` | `Component` | ❌ No | - | Custom separator component |
| `ListHeaderComponent` | `Component` | ❌ No | - | Header component |
| `ListFooterComponent` | `Component` | ❌ No | - | Footer component |
| `numColumns` | `number` | ❌ No | - | Number of columns (for grid) |
| `keyExtractor` | `(item: T, index: number) => string` | ❌ No | - | Custom key extractor |
| `containerStyle` | `ViewStyle` | ❌ No | - | Container style |
| `contentContainerStyle` | `ViewStyle` | ❌ No | - | Content container style |
| `...flatListProps` | `FlatListProps<T>` | ❌ No | - | All standard FlatList props |

### Empty State Configuration

```typescript
interface EmptyState {
  title?: string;           // Empty state title
  message?: string;         // Empty state message
  icon?: React.ReactNode;   // Optional icon
  actionLabel?: string;     // Action button label
  onAction?: () => void;    // Action callback
}
```

## 🎯 Use Cases

### 1. User List with Avatars

```tsx
<PTCustomList
  data={users}
  renderItem={(user) => (
    <PTListItem
      title={user.name}
      subtitle={user.email}
      avatar={user.avatar}
      badge={user.unreadCount}
      onPress={() => navigateToUser(user.id)}
    />
  )}
  onItemPress={(user) => handleUserPress(user)}
/>
```

### 2. Product Grid

```tsx
<PTCustomList
  data={products}
  renderItem={(product) => (
    <PTCard style={{ flex: 1, margin: 8 }}>
      <PTText variant="h3">{product.name}</PTText>
      <PTText color="textSecondary">${product.price}</PTText>
    </PTCard>
  )}
  numColumns={2}
  onItemPress={(product) => navigateToProduct(product)}
/>
```

### 3. Search Results

```tsx
<PTCustomList
  data={searchResults}
  renderItem={(result) => (
    <PTListItem
      title={result.title}
      subtitle={result.description}
      leftIcon={<PTText>🔍</PTText>}
    />
  )}
  emptyState={{
    title: "No results found",
    message: "Try a different search term",
  }}
  onItemPress={(result) => handleResultPress(result)}
/>
```

### 4. Notification List

```tsx
<PTCustomList
  data={notifications}
  renderItem={(notification) => (
    <PTListItem
      title={notification.title}
      subtitle={notification.message}
      badge={notification.unread ? 1 : undefined}
      rightIcon={<PTText>{formatDate(notification.date)}</PTText>}
    />
  )}
  refreshing={refreshing}
  onRefresh={handleRefresh}
  onItemPress={(notification) => markAsRead(notification)}
/>
```

## 🔧 Advanced Features

### Custom Item Rendering with Conditional Styling

```tsx
<PTCustomList
  data={items}
  renderItem={(item, index) => (
    <PTCard
      style={{
        backgroundColor: item.isActive ? theme.colors.primary : theme.colors.surface,
      }}
    >
      <PTText color={item.isActive ? 'textInverse' : 'text'}>
        {item.name}
      </PTText>
    </PTCard>
  )}
  onItemPress={(item) => toggleItem(item)}
/>
```

### Handling Items with Built-in onPress

If your rendered item already has an `onPress` handler, the component won't wrap it:

```tsx
<PTCustomList
  data={items}
  renderItem={(item) => (
    <PTListItem
      title={item.name}
      onPress={() => handleItemPress(item)} // Already has onPress
    />
  )}
  // onItemPress won't be called since item has its own onPress
/>
```

### Performance Optimization

The component uses `useCallback` for optimal performance. For large lists, consider:

```tsx
// Memoize your render function
const renderItem = useCallback((item: ItemType) => {
  return <PTListItem title={item.name} />;
}, []);

<PTCustomList
  data={items}
  renderItem={renderItem}
  onItemPress={handleItemPress}
/>
```

## 🎨 Theming

The component automatically uses the current theme:

- Background colors from `theme.colors.background`
- Separator colors from `theme.colors.borderLight`
- Spacing from `theme.spacing`
- All child components are themed

## 📝 Notes

- The component automatically handles empty arrays and shows appropriate states
- Loading state only shows when `data.length === 0`
- Error state only shows when `data.length === 0`
- Empty state shows when `!loading && data.length === 0`
- Items are automatically wrapped in `TouchableOpacity` if `onItemPress` is provided and the item doesn't have its own `onPress`
- The component supports all standard `FlatList` props for maximum flexibility

## 🔗 Related Components

- `PTListItem` - List item component
- `PTEmptyState` - Empty state component
- `PTSpinner` - Loading spinner
- `PTDivider` - Separator component

## 📚 Examples

See the component in action in:
- User management screens
- Product listings
- Search results
- Notification lists
- Any screen that displays a list of items

