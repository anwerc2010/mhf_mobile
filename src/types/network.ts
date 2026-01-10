import { NetInfoState, NetInfoStateType } from '@react-native-community/netinfo';

// Network Status
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

