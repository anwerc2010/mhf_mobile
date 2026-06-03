import React, { useRef, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import {
  QrCode,
  CheckCircle,
  EnvelopeSimple,
  DownloadSimple,
} from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";
import FamilyCard from "../components/general/FamilyCard";
import {
  useGetDashboardDetailsQuery,
  useGetBenefitsQuery,
  type Benefit,
} from "@psi/shared-api";
import { openEmailComposer } from "../utils/emailComposer";
import {
  downloadHealthCard,
  downloadAllHealthCards,
} from "../utils/downloadCard";
import ViewShot from "react-native-view-shot";
import { generatePDF } from "react-native-html-to-pdf";
import { generateCardHTMLWithBenefits } from "../utils/generateCardHTML";
import { getCardImageBase64FromRequire } from "../utils/imageToBase64";
import RNShare from "react-native-share";
import { formatToDDMMYYYY } from "../utils/formatDate";

export default function CardScreen() {
  const { t } = useTranslation();
  const familyScrollRef = useRef<ScrollView>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const { width } = useWindowDimensions();
  const viewShotRef = useRef<any>(null);

  // Fetch dashboard details
  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useGetDashboardDetailsQuery();
  // Refetch when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const { data: benefitsData, isLoading: benefitsLoading } =
    useGetBenefitsQuery();

  const apiBenefits = useMemo<Benefit[]>(() => {
    if (Array.isArray(benefitsData)) {
      return benefitsData;
    }

    if (Array.isArray(benefitsData?.data)) {
      return benefitsData.data as Benefit[];
    }

    return [];
  }, [benefitsData]);

  const benefits = [
    t(
      "card.benefits.freeConsultations",
      "Free consultations at 100+ partner clinics",
    ),
    t("card.benefits.discount", "Up to 50% discount on medicines"),
    t("card.benefits.checkup", "Free annual health checkup"),
    t("card.benefits.helpline", "24/7 emergency helpline support"),
  ];

  const steps = [
    t("card.howToUse.step1", "Visit any partner healthcare facility"),
    t("card.howToUse.step2", "Show your digital health card or Member ID"),
    t("card.howToUse.step3", "Receive services as per your card benefits"),
  ];

  const createPdf = async () => {
    try {
      // Generate HTML from card data
      const cardsData = familyCards.map((card) => ({
        name: card.name,
        membershipId: card.membershipId,
        bloodGroup: card.bloodGroup,
        aadharNumber: card.aadharNumber || t("home.notAvailable"),
        dateOfIssue: card.dateOfIssue || t("home.notAvailable"),
        created_at: card.created_at || t("home.notAvailable"),
        dateOfExpiry: card.dateOfExpiry || t("home.notAvailable"),
      }));

      // Get card.png image as base64 (optional - will fall back to gradient if not available)
      let backgroundImageBase64 = "";
      try {
        backgroundImageBase64 = await getCardImageBase64FromRequire();
        if (backgroundImageBase64) {
          console.log("Card background image loaded successfully");
        } else {
          console.log("Card background image not available, using gradient");
        }
      } catch (imageError) {
        console.warn("Could not load card background image:", imageError);
        // Continue without background image - gradient will be used as fallback
      }

      const htmlContent = generateCardHTMLWithBenefits(
        cardsData,
        benefits,
        steps,
        backgroundImageBase64 || undefined,
      );

      // Convert HTML to PDF
      const pdf = await generatePDF({
        html: htmlContent,
        fileName: `family_health_cards_${Date.now()}`,
        base64: false,
      });

      console.log("PDF saved at:", pdf.filePath);
      return pdf.filePath;
    } catch (error) {
      console.error("Error creating PDF:", error);
      throw error;
    }
  };

  // Get family cards from API data or use default
  const familyCards = useMemo(() => {
    if (dashboardData?.health_card) {
      const familyMembers = Array.isArray(dashboardData?.family_members)
        ? dashboardData.family_members
        : [];

      // Map family members with health card info
      const familyMembersWithCard = familyMembers.map((member: any) => ({
        ...member,
        name: member.name,
        bloodGroup: member.blood_group,
        aadharNumber: member.aadhaar_number,
        membershipId:
          dashboardData?.health_card?.membership_id || t("home.notAvailable"),
        dateOfIssue:
          formatToDDMMYYYY(dashboardData?.health_card?.date_of_issue) ||
          t("home.notAvailable"),
        created_at:
          dashboardData?.health_card?.created_at || t("home.notAvailable"),
        dateOfExpiry:
          formatToDDMMYYYY(dashboardData?.health_card?.date_of_expiry) ||
          t("home.notAvailable"),
      }));

      // Create health card as standalone object (primary member)
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
          formatToDDMMYYYY(dashboardData.health_card.date_of_issue) ||
          t("home.notAvailable"),
        created_at:
          dashboardData.health_card.created_at || t("home.notAvailable"),
        dateOfExpiry:
          formatToDDMMYYYY(dashboardData.health_card.date_of_expiry) ||
          t("home.notAvailable"),
      };

      // Combine both arrays (health card first)
      return [healthCardObject, ...familyMembersWithCard];
    }

    // Default fallback data
    return [];
  }, [dashboardData?.family_members, dashboardData?.health_card]);

  const handleCardScroll = (event: any) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollX / width);
    setCurrentCardIndex(Math.max(0, Math.min(index, familyCards.length - 1)));
  };

  const handleEmailCard = async () => {
    try {
      const currentCard = familyCards[currentCardIndex];
      if (!currentCard) {
        return;
      }
      const subject = `Health Card Details - ${currentCard.name}`;
      const body = `Family Health Card Details:

Name: ${currentCard.name}
Membership ID: ${currentCard.membershipId}
Blood Group: ${currentCard.bloodGroup}
Aadhar Number: ${currentCard.aadharNumber}
Date of Issue: ${currentCard.dateOfIssue}
Date of Expiry: ${currentCard.dateOfExpiry}`;

      // Create and attach the same PDF used by Download.
      const pdfPath = await createPdf();

      await RNShare.shareSingle({
        social: RNShare.Social.EMAIL as any,
        subject,
        message: body,
        title: subject,
        url: `file://${pdfPath}`,
        type: "application/pdf",
      });
    } catch (error: any) {
      // Fallback to plain email composer if the email-share flow is unavailable.
      const currentCard = familyCards[currentCardIndex];
      if (!currentCard) {
        return;
      }

      const subject = `Health Card Details - ${currentCard.name}`;
      const body = `Family Health Card Details:

Name: ${currentCard.name}
Membership ID: ${currentCard.membershipId}
Blood Group: ${currentCard.bloodGroup}
Aadhar Number: ${currentCard.aadharNumber}
Date of Issue: ${currentCard.dateOfIssue}
Date of Expiry: ${currentCard.dateOfExpiry}`;

      await openEmailComposer({ subject, body });
      if (error?.code !== "E_CANCELLED" && error?.code !== "CANCELLED") {
        console.error("Error sending email with PDF:", error);
      }
    }
  };

  const handleDownloadCard = async () => {
    try {
      const pdfPath = await createPdf();
      console.log("All family cards downloaded successfully at:", pdfPath);

      // Share the PDF using react-native-share
      await RNShare.open({
        url: `file://${pdfPath}`,
        type: "application/pdf",
        message: t("card.shareMessage", "Here are my family health cards"),
        title: t("card.shareTitle", "Share Family Health Cards"),
      });
    } catch (error: any) {
      if (error.code !== "E_CANCELLED" && error.code !== "CANCELLED") {
        console.error("Error downloading/sharing cards:", error);
      }
    }
  };

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>
          {t("card.title", "Family Health Cards")}
        </Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.scanButton}
            activeOpacity={0.8}
            onPress={handleDownloadCard}
            disabled={familyCards.length === 0}
          >
            <DownloadSimple color="#fff" weight="bold" size={14} />
            <Text style={styles.scanText}>
              {t("card.downloadCard", "Download")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.scanButton}
            activeOpacity={0.8}
            onPress={handleEmailCard}
            disabled={familyCards.length === 0}
          >
            <EnvelopeSimple color="#fff" weight="bold" size={14} />
            <Text style={styles.scanText}>{t("card.emailCard", "Email")}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Family Health Cards header */}
      {/* <Text style={styles.smallHeader}>{t('home.familyHealthCards')}</Text> */}

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#06B6D4" />
          <Text style={styles.loadingText}>{t("card.loading")}</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{t("card.loadError")}</Text>
        </View>
      ) : familyCards.length === 0 ? (
        <View style={styles.errorContainer}>
          <Text style={styles.loadingText}>
            {t(
              "card.noCardsFound",
              "No health cards found. Complete payment to view your card.",
            )}
          </Text>
        </View>
      ) : (
        <>
          <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1 }}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={styles.familyScroll}
              ref={familyScrollRef}
              decelerationRate="fast"
              scrollEventThrottle={16}
              onMomentumScrollEnd={handleCardScroll}
            >
              {familyCards.map((c, i) => (
                <View key={i} style={[styles.familyCardPage, { width }]}>
                  <FamilyCard
                    data={c}
                    image={require("../../assets/images/card.png")}
                  />
                </View>
              ))}
            </ScrollView>
          </ViewShot>
          {/* Pagination Dots */}
          <View style={styles.dotsContainer}>
            {familyCards.map((_, i) => (
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

          <Text style={styles.swipeText}>{t("card.swipeHint")}</Text>
        </>
      )}

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>
          {t("card.cardBenefits", "Card Benefits")}
        </Text>
        {benefitsLoading ? (
          <ActivityIndicator size="small" color="#06B6D4" />
        ) : (
          apiBenefits.map((b) => (
            <View style={styles.benefitRow} key={b.id}>
              <CheckCircle color="#10B981" weight="bold" size={16} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.benefitText}>{b.title}</Text>
                {b.description ? (
                  <Text style={styles.benefitDesc}>{b.description}</Text>
                ) : null}
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>{t("card.howToUse.title")}</Text>
        {steps.map((s, i) => (
          <View style={styles.stepRow} key={i}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>
                {t("common.step", `Step ${i + 1}`)}
              </Text>
            </View>
            <Text style={styles.stepText}>{s}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F6F7FB" },
  content: { padding: 16, paddingBottom: 40 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: { fontSize: 14, fontWeight: "700", color: "#1E3A8A" },
  actionButtons: { flexDirection: "row", gap: 8 },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#06B6D4",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
  },
  scanText: { color: "#fff", marginLeft: 6, fontSize: 12, fontWeight: "600" },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    marginTop: 8,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotActive: { backgroundColor: "#06B6D4", width: 24 },
  dotInactive: { backgroundColor: "#D1D5DB" },
  swipeText: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 8,
    marginBottom: 12,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: { marginTop: 12, color: "#6B7280", fontSize: 14 },
  errorContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: { color: "#DC2626", fontSize: 14, fontWeight: "600" },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111827",
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  benefitText: { color: "#374151", fontSize: 13, fontWeight: "600" },
  benefitDesc: { color: "#6B7280", fontSize: 12, marginTop: 2 },
  stepRow: { marginBottom: 12 },
  stepNumber: {
    backgroundColor: "#F3F4F6",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 6,
  },
  stepNumberText: { color: "#374151", fontWeight: "600" },
  stepText: { color: "#6B7280", fontSize: 13 },
  smallHeader: {
    marginTop: 18,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  familyScroll: { marginTop: 8, marginHorizontal: -16 },
  familyCardPage: { paddingHorizontal: 16 },
});
