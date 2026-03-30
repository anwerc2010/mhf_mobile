import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { PTCard } from "../../../components/comman";
import AmountEntryModal from "../../../components/general/AmountEntryModal";
import { useGetTrainingProgramsQuery, TrainingProgram } from "@psi/shared-api";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// These will be translated dynamically using useTranslation hook

export default function EducationScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const {
    data: trainingResponse,
    isLoading,
    error,
    refetch,
  } = useGetTrainingProgramsQuery();
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [selectedProgramForSponsor, setSelectedProgramForSponsor] =
    useState<TrainingProgram | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch]),
  );

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

  useEffect(() => {
    console.log(
      "Training Programs Data:",
      JSON.stringify(trainingResponse, null, 2),
    );
  }, [isLoading]);

  // Extract and map training programs from the response
  // The API returns TrainingProgramsResponse with data array containing TrainingProgramData objects
  const programs: TrainingProgram[] =
    trainingResponse?.data?.map((item: any) => ({
      ...item.training_program,
      my_registrations: item?.my_registrations,
    })) || [];

  // Translate benefits data
  const benefits = [
    {
      icon: "🎓",
      title: t(
        "education.benefits.subsidized.title",
        "Free / Subsidized Training",
      ),
      desc: t(
        "education.benefits.subsidized.desc",
        "Quality education at no or minimal cost",
      ),
    },
    {
      icon: "📜",
      title: t(
        "education.benefits.certificate.title",
        "Certificate on Completion",
      ),
      desc: t(
        "education.benefits.certificate.desc",
        "85% attendance required for certificate",
      ),
    },
    {
      icon: "👨‍🏫",
      title: t("education.benefits.trainers.title", "Expert Trainers"),
      desc: t(
        "education.benefits.trainers.desc",
        "Learn from experienced professionals",
      ),
    },
  ];

  // Translate impact data
  const impact = [
    {
      value: "500+",
      label: t("education.impact.students", "Students Trained"),
    },
    { value: "15+", label: t("education.impact.courses", "Courses Offered") },
    { value: "85%", label: t("education.impact.placement", "Job Placement") },
  ];

  const getStatusMeta = (status?: string) => {
    const normalized = status?.toLowerCase();
    switch (normalized) {
      case "approved":
        return { label: "Approved", bg: "#dcfce7", text: "#166534" };
      case "rejected":
        return { label: "Rejected", bg: "#fee2e2", text: "#b91c1c" };
      case "hold":
        return { label: "On Hold", bg: "#f5f3ff", text: "#6b21a8" };
      default:
        return { label: "Pending", bg: "#fef9c3", text: "#854d0e" };
    }
  };

  const handleSponsorPress = (program: TrainingProgram) => {
    setSelectedProgramForSponsor(program);
  };

  const handleSponsorAmountSubmit = (amount: number) => {
    if (!selectedProgramForSponsor) {
      return;
    }

    setSelectedProgramForSponsor(null);
    navigation.navigate("Payment", {
      campaignPayment: {
        module: "education",
        moduleId: (selectedProgramForSponsor as any)?.id,
        moduleTitle: selectedProgramForSponsor.program_name,
        actionLabel: "sponsorship",
        amount,
      },
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>
            {t("education.header.title", "Education & Skill Development")}
          </Text>
          <Text style={styles.headerSubtitle}>
            {t("education.header.subtitle", "Empower yourself with new skills")}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          {t("education.programs.title", "Available Training Programs")}
        </Text>

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>
              {t("common.loading", "Loading programs...")}
            </Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {t(
                "education.errors.loadFailed",
                "Failed to load training programs",
              )}
            </Text>
          </View>
        )}

        {!isLoading && !error && (!programs || programs.length === 0) && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {t(
                "education.errors.noPrograms",
                "No training programs available",
              )}
            </Text>
          </View>
        )}

        {!isLoading &&
          !error &&
          Array.isArray(programs) &&
          programs.map((p: TrainingProgram, idx: number) => {
            const statusMeta = getStatusMeta((p as any).status);
            const isRegisterEnabled = p.status?.toLowerCase() === "active";

            return (
              <View key={p.id || idx} style={styles.programCard}>
                <View style={styles.programHeader}>
                  <Text style={styles.programIcon}>📚</Text>
                  <View style={{ flex: 1 }}>
                    <View style={styles.programTitleRow}>
                      <Text style={styles.programTitle} numberOfLines={2}>
                        {p.program_name}
                      </Text>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: statusMeta.bg },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeText,
                            { color: statusMeta.text },
                          ]}
                        >
                          {p.status}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.programTagsRow}>
                      <View style={styles.tag}>
                        <Text style={styles.tagText}>{p.duration}</Text>
                      </View>
                      <View style={styles.tagOutline}>
                        <Text style={styles.tagOutlineText}>
                          {p.total_seat} seats
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <Text style={styles.programSchedule}>🕒 {p.schedule}</Text>
                <Text style={styles.programDesc}>{p.description}</Text>
                <View style={styles.topicsRow}>
                  {p.topics_covered && typeof p.topics_covered === "string"
                    ? p.topics_covered.split(",").map((t: string) => (
                        <View key={t.trim()} style={styles.topicTag}>
                          <Text style={styles.topicTagText}>{t.trim()}</Text>
                        </View>
                      ))
                    : Array.isArray(p.topics_covered) &&
                      p.topics_covered.map((t: string) => (
                        <View key={t} style={styles.topicTag}>
                          <Text style={styles.topicTagText}>{t}</Text>
                        </View>
                      ))}
                </View>
                <View style={styles.programActions}>
                  {(p as any).my_registrations &&
                  Array.isArray((p as any).my_registrations) &&
                  (p as any).my_registrations.length > 0 ? (
                    <TouchableOpacity
                      style={[
                        styles.registrationStatusBadge,
                        getRegistrationStatusColor(
                          (p as any).my_registrations[0]?.customer_status,
                        ),
                      ]}
                      onPress={() =>
                        handleRegistrationStatusPress(
                          (p as any).my_registrations[0],
                        )
                      }
                    >
                      <Text style={styles.registrationStatusText}>
                        {getRegistrationStatusLabel(
                          (p as any).my_registrations[0]?.customer_status,
                        )}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    isRegisterEnabled && (
                      <TouchableOpacity
                        style={[styles.primaryBtnSmall]}
                        onPress={() =>
                          navigation.navigate("RegisterTraining", {
                            program: p,
                          })
                        }
                      >
                        <Text style={styles.primaryBtnText}>
                          {t("education.programs.registerNow", "Register Now")}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                  <TouchableOpacity
                    style={styles.secondaryBtnSmall}
                    onPress={() => handleSponsorPress(p)}
                  >
                    <Text style={styles.secondaryBtnText}>
                      {t("education.programs.sponsor", "Sponsor")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}

        <View style={styles.benefitsCard}>
          <Text style={styles.sectionTitle}>
            {t("education.benefits.title", "Program Benefits")}
          </Text>
          {benefits.map((b) => (
            <View key={b.title} style={styles.benefitRow}>
              <Text style={styles.benefitIcon}>{b.icon}</Text>
              <View>
                <Text style={styles.benefitTitle}>{b.title}</Text>
                <Text style={styles.benefitDesc}>{b.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.impactCard}>
          <Text style={styles.sectionTitle}>
            {t("education.impact.title", "Our Impact")}
          </Text>
          <View style={styles.impactRow}>
            {impact.map((i) => (
              <PTCard key={i.label} style={styles.impactBoxCard}>
                <View style={styles.impactBox}>
                  <Text style={styles.impactValue}>{i.value}</Text>
                  <Text style={styles.impactLabel}>{i.label}</Text>
                </View>
              </PTCard>
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
        visible={!!selectedProgramForSponsor}
        title="Sponsor This Program"
        subtitle={selectedProgramForSponsor?.program_name}
        actionLabel="Continue"
        onClose={() => setSelectedProgramForSponsor(null)}
        onSubmit={handleSponsorAmountSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
    padding: 16,
  },
  headerCard: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  headerSubtitle: {
    color: "#dbeafe",
    fontSize: 14,
    marginBottom: 16,
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  secondaryBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1e293b",
  },
  programCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  programHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  programTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  programIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  programTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
    flex: 1,
    flexShrink: 1,
  },
  programTagsRow: {
    flexDirection: "row",
    marginTop: 4,
    gap: 8,
  },
  tag: {
    backgroundColor: "#dbeafe",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 6,
  },
  tagText: {
    color: "#2563eb",
    fontSize: 12,
    fontWeight: "bold",
  },
  tagOutline: {
    borderColor: "#38bdf8",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagOutlineText: {
    color: "#38bdf8",
    fontSize: 12,
    fontWeight: "bold",
  },
  programSchedule: {
    color: "#64748b",
    fontSize: 13,
    marginBottom: 4,
  },
  programDesc: {
    color: "#334155",
    fontSize: 13,
    marginBottom: 8,
  },
  topicsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  topicTag: {
    backgroundColor: "#bbf7d0",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 6,
    marginBottom: 4,
  },
  topicTagText: {
    color: "#15803d",
    fontSize: 12,
    fontWeight: "bold",
  },
  programActions: {
    flexDirection: "row",
    gap: 10,
  },
  primaryBtnSmall: {
    backgroundColor: "#1e40af",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  primaryBtnDisabled: {
    backgroundColor: "#cbd5e1",
  },
  primaryBtnDisabledText: {
    color: "#e2e8f0",
  },
  secondaryBtnSmall: {
    backgroundColor: "#22c55e",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  registrationStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 8,
    flex: 1,
  },
  registrationStatusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  statusApproved: {
    backgroundColor: "#16A34A",
  },
  statusPending: {
    backgroundColor: "#F59E0B",
  },
  statusRejected: {
    backgroundColor: "#DC2626",
  },
  statusOnHold: {
    backgroundColor: "#8B5CF6",
  },
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
  modalDivider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginBottom: 16,
  },
  modalBody: {
    marginBottom: 20,
  },
  modalRow: {
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  modalLabel: {
    fontWeight: "700",
    color: "#475569",
    marginRight: 8,
    minWidth: 80,
  },
  modalValue: {
    color: "#334155",
    fontSize: 14,
    flex: 1,
  },
  modalStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  modalStatusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  modalCloseBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  modalCloseBtnText: {
    color: "#fff",
    fontWeight: "700",
  },
  benefitsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  benefitIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  benefitTitle: {
    fontWeight: "bold",
    color: "#0f172a",
    fontSize: 14,
  },
  benefitDesc: {
    color: "#64748b",
    fontSize: 13,
  },
  impactCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    width: "100%",
  },
  impactRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    gap: 8,
    width: "100%",
  },
  impactBox: {
    alignItems: "center",
  },
  impactBoxCard: {
    width: "31%",
  },
  impactValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2563eb",
  },
  impactLabel: {
    color: "#64748b",
    fontSize: 13,
    marginTop: 2,
    textAlign: "center",
  },
  marginLR8: {
    marginLeft: 8,
    marginRight: 8,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    color: "#64748b",
    fontSize: 14,
  },
  errorContainer: {
    backgroundColor: "#fee2e2",
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    borderLeftWidth: 4,
    borderLeftColor: "#dc2626",
  },
  errorText: {
    color: "#991b1b",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    backgroundColor: "#f0f9ff",
    borderRadius: 12,
    padding: 24,
    marginBottom: 18,
    alignItems: "center",
  },
  emptyText: {
    color: "#0369a1",
    fontSize: 14,
    fontWeight: "500",
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
