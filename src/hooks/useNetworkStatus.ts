import { useState, useEffect } from 'react';
import NetInfo, { NetInfoState, NetInfoStateType } from '@react-native-community/netinfo';

export interface NetworkStatus {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  type: NetInfoStateType | null;
  details: NetInfoState['details'] | null;
  isWifi: boolean;
  isCellular: boolean;
  isEthernet: boolean;
  isUnknown: boolean;
}

/**
 * Custom hook to monitor network connection status
 * 
 * @returns {NetworkStatus} Network status information including:
 * - isConnected: Whether device has network connection
 * - isInternetReachable: Whether internet is actually reachable
 * - type: Connection type (wifi, cellular, ethernet, etc.)
 * - details: Additional connection details
 * - isWifi: Boolean indicating if connected via WiFi
 * - isCellular: Boolean indicating if connected via cellular
 * - isEthernet: Boolean indicating if connected via ethernet
 * - isUnknown: Boolean indicating if connection type is unknown
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const networkStatus = useNetworkStatus();
 *   
 *   if (!networkStatus.isConnected) {
 *     return <Text>No internet connection</Text>;
 *   }
 *   
 *   return <Text>Connected via {networkStatus.type}</Text>;
 * }
 * ```
 */
export function useNetworkStatus(): NetworkStatus {
  const [networkState, setNetworkState] = useState<NetInfoState | null>(null);

  useEffect(() => {
    // Get initial network state
    NetInfo.fetch().then((state) => {
      setNetworkState(state);
    });

    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetworkState(state);
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log('networkState11', networkState);
  }, [networkState]);

  // Derive network status from state
  const isConnected = networkState?.isConnected ?? null;
  const isInternetReachable = networkState?.isInternetReachable ?? null;
  const type = networkState?.type ?? null;
  const details = networkState?.details ?? null;

  return {
    isConnected,
    isInternetReachable,
    type,
    details,
    isWifi: type === NetInfoStateType.wifi,
    isCellular: type === NetInfoStateType.cellular,
    isEthernet: type === NetInfoStateType.ethernet,
    isUnknown: type === NetInfoStateType.unknown || type === null,
  };
}

export default useNetworkStatus;

