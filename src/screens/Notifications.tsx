import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
} from "@psi/shared-api";
import {
  Bell,
  CheckCircle,
  Info,
  Warning,
  X,
  CaretDown,
} from "phosphor-react-native";
import { formatRelativeTime } from "../utils/formatDate";

interface Notification {
  id: number;
  type: "info" | "success" | "warning";
  title: string;
  message: string;
  reason: string;
  image: string | null;
  timestamp: string;
  created_at: string;
  isExpanded: boolean;
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const {
    data,
    isLoading,
    isError,
    error: queryError,
    refetch,
  } = useGetNotificationsQuery();
  const [markAsRead] = useMarkNotificationAsReadMutation();

  console.log("Notifications query:", {
    data,
    isLoading,
    isError,
    error: queryError,
  });

  // Refetch notifications when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch]),
  );

  React.useEffect(() => {
    if (!data?.data) {
      return;
    }

    const mapTypeFromReason = (reason: string): Notification["type"] => {
      const normalizedReason = reason.toLowerCase();
      if (
        normalizedReason.includes("approve") ||
        normalizedReason.includes("success") ||
        normalizedReason.includes("complete")
      ) {
        return "success";
      }
      if (
        normalizedReason.includes("warning") ||
        normalizedReason.includes("incomplete") ||
        normalizedReason.includes("failed")
      ) {
        return "warning";
      }
      return "info";
    };

    const mappedNotifications: Notification[] = data.data.map((item) => ({
      id: item.id,
      type: mapTypeFromReason(item.reason || ""),
      title: item.title,
      message: item.message,
      reason: item.reason,
      image: item.image,
      timestamp: formatRelativeTime(item.created_at),
      created_at: item.created_at,
      isExpanded: false,
    }));

    setNotifications(mappedNotifications);
  }, [data]);

  const getIconByType = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle size={24} color="#10B981" weight="fill" />;
      case "warning":
        return <Warning size={24} color="#F59E0B" weight="fill" />;
      case "info":
      default:
        return <Info size={24} color="#0369A1" weight="fill" />;
    }
  };

  const getColorByType = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "#D1FAE5";
      case "warning":
        return "#FEF3C7";
      case "info":
      default:
        return "#DBEAFE";
    }
  };

  const handleRemoveNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const toggleExpandNotification = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isExpanded: !n.isExpanded } : n)),
    );
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      const response = await markAsRead(id).unwrap();
      if (response.success) {
        Alert.alert("Success", response.message);
        // Refetch to update notification status
        refetch();
      }
    } catch (error: any) {
      console.error("Error marking notification as read:", error);
      Alert.alert(
        "Error",
        error?.data?.message || "Failed to mark notification as read",
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Stats */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Bell size={28} color="#0369A1" weight="fill" />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Notifications</Text>
            <Text style={styles.headerSubtitle}>
              {notifications.length > 0
                ? `${notifications.length} notification${
                    notifications.length > 1 ? "s" : ""
                  }`
                : "No notifications"}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            {isLoading ? (
              <>
                <ActivityIndicator size="large" color="#0369A1" />
                <Text style={styles.emptyTitle}>Loading Notifications</Text>
                <Text style={styles.emptyText}>
                  Please wait while we fetch your updates.
                </Text>
              </>
            ) : isError ? (
              <>
                <Bell size={64} color="#D1D5DB" weight="thin" />
                <Text style={styles.emptyTitle}>
                  Unable to Load Notifications
                </Text>
                <Text style={styles.emptyText}>
                  Please try again in a moment.
                </Text>
              </>
            ) : (
              <>
                <Bell size={64} color="#D1D5DB" weight="thin" />
                <Text style={styles.emptyTitle}>No Notifications</Text>
                <Text style={styles.emptyText}>
                  You're all caught up! Check back later for updates.
                </Text>
              </>
            )}
          </View>
        ) : (
          <View style={styles.notificationsList}>
            {notifications.map((notification) => (
              <View key={notification.id} style={styles.notificationWrapper}>
                <TouchableOpacity
                  style={styles.notificationCard}
                  onPress={() => {
                    handleMarkAsRead(notification.id);
                    toggleExpandNotification(notification.id);
                  }}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: getColorByType(notification.type) },
                    ]}
                  >
                    {getIconByType(notification.type)}
                  </View>

                  <View style={styles.notificationContent}>
                    <View style={styles.notificationHeader}>
                      <Text style={styles.notificationTitle}>
                        {notification.title}
                      </Text>
                    </View>
                    <Text style={styles.notificationMessage}>
                      {notification.message}
                    </Text>
                    <Text style={styles.notificationTime}>
                      {notification.timestamp}
                    </Text>
                  </View>

                  <View style={styles.actionContainer}>
                    <TouchableOpacity
                      style={styles.expandButton}
                      onPress={() => {
                        handleMarkAsRead(notification.id);
                        toggleExpandNotification(notification.id);
                      }}
                    >
                      <CaretDown
                        size={20}
                        color="#6B7280"
                        weight="bold"
                        style={{
                          transform: [
                            {
                              rotate: notification.isExpanded
                                ? "180deg"
                                : "0deg",
                            },
                          ],
                        }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleRemoveNotification(notification.id);
                      }}
                    >
                      <X size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>

                {notification.isExpanded && (
                  <View style={styles.expandedContent}>
                    <View style={styles.fieldRow}>
                      <Text style={styles.fieldLabel}>ID:</Text>
                      <Text style={styles.fieldValue}>{notification.id}</Text>
                    </View>
                    <View style={styles.fieldRow}>
                      <Text style={styles.fieldLabel}>Title:</Text>
                      <Text style={styles.fieldValue}>
                        {notification.title}
                      </Text>
                    </View>
                    <View style={styles.fieldRow}>
                      <Text style={styles.fieldLabel}>Message:</Text>
                      <Text style={styles.fieldValue}>
                        {notification.message}
                      </Text>
                    </View>
                    <View style={styles.fieldRow}>
                      <Text style={styles.fieldLabel}>Reason:</Text>
                      <Text style={styles.fieldValue}>
                        {notification.reason}
                      </Text>
                    </View>
                    <View style={styles.fieldRow}>
                      <Text style={styles.fieldLabel}>Created At:</Text>
                      <Text style={styles.fieldValue}>
                        {(() => {
                          try {
                            const d = new Date(notification.created_at);
                            const dd = String(d.getDate()).padStart(2, "0");
                            const mm = String(d.getMonth() + 1).padStart(
                              2,
                              "0",
                            );
                            const yyyy = d.getFullYear();
                            return `${dd}-${mm}-${yyyy}`;
                          } catch {
                            return notification.created_at;
                          }
                        })()}
                      </Text>
                    </View>
                    {notification.image && (
                      <View style={styles.fieldRow}>
                        <Text style={styles.fieldLabel}>Image:</Text>
                        <Text style={styles.fieldValue}>
                          {notification.image}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  scrollContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  notificationsList: {
    padding: 16,
    gap: 12,
  },
  notificationWrapper: {
    marginBottom: 12,
  },
  notificationCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
    flex: 1,
  },
  notificationMessage: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  actionContainer: {
    flexDirection: "row",
    gap: 8,
  },
  expandButton: {
    padding: 4,
  },
  removeButton: {
    padding: 4,
  },
  expandedContent: {
    backgroundColor: "#F9FAFB",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "#E5E7EB",
    gap: 12,
  },
  fieldRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    flex: 0.35,
  },
  fieldValue: {
    fontSize: 13,
    color: "#334155",
    flex: 0.65,
    textAlign: "right",
  },
});
