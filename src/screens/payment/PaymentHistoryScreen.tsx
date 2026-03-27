import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { PTText } from "../../components/comman";
import { useFetchPaymentHistoryQuery, PaymentRecord } from "@psi/shared-api";

const STATUS_COLORS: Record<string, string> = {
  paid: "#16A34A",
  pending: "#D97706",
  failed: "#DC2626",
  refunded: "#6366F1",
};

function StatusBadge({ status }: { status: string }) {
  const color = STATUS_COLORS[status] ?? "#64748B";
  return (
    <View
      style={[
        badgeStyles.badge,
        { backgroundColor: color + "20", borderColor: color },
      ]}
    >
      <PTText style={[badgeStyles.text, { color }]}>
        {status.toUpperCase()}
      </PTText>
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  text: { fontSize: 11, fontWeight: "700" },
});

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function PaymentHistoryItem({ item }: { item: PaymentRecord }) {
  const instrument = item.notes?.payment_instrument;
  const methodLabel = instrument?.method
    ? instrument.method.toUpperCase()
    : "—";

  return (
    <View style={itemStyles.card}>
      <View style={itemStyles.row}>
        <PTText style={itemStyles.amount}>
          ₹{(item.amount / 100).toFixed(2)}
        </PTText>
        <StatusBadge status={item.status} />
      </View>
      <PTText style={itemStyles.orderId} numberOfLines={1}>
        {item.razorpay_order_id}
      </PTText>
      <View style={itemStyles.footer}>
        <PTText style={itemStyles.meta}>{methodLabel}</PTText>
        <PTText style={itemStyles.meta}>{formatDate(item.created_at)}</PTText>
      </View>
    </View>
  );
}

const itemStyles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  amount: { fontSize: 18, fontWeight: "700", color: "#0F172A" },
  orderId: { fontSize: 12, color: "#94A3B8", marginBottom: 8 },
  footer: { flexDirection: "row", justifyContent: "space-between" },
  meta: { fontSize: 13, color: "#64748B" },
});

function PaymentHistoryScreen() {
  const navigation = useNavigation<any>();
  const { data, isLoading, isError, refetch } = useFetchPaymentHistoryQuery();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <PTText style={styles.errorText}>
          Failed to load payment history.
        </PTText>
        <TouchableOpacity onPress={refetch} style={styles.retryButton}>
          <PTText style={styles.retryText}>Retry</PTText>
        </TouchableOpacity>
      </View>
    );
  }

  const payments = data?.data ?? [];

  return (
    <FlatList
      data={payments}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <PaymentHistoryItem item={item} />}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <View style={styles.center}>
          <PTText style={styles.emptyText}>No payment history found.</PTText>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  list: { padding: 16, flexGrow: 1, backgroundColor: "#F8FAFC" },
  errorText: {
    fontSize: 15,
    color: "#EF4444",
    marginBottom: 12,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#1E3A8A",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: { color: "#fff", fontWeight: "600" },
  emptyText: { fontSize: 15, color: "#94A3B8" },
});

export default PaymentHistoryScreen;
