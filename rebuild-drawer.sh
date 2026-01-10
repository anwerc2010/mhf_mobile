#!/bin/bash

echo "🧹 Clearing caches..."
rm -rf .metro-cache
rm -rf node_modules/.cache
rm -rf android/app/build
rm -rf android/.gradle

echo "✅ Caches cleared!"
echo ""
echo "📱 Next steps:"
echo "1. Stop Metro bundler (Ctrl+C if running)"
echo "2. Run: npx react-native start --reset-cache"
echo "3. In a new terminal, run: npx react-native run-android"
echo ""
echo "⚠️  IMPORTANT: After rebuild, change NAVIGATION_CONFIG.type to 'drawer' in src/navigation/AppNavigator.tsx"

