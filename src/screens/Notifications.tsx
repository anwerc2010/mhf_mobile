import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  useGetNotificationsQuery,
  useDismissNotificationMutation,
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
import { useTranslation } from "react-i18next";

const SCREEN_WIDTH = Dimensions.get("window").width;
const IMAGE_WIDTH = SCREEN_WIDTH - 64;

function AutoHeightImage({ uri }: { uri: string }) {
  const { t } = useTranslation();
  const [height, setHeight] = React.useState(200);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    setFailed(false);
    Image.getSize(
      uri,
      (w, h) => {
        if (!cancelled && w > 0) {
          setHeight(Math.round((h / w) * IMAGE_WIDTH));
        }
      },
      () => {
        if (!cancelled) setHeight(200);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [uri]);

  if (failed) {
    return (
      <View style={styles.imageFallback}>
        <Text style={styles.imageFallbackText}>
          {t("notifications.imageUnavailable", "Image unavailable")}
        </Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={{ width: IMAGE_WIDTH, height, borderRadius: 8, marginTop: 8 }}
      resizeMode="contain"
      onError={() => setFailed(true)}
    />
  );
}

const mapTypeFromReason = (reason: string): Notification["type"] => {
  const r = reason.toLowerCase();
  if (r.includes("emergency")) return "warning";
  return "info";
};

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
  const { t } = useTranslation();
  const [dismissing, setDismissing] = React.useState<number | null>(null);
  // Ids the user dismissed this session. Kept separate from the query cache so a
  // refetch (triggered by invalidatesTags or screen focus) can't resurrect them
  // while the server catches up. Pruned once the server stops returning them.
  const [dismissedIds, setDismissedIds] = React.useState<Set<number>>(
    () => new Set(),
  );
  const [expandedIds, setExpandedIds] = React.useState<Set<number>>(
    () => new Set(),
  );

  const [dismissNotification] = useDismissNotificationMutation();

  const { data, isLoading, isError, refetch } = useGetNotificationsQuery();

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch]),
  );

  // Drop local overrides for notifications the server no longer returns, so the
  // dismissed/expanded sets don't grow unbounded across a session.
  React.useEffect(() => {
    if (!data?.data) return;
    const serverIds = new Set(data.data.map((item) => item.id));
    const prune = (prev: Set<number>) => {
      let changed = false;
      const next = new Set<number>();
      prev.forEach((id) => {
        if (serverIds.has(id)) next.add(id);
        else changed = true;
      });
      return changed ? next : prev;
    };
    setDismissedIds(prune);
    setExpandedIds(prune);
  }, [data]);

  const notifications = React.useMemo<Notification[]>(() => {
    if (!data?.data) return [];
    return data.data
      .filter((item) => !dismissedIds.has(item.id))
      .map((item) => ({
        id: item.id,
        type: mapTypeFromReason(item.reason || ""),
        title: item.title,
        message: item.message,
        reason: item.reason,
        image: item.image ?? null,
        timestamp: formatRelativeTime(item.created_at),
        created_at: item.created_at,
        isExpanded: expandedIds.has(item.id),
      }));
  }, [data, dismissedIds, expandedIds]);

  const getIconByType = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle size={24} color="#10B981" weight="fill" />;
      case "warning":
        return <Warning size={24} color="#F59E0B" weight="fill" />;
      default:
        return <Info size={24} color="#0369A1" weight="fill" />;
    }
  };

  const getColorByType = (type: Notification["type"]) => {
    switch (type) {
      case "success": return "#D1FAE5";
      case "warning": return "#FEF3C7";
      default:        return "#DBEAFE";
    }
  };

  const handleDismiss = async (id: number) => {
    setDismissing(id);
    // Optimistically hide it; the query cache stays untouched.
    setDismissedIds((prev) => new Set(prev).add(id));
    try {
      await dismissNotification(id).unwrap();
    } catch {
      // Dismiss failed server-side — un-hide it so it isn't silently lost,
      // and let the user know rather than have it mysteriously reappear later.
      setDismissedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      Alert.alert(
        t("common.error"),
        t(
          "notifications.dismissError",
          "Couldn't dismiss this notification. Please try again.",
        ),
      );
    } finally {
      setDismissing(null);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Bell size={28} color="#0369A1" weight="fill" />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>
              {t("notifications.title", "Notifications")}
            </Text>
            <Text style={styles.headerSubtitle}>
              {notifications.length > 0
                ? `${notifications.length} notification${notifications.length > 1 ? "s" : ""}`
                : t("notifications.subtitleEmpty", "No notifications")}
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
                <Text style={styles.emptyTitle}>Unable to Load Notifications</Text>
                <Text style={styles.emptyText}>Please try again in a moment.</Text>
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
                  onPress={() => toggleExpand(notification.id)}
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
                    <Text style={styles.notificationTitle} numberOfLines={1}>
                      {notification.title}
                    </Text>
                    <Text style={styles.notificationMessage} numberOfLines={2}>
                      {notification.message}
                    </Text>
                    <Text style={styles.notificationTime}>
                      {notification.timestamp}
                    </Text>
                  </View>

                  <View style={styles.actionContainer}>
                    <TouchableOpacity
                      style={styles.expandButton}
                      onPress={() => toggleExpand(notification.id)}
                    >
                      <CaretDown
                        size={18}
                        color="#6B7280"
                        weight="bold"
                        style={{
                          transform: [
                            { rotate: notification.isExpanded ? "180deg" : "0deg" },
                          ],
                        }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleDismiss(notification.id)}
                      disabled={dismissing === notification.id}
                    >
                      <X size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>

                {notification.isExpanded && (
                  <View style={styles.expandedContent}>
                    <Text style={styles.expandedMessage}>
                      {notification.message}
                    </Text>

                    {notification.image ? (
                      <AutoHeightImage uri={notification.image} />
                    ) : null}

                    <Text style={styles.expandedTime}>
                      {(() => {
                        try {
                          const d = new Date(notification.created_at);
                          return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
                        } catch {
                          return notification.created_at;
                        }
                      })()}
                    </Text>
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
    gap: 4,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },
  notificationMessage: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
  notificationTime: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 2,
  },
  actionContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
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
  expandedMessage: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 22,
  },
  expandedTime: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
  imageFallback: {
    width: IMAGE_WIDTH,
    height: 120,
    borderRadius: 8,
    marginTop: 8,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  imageFallbackText: {
    fontSize: 13,
    color: "#9CA3AF",
  },
});
