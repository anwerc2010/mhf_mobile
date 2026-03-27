import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useGetEquipmentRequestsQuery } from "@psi/shared-api";
import { Wrench, Calendar, MapPin, Clock } from "phosphor-react-native";

export default function EquipmentRequestList() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const {
    data: requestsResponse,
    isLoading,
    error,
    refetch,
  } = useGetEquipmentRequestsQuery();
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);

  // Refetch data whenever screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log("EquipmentRequestList screen focused - fetching data");
      refetch();

      return () => {
        console.log("EquipmentRequestList screen unfocused");
      };
    }, [refetch]),
  );

  const handleStatusPress = (request: any) => {
    setSelectedReview(request);
    setReviewModalVisible(true);
  };

  const getStatusColor = (status: string) => {
    const statusLower = (status ?? "").toString().toLowerCase();
    switch (statusLower) {
      case "approved":
        return styles.statusApproved;
      case "pending":
        return styles.statusPending;
      case "rejected":
        return styles.statusRejected;
      case "completed":
        return styles.statusCompleted;
      default:
        return styles.statusPending;
    }
  };

  const getStatusLabel = (status: string) => {
    const statusLower = (status ?? "").toString().toLowerCase();
    return statusLower
      ? statusLower.charAt(0).toUpperCase() + statusLower.slice(1)
      : "";
  };

  const requests = requestsResponse?.data || [];
  console.log("all the requests" + requests);

  const renderRequestItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <Wrench size={24} color="#0369A1" weight="fill" />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.requestId}>{item.request_id}</Text>
            <Text style={styles.equipmentType}>{item.equipment_type}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.statusBadge, getStatusColor(item.status)]}
          onPress={() => handleStatusPress(item)}
        >
          <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Full Name:</Text>
          <Text style={styles.detailValue}>{item.full_name}</Text>
        </View>
        <View style={styles.detailRow}>
          <MapPin size={14} color="#64748B" />
          <Text style={styles.detailValue}>
            {item.block_name}, {item.district_name}, {item.state_name}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Clock size={14} color="#64748B" />
          <Text style={styles.detailLabel}>Duration:</Text>
          <Text style={styles.detailValue}>{item.duration}</Text>
        </View>
        <View style={styles.detailRow}>
          <Calendar size={14} color="#64748B" />
          <Text style={styles.detailValue}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {item.medical_reason && (
        <View style={styles.reasonContainer}>
          <Text style={styles.reasonLabel}>Medical Reason:</Text>
          <Text style={styles.reasonText}>{item.medical_reason}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.page}>
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>
          {t("equipment.title", "Equipment Requests")}
        </Text>
        <Text style={styles.headerSubtitle}>
          {t("equipment.subtitle", "View your equipment request history")}
        </Text>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.navigate("EquipmentRequest")}
        >
          <Text style={styles.headerBtnText}>
            {t("equipment.newRequest", "New Request")}
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0EA5A4" />
          <Text style={styles.loadingText}>
            {t("equipment.loading", "Loading requests...")}
          </Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {t("equipment.error", "Failed to load requests")}
          </Text>
        </View>
      )}

      {!isLoading && !error && requests.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {t("equipment.empty", "No equipment requests found")}
          </Text>
        </View>
      )}

      {!isLoading && !error && requests.length > 0 && (
        <FlatList
          data={requests}
          renderItem={renderRequestItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal
        visible={reviewModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setReviewModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Request Details</Text>
            <View style={styles.modalDivider} />
            <View style={styles.modalBody}>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Request ID:</Text>
                <Text style={styles.modalValue}>
                  {selectedReview?.request_id}
                </Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Status:</Text>
                <View
                  style={[
                    styles.modalStatusBadge,
                    getStatusColor(selectedReview?.status),
                  ]}
                >
                  <Text style={styles.modalStatusText}>
                    {getStatusLabel(selectedReview?.status)}
                  </Text>
                </View>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Equipment:</Text>
                <Text style={styles.modalValue}>
                  {selectedReview?.equipment_type}
                </Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Duration:</Text>
                <Text style={styles.modalValue}>
                  {selectedReview?.duration}
                </Text>
              </View>
              {selectedReview?.review_notes && (
                <View style={[styles.modalRow, { alignItems: "flex-start" }]}>
                  <Text style={[styles.modalLabel, { marginTop: 0 }]}>
                    Review Notes:
                  </Text>
                  <Text style={styles.modalValue}>
                    {selectedReview.review_notes}
                  </Text>
                </View>
              )}
              {!selectedReview?.review_notes && (
                <View style={styles.modalRow}>
                  <Text style={styles.modalValue}>
                    No review notes available.
                  </Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setReviewModalVisible(false)}
            >
              <Text style={styles.modalCloseBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F6F7FB" },
  headerCard: {
    backgroundColor: "#0369A1",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 8,
  },
  headerTitle: { color: "#fff", fontWeight: "700", fontSize: 18 },
  headerSubtitle: { color: "#BFDBFE", marginTop: 6, fontSize: 14 },
  headerBtn: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "#0EA5A4",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerBtnText: { color: "#fff", fontWeight: "700" },
  listContent: { padding: 16, paddingTop: 8 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  titleContainer: { flex: 1 },
  requestId: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  equipmentType: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  statusApproved: { backgroundColor: "#16A34A" },
  statusPending: { backgroundColor: "#F59E0B" },
  statusRejected: { backgroundColor: "#DC2626" },
  statusCompleted: { backgroundColor: "#0EA5A4" },
  detailsContainer: { marginBottom: 8 },
  detailRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  detailLabel: {
    fontSize: 13,
    color: "#64748B",
    marginRight: 6,
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 13,
    color: "#0F172A",
    fontWeight: "600",
    marginLeft: 4,
  },
  reasonContainer: {
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  reasonLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
    marginBottom: 4,
  },
  reasonText: { fontSize: 13, color: "#0F172A", lineHeight: 18 },
  loadingContainer: { alignItems: "center", paddingVertical: 40 },
  loadingText: { marginTop: 12, color: "#64748B", fontSize: 14 },
  errorContainer: {
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    padding: 16,
    margin: 16,
  },
  errorText: { color: "#B91C1C", fontWeight: "600", textAlign: "center" },
  emptyContainer: { alignItems: "center", paddingVertical: 40 },
  emptyText: { color: "#64748B", fontSize: 14 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "85%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 12,
  },
  modalDivider: { height: 1, backgroundColor: "#E2E8F0", marginBottom: 16 },
  modalBody: { marginBottom: 20 },
  modalRow: { marginBottom: 12, flexDirection: "row", alignItems: "center" },
  modalLabel: {
    fontWeight: "700",
    color: "#475569",
    marginRight: 8,
    minWidth: 100,
  },
  modalValue: { color: "#334155", fontSize: 14, flex: 1 },
  modalStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  modalStatusText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  modalCloseBtn: {
    backgroundColor: "#0EA5A4",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  modalCloseBtnText: { color: "#fff", fontWeight: "700" },
});
