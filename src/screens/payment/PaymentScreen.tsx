import React from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { PTText } from "../../components/comman";
import { useFetchPricingQuery } from "@psi/shared-api";
import { useRazorpayPayment } from "../../hooks/useRazorpayPayment";
import { useAppSelector } from "../../store/hook";
import { useTranslation } from "react-i18next";

export type PaymentScreenParams = {
  customerId?: number | string;
  healthCardId?: number;
  cardType?: "individual" | "family";
  purpose?: "new" | "renewal";
  /** If provided (from apply-card response), creation order is already made */
  existingOrder?: {
    razorpay_order_id: string;
    razorpay_key_id: string;
    amount: number;
    currency: string;
  };
  campaignPayment?: {
    module: "education" | "events" | "relief";
    moduleId?: number | string;
    moduleTitle: string;
    actionLabel: "donation" | "sponsorship";
    amount: number;
  };
};

type RouteType = RouteProp<{ Payment: PaymentScreenParams }, "Payment">;

function PaymentScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteType>();
  const {
    customerId,
    healthCardId,
    cardType,
    purpose,
    existingOrder,
    campaignPayment,
  } = route.params;
  const isCampaignPayment = !!campaignPayment;

  const user = useAppSelector((state) => state.auth.user);
  const { data: pricingData, isLoading: isPricingLoading } =
    useFetchPricingQuery(undefined, {
      // Skip if we already know the amount from an existing order
      skip: !!existingOrder || isCampaignPayment,
    });

  const { loading, error, initiatePayment } = useRazorpayPayment();

  const pricingAmount =
    cardType && purpose ? pricingData?.data?.[cardType]?.[purpose] : undefined;

  const displayAmount = existingOrder
    ? existingOrder.amount / 100
    : isCampaignPayment
    ? campaignPayment.amount
    : pricingAmount;

  const handlePay = async () => {
    const resolvedCustomerId = customerId ?? user?.id;

    if (!resolvedCustomerId) {
      Alert.alert(
        t("payment.failed", "Payment Failed"),
        t(
          "payment.customerMissing",
          "Unable to identify the current customer.",
        ),
      );
      return;
    }

    const outcome = await initiatePayment({
      customerId: resolvedCustomerId,
      healthCardId,
      cardType,
      purpose,
      existingOrder,
      campaignPayment,
      prefill: {
        name: user?.fullname ?? "",
        email: user?.email ?? "",
        contact: user?.phone ?? "",
      },
    });

    if (outcome.success) {
      navigation.replace("PaymentSuccess", {
        result: outcome.data,
        campaignPayment,
      });
    } else if (outcome.dismissed) {
      Alert.alert(
        t("payment.cancelled", "Payment Cancelled"),
        t(
          "payment.cancelledKeepPending",
          "Payment cancelled. Card will not be visible until payment succeeds.",
        ),
      );
    } else if (!outcome.dismissed) {
      Alert.alert(t("payment.failed", "Payment Failed"), outcome.error, [
        { text: "OK" },
      ]);
    }
  };

  if (isPricingLoading && !existingOrder && !isCampaignPayment) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        {campaignPayment ? (
          <>
            <PTText style={styles.label}>
              {t("payment.contributionType", "Contribution Type")}
            </PTText>
            <PTText style={styles.value}>
              {campaignPayment.actionLabel === "sponsorship"
                ? "Sponsorship"
                : "Donation"}
            </PTText>

            <View style={styles.divider} />

            <PTText style={styles.label}>Module</PTText>
            <PTText style={styles.value}>
              {campaignPayment.module.charAt(0).toUpperCase() +
                campaignPayment.module.slice(1)}
            </PTText>

            <View style={styles.divider} />

            <PTText style={styles.label}>Campaign</PTText>
            <PTText style={styles.value}>{campaignPayment.moduleTitle}</PTText>

            <View style={styles.divider} />
          </>
        ) : (
          <>
            <PTText style={styles.label}>Card Type</PTText>
            <PTText style={styles.value}>
              {cardType === "family" ? "Family" : "Individual"}
            </PTText>

            <View style={styles.divider} />

            <PTText style={styles.label}>Purpose</PTText>
            <PTText style={styles.value}>
              {purpose === "renewal" ? "Renewal" : "New Card"}
            </PTText>

            <View style={styles.divider} />
          </>
        )}

        <PTText style={styles.label}>Amount Payable</PTText>
        <PTText style={styles.amount}>
          ₹{displayAmount !== undefined ? displayAmount.toFixed(2) : "—"}
        </PTText>

        <PTText style={styles.helperText}>
          Razorpay will show available payment methods, including UPI apps like
          Google Pay and PhonePe, based on what is installed on the device.
        </PTText>
      </View>

      {error ? <PTText style={styles.error}>{error}</PTText> : null}

      <TouchableOpacity
        style={[styles.payButton, loading && styles.payButtonDisabled]}
        onPress={handlePay}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <PTText style={styles.payButtonText}>
            {campaignPayment
              ? t("payment.continueUpi", "Continue to UPI")
              : t("payment.payNow", "Pay Now")}
          </PTText>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flexGrow: 1, padding: 20, backgroundColor: "#F8FAFC" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 24,
  },
  label: { fontSize: 13, color: "#64748B", marginBottom: 4 },
  value: { fontSize: 16, fontWeight: "600", color: "#0F172A", marginBottom: 8 },
  amount: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 8,
  },
  helperText: {
    color: "#64748B",
    fontSize: 13,
    lineHeight: 20,
  },
  divider: { height: 1, backgroundColor: "#F1F5F9", marginVertical: 12 },
  error: {
    color: "#EF4444",
    textAlign: "center",
    marginBottom: 16,
    fontSize: 14,
  },
  payButton: {
    backgroundColor: "#1E3A8A",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  payButtonDisabled: { opacity: 0.6 },
  payButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});

export default PaymentScreen;
