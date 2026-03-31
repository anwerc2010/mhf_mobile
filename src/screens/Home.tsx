import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Modal,
  Linking,
} from "react-native";
import {
  GraduationCapIcon,
  HeartIcon,
  UsersIcon,
  CalendarBlankIcon,
} from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useGetDashboardDetailsQuery } from "@psi/shared-api";
import FamilyCard from "../components/general/FamilyCard";
import { formatToDDMMYYY } from "../utils/formatDate";

const { width } = Dimensions.get("window");

const defaultPartnerImages = [
  require("../../assets/images/carousel.png"),
  require("../../assets/images/carousel.png"),
  require("../../assets/images/carousel.png"),
];

export default function HomeScreen() {
  const { t } = useTranslation();
  const [currentPartnerIndex, setCurrentPartnerIndex] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cardRequestModalVisible, setCardRequestModalVisible] = useState(false);
  const [selectedCardRequest, setSelectedCardRequest] = useState<any>(null);
  const [partnersModalVisible, setPartnersModalVisible] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const partnerScrollRef = useRef<ScrollView>(null);
  const familyScrollRef = useRef<ScrollView>(null);

  // Fetch dashboard details
  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useGetDashboardDetailsQuery();
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const hasPendingPayment = useMemo(() => {
    return (dashboardData?.card_requests ?? []).some(
      (req: any) => req?.payment_status === "pending",
    );
  }, [dashboardData?.card_requests]);

  // Create merged array combining health card object with family members array
  const familyCardsData = useMemo(() => {
    if (!dashboardData?.health_card) {
      return [];
    }

    const familyMembers = Array.isArray(dashboardData?.family_members)
      ? dashboardData.family_members
      : [];

    // Map family members with health card details
    const familyMembersWithCard = familyMembers.map((member: any) => ({
      ...member,
      name: member.name,
      bloodGroup: member.blood_group,
      aadharNumber: member.aadhaar_number,
      membershipId:
        dashboardData?.health_card?.membership_id || t("home.notAvailable"),
      dateOfIssue:
        formatToDDMMYYY(dashboardData?.health_card?.date_of_issue) ||
        t("home.notAvailable"),
      dateOfExpiry:
        formatToDDMMYYY(dashboardData?.health_card?.date_of_expiry) ||
        t("home.notAvailable"),
    }));

    // Create health card as standalone object
    const healthCardObject = {
      ...dashboardData.health_card,
      name:
        dashboardData.health_card.card_holder_name || t("home.primaryMember"),
      membershipId:
        dashboardData.health_card.membership_id || t("home.notAvailable"),
      bloodGroup:
        dashboardData.health_card.blood_group || t("home.notAvailable"),
      aadharNumber:
        dashboardData.health_card.aadhaar_number || t("home.notAvailable"),
      dateOfIssue:
        formatToDDMMYYY(dashboardData.health_card.date_of_issue) ||
        t("home.notAvailable"),
      dateOfExpiry:
        formatToDDMMYYY(dashboardData.health_card.date_of_expiry) ||
        t("home.notAvailable"),
    };

    // Combine both arrays
    return [healthCardObject, ...familyMembersWithCard];
  }, [dashboardData?.family_members, dashboardData?.health_card]);

  // Auto-scroll partners carousel
  useEffect(() => {
    const partnerImages =
      dashboardData?.featured_partners || defaultPartnerImages;
    const autoScrollInterval = setInterval(() => {
      const nextIndex = (currentPartnerIndex + 1) % partnerImages.length;
      setCurrentPartnerIndex(nextIndex);
      if (partnerScrollRef.current) {
        partnerScrollRef.current.scrollTo({
          x: nextIndex * (width - 32),
          animated: true,
        });
      }
    }, 4000); // Auto-scroll every 4 seconds

    return () => clearInterval(autoScrollInterval);
  }, [currentPartnerIndex, dashboardData?.featured_partners]);

  const handlePartnerScroll = (event: any) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const partnerWidth = width - 32;
    const index = Math.round(scrollX / partnerWidth);
    setCurrentPartnerIndex(index);
  };

  const cardWidth = width * 0.9 - 32; // cardItem width + margin
  const handleCardScroll = (event: any) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const cardWidth = width * 0.9 + 32; // cardItem width + margin
    const index = Math.round(scrollX / cardWidth);
    setCurrentCardIndex(index);
  };

  const navigation = useNavigation<any>();

  const handleCardRequestPress = (request: any) => {
    setSelectedCardRequest(request);
    setCardRequestModalVisible(true);
  };

  const hasCardRequests =
    Array.isArray(dashboardData?.card_requests) &&
    dashboardData.card_requests.some(
      (req: any) => req?.status?.toString().toLowerCase() === "approved",
    );

  const getCardRequestStatusColor = (status: string) => {
    const statusLower = (status ?? "").toString().toLowerCase();
    switch (statusLower) {
      case "approved":
        return styles.cardRequestStatusApproved;
      case "rejected":
        return styles.cardRequestStatusRejected;
      case "pending":
      default:
        return styles.cardRequestStatusPending;
    }
  };

  const getPaymentType = (request: any): "free" | "paid" | "unknown" => {
    const value = (request?.payment_type ?? "").toString().toLowerCase();
    if (value === "free" || value === "paid") {
      return value;
    }
    return "unknown";
  };

  const getPaymentStatus = (request: any): string => {
    return (request?.payment_status ?? "").toString().toLowerCase();
  };

  const getPaymentTypeBadgeStyle = (request: any) => {
    const paymentType = getPaymentType(request);
    if (paymentType === "free") {
      return styles.cardRequestPaymentFree;
    }
    if (paymentType === "paid") {
      return styles.cardRequestPaymentPaid;
    }
    return styles.cardRequestPaymentUnknown;
  };

  const getPaymentTypeLabel = (request: any) => {
    const paymentType = getPaymentType(request);
    if (paymentType === "free") {
      return t("home.free", "Free");
    }
    if (paymentType === "paid") {
      return t("home.paid", "Paid");
    }
    return t("home.unknown", "Unknown");
  };

  const isSelectedRequestApproved =
    selectedCardRequest?.status?.toString().toLowerCase() === "approved";
  const selectedRequestPaymentType = getPaymentType(selectedCardRequest);
  const isSelectedRequestPaid = selectedRequestPaymentType === "paid";
  const isSelectedRequestFree = selectedRequestPaymentType === "free";
  const isSelectedRequestPendingPayment =
    isSelectedRequestPaid &&
    getPaymentStatus(selectedCardRequest) === "pending";
  const isSelectedRequestCanApply = Boolean(selectedCardRequest?.can_apply);
  const isSelectedRequestCanPay =
    Boolean(selectedCardRequest?.can_pay) || isSelectedRequestPendingPayment;
  const shouldShowApplyAction = isSelectedRequestApproved;
  const shouldShowPayAction = isSelectedRequestPaid && isSelectedRequestCanPay;

  const actions = [
    { key: "education", Icon: GraduationCapIcon, label: t("home.education") },
    { key: "relief", Icon: HeartIcon, label: t("home.relief") },
    { key: "volunteers", Icon: UsersIcon, label: t("home.volunteers") },
    { key: "events", Icon: CalendarBlankIcon, label: t("home.events") },
  ];

  return (
    <>
      <ScrollView style={styles.page} contentContainerStyle={styles.content}>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1E3A8A" />
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{t("home.errorLoadingData")}</Text>
          </View>
        )}

        {/* Featured Partners */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t("home.featuredPartners")}</Text>
          <TouchableOpacity onPress={() => setPartnersModalVisible(true)}>
            <Text style={styles.viewAll}>{t("home.viewAll")}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.carousel}
          ref={partnerScrollRef}
          onMomentumScrollEnd={handlePartnerScroll}
          scrollEventThrottle={16}
        >
          {(dashboardData?.featured_partners || []).map(
            (partner: any, idx: number) => (
              <View key={idx} style={styles.partnerCard}>
                <Image
                  source={
                    partner.image_url && !imageErrors[idx]
                      ? { uri: partner.image_url }
                      : defaultPartnerImages[idx % defaultPartnerImages.length]
                  }
                  style={styles.partnerImage}
                  resizeMode="cover"
                  onError={() =>
                    setImageErrors((prev) => ({ ...prev, [idx]: true }))
                  }
                />
                <View style={styles.partnerOverlay}>
                  <Text style={styles.partnerOverlayName} numberOfLines={1}>
                    {partner.partner_details?.split(" • ")[0] || ""}
                  </Text>
                  <View style={styles.partnerTypeBadge}>
                    <Text style={styles.partnerTypeText}>{partner.type}</Text>
                  </View>
                </View>
              </View>
            ),
          )}
        </ScrollView>

        {/* Pagination Dots for Partners */}
        <View style={styles.dotsContainer}>
          {(dashboardData?.featured_partners || []).map((_, i: number) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentPartnerIndex
                  ? styles.dotActive
                  : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* Welcome / Actions card */}
        <ImageBackground
          source={require("../../assets/images/carousel_bg.png")}
          style={styles.welcomeCard}
          imageStyle={{ resizeMode: "cover" }}
        >
          <Text style={styles.welcomeTitle}>{t("home.welcomeBack")}</Text>
          <Text style={styles.welcomeName}>
            {dashboardData?.customer?.fullname || t("home.guest")}
          </Text>

          <View style={styles.actionsRow}>
            {actions.map(({ key, Icon, label }) => (
              <TouchableOpacity
                style={styles.actionItem}
                key={key}
                onPress={() => {
                  if (key === "relief") navigation.navigate("Relief");
                  else if (key === "education")
                    navigation.navigate("Education");
                  else if (key === "events") navigation.navigate("Events");
                  else if (key === "volunteers")
                    navigation.navigate("Volunteers");
                }}
              >
                <View
                  style={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    borderRadius: 21,
                    padding: 12,
                  }}
                >
                  <Icon color="#fff" weight="bold" size={20} />
                </View>
                <Text style={styles.actionText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ImageBackground>

        {/* Family Health Cards header */}
        <Text style={styles.smallHeader}>{t("home.familyHealthCards")}</Text>

        {familyCardsData.length > 0 ? (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.familyScroll}
              ref={familyScrollRef}
              snapToInterval={cardWidth}
              decelerationRate={0}
              scrollEventThrottle={16}
              onMomentumScrollEnd={handleCardScroll}
              contentContainerStyle={styles.familyScrollContent}
            >
              {familyCardsData.map((cardData: any, i: number) => (
                <FamilyCard
                  key={i}
                  data={cardData}
                  image={require("../../assets/images/card.png")}
                />
              ))}
            </ScrollView>

            {/* Pagination Dots */}
            <View style={styles.dotsContainer}>
              {familyCardsData.map((_, i: number) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    i === currentCardIndex
                      ? styles.dotActive
                      : styles.dotInactive,
                  ]}
                />
              ))}
            </View>
          </>
        ) : (
          <View style={styles.noCardsContainer}>
            <Text style={styles.noCardsText}>
              {hasPendingPayment
                ? t(
                    "home.paymentPendingNoCard",
                    "Payment is pending. Complete payment to view your health card.",
                  )
                : t("home.noCardsFound")}
            </Text>
          </View>
        )}

        {!dashboardData?.health_card && !hasCardRequests && (
          <ImageBackground
            source={require("../../assets/images/button_bg.png")}
            style={styles.requestButton}
            imageStyle={styles.requestButtonImage}
          >
            <TouchableOpacity
              style={styles.requestTouchable}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("NewCardRequest")}
            >
              <Text style={styles.requestText}>{t("home.requestNewCard")}</Text>
            </TouchableOpacity>
          </ImageBackground>
        )}

        {!dashboardData?.health_card && hasCardRequests && (
          <View style={styles.cardRequestsCard}>
            <Text style={styles.cardRequestsTitle}>
              {t("home.cardRequests")}
            </Text>
            {dashboardData.card_requests
              .filter(
                (req: any) =>
                  req?.status?.toString().toLowerCase() === "approved",
              )
              .map((req: any) => (
                <TouchableOpacity
                  key={req.id}
                  style={styles.cardRequestItem}
                  onPress={() => handleCardRequestPress(req)}
                >
                  <View>
                    <Text style={styles.cardRequestId}>#{req.id}</Text>
                    {!!req.requested_at && (
                      <Text style={styles.cardRequestDate}>
                        {req.requested_at}
                      </Text>
                    )}
                  </View>
                  <View style={styles.cardRequestBadgesRow}>
                    <View
                      style={[
                        styles.cardRequestStatusBadge,
                        getCardRequestStatusColor(req.status),
                      ]}
                    >
                      <Text style={styles.cardRequestStatusText}>
                        {req.status
                          ? req.status.charAt(0).toUpperCase() +
                            req.status.slice(1).toLowerCase()
                          : ""}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.cardRequestStatusBadge,
                        getPaymentTypeBadgeStyle(req),
                      ]}
                    >
                      <Text style={styles.cardRequestStatusText}>
                        {getPaymentTypeLabel(req)}
                      </Text>
                    </View>
                    {getPaymentType(req) === "paid" &&
                      getPaymentStatus(req) === "pending" && (
                        <View
                          style={[
                            styles.cardRequestStatusBadge,
                            styles.cardRequestPaymentPending,
                          ]}
                        >
                          <Text style={styles.cardRequestStatusText}>
                            {t("home.payNow", "Pay Now")}
                          </Text>
                        </View>
                      )}
                  </View>
                </TouchableOpacity>
              ))}
          </View>
        )}
      </ScrollView>

      {/* Partners List Modal */}
      <Modal
        visible={partnersModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPartnersModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { maxHeight: "85%", width: "95%" }]}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text style={styles.modalTitle}>
                {t("home.featuredPartners")}
              </Text>
              <TouchableOpacity onPress={() => setPartnersModalVisible(false)}>
                <Text style={{ fontSize: 22, color: "#6B7280" }}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalDivider} />
            <ScrollView showsVerticalScrollIndicator={false}>
              {(dashboardData?.featured_partners || []).map(
                (partner: any, idx: number) => {
                  const [name, phone, email] = (
                    partner.partner_details || ""
                  ).split(" • ");
                  return (
                    <View key={idx} style={styles.partnerListItem}>
                      <Image
                        source={
                          partner.image_url && !imageErrors[idx]
                            ? { uri: partner.image_url }
                            : defaultPartnerImages[
                                idx % defaultPartnerImages.length
                              ]
                        }
                        style={styles.partnerListImage}
                        resizeMode="cover"
                        onError={() =>
                          setImageErrors((prev) => ({ ...prev, [idx]: true }))
                        }
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.partnerListName} numberOfLines={1}>
                          {name}
                        </Text>
                        <Text style={styles.partnerListMeta} numberOfLines={1}>
                          {phone}
                          {email ? ` • ${email}` : ""}
                        </Text>
                        <View
                          style={{ flexDirection: "row", gap: 6, marginTop: 4 }}
                        >
                          <View style={styles.partnerTypeBadge}>
                            <Text
                              style={[
                                styles.partnerTypeText,
                                { color: "#1E3A8A" },
                              ]}
                            >
                              {partner.type}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.partnerTypeBadge,
                              { backgroundColor: "#D1FAE5" },
                            ]}
                          >
                            <Text
                              style={[
                                styles.partnerTypeText,
                                { color: "#065F46" },
                              ]}
                            >
                              {partner.status}
                            </Text>
                          </View>
                        </View>
                      </View>
                      {partner.learn_more_url ? (
                        <TouchableOpacity
                          style={styles.partnerLearnBtn}
                          onPress={() =>
                            Linking.openURL(partner.learn_more_url)
                          }
                        >
                          <Text style={styles.partnerLearnBtnText}>View</Text>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  );
                },
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={cardRequestModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCardRequestModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {t("home.cardRequestDetails")}
            </Text>
            <View style={styles.modalDivider} />
            <View style={styles.modalBody}>
              {selectedCardRequest?.id && (
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>{t("home.requestId")}</Text>
                  <Text style={styles.modalValue}>
                    #{selectedCardRequest.id}
                  </Text>
                </View>
              )}
              {selectedCardRequest?.status && (
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>{t("home.status")}</Text>
                  <Text style={styles.modalValue}>
                    {selectedCardRequest.status}
                  </Text>
                </View>
              )}
              {selectedCardRequest?.payment_type && (
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>
                    {t("home.paymentType", "Payment Type")}
                  </Text>
                  <Text style={styles.modalValue}>
                    {getPaymentTypeLabel(selectedCardRequest)}
                  </Text>
                </View>
              )}
              {selectedCardRequest?.requested_at && (
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>{t("home.requested")}</Text>
                  <Text style={styles.modalValue}>
                    {selectedCardRequest.requested_at}
                  </Text>
                </View>
              )}
              {selectedCardRequest?.updated_at && (
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>{t("home.updated")}</Text>
                  <Text style={styles.modalValue}>
                    {selectedCardRequest.updated_at}
                  </Text>
                </View>
              )}
              {/* {selectedCardRequest?.review_notes && (
                <View style={[styles.modalRow, { alignItems: 'flex-start' }]}>
                  <Text style={[styles.modalLabel, { marginTop: 0 }]}>{t('home.reviewNotes')}</Text>
                  <Text style={[styles.modalValue, { flex: 1 }]}>{selectedCardRequest.review_notes}</Text>
                </View>
              )}
              {!selectedCardRequest?.review_notes && selectedCardRequest?.id && (
                <View style={styles.modalRow}>
                  <Text style={styles.modalValue}>{t('home.noReviewNotes')}</Text>
                </View>
              )} */}
            </View>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setCardRequestModalVisible(false)}
            >
              <Text style={styles.modalCloseBtnText}>{t("home.close")}</Text>
            </TouchableOpacity>

            {shouldShowApplyAction && (
              <>
                <Text style={styles.modalInfoText}>
                  {isSelectedRequestPaid
                    ? t(
                        "home.paidRequestInfo",
                        "This request is paid. Complete card details first, then proceed to Razorpay payment. Card will appear after successful payment verification.",
                      )
                    : isSelectedRequestFree
                    ? t(
                        "home.freeRequestInfo",
                        "This request is free. After submitting card details, your card will be generated automatically.",
                      )
                    : t(
                        "home.unknownPaymentTypeInfo",
                        "Complete card details to continue. Payment requirements will be decided by server verification.",
                      )}
                </Text>

                <TouchableOpacity
                  style={styles.modalPrimaryBtn}
                  onPress={() => {
                    setCardRequestModalVisible(false);
                    navigation.navigate("ApplyCardRequest", {
                      paymentType: selectedRequestPaymentType,
                      paymentStatus: getPaymentStatus(selectedCardRequest),
                      canApply: isSelectedRequestCanApply,
                      canPay: isSelectedRequestCanPay,
                    });
                  }}
                >
                  <Text style={styles.modalPrimaryBtnText}>
                    {isSelectedRequestPaid
                      ? t(
                          "home.applyAndPay",
                          "Apply Card & Continue to Payment",
                        )
                      : isSelectedRequestFree
                      ? t("home.applyForFreeCard", "Apply For Free Card")
                      : t("home.applyForCard", "Apply For Card")}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F6F7FB" },
  content: { padding: 16, paddingBottom: 40 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  errorContainer: {
    backgroundColor: "#FEE2E2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: { color: "#DC2626", fontSize: 14, fontWeight: "500" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: "#1E3A8A" },
  viewAll: { fontSize: 12, color: "#1E90FF" },
  carousel: { height: 190, marginBottom: 12 },
  partnerCard: {
    width: width - 32,
    height: 190,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#E5E7EB",
    marginRight: 0,
    elevation: 2,
  },
  partnerImage: { width: "100%", height: 190 },
  partnerOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  partnerOverlayName: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
    flex: 1,
    marginRight: 8,
  },
  partnerTypeBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  partnerTypeText: { color: "#fff", fontSize: 11, fontWeight: "600" },
  welcomeCard: {
    marginTop: 16,
    marginHorizontal: -16,
    paddingHorizontal: 16,
    height: 200,
    paddingVertical: 12,
    backgroundColor: "#1E3A8A",
    // simple gradient feel by layering colors
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  welcomeTitle: { color: "#fff", fontSize: 13, marginTop: 12 },
  welcomeName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 12,
  },
  actionItem: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    padding: 8,
    borderRadius: 10,
    width: (width - 64) / 4,
    height: 80,
    justifyContent: "center",
  },
  actionText: { color: "#fff", fontSize: 12, marginTop: 6 },
  smallHeader: {
    marginTop: 18,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  familyScroll: { marginTop: 8, width: "100%" },
  familyScrollContent: { paddingRight: 8 },
  noCardsContainer: {
    marginTop: 24,
    paddingVertical: 40,
    paddingHorizontal: 16,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  noCardsText: { fontSize: 16, fontWeight: "500", color: "#6B7280" },
  requestButton: {
    marginTop: 12,
    width: "100%",
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  requestButtonImage: { borderRadius: 24 },
  requestTouchable: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  plusText: { color: "#fff", fontSize: 16, fontWeight: "700", marginRight: 8 },
  requestText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    gap: 8,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotActive: { backgroundColor: "#1E3A8A", width: 24 },
  dotInactive: { backgroundColor: "#D1D5DB" },

  cardRequestsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardRequestsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 8,
  },
  cardRequestItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  cardRequestId: { fontSize: 13, fontWeight: "700", color: "#0F172A" },
  cardRequestDate: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  cardRequestStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  cardRequestBadgesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cardRequestStatusText: { fontSize: 12, color: "#fff", fontWeight: "700" },
  cardRequestStatusApproved: { backgroundColor: "#16A34A" },
  cardRequestStatusPending: { backgroundColor: "#F59E0B" },
  cardRequestStatusRejected: { backgroundColor: "#DC2626" },
  cardRequestPaymentFree: { backgroundColor: "#0EA5A4" },
  cardRequestPaymentPaid: { backgroundColor: "#2563EB" },
  cardRequestPaymentUnknown: { backgroundColor: "#6B7280" },
  cardRequestPaymentPending: { backgroundColor: "#D97706" },

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
    minWidth: 90,
  },
  modalValue: { color: "#334155", fontSize: 14, flex: 1 },
  modalCloseBtn: {
    backgroundColor: "#1E3A8A",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  modalCloseBtnText: { color: "#fff", fontWeight: "700" },
  modalPrimaryBtn: {
    backgroundColor: "#0EA5A4",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  modalInfoText: {
    color: "#475569",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 10,
  },
  modalPrimaryBtnText: { color: "#fff", fontWeight: "700" },
  partnerListItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  partnerListImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
  },
  partnerListName: { fontSize: 13, fontWeight: "700", color: "#0F172A" },
  partnerListMeta: { fontSize: 11, color: "#6B7280", marginTop: 2 },
  partnerLearnBtn: {
    backgroundColor: "#1E3A8A",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  partnerLearnBtnText: { color: "#fff", fontSize: 12, fontWeight: "700" },
});
