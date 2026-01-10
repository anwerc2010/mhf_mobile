import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { NETWORK_CONFIG } from '../../constants/config';
import PTText from '../comman/PTText';
import { useTheme } from '../../hooks/useTheme';

/**
 * NetworkStatusBanner component
 * Displays a banner at the top of the screen when there's no internet connection
 * 
 * @example
 * ```tsx
 * <NetworkStatusBanner />
 * ```
 */
export default function NetworkStatusBanner() {
  const { t } = useTranslation();
  const networkStatus = useNetworkStatus();
  const theme = useTheme();

  useEffect(() => {
    console.log('networkStatus', networkStatus.isConnected);
  }, [networkStatus]);

  // Don't render if connected or status is unknown
  if (networkStatus.isConnected === true || networkStatus.isConnected === null) {
    return null;
  }

  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.error,
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.md,
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}
    >
      <PTText variant="caption" color="textInverse" style={{ fontWeight: '600' }}>
        {t('network.noConnection')}
      </PTText>
    </View>
  );
}

