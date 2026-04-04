# mhf_mobile - React Native Application

A modern, feature-rich React Native application built with TypeScript, Redux Toolkit, React Navigation, and comprehensive theming support.

## 📋 Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [File Structure & Documentation](#file-structure--documentation)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Configuration](#configuration)
- [Development](#development)

## 🎯 Overview

Patrn is a React Native application that demonstrates best practices in mobile app development, including:

- Authentication flow (Login/Register)
- Multi-navigation support (Stack, Tabs, Drawer)
- Internationalization (i18n) with RTL support
- Dark/Light theme system
- Network status monitoring
- Form validation
- Centralized configuration management

## 📁 Project Structure

```
Patrn/
├── android/                 # Android native code
├── ios/                     # iOS native code
├── src/                     # Source code
│   ├── assets/             # Static assets (fonts, icons, images)
│   ├── components/         # Reusable components
│   ├── constants/         # App constants and configuration
│   ├── hooks/              # Custom React hooks
│   ├── i18n/               # Internationalization setup
│   ├── locales/            # Translation files
│   ├── navigation/        # Navigation configuration
│   ├── screens/            # Screen components
│   ├── store/              # Redux store and slices
│   ├── theme/              # Theme definitions
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── App.tsx                  # Root application component
├── index.js                 # Application entry point
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── babel.config.js          # Babel configuration
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd Patrn
```

2. Install dependencies

```bash
npm install
```

3. For iOS, install pods

```bash
cd ios && pod install && cd ..
```

### Running the App

**Android:**

```bash
npm run android
```

**iOS:**

```bash
npm run ios
```

**Start Metro Bundler:**

```bash
npm start
```

## 📚 File Structure & Documentation

### Root Level Files

#### `App.tsx`

The root application component that sets up:

- Redux Provider
- Navigation Container
- Safe Area handling
- Theme initialization
- RTL (Right-to-Left) layout support
- Network status banner
- Status bar configuration

**Key Features:**

- Wraps the app with `GestureHandlerRootView` for gesture support
- Provides Redux store to all components
- Handles system theme detection
- Manages RTL layout based on selected language

#### `index.js`

The application entry point that:

- Imports `react-native-gesture-handler` (must be first import)
- Registers the app component with React Native
- Sets up the app name from `app.json`

#### `package.json`

Contains:

- Project metadata (name, version)
- Dependencies (React, React Native, Navigation, Redux, etc.)
- Dev dependencies (TypeScript, ESLint, Jest)
- Scripts for running, testing, and linting
- Engine requirements (Node >= 20)

#### `tsconfig.json`

TypeScript configuration that:

- Extends React Native TypeScript config
- Includes all `.ts` and `.tsx` files
- Excludes `node_modules` and `Pods`

#### `babel.config.js`

Babel configuration for:

- React Native preset
- Reanimated plugin (required for animations)

#### `app.json`

App metadata:

- App name: "Patrn"
- Display name: "Patrn"

#### `metro.config.js`

Metro bundler configuration for React Native

#### `jest.config.js`

Jest testing configuration

---

### `/src` Directory

### `/src/components` - Reusable Components

#### `/src/components/comman` - Common UI Components

All common components follow the `PT` (Patrn) naming convention and are fully themed.

##### `PTButton.tsx`

A customizable button component with:

- Variants: `primary`, `secondary`, `outline`
- Loading state support
- Disabled state
- Themed colors and spacing

**Props:**

- `title`: Button text
- `onPress`: Press handler
- `loading`: Shows activity indicator
- `disabled`: Disables interaction
- `variant`: Button style variant

##### `PTInput.tsx`

Text input component with:

- Label support
- Error message display
- Themed styling
- All standard TextInput props

**Props:**

- `label`: Optional label text
- `error`: Error message to display
- All `TextInputProps` are supported

##### `PTText.tsx`

Typography component with:

- Variants: `h1`, `h2`, `h3`, `body`, `caption`
- Color options: `primary`, `secondary`, `text`, `textSecondary`, `textTertiary`, `error`, `success`
- Bold option
- Themed colors

##### `PTCard.tsx`

Card container component with:

- Themed background and shadows
- Configurable padding
- Rounded corners

##### `PTContainer.tsx`

Main container component with:

- Safe area support
- Themed background
- Full-screen layout

##### `PTHeader.tsx`

Header component with:

- Title display
- Left and right icon support
- Themed styling
- Touch handlers for icons

##### `PTSpinner.tsx`

Loading spinner component:

- Centered layout
- Themed primary color
- Full-screen overlay

##### `PTModal.tsx`

Modal/Dialog component with:

- Backdrop overlay
- Title and close button
- Configurable animations
- Touch outside to close

**Props:**

- `visible`: Controls visibility
- `onClose`: Close handler
- `title`: Optional title
- `showCloseButton`: Toggle close button
- `closeOnBackdrop`: Close on backdrop press
- `animationType`: Animation style

##### `PTBadge.tsx`

Badge/notification count component:

- Displays numbers or text
- Variants: `primary`, `secondary`, `error`, `success`, `warning`
- Sizes: `small`, `medium`, `large`
- Max count support (e.g., "99+")
- Auto-hides when count is 0

##### `PTAvatar.tsx`

Avatar/profile picture component:

- Image source or initials
- Shapes: `circle`, `rounded`, `square`
- Customizable size
- Auto-generates initials from name

##### `PTDivider.tsx`

Divider/separator component:

- Horizontal or vertical orientation
- Configurable spacing
- Themed colors

##### `PTSwitch.tsx`

Switch/toggle component:

- Native switch with label
- Themed colors
- Disabled state

##### `PTListItem.tsx`

List item component with:

- Title and subtitle
- Left/right icons
- Avatar support
- Badge support
- Pressable with onPress handler

##### `PTEmptyState.tsx`

Empty state component for:

- No data scenarios
- Title and message
- Optional icon
- Optional action button

##### `PTToast.tsx`

Toast notification component:

- Types: `success`, `error`, `info`, `warning`
- Auto-dismiss with configurable duration
- Slide and fade animations
- Top or bottom positioning

##### `index.ts`

Centralized export file for all common components

#### `/src/components/general` - General Components

##### `LanguageSwitcher.tsx`

Language switching component:

- Modal-based language selection
- Supports English and Arabic
- Updates app language and RTL layout
- Themed styling

##### `ThemeSwitcher.tsx`

Theme switching component:

- Modal-based theme selection
- Options: Light, Dark, System
- Updates app theme immediately
- Themed styling

##### `NetworkStatusBanner.tsx`

Network status indicator:

- Shows banner when offline
- Auto-hides when connected
- Themed error color
- Internationalized message

---

### `/src/constants` - Constants & Configuration

#### `colors.ts`

Color palette definitions:

- Primary, secondary, accent colors
- Success, warning, error colors
- Neutral colors (gray scale)
- Background colors
- Text colors
- Border colors
- Overlay colors

#### `spacing.ts`

Spacing scale definitions:

- Base spacing: `xs`, `sm`, `md`, `lg`, `xl`, `xxl`
- Common spacing: `padding`, `margin` variants
- Component-specific spacing

#### `config.ts`

**Comprehensive application configuration:**

- **Environment detection** (development/production)
- **API configuration** (base URL, timeouts, retries)
- **App information** (name, version, URLs)
- **Feature flags** (enable/disable features)
- **Authentication config** (storage keys, timeouts)
- **Network config** (check intervals, caching)
- **UI config** (debounce delays, animations, pagination)
- **Validation config** (regex patterns, length limits)
- **Storage config** (storage keys)
- **Error config** (error messages, reporting)
- **Analytics config** (tracking settings)
- **Development config** (logging, mock API)

**Helper Functions:**

- `isDevelopment()`: Check if in dev mode
- `isProduction()`: Check if in production
- `getApiUrl(endpoint)`: Get full API URL
- `isFeatureEnabled(feature)`: Check feature flag

---

### `/src/hooks` - Custom React Hooks

#### `useTheme.ts`

Theme hook that:

- Returns current theme based on user preference
- Supports system theme detection
- Syncs with Redux theme state
- Returns complete theme object (colors, spacing, shadows, etc.)

**Usage:**

```tsx
const theme = useTheme();
// theme.colors.primary
// theme.spacing.md
// theme.borderRadius.lg
```

#### `useDebounce.ts`

Debounce hook for:

- Delaying value updates
- Search input debouncing
- API call optimization
- Default delay from `UI_CONFIG.INPUT_DEBOUNCE`

**Usage:**

```tsx
const debouncedValue = useDebounce(value, 500);
```

#### `useNetworkStatus.ts`

Network status monitoring hook:

- Real-time connection status
- Connection type detection (WiFi, Cellular, Ethernet)
- Internet reachability check
- Automatic updates on network changes

**Returns:**

- `isConnected`: Connection status
- `isInternetReachable`: Internet availability
- `type`: Connection type
- `isWifi`, `isCellular`, `isEthernet`: Type booleans

---

### `/src/navigation` - Navigation Configuration

#### `RootNavigator.tsx`

Root navigation setup that:

- Manages authentication flow
- Switches between Auth and App navigators
- Handles navigation reset on auth state change
- Prevents back navigation to login after authentication

**Structure:**

- `AuthNavigator`: Login and Register screens
- `AppNavigatorWrapper`: Main app navigation
- Auto-navigation based on `isAuthenticated` state

#### `AppNavigator.tsx`

Configurable navigation system supporting:

- **Stack Navigator**: Standard stack-based navigation
- **Bottom Tab Navigator**: Bottom tab bar
- **Top Tab Navigator**: Swipeable top tabs
- **Drawer Navigator**: Side drawer navigation

**Configuration:**
Change `NAVIGATION_CONFIG.type` to switch navigation types:

```typescript
const NAVIGATION_CONFIG: NavigationConfig = {
  type: "bottom-tabs", // or 'stack', 'top-tabs', 'drawer'
};
```

**Screens:**

- Home
- Profile
- Settings
- Notifications

#### `DrawerNavigator.tsx`

Drawer navigation implementation:

- Side drawer menu
- All main screens accessible via drawer
- Themed drawer styling
- Swipe gesture support

---

### `/src/screens` - Screen Components

#### `Login.tsx`

Login screen with:

- Email and password inputs
- Form validation (email format)
- Login API integration
- Language and theme switchers
- Navigation to Register
- Error handling
- RTL layout support

**Features:**

- Uses `@psi/shared-api` for authentication
- Validates email using `validator.ts`
- Logs errors using `logger.ts`
- Themed components

#### `Register.tsx`

Registration screen with:

- Name, email, password, confirm password inputs
- Password validation (length, match)
- Email validation
- Registration API integration
- Language and theme switchers
- Navigation to Login
- Error handling

#### `Home.tsx`

Home screen (placeholder)

#### `Profile.tsx`

Profile screen (placeholder)

#### `Settings.tsx`

Settings screen (placeholder)

#### `Notifications.tsx`

Notifications screen (placeholder)

---

### `/src/store` - Redux Store

#### `store.ts`

Redux store configuration:

- Combines all reducers
- Configures middleware (RTK Query)
- Type-safe state and dispatch

**Reducers:**

- `counter`: Counter slice (example)
- `auth`: Authentication state from `@psi/shared-api`
- `language`: Language selection state
- `theme`: Theme mode state
- `authApi`: RTK Query API reducer

#### `hook.ts`

Typed Redux hooks:

- `useAppDispatch`: Typed dispatch hook
- `useAppSelector`: Typed selector hook

#### `/src/store/slices` - Redux Slices

##### `counterSlice.ts`

Example counter slice (can be removed if not needed)

##### `languageSlice.ts`

Language management slice:

- Current language state (`en` | `ar`)
- `setLanguage` action
- Persists language preference

##### `themeSlice.ts`

Theme management slice:

- Theme mode (`light` | `dark` | `system`)
- Current theme state
- Actions: `setThemeMode`, `setCurrentTheme`, `toggleTheme`

---

### `/src/theme` - Theme System

#### `light.ts`

Light theme definition:

- Light color palette
- Light backgrounds
- Dark text colors
- Shadow definitions
- Border radius values

#### `dark.ts`

Dark theme definition:

- Dark color palette
- Dark backgrounds
- Light text colors
- Enhanced shadows for dark mode
- Same structure as light theme

#### `index.ts`

Theme exports and utilities:

- `getTheme(mode)`: Get theme by mode
- `themes`: Theme object
- Type exports

---

### `/src/i18n` - Internationalization

#### `index.ts`

i18next configuration:

- Sets up i18next with React Native
- Configures language detection
- Sets up RTL support
- Loads translation files

**Supported Languages:**

- English (`en`)
- Arabic (`ar`) - RTL support

---

### `/src/locales` - Translation Files

#### `en.json`

English translations for:

- Common terms
- Login/Register screens
- Language switcher
- Theme switcher
- Network status
- Error messages

#### `ar.json`

Arabic translations (RTL):

- Same structure as English
- Right-to-left text
- Culturally appropriate translations

---

### `/src/utils` - Utility Functions

#### `validator.ts`

Validation utilities:

- `isValidEmail(email)`: Email validation
- `validatePassword(password)`: Password validation with rules
- `isValidPhone(phone)`: Phone number validation
- `validateUsername(username)`: Username validation
- `isNotEmpty(value)`: Non-empty check
- `doPasswordsMatch(password, confirmPassword)`: Password match check

**Uses `VALIDATION_CONFIG` from config.ts**

#### `logger.ts`

Logging utility with:

- Log levels: `DEBUG`, `INFO`, `WARN`, `ERROR`
- Configurable log level from `DEV_CONFIG`
- Network request logging
- Redux action logging
- Error reporting (production)

**Usage:**

```tsx
import { logger } from "../utils/logger";
logger.error("Error message", error);
logger.debug("Debug info", data);
```

#### `formatDate.ts`

Date formatting utilities:

- `formatDate(date, format, locale)`: Format dates
- `formatRelativeTime(date, locale)`: Relative time (e.g., "2 hours ago")
- `isToday(date)`: Check if date is today
- `isPast(date)`: Check if date is in past
- `isFuture(date)`: Check if date is in future

**Formats:**

- `short`, `medium`, `long`, `full`
- `time`, `date`, `datetime`

---

### `/src/assets` - Static Assets

#### `/fonts`

Custom font files (if any)

#### `/icons`

Icon files (SVG, PNG, etc.)

#### `/images`

Image assets

---

### `/src/types` - TypeScript Types

Directory for shared TypeScript type definitions (currently empty, can be used for app-specific types)

---

## ✨ Features

### Authentication

- Login/Register screens
- JWT token management
- Automatic navigation on auth state change
- Secure token storage

### Navigation

- Multiple navigation types (Stack, Tabs, Drawer)
- Configurable navigation system
- Pre-auth and post-auth routes
- No back button after login

### Internationalization

- English and Arabic support
- RTL (Right-to-Left) layout for Arabic
- Language switcher component
- All text internationalized

### Theming

- Light and Dark themes
- System theme support
- Theme switcher component
- All components theme-aware
- Consistent design system

### Network Monitoring

- Real-time network status
- Offline banner notification
- Connection type detection
- Internet reachability check

### Form Validation

- Email validation
- Password validation with rules
- Phone number validation
- Username validation
- Configurable validation rules

### Logging

- Configurable log levels
- Network request logging
- Redux action logging
- Error reporting

### Configuration Management

- Centralized configuration
- Environment-aware settings
- Feature flags
- API configuration
- Validation rules

---

## 🛠 Technologies Used

### Core

- **React Native** (0.82.1)
- **React** (19.1.1)
- **TypeScript** (5.8.3)

### Navigation

- **@react-navigation/native** (7.1.20)
- **@react-navigation/native-stack** (7.6.3)
- **@react-navigation/bottom-tabs** (7.8.5)
- **@react-navigation/drawer** (7.7.3)
- **@react-navigation/material-top-tabs** (7.4.3)

### State Management

- **Redux Toolkit** (1.9.5)
- **React Redux** (8.1.1)
- **@psi/shared-api** (Custom package)

### Internationalization

- **i18next** (25.6.2)
- **react-i18next** (16.3.3)

### UI & Animations

- **react-native-reanimated** (4.1.5)
- **react-native-gesture-handler** (2.29.1)
- **react-native-safe-area-context** (5.5.2)
- **react-native-screens** (4.18.0)

### Utilities

- **@react-native-community/netinfo** (11.4.1) - Network status

### Development

- **ESLint** - Code linting
- **Jest** - Testing framework
- **Prettier** - Code formatting

---

## ⚙️ Configuration

### Environment Detection

The app automatically detects the environment:

- **Development**: Uses `__DEV__` flag
- **Production**: Production builds

### API Configuration

Configure API settings in `src/constants/config.ts`:

```typescript
API_CONFIG.BASE_URL = "http://localhost:3000/api"; // Development
```

### Navigation Type

Change navigation type in `src/navigation/AppNavigator.tsx`:

```typescript
const NAVIGATION_CONFIG: NavigationConfig = {
  type: "bottom-tabs", // or 'stack', 'top-tabs', 'drawer'
};
```

### Feature Flags

Enable/disable features in `src/constants/config.ts`:

```typescript
FEATURE_FLAGS.ENABLE_ANALYTICS = true;
FEATURE_FLAGS.ENABLE_PUSH_NOTIFICATIONS = true;
```

---

## 🧪 Development

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Building

**Android:**

```bash
cd android && ./gradlew assembleRelease
```

**iOS:**

```bash
cd ios && xcodebuild -workspace Patrn.xcworkspace -scheme Patrn
```

---

## 📝 Notes

- All components use the `PT` prefix (Patrn)
- All components are fully themed and support dark mode
- All text is internationalized
- Configuration is centralized in `config.ts`
- Logging is controlled by feature flags
- Network status is monitored automatically
- RTL layout is supported for Arabic

---

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for all new code
3. Follow the component naming convention (`PT` prefix)
4. Add translations for new text
5. Ensure theming support for new components
6. Update this README for significant changes

---

## 📄 License

[Add your license information here]

---

## 👥 Authors

[Add author information here]

---

**Last Updated:** [Current Date]
