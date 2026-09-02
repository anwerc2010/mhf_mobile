import React, { useRef, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
  Modal,
  TextInput,
  Linking,
} from "react-native";
import {
  QrCode,
  CheckCircle,
  EnvelopeSimple,
  DownloadSimple,
  Clock,
  XCircle,
  ShieldCheck,
  Phone,
  WhatsappLogo,
  Warning,
} from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import PTToast, { ToastType } from "../components/comman/PTToast";
import FamilyCard from "../components/general/FamilyCard";
import {
  useGetDashboardDetailsQuery,
  useGetBenefitsQuery,
  useGetProvidersQuery,
  type Benefit,
} from "@psi/shared-api";
import { generatePDF } from "react-native-html-to-pdf";
import { generateCardHTMLWithBenefits } from "../utils/generateCardHTML";
import { getCardImageBase64FromRequire, getLogoImageBase64 } from "../utils/imageToBase64";
import RNShare from "react-native-share";
import { formatToDDMMYYYY } from "../utils/formatDate";
import { APP_CONFIG } from "../constants/config";
const MHF = APP_CONFIG;

export default function CardScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const familyScrollRef = useRef<ScrollView>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [emailSheetVisible, setEmailSheetVisible] = useState(false);
  const [providerQuery, setProviderQuery] = useState("");
  const [activeProviderCategory, setActiveProviderCategory] =
    useState("all");
  const { width } = useWindowDimensions();
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [pdfPreview, setPdfPreview] = useState<{ visible: boolean; pdfPath: string | null }>({ visible: false, pdfPath: null });
  const [toastState, setToastState] = useState({
    visible: false,
    message: "",
    type: "info" as ToastType,
  });

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

  const { data: benefitsData, isLoading: benefitsLoading } =
    useGetBenefitsQuery();
  const {
    data: providersData,
    isLoading: providersLoading,
    error: providersError,
    refetch: refetchProviders,
  } = useGetProvidersQuery();

  const apiBenefits = useMemo<Benefit[]>(() => {
    if (Array.isArray(benefitsData)) {
      return benefitsData;
    }

    if (Array.isArray(benefitsData?.data)) {
      return benefitsData.data as Benefit[];
    }

    return [];
  }, [benefitsData]);


  const steps = [
    t(
      "card.howToUse.step1",
      "Visit any of our trusted partner healthcare facilities and enjoy exclusive health card benefits",
    ),
    t(
      "card.howToUse.step2",
      "Show your digital health card and share it with the hospital's email ID for verification",
    ),
    t(
      "card.howToUse.step3",
      "Receive healthcare services with care, ensuring support when you need it most",
    ),
  ];
  const howToUseNote = t(
    "card.howToUse.note",
    "Note: If you are an existing patient, the card will not be accepted at the hospitals",
  );

  const providerCategories = [
    { key: "all", label: t("services.categories.all", "All") },
    {
      key: "hospital",
      label: t("services.categories.hospital", "Hospital"),
    },
    {
      key: "diagnostics",
      label: t("services.categories.diagnostics", "Diagnostics"),
    },
    {
      key: "pharmacy",
      label: t("services.categories.pharmacy", "Pharmacy"),
    },
    { key: "clinic", label: t("services.categories.clinics", "Clinics") },
    { key: "rehab", label: t("services.categories.rehab", "Rehab") },
    {
      key: "old_age_home",
      label: t("services.categories.oldAgeHome", "Old Age Home"),
    },
    {
      key: "surgicals",
      label: t("services.categories.surgical", "Surgical"),
    },
  ];

  const normalizeCategory = (value: string) =>
    value.toLowerCase().replace(/\s+/g, "_").trim();

  const filteredProviders = useMemo(() => {
    const providersList = Array.isArray(providersData)
      ? providersData
      : Array.isArray(providersData?.data)
        ? providersData.data
        : Array.isArray((providersData as any)?.data?.data)
          ? (providersData as any).data.data
          : [];

    const baseProviders = providersList;

    const categoryFiltered = baseProviders.filter((p: any) => {
      if (activeProviderCategory === "all") return true;

      const rawCategory =
        p?.category || p?.type || p?.sub_type || p?.provider_type || "";
      const category = normalizeCategory(String(rawCategory));

      if (activeProviderCategory === "old_age_home") {
        return ["old_age_home", "oldagehome", "old_agehome", "labs", "lab"].includes(
          category,
        );
      }

      return category === activeProviderCategory;
    });

    if (!providerQuery.trim()) return categoryFiltered;

    const q = providerQuery.toLowerCase();
    return categoryFiltered.filter((p: any) => {
      const name = (p?.provider_name || "").toLowerCase();
      const address = (p?.address || "").toLowerCase();
      const email = (p?.email || "").toLowerCase();
      const city = (
        p?.city ||
        p?.city_name ||
        p?.district ||
        p?.district_name ||
        ""
      ).toLowerCase();

      return (
        name.includes(q) ||
        address.includes(q) ||
        email.includes(q) ||
        city.includes(q)
      );
    });
  }, [providersData?.data, activeProviderCategory, providerQuery]);

  const createPdf = async (cardsOverride?: any[]) => {
    try {
      const cards = cardsOverride ?? familyCards;
      const cardsData = cards.map((card) => ({
        name: card.name,
        membershipId: card.membershipId,
        bloodGroup: card.bloodGroup,
        aadharNumber: card.aadharNumber || t("home.notAvailable"),
        dateOfIssue: card.dateOfIssue || t("home.notAvailable"),
        created_at: card.created_at || t("home.notAvailable"),
        dateOfExpiry: card.dateOfExpiry || t("home.notAvailable"),
        phone: card.phone || "",
        email: card.email || "",
        address: card.address || "",
        city: card.city || "",
        gender: card.gender || "",
      }));

      const [backgroundImageBase64, logoBase64] = await Promise.all([
        getCardImageBase64FromRequire().catch(() => ""),
        getLogoImageBase64().catch(() => ""),
      ]);

      const htmlContent = generateCardHTMLWithBenefits(
        cardsData,
        [],
        [],
        backgroundImageBase64 || undefined,
        logoBase64 || undefined,
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
  const healthCardStatus = dashboardData?.health_card?.status;
  const cardExpiryDate = dashboardData?.health_card?.date_of_expiry;
  const isExpiredByDate = cardExpiryDate
    ? new Date(cardExpiryDate) < new Date()
    : false;
  const isCardPending = healthCardStatus === 'pending';
  const isCardRejected = healthCardStatus === 'rejected';
  const isCardExpired =
    healthCardStatus === 'expired' ||
    (isExpiredByDate && !isCardPending && !isCardRejected);
  const isCardVisible =
    (healthCardStatus === 'approved' || healthCardStatus === 'active') &&
    !isExpiredByDate;

  console.log('[CardScreen] dashboard response:', dashboardData);
  console.log('[CardScreen] health_card:', dashboardData?.health_card);
  console.log('[CardScreen] health_card status:', healthCardStatus);
  console.log('[CardScreen] card visibility — pending:', isCardPending, '| rejected:', isCardRejected, '| expired:', isCardExpired, '| visible:', isCardVisible);

  const familyCards = useMemo(() => {
    if (dashboardData?.health_card && isCardVisible) {
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
    setEmailSheetVisible(true);
    refetchProviders();
  };

  const handleComposeProviderEmail = async (provider: any) => {
    const currentCard = familyCards[currentCardIndex];
    if (!currentCard || !provider?.email) return;

    setEmailSheetVisible(false);
    setIsSendingEmail(true);
    setToastState({ visible: true, message: t("card.preparingEmail", "Preparing email…"), type: "info" });

    try {
      const pdfPath = await createPdf();

      const subject = `${t("card.providerEmailSubjectPrefix", "Hospital Visit – Mujtaba Helping Foundation Health Card")} | ${currentCard.membershipId}`;
      const addressLine = [currentCard.address, currentCard.city].filter(Boolean).join(", ");
      const notAvailable = t("home.notAvailable", "N/A");
      const body = `${t("card.providerEmailGreeting", "Dear {{name}},", { name: provider.provider_name || t("card.healthcareProvider", "Healthcare Provider") })}

${t("card.providerEmailIntro", "I am a Mujtaba Helping Foundation member and will be visiting your facility. Please find my Mujtaba Helping Foundation Health Card PDF attached for your reference.")}

${t("card.healthCardDetailsHeading", "HEALTH CARD DETAILS")}
-------------------
${t("card.cardHolderLabel", "Card Holder")}  : ${currentCard.name}
${t("card.membershipIdLabel", "Membership ID")}: ${currentCard.membershipId}
${t("card.bloodGroupLabel", "Blood Group")}  : ${currentCard.bloodGroup}
${t("card.dateOfIssueLabel", "Date of Issue")}: ${currentCard.dateOfIssue}
${t("card.dateOfExpiryLabel", "Date of Expiry")}: ${currentCard.dateOfExpiry}
${currentCard.phone ? `${t("common.phone", "Phone")}        : ${currentCard.phone}\n` : ""}${currentCard.email ? `${t("common.email")}        : ${currentCard.email}\n` : ""}${addressLine ? `${t("common.address", "Address")}      : ${addressLine}\n` : ""}
${t("card.visitingProviderHeading", "VISITING PROVIDER")}
-----------------
${t("card.providerLabel", "Provider")} : ${provider.provider_name || notAvailable}
${t("common.address", "Address")}  : ${provider.address || notAvailable}

${t("card.thankYou", "Thank you.")}`;

      await RNShare.shareSingle({
        social: RNShare.Social.EMAIL,
        email: provider.email,
        cc: APP_CONFIG.MHF_CC_EMAIL,
        subject,
        message: body,
        url: `file://${pdfPath}`,
        type: "application/pdf",
      } as any);
    } catch (error: any) {
      if (error?.code !== "CANCELLED" && error?.code !== "E_CANCELLED") {
        console.error("Error sending email:", error);
        setToastState({ visible: true, message: t("card.emailError", "Failed to compose email"), type: "error" });
      }
    } finally {
      setIsSendingEmail(false);
      setToastState((prev) => ({ ...prev, visible: false }));
    }
  };

  const handleDownloadCard = async () => {
    try {
      const pdfPath = await createPdf();
      if (pdfPath) {
        setPdfPreview({ visible: true, pdfPath });
      }
    } catch (error: any) {
      if (error.code !== "E_CANCELLED" && error.code !== "CANCELLED") {
        console.error("Error generating PDF:", error);
        setToastState({ visible: true, message: t("card.pdfError", "Failed to generate PDF"), type: "error" });
      }
    }
  };

  const handleSharePdf = async () => {
    if (!pdfPreview.pdfPath) return;
    try {
      await RNShare.open({
        url: `file://${pdfPreview.pdfPath}`,
        type: "application/pdf",
        message: t("card.shareMessage", "Here are my family health cards"),
        title: t("card.shareTitle", "Share Family Health Cards"),
      });
    } catch (error: any) {
      if (error.code !== "E_CANCELLED" && error.code !== "CANCELLED") {
        console.error("Error sharing PDF:", error);
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>
          {t("card.title", "Family Health Cards")}
        </Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.scanButton, (!isCardVisible || familyCards.length === 0) && { opacity: 0.4 }]}
            activeOpacity={0.8}
            onPress={handleDownloadCard}
            disabled={!isCardVisible || familyCards.length === 0}
          >
            <DownloadSimple color="#fff" weight="bold" size={14} />
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.scanText}
            >
              {t("card.downloadCard", "Download")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.scanButton, (!isCardVisible || familyCards.length === 0) && { opacity: 0.4 }]}
            activeOpacity={0.8}
            onPress={handleEmailCard}
            disabled={!isCardVisible || familyCards.length === 0}
          >
            <EnvelopeSimple color="#fff" weight="bold" size={14} />
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.scanText}
            >
              {t("card.emailCard", "Email")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#06B6D4" />
          <Text style={styles.loadingText}>{t("card.loading")}</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{t("card.loadError")}</Text>
        </View>
      ) : isCardPending ? (
        <View style={styles.statusCard}>
          {/* Header stripe */}
          <View style={styles.statusCardHeader}>
            <Clock size={28} color="#FFFFFF" weight="fill" />
            <Text style={styles.statusCardHeaderText}>
              {t("card.underReview", "Under Review")}
            </Text>
          </View>

          <View style={styles.statusCardBody}>
            {/* MHF org name */}
            <Text style={styles.orgName}>MUJTABA HELPING FOUNDATION</Text>
            <View style={styles.dividerLine} />

            <Text style={styles.statusMainMsg}>
              {t("card.pendingReviewMsg", "is reviewing your details")}
            </Text>
            <Text style={styles.statusSubMsg}>
              {t(
                "card.pendingReviewSubMsg",
                "Once your card is verified, it will be approved and become visible here automatically. No action needed from your side.",
              )}
            </Text>

            <View style={styles.stepsList}>
              <View style={styles.stepRow}>
                <View style={[styles.stepDot, { backgroundColor: '#10B981' }]} />
                <Text style={styles.stepText}>
                  {t("card.stepApplicationSubmitted", "Application submitted")}
                </Text>
              </View>
              <View style={styles.stepConnector} />
              <View style={styles.stepRow}>
                <View style={[styles.stepDot, { backgroundColor: '#F59E0B' }]} />
                <Text style={[styles.stepText, { color: '#92400E', fontWeight: '700' }]}>
                  {t("card.stepAdminVerification", "Admin verification in progress")}
                </Text>
              </View>
              <View style={styles.stepConnector} />
              <View style={styles.stepRow}>
                <View style={[styles.stepDot, { backgroundColor: '#CBD5E1' }]} />
                <Text style={[styles.stepText, { color: '#94A3B8' }]}>
                  {t("card.stepCardActivated", "Card activated")}
                </Text>
              </View>
            </View>

            <View style={styles.pendingBadge}>
              <Clock size={12} color="#92400E" weight="fill" />
              <Text style={styles.pendingBadgeText}>
                {t("card.pendingApproval", "Pending Approval")}
              </Text>
            </View>
          </View>
        </View>
      ) : isCardRejected ? (
        <View style={styles.statusCard}>
          {/* Header stripe */}
          <View style={[styles.statusCardHeader, { backgroundColor: '#DC2626' }]}>
            <Warning size={28} color="#FFFFFF" weight="fill" />
            <Text style={styles.statusCardHeaderText}>
              {t("card.applicationNotApproved", "Application Not Approved")}
            </Text>
          </View>

          <View style={styles.statusCardBody}>
            <Text style={[styles.orgName, { color: '#DC2626' }]}>MUJTABA HELPING FOUNDATION</Text>
            <View style={[styles.dividerLine, { backgroundColor: '#FECACA' }]} />

            <Text style={[styles.statusMainMsg, { color: '#7F1D1D' }]}>
              {t("card.rejectedMsg", "was unable to approve your card")}
            </Text>
            <Text style={styles.statusSubMsg}>
              {t(
                "card.rejectedSubMsg",
                "Please contact us for more information about your application status.",
              )}
            </Text>

            {/* Contact buttons */}
            <View style={styles.contactSection}>
              <Text style={styles.contactLabel}>
                {t("card.getInTouch", "Get in touch with us")}
              </Text>

              <TouchableOpacity
                style={styles.contactBtn}
                onPress={() => Linking.openURL(`tel:${MHF.MHF_WHATSAPP_NUMBER_E164}`)}
                activeOpacity={0.75}
              >
                <Phone size={18} color="#1E3A8A" weight="fill" />
                <View style={styles.contactBtnText}>
                  <Text style={styles.contactBtnTitle}>
                    {t("card.callUs", "Call Us")}
                  </Text>
                  <Text style={styles.contactBtnValue}>{MHF.MHF_WHATSAPP_DISPLAY_NUMBER}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.contactBtn}
                onPress={() => Linking.openURL(`mailto:${MHF.MHF_CC_EMAIL}`)}
                activeOpacity={0.75}
              >
                <EnvelopeSimple size={18} color="#1E3A8A" weight="fill" />
                <View style={styles.contactBtnText}>
                  <Text style={styles.contactBtnTitle}>
                    {t("card.emailUs", "Email Us")}
                  </Text>
                  <Text style={styles.contactBtnValue}>{MHF.MHF_CC_EMAIL}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.contactBtn, { backgroundColor: '#DCFCE7', borderColor: '#BBF7D0' }]}
                onPress={() => Linking.openURL(`https://wa.me/${MHF.MHF_WHATSAPP_NUMBER_E164}`)}
                activeOpacity={0.75}
              >
                <WhatsappLogo size={18} color="#15803D" weight="fill" />
                <View style={styles.contactBtnText}>
                  <Text style={[styles.contactBtnTitle, { color: '#14532D' }]}>
                    {t("card.whatsapp", "WhatsApp")}
                  </Text>
                  <Text style={[styles.contactBtnValue, { color: '#15803D' }]}>{MHF.MHF_WHATSAPP_DISPLAY_NUMBER}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : isCardExpired ? (
        <View style={styles.statusCard}>
          <View style={[styles.statusCardHeader, { backgroundColor: '#EA580C' }]}>
            <XCircle size={28} color="#FFFFFF" weight="fill" />
            <Text style={styles.statusCardHeaderText}>
              {t("card.cardExpiredTitle", "Card Expired")}
            </Text>
          </View>

          <View style={styles.statusCardBody}>
            <Text style={[styles.orgName, { color: '#EA580C' }]}>MUJTABA HELPING FOUNDATION</Text>
            <View style={[styles.dividerLine, { backgroundColor: '#FED7AA' }]} />

            <Text style={[styles.statusMainMsg, { color: '#7C2D12' }]}>
              {t("card.expiredMsg", "Your health card has expired")}
            </Text>
            <Text style={styles.statusSubMsg}>
              {t(
                "card.expiredSubMsg",
                "Renew your card to continue enjoying health benefits. After payment, our team will verify and activate your card.",
              )}
            </Text>

            <View style={[styles.pendingBadge, { borderColor: '#FED7AA', backgroundColor: '#FFF7ED' }]}>
              <XCircle size={12} color="#9A3412" weight="fill" />
              <Text style={[styles.pendingBadgeText, { color: '#9A3412' }]}>
                {t("card.renewalRequired", "Renewal Required")}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.renewCardBtn}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate('Payment', {
                  customerId:
                    dashboardData?.health_card?.customer_id ??
                    dashboardData?.customer?.id,
                  healthCardId: dashboardData?.health_card?.id,
                  cardType:
                    (dashboardData?.health_card?.type || 'individual') as
                      | 'individual'
                      | 'family',
                  purpose: 'renewal' as const,
                })
              }
            >
              <Text style={styles.renewCardBtnText}>
                {t("card.renewCardNow", "Renew Card Now")}
              </Text>
            </TouchableOpacity>

            <Text style={styles.renewCardHint}>
              {t(
                "card.renewalHint",
                "After payment, your renewal will be reviewed and approved by our team.",
              )}
            </Text>
          </View>
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
          <View style={styles.verifiedBadgeRow}>
            <ShieldCheck size={14} color="#059669" weight="fill" />
            <Text style={styles.verifiedBadgeText}>Verified by Mujtaba Helping Foundation</Text>
          </View>
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

      <View style={[styles.infoCard, { marginTop: 14 }]}>
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

      <View style={[styles.infoCard, { marginTop: 14 }]}>
        <Text style={styles.infoTitle}>{t("card.howToUse.title")}</Text>
        {steps.map((s, i) => (
          <View style={styles.howToUseRow} key={i}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>
                {t("common.step", `Step ${i + 1}`)}
              </Text>
            </View>
            <Text style={styles.howToUseText}>{s}</Text>
          </View>
        ))}
        <View style={styles.howToUseNoteBox}>
          <Text style={styles.howToUseNoteText}>{howToUseNote}</Text>
        </View>
      </View>

      {/* PDF Preview Modal */}
      <Modal
        visible={pdfPreview.visible}
        animationType="slide"
        onRequestClose={() => setPdfPreview({ visible: false, pdfPath: null })}
      >
        <View style={styles.pdfPreviewPage}>
          <View style={styles.pdfPreviewHeader}>
            <TouchableOpacity
              style={styles.pdfPreviewClose}
              onPress={() => setPdfPreview({ visible: false, pdfPath: null })}
            >
              <Text style={styles.pdfPreviewCloseText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.pdfPreviewTitle}>
              {t("card.pdfPreviewTitle", "PDF Preview")}
            </Text>
            <TouchableOpacity
              style={styles.pdfPreviewDownloadBtn}
              onPress={handleSharePdf}
            >
              <DownloadSimple color="#fff" weight="bold" size={16} />
              <Text style={styles.pdfPreviewDownloadText}>
                {t("card.download", "Download")}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.pdfPreviewContent}
            showsVerticalScrollIndicator={false}
          >
            {familyCards.map((card, i) => (
              <View key={i} style={styles.pdfPreviewCard}>
                <FamilyCard
                  data={card}
                  image={require("../../assets/images/card.png")}
                />
                {(card.phone || card.email || card.address || card.city || card.gender) && (
                  <View style={styles.pdfPreviewContactBox}>
                    <Text style={styles.pdfPreviewContactTitle}>
                      {t("card.memberContactDetails", "Member Contact Details")}
                    </Text>
                    {card.phone ? (
                      <View style={styles.pdfPreviewContactRow}>
                        <Text style={styles.pdfPreviewContactLabel}>
                          {t("common.phone", "Phone")}
                        </Text>
                        <Text style={styles.pdfPreviewContactValue}>{card.phone}</Text>
                      </View>
                    ) : null}
                    {card.email ? (
                      <View style={styles.pdfPreviewContactRow}>
                        <Text style={styles.pdfPreviewContactLabel}>
                          {t("common.email")}
                        </Text>
                        <Text style={styles.pdfPreviewContactValue}>{card.email}</Text>
                      </View>
                    ) : null}
                    {(card.address || card.city) ? (
                      <View style={styles.pdfPreviewContactRow}>
                        <Text style={styles.pdfPreviewContactLabel}>
                          {t("common.address", "Address")}
                        </Text>
                        <Text style={styles.pdfPreviewContactValue}>
                          {[card.address, card.city].filter(Boolean).join(", ")}
                        </Text>
                      </View>
                    ) : null}
                    {card.gender ? (
                      <View style={styles.pdfPreviewContactRow}>
                        <Text style={styles.pdfPreviewContactLabel}>
                          {t("common.gender", "Gender")}
                        </Text>
                        <Text style={styles.pdfPreviewContactValue}>{card.gender}</Text>
                      </View>
                    ) : null}
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>

      <Modal
        visible={emailSheetVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEmailSheetVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.emailSheet}>
            <View style={styles.emailSheetHeader}>
              <Text style={styles.emailSheetTitle}>
                {t("card.selectProvider", "Select Provider")}
              </Text>
              <TouchableOpacity onPress={() => setEmailSheetVisible(false)}>
                <Text style={styles.emailSheetClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.searchWrap}>
              <TextInput
                style={styles.searchInput}
                placeholder={t("card.searchProviders", "Search providers")}
                value={providerQuery}
                onChangeText={setProviderQuery}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryRow}
            >
              {providerCategories.map((c) => (
                <TouchableOpacity
                  key={c.key}
                  style={[
                    styles.categoryChip,
                    activeProviderCategory === c.key && styles.categoryChipActive,
                  ]}
                  onPress={() => setActiveProviderCategory(c.key)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      activeProviderCategory === c.key &&
                        styles.categoryChipTextActive,
                    ]}
                  >
                    {c.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.providerListWrap}>
              {providersLoading ? (
                <View style={styles.providerStateContainer}>
                  <ActivityIndicator size="small" color="#06B6D4" />
                  <Text style={styles.providerStateText}>
                    {t("card.loadingProviders", "Loading providers...")}
                  </Text>
                </View>
              ) : providersError ? (
                <View style={styles.providerStateContainer}>
                  <Text style={styles.providerErrorText}>
                    {t("card.providerLoadError", "Failed to load providers")}
                  </Text>
                  <TouchableOpacity
                    style={styles.retryBtn}
                    onPress={() => refetchProviders()}
                  >
                    <Text style={styles.retryBtnText}>{t("common.retry", "Retry")}</Text>
                  </TouchableOpacity>
                </View>
              ) : filteredProviders.length === 0 ? (
                <View style={styles.providerStateContainer}>
                  <Text style={styles.providerStateText}>
                    {t("card.noProviders", "No providers found")}
                  </Text>
                </View>
              ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                  {filteredProviders.map((provider: any, index: number) => {
                    const canEmail = !!provider?.email;
                    return (
                      <TouchableOpacity
                        key={String(provider?.id ?? provider?.provider_id ?? index)}
                        style={styles.providerRow}
                        onPress={() => canEmail && handleComposeProviderEmail(provider)}
                      >
                        <View style={styles.providerAvatar}>
                          <Text style={styles.providerAvatarText}>
                            {provider.provider_name?.charAt(0) || "P"}
                          </Text>
                        </View>
                        <View style={styles.providerMeta}>
                          <Text style={styles.providerName} numberOfLines={1}>
                            {provider.provider_name || t("services.provider.unknown")}
                          </Text>
                          <Text style={styles.providerAddress} numberOfLines={1}>
                            {provider.address || t("services.provider.noAddress")}
                          </Text>
                          <Text style={styles.providerEmail} numberOfLines={1}>
                            {provider.email || t("card.noProviderEmail", "Email not available")}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => canEmail && handleComposeProviderEmail(provider)}
                          disabled={!canEmail}
                          style={[
                            styles.providerEmailAction,
                            !canEmail && styles.providerEmailActionDisabled,
                          ]}
                        >
                          <EnvelopeSimple color="#0891B2" weight="fill" size={18} />
                        </TouchableOpacity>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
      <PTToast
        visible={toastState.visible}
        message={toastState.message}
        type={toastState.type}
        onClose={() => setToastState((prev) => ({ ...prev, visible: false }))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F6F7FB" },
  content: { padding: 16, paddingBottom: 40 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    rowGap: 8,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E3A8A",
    flexShrink: 1,
    marginRight: 8,
  },
  actionButtons: { flexDirection: "row", gap: 8, flexShrink: 0 },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#06B6D4",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
  },
  scanText: { color: "#fff", marginLeft: 6, fontSize: 12, fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  emailSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 20,
    maxHeight: "82%",
  },
  emailSheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  emailSheetTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  emailSheetClose: { fontSize: 20, color: "#6B7280", fontWeight: "700" },
  searchWrap: { marginBottom: 10 },
  searchInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#111827",
  },
  categoryRow: { gap: 8, paddingBottom: 8 },
  categoryChip: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#fff",
  },
  categoryChipActive: {
    borderColor: "#06B6D4",
    backgroundColor: "#E6FFFB",
  },
  categoryChipText: { color: "#374151", fontSize: 12, fontWeight: "600" },
  categoryChipTextActive: { color: "#0891B2" },
  providerListWrap: {
    minHeight: 220,
    maxHeight: 340,
    marginTop: 8,
    marginBottom: 12,
  },
  providerStateContainer: {
    minHeight: 160,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  providerStateText: { color: "#6B7280", fontSize: 13 },
  providerErrorText: { color: "#DC2626", fontSize: 13, fontWeight: "600" },
  retryBtn: {
    marginTop: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  retryBtnText: { color: "#374151", fontWeight: "700", fontSize: 12 },
  providerRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    gap: 10,
    backgroundColor: "#fff",
  },
  providerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
  },
  providerAvatarText: { color: "#1E3A8A", fontWeight: "700", fontSize: 14 },
  providerMeta: { flex: 1 },
  providerEmailAction: {
    marginLeft: 8,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E6FFFB",
  },
  providerEmailActionDisabled: {
    opacity: 0.35,
  },
  providerName: { color: "#0F172A", fontWeight: "700", fontSize: 13 },
  providerAddress: { color: "#6B7280", fontSize: 12, marginTop: 2 },
  providerEmail: { color: "#0891B2", fontSize: 12, marginTop: 2 },
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
  statusCard: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  statusCardHeader: {
    backgroundColor: "#F59E0B",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 10,
  },
  statusCardHeaderText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  statusCardBody: {
    padding: 20,
    gap: 10,
    alignItems: "center",
  },
  orgName: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1E3A8A",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  dividerLine: {
    height: 1,
    backgroundColor: "#FDE68A",
    width: "80%",
    marginVertical: 4,
  },
  statusMainMsg: {
    fontSize: 16,
    fontWeight: "700",
    color: "#78350F",
    textAlign: "center",
  },
  statusSubMsg: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  stepsList: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    marginTop: 4,
    gap: 0,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 4,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  stepConnector: {
    width: 2,
    height: 14,
    backgroundColor: "#E2E8F0",
    marginLeft: 4,
  },
  stepText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
  },
  pendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FDE68A",
    marginTop: 4,
  },
  pendingBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#92400E",
  },
  contactSection: {
    width: "100%",
    gap: 8,
    marginTop: 6,
  },
  contactLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94A3B8",
    textAlign: "center",
    marginBottom: 2,
  },
  contactBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  contactBtnText: {
    flex: 1,
  },
  contactBtnTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E40AF",
  },
  contactBtnValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E3A8A",
    marginTop: 1,
  },
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
  howToUseRow: { marginBottom: 12 },
  stepNumber: {
    backgroundColor: "#F3F4F6",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 6,
  },
  stepNumberText: { color: "#374151", fontWeight: "600" },
  howToUseText: { color: "#6B7280", fontSize: 13 },
  howToUseNoteBox: {
    marginTop: 4,
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
    borderRadius: 8,
    padding: 10,
  },
  howToUseNoteText: { color: "#92400E", fontSize: 12, fontWeight: "600" },
  renewCardBtn: {
    marginTop: 14,
    backgroundColor: "#EA580C",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: "center",
    width: "100%",
  },
  renewCardBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 0.3,
  },
  renewCardHint: {
    fontSize: 12,
    color: "#9A3412",
    textAlign: "center",
    lineHeight: 18,
    marginTop: 8,
    paddingHorizontal: 8,
  },
  smallHeader: {
    marginTop: 18,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  familyScroll: { marginTop: 8, marginHorizontal: -16 },
  familyCardPage: { paddingHorizontal: 16 },
  verifiedBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    marginTop: 12,
    marginBottom: 4,
    backgroundColor: "#D1FAE5",
    alignSelf: "center",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  verifiedBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#065F46",
  },

  // PDF Preview Modal
  pdfPreviewPage: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },
  pdfPreviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1E3A8A",
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop: 16,
  },
  pdfPreviewClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  pdfPreviewCloseText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  pdfPreviewTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
  },
  pdfPreviewDownloadBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#06B6D4",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pdfPreviewDownloadText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  pdfPreviewContent: {
    padding: 16,
    paddingBottom: 40,
  },
  pdfPreviewCard: {
    marginBottom: 20,
  },
  pdfPreviewContactBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  pdfPreviewContactTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 10,
  },
  pdfPreviewContactRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 6,
  },
  pdfPreviewContactLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    width: 60,
  },
  pdfPreviewContactValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
});
