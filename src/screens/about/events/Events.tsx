import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Linking,
  Image,
  Modal,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useGetEventsQuery } from "@psi/shared-api";
import AmountEntryModal from "../../../components/general/AmountEntryModal";
import { GuideWrapper } from "../../../components/general/GuideWrapper";
import { findGuideStep } from "../../../config/guideConfig";
import { useGuideController } from "../../../hooks/useGuideController";

const { width } = Dimensions.get("window");

function getEventDisplayStatus(backendStatus: string, eventDate: string | null): string {
  const s = (backendStatus ?? "").toLowerCase();
  if (s === "canceled") return "canceled";
  if (!eventDate) return s || "upcoming";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eDate = new Date(eventDate);
  eDate.setHours(0, 0, 0, 0);
  if (eDate.getTime() < today.getTime()) return "completed";
  if (eDate.getTime() === today.getTime()) return "ongoing";
  return "upcoming";
}

function formatTimeTo12h(time: string | null | undefined): string {
  if (!time) return "";
  const parts = time.split(":");
  if (parts.length < 2) return time;
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1].padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${hours}:${minutes} ${ampm}`;
}

export default function EventsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  // Initialize walkthrough guide for EventsScreen
  useGuideController("EventsScreen");

  const {
    data: eventsResponse,
    isLoading,
    error,
    refetch,
  } = useGetEventsQuery();
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [selectedEventForSponsor, setSelectedEventForSponsor] =
    useState<any>(null);

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const handleMapPress = (mapLink: string) => {
    if (mapLink) {
      Linking.openURL(mapLink).catch((err) =>
        console.log("Error opening map:", err),
      );
    }
  };

  const handleRegistrationStatusPress = (registration: any) => {
    setSelectedReview(registration);
    setReviewModalVisible(true);
  };

  const getRegistrationStatusColor = (status: string) => {
    const statusLower = (status ?? "").toString().toLowerCase();
    switch (statusLower) {
      case "approved":
        return styles.statusApproved;
      case "pending":
        return styles.statusPending;
      case "rejected":
        return styles.statusRejected;
      case "on_hold":
        return styles.statusOnHold;
      default:
        return styles.statusPending;
    }
  };

  const getRegistrationStatusLabel = (status: string) => {
    const statusLower = (status ?? "").toString().toLowerCase();
    return statusLower
      ? statusLower.charAt(0).toUpperCase() +
          statusLower.slice(1).replace("_", " ")
      : "";
  };

  const events = (
    Array.isArray(eventsResponse?.data) ? eventsResponse?.data : []
  ).map((item: any) => {
    const event = item?.event ?? item;
    const eventDate = event?.event_date ?? null;
    const displayStatus = getEventDisplayStatus(event?.status ?? "", eventDate);
    return {
      id: event?.id ?? event?.event_id ?? event?.title,
      icon: event?.icon ?? "📌",
      title: event?.event_name,
      date: eventDate,
      time: formatTimeTo12h(event?.start_time),
      location: event?.location,
      desc: event?.description,
      status: displayStatus,
      mapLink: event?.map_url,
      my_registrations: item?.my_registrations,
    };
  });

  const impact = [
    { value: "50+", label: t("events.impact.events") },
    { value: "5000+", label: t("events.impact.people") },
    { value: "200+", label: t("events.impact.volunteers") },
  ];

  const handleSponsorPress = (event: any) => {
    setSelectedEventForSponsor(event);
  };

  const handleSponsorAmountSubmit = (amount: number) => {
    if (!selectedEventForSponsor) {
      return;
    }

    setSelectedEventForSponsor(null);
    navigation.navigate("Payment", {
      campaignPayment: {
        module: "events",
        moduleId: selectedEventForSponsor.id,
        moduleTitle: selectedEventForSponsor.title,
        actionLabel: "sponsorship",
        amount,
      },
    });
  };

  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>{t("events.title")}</Text>
          <Text style={styles.headerSubtitle}>{t("events.subtitle")}</Text>
          {/* <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.navigate('RegisterForEvent')}>
                        <Text style={styles.headerBtnText}>{t('events.registerHeader')}</Text>
                    </TouchableOpacity> */}
        </View>

        <Text style={styles.sectionTitle}>{t("events.upcoming")}</Text>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0EA5A4" />
            <Text style={styles.loadingText}>
              {t("events.loading", "Loading events...")}
            </Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {t("events.error", "Failed to load events")}
            </Text>
          </View>
        )}

        {!isLoading && !error && events.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {t("events.empty", "No upcoming events")}
            </Text>
          </View>
        )}

        {!isLoading &&
          !error &&
          events.map((e, idx) => {
            const status = e.status;
            const isActive = status === "upcoming" || status === "ongoing";
            const statusLabel = status
              ? status.charAt(0).toUpperCase() + status.slice(1)
              : "";
            const statusStyle =
              status === "upcoming"
                ? styles.statusUpcoming
                : status === "ongoing"
                ? styles.statusOngoing
                : status === "completed"
                ? styles.statusCompleted
                : status === "canceled"
                ? styles.statusCanceled
                : styles.statusUpcoming;

            return (
              <View key={e.id ?? e.title} style={styles.card}>
                {!!statusLabel && (
                  <View style={[styles.statusBadge, statusStyle]}>
                    <Text style={styles.statusText}>{statusLabel}</Text>
                  </View>
                )}
                <View style={styles.rowHeader}>
                  <TouchableOpacity
                    onPress={() => handleMapPress(e.mapLink)}
                    disabled={!e.mapLink}
                  >
                    {e.mapLink ? (
                      <Image
                        source={require("../../../../assets/images/map-icon.png")}
                        style={styles.mapIcon}
                      />
                    ) : (
                      <Text style={styles.icon}>{e.icon}</Text>
                    )}
                  </TouchableOpacity>
                  <View style={styles.titleContainer}>
                    <Text style={styles.cardTitle}>{e.title}</Text>
                    <View style={{ marginTop: 6 }}>
                      {!!e.date && <Text style={styles.meta}>{e.date}</Text>}
                      {!!e.time && <Text style={styles.meta}>{e.time}</Text>}
                      {!!e.location && (
                        <Text style={styles.meta}>{e.location}</Text>
                      )}
                    </View>
                  </View>
                </View>
                {!!e.desc && <Text style={styles.desc}>{e.desc}</Text>}
                {e.my_registrations &&
                Array.isArray(e.my_registrations) &&
                e.my_registrations.length > 0 ? (
                  <TouchableOpacity
                    style={[
                      styles.registrationStatusBadge,
                      getRegistrationStatusColor(
                        e.my_registrations[0]?.customer_status,
                      ),
                    ]}
                    onPress={() =>
                      handleRegistrationStatusPress(e.my_registrations[0])
                    }
                  >
                    <Text style={styles.registrationStatusText}>
                      {getRegistrationStatusLabel(
                        e.my_registrations[0]?.customer_status,
                      )}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  isActive && (
                    <View style={styles.actionRow}>
                      <GuideWrapper
                        step={
                          idx === 0
                            ? findGuideStep("EventsScreen", "eventsRegisterBtn")
                            : undefined
                        }
                        borderRadius={6}
                        style={{ flex: 1 }}
                      >
                        <TouchableOpacity
                          style={[styles.registerBtn, styles.registerBtnHalf]}
                          onPress={() =>
                            navigation.navigate("RegisterForEvent", {
                              event: e,
                            })
                          }
                        >
                          <Text style={styles.registerBtnText}>
                            {t("events.registerNow")}
                          </Text>
                        </TouchableOpacity>
                      </GuideWrapper>
                      <GuideWrapper
                        step={
                          idx === 0
                            ? findGuideStep("EventsScreen", "eventsSponsorBtn")
                            : undefined
                        }
                        borderRadius={6}
                        style={{ flex: 1 }}
                      >
                        <TouchableOpacity
                          style={[styles.sponsorBtn, styles.registerBtnHalf]}
                          onPress={() => handleSponsorPress(e)}
                        >
                          <Text style={styles.registerBtnText}>
                            {t("education.programs.sponsor", "Sponsor")}
                          </Text>
                        </TouchableOpacity>
                      </GuideWrapper>
                    </View>
                  )
                )}
              </View>
            );
          })}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t("events.impactTitle")}</Text>
          <View style={styles.impactRow}>
            {impact.map((i) => (
              <View key={i.label} style={styles.impactItem}>
                <Text style={styles.impactValue}>{i.value}</Text>
                <Text style={styles.impactLabel}>{i.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={reviewModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setReviewModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Registration Status</Text>
            <View style={styles.modalDivider} />
            <View style={styles.modalBody}>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Status:</Text>
                <View
                  style={[
                    styles.modalStatusBadge,
                    getRegistrationStatusColor(selectedReview?.customer_status),
                  ]}
                >
                  <Text style={styles.modalStatusText}>
                    {getRegistrationStatusLabel(
                      selectedReview?.customer_status,
                    )}
                  </Text>
                </View>
              </View>
              {selectedReview?.registered_at && (
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Registered:</Text>
                  <Text style={styles.modalValue}>
                    {selectedReview.registered_at}
                  </Text>
                </View>
              )}
              {selectedReview?.review_note && (
                <View style={[styles.modalRow, { alignItems: "flex-start" }]}>
                  <Text style={[styles.modalLabel, { marginTop: 0 }]}>
                    Review Note:
                  </Text>
                  <Text style={styles.modalValue}>
                    {selectedReview.review_note}
                  </Text>
                </View>
              )}
              {!selectedReview?.review_note && (
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

      <AmountEntryModal
        visible={!!selectedEventForSponsor}
        title="Sponsor This Event"
        subtitle={selectedEventForSponsor?.title}
        actionLabel="Continue"
        onClose={() => setSelectedEventForSponsor(null)}
        onSubmit={handleSponsorAmountSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F6F7FB" },
  content: { padding: 16, paddingBottom: 40 },

  headerCard: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
  },
  headerTitle: { color: "#fff", fontWeight: "700", fontSize: 16 },
  headerSubtitle: { color: "#DBEAFE", marginTop: 6 },
  headerBtn: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "#0EA5A4",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerBtnText: { color: "#fff", fontWeight: "700" },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginVertical: 12,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    position: "relative",
  },
  rowHeader: { flexDirection: "row" },
  icon: { fontSize: 22, marginRight: 10 },
  mapIcon: {
    width: 60,
    height: 60,
    marginRight: 10,
    resizeMode: "contain",
    borderColor: "#84b3b3",
    borderWidth: 0.5,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  titleContainer: { flex: 1, paddingRight: 90 },
  cardTitle: {
    fontWeight: "700",
    color: "#0F172A",
    flexShrink: 1,
    flexWrap: "wrap",
  },
  meta: { color: "#64748B", fontSize: 12 },
  desc: { color: "#334155", fontSize: 13, marginTop: 8 },

  statusBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  statusUpcoming: { backgroundColor: "#2563EB" },
  statusOngoing: { backgroundColor: "#0EA5A4" },
  statusCompleted: { backgroundColor: "#16A34A" },
  statusCanceled: { backgroundColor: "#DC2626" },

  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginVertical: 8,
  },
  tag: {
    backgroundColor: "#E0F2FE",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: { color: "#0EA5A4", fontWeight: "700", fontSize: 12 },

  stats: { color: "#2563EB", fontWeight: "700", fontSize: 12, marginBottom: 8 },

  registrationStatusBadge: {
    marginTop: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  registrationStatusText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  statusApproved: { backgroundColor: "#16A34A" },
  statusPending: { backgroundColor: "#F59E0B" },
  statusRejected: { backgroundColor: "#DC2626" },
  statusOnHold: { backgroundColor: "#8B5CF6" },

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
    minWidth: 80,
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

  actionRow: { flexDirection: "row", gap: 10, marginTop: 20 },
  registerBtn: {
    backgroundColor: "#0EA5A4",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 20,
  },
  registerBtnHalf: { flex: 1, marginTop: 0 },
  sponsorBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  registerBtnText: { color: "#fff", fontWeight: "700" },

  loadingContainer: { alignItems: "center", paddingVertical: 20 },
  loadingText: { marginTop: 8, color: "#64748B" },
  errorContainer: {
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  errorText: { color: "#B91C1C", fontWeight: "600" },
  emptyContainer: { alignItems: "center", paddingVertical: 20 },
  emptyText: { color: "#64748B" },

  impactRow: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  impactItem: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 10,
    width: (width - 64) / 3,
    alignItems: "center",
  },
  impactValue: { fontWeight: "700", color: "#0F172A", marginBottom: 6 },
  impactLabel: { color: "#6B7280", fontSize: 12, textAlign: "center" },
});
