import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { PTText } from "../../components/comman";
import { VerifyPaymentResult } from "@psi/shared-api";
import ViewShot from "react-native-view-shot";
import RNShare from "react-native-share";

export type PaymentSuccessScreenParams = {
  result: VerifyPaymentResult;
};

type RouteType = RouteProp<
  { PaymentSuccess: PaymentSuccessScreenParams },
  "PaymentSuccess"
>;

function formatDate(iso: string): string {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) +
    " " +
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
  );
}

function PaymentSuccessScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteType>();
  const { result } = route.params;
  const { payment } = result;
  const receiptRef = useRef<any>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const instrument = payment.notes?.payment_instrument;
  const amountINR = (payment.amount / 100).toFixed(2);

  const handleDownloadReceipt = async () => {
    try {
      setIsDownloading(true);

      const uri = await receiptRef.current?.capture?.();
      if (!uri) {
        Alert.alert("Error", "Could not generate receipt image.");
        return;
      }

      await RNShare.open({
        url: `file://${uri}`,
        type: "image/png",
        title: "Payment Receipt",
        message: "Health Card Payment Receipt",
      });
    } catch (error: any) {
      if (error?.code !== "E_CANCELLED" && error?.code !== "CANCELLED") {
        Alert.alert("Error", "Unable to download/share receipt image.");
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Success banner */}
      <View style={styles.successBanner}>
        <PTText style={styles.checkmark}>✓</PTText>
        <PTText style={styles.successTitle}>Payment Successful!</PTText>
        <PTText style={styles.amountText}>₹{amountINR}</PTText>
      </View>

      {/* Details card (captured as receipt image) */}
      <ViewShot
        ref={receiptRef}
        options={{
          format: "png",
          quality: 1,
          fileName: `receipt_${payment.id}`,
        }}
      >
        <View style={styles.card}>
          <Row
            label="Transaction ID"
            value={payment.razorpay_payment_id ?? "—"}
          />
          <Row label="Order ID" value={payment.razorpay_order_id} />
          <Row label="Status" value="Paid" valueStyle={styles.paidBadge} />

          {instrument?.method ? (
            <Row
              label="Payment Method"
              value={instrument.method.toUpperCase()}
            />
          ) : null}

          {instrument?.method === "upi" && instrument.upi?.vpa ? (
            <Row label="UPI ID" value={instrument.upi.vpa} />
          ) : null}

          {instrument?.method === "card" && instrument.card ? (
            <>
              <Row
                label="Card (last 4)"
                value={`•••• ${instrument.card.last4}`}
              />
              <Row label="Network" value={instrument.card.network} />
            </>
          ) : null}

          <Row label="Paid On" value={formatDate(payment.updated_at)} />
        </View>
      </ViewShot>

      <TouchableOpacity
        style={[styles.secondaryButton, isDownloading && styles.buttonDisabled]}
        onPress={handleDownloadReceipt}
        activeOpacity={0.8}
        disabled={isDownloading}
      >
        {isDownloading ? (
          <ActivityIndicator color="#1E3A8A" />
        ) : (
          <PTText style={styles.secondaryButtonText}>Download Receipt</PTText>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() =>
          navigation.navigate("BottomTabs", {
            screen: "Card",
          })
        }
        activeOpacity={0.8}
      >
        <PTText style={styles.primaryButtonText}>View Health Card</PTText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() =>
          navigation.navigate("BottomTabs", {
            screen: "Home",
          })
        }
        activeOpacity={0.8}
      >
        <PTText style={styles.secondaryButtonText}>Go to Home</PTText>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Row({
  label,
  value,
  valueStyle,
}: {
  label: string;
  value: string;
  valueStyle?: object;
}) {
  return (
    <View style={rowStyles.row}>
      <PTText style={rowStyles.label}>{label}</PTText>
      <PTText style={[rowStyles.value, valueStyle]}>{value}</PTText>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  label: { fontSize: 14, color: "#64748B", flex: 1 },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    flex: 2,
    textAlign: "right",
  },
});

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#F8FAFC" },
  successBanner: {
    backgroundColor: "#1E3A8A",
    borderRadius: 16,
    alignItems: "center",
    paddingVertical: 32,
    marginBottom: 24,
  },
  checkmark: { fontSize: 48, color: "#4ADE80", marginBottom: 8 },
  successTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  amountText: { fontSize: 36, fontWeight: "800", color: "#fff" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 24,
  },
  paidBadge: { color: "#16A34A", fontWeight: "700" },
  primaryButton: {
    backgroundColor: "#1E3A8A",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  buttonDisabled: { opacity: 0.6 },
  secondaryButton: {
    borderWidth: 1.5,
    borderColor: "#1E3A8A",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryButtonText: { color: "#1E3A8A", fontSize: 16, fontWeight: "600" },
});

export default PaymentSuccessScreen;
