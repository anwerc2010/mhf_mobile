import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Modal,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Linking,
} from "react-native";
import {
  CaretDown,
  CaretRight,
  Info,
  Eye,
  Target,
  Users,
  UsersThree,
  Heart,
  Phone,
  Sparkle,
  ShieldCheck,
  HandHeart,
  TrendUp,
  MapPin,
  EnvelopeSimple,
  WhatsappLogo,
} from "phosphor-react-native";
import { useNavigation } from "@react-navigation/native";
import { useAppSelector, useAppDispatch } from "../store/hook";
import { clearAuth, useGetDashboardDetailsQuery } from "@psi/shared-api";
import { useTranslation } from "react-i18next";
import { APP_CONFIG } from "../constants/config";

const { width } = Dimensions.get("window");

const ABOUT_IMPACT_STATS = [
  {
    key: "families",
    icon: Users,
    title: "37,000 Families Impacted",
    subtitle: "Help and hope delivered across communities",
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  {
    key: "perFamily",
    icon: HandHeart,
    title: "2,500 per Family / Year",
    subtitle: "Average annual support improving daily life",
    color: "#10B981",
    bg: "#ECFDF5",
  },
  {
    key: "annualBenefit",
    icon: TrendUp,
    title: "9.25 Crores Annual Benefit",
    subtitle: "Direct value reaching people who need it most",
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
];

export default function ProfileScreen() {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<{ [k: string]: boolean }>({});
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { data: dashboardData } = useGetDashboardDetailsQuery();
  const whatsappPhoneNumber = APP_CONFIG.MHF_WHATSAPP_NUMBER_E164;

  const toggle = (k: string) =>
    setExpanded((prev) => ({ ...prev, [k]: !prev[k] }));

  const handleLogout = () => {
    Alert.alert(
      t("profile.logout"),
      t("profile.logoutConfirm"),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("profile.logout"),
          style: "destructive",
          onPress: () => {
            dispatch(clearAuth());
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handleEditProfile = () => {
    // Profile is rendered inside BottomTabs while EditProfile is in parent stack.
    const parentNavigator = navigation.getParent?.();
    if (parentNavigator?.navigate) {
      parentNavigator.navigate("EditProfile");
      return;
    }
    navigation.navigate("EditProfile");
  };

  const handleOpenWebsite = async () => {
    const websiteUrl = APP_CONFIG.MHF_WEBSITE_URL;
    try {
      const canOpen = await Linking.canOpenURL(websiteUrl);
      if (canOpen) {
        await Linking.openURL(websiteUrl);
      } else {
        Alert.alert("Error", "Unable to open website");
      }
    } catch {
      Alert.alert("Error", "Unable to open website");
    }
  };

  const handleOpenWhatsapp = async () => {
    const initialMessage = encodeURIComponent(
      t("profile.whatsappInitialMessage", "Hello MHF team, I need support."),
    );
    const appUrl = `whatsapp://send?phone=${whatsappPhoneNumber}&text=${initialMessage}`;
    const webUrl = `https://wa.me/${whatsappPhoneNumber}?text=${initialMessage}`;

    try {
      const canOpenWhatsapp = await Linking.canOpenURL(appUrl);

      if (canOpenWhatsapp) {
        await Linking.openURL(appUrl);
        return;
      }

      await Linking.openURL(webUrl);
    } catch {
      Alert.alert(
        t("common.error", "Error"),
        t(
          "profile.whatsappOpenError",
          "Unable to open WhatsApp chat right now.",
        ),
      );
    }
  };

  // Get initials from fullname
  const getInitials = (name: string | undefined) => {
    if (!name) return "U";
    const names = name.split(" ");
    return names.length >= 2
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return t("home.notAvailable");
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Get member since year
  const getMemberSinceYear = (dateString: string | undefined) => {
    if (!dateString) return t("home.notAvailable");
    return new Date(dateString).getFullYear();
  };

  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>{t("profile.title")}</Text>

        {/* Full-screen image viewer modal */}
        {user?.image ? (
          <Modal
            visible={imageModalVisible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={() => setImageModalVisible(false)}
          >
            <StatusBar backgroundColor="#000" barStyle="light-content" />
            <SafeAreaView style={styles.modalContainer}>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setImageModalVisible(false)}
                activeOpacity={0.8}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.modalCloseIcon}>✕</Text>
              </TouchableOpacity>
              <Image
                source={{ uri: user.image }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            </SafeAreaView>
          </Modal>
        ) : null}

        <View style={styles.profileCard}>
          <View style={styles.profileTopRow}>
            {user?.image ? (
              <TouchableOpacity
                onPress={() => setImageModalVisible(true)}
                activeOpacity={0.85}
                style={styles.avatar}
              >
                <Image
                  source={{ uri: user.image }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarInitials}>
                  {getInitials(user?.fullname)}
                </Text>
              </View>
            )}
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.name}>
                {user?.fullname || t("profile.user")}
              </Text>
              <Text style={styles.memberSince}>
                {t("profile.memberSince")}{" "}
                {getMemberSinceYear(user?.created_at)}
              </Text>
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>
                  {user?.status || t("profile.activeMember")}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.infoRows}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>{t("profile.memberId")}</Text>
              <Text style={styles.rowValue}>
                {user?.id || t("home.notAvailable")}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>{t("profile.bloodGroup")}</Text>
              <Text style={styles.rowValue}>
                {user?.blood_group || t("home.notAvailable")}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>{t("profile.dateOfBirth")}</Text>
              <Text style={styles.rowValue}>
                {formatDate(user?.date_of_birth)}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>{t("profile.contact")}</Text>
              <Text style={styles.rowValue}>
                {user?.phone || t("home.notAvailable")}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>{t("profile.email")}</Text>
              <Text style={styles.rowValue}>
                {user?.email || t("home.notAvailable")}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>
                {t("profile.joiningDate", "Joining Date")}
              </Text>
              <Text style={styles.rowValue}>
                {formatDate(user?.joining_date ?? undefined)}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>
                {t("profile.cardNumber", "Card Number")}
              </Text>
              <Text style={styles.rowValue}>
                {dashboardData?.health_card?.membership_id ||
                  user?.card_number ||
                  t("home.notAvailable")}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.medCard}>
          <Text style={styles.cardTitle}>{t("profile.medicalInfo")}</Text>
          <View style={styles.medRow}>
            <Text style={styles.medLabel}>{t("profile.allergies")}</Text>
            <Text style={styles.medValue}>
              {user?.allergies || t("home.notAvailable")}
            </Text>
          </View>
          <View style={styles.medRow}>
            <Text style={styles.medLabel}>
              {t("profile.chronicConditions")}
            </Text>
            <Text style={styles.medValue}>
              {user?.chronic_conditions || t("home.notAvailable")}
            </Text>
          </View>
          <View style={styles.medRow}>
            <Text style={styles.medLabel}>{t("profile.emergencyContact")}</Text>
            <Text style={styles.medValue}>
              {user?.emergency_contact_number || t("home.notAvailable")}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          activeOpacity={0.9}
          onPress={handleEditProfile}
        >
          <Text style={styles.editButtonText}>
            {t("profile.editProfile", "Edit Profile")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.9}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>{t("profile.logout")}</Text>
        </TouchableOpacity>

        <View style={styles.aboutCard}>
          <Text style={styles.cardTitle}>{t("profile.about")}</Text>

          {[
            {
              key: "about",
              title: t("profile.aboutMHF"),
              icon: Info,
              bg: "#EFF6FF",
              color: "#075985",
            },
            {
              key: "vision",
              title: t("profile.ourVision"),
              icon: Eye,
              bg: "#ECFDF5",
              color: "#10B981",
            },
            {
              key: "mission",
              title: t("profile.ourMission"),
              icon: Target,
              bg: "#EFF6FF",
              color: "#2563EB",
            },
            {
              key: "board",
              title: t("profile.ourBoard"),
              icon: Users,
              bg: "#FDF2FE",
              color: "#7C3AED",
            },
            {
              key: "team",
              title: t("profile.ourTeam"),
              icon: UsersThree,
              bg: "#FFF7ED",
              color: "#FB923C",
            },
            // {
            //   key: "volunteers",
            //   title: t("profile.ourVolunteers"),
            //   icon: Heart,
            //   bg: "#FEF2F2",
            //   color: "#F43F5E",
            // },
            {
              key: "contact",
              title: t("profile.contactInfo"),
              icon: Phone,
              bg: "#F0F9FF",
              color: "#0369A1",
            },
            {
              key: "whatsapp",
              title: t("profile.whatsapp", "WhatsApp"),
              icon: WhatsappLogo,
              bg: "#ECFDF5",
              color: "#16A34A",
            },
          ].map((item) => {
            const Icon = item.icon as any;
            return (
              <View key={item.key}>
                <TouchableOpacity
                  style={styles.aboutItem}
                  onPress={() => toggle(item.key)}
                  activeOpacity={0.85}
                >
                  <View style={styles.aboutItemInner}>
                    <View
                      style={[styles.iconCircle, { backgroundColor: item.bg }]}
                    >
                      <Icon color={item.color} size={18} />
                    </View>
                    <Text style={styles.aboutItemTitle}>{item.title}</Text>
                  </View>
                  {expanded[item.key] ? (
                    <CaretDown size={18} color="#0F172A" />
                  ) : (
                    <CaretRight size={18} color="#9CA3AF" />
                  )}
                </TouchableOpacity>

                {item.key === "about" && expanded[item.key] && (
                  <View style={styles.aboutDropdownCard}>
                    <View style={styles.aboutHeadingRow}>
                      <View
                        style={[
                          styles.aboutHeadingIcon,
                          { backgroundColor: "#EFF6FF" },
                        ]}
                      >
                        <Sparkle size={18} color="#1D4ED8" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.aboutHeading}>About Us</Text>
                        <Text style={styles.aboutSubheading}>
                          A Personal Story That Turned Grief Into a Mission of
                          Health and Hope
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.aboutParagraph}>
                      Founded in 2018 by Mr. SM Mustafa Ahmed, Mujtaba Helping
                      Foundation (MHF) was born from a deeply personal tragedy
                      that changed one family forever.
                    </Text>
                    <Text style={styles.aboutParagraph}>
                      Mr. Ahmed lost his 8-year-old son in a tragic
                      electrocution accident, a pain no parent should ever face.
                      From that heartbreak came a powerful promise: to protect
                      other families from preventable loss.
                    </Text>
                    <Text style={styles.aboutParagraphLast}>
                      Today, MHF works to make healthcare affordable and
                      accessible for underprivileged and middle-class families
                      so that no one is left behind due to lack of access,
                      support, or awareness.
                    </Text>

                    <View style={styles.promiseRow}>
                      <ShieldCheck size={18} color="#047857" />
                      <Text style={styles.promiseText}>
                        Our mission is simple: protect lives, restore dignity,
                        and create healthier futures for every family we can
                        reach.
                      </Text>
                    </View>

                    {ABOUT_IMPACT_STATS.map((stat) => {
                      const StatIcon = stat.icon as any;
                      return (
                        <View key={stat.key} style={styles.statRow}>
                          <View
                            style={[
                              styles.statIconWrap,
                              { backgroundColor: stat.bg },
                            ]}
                          >
                            <StatIcon size={18} color={stat.color} />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.statTitle}>{stat.title}</Text>
                            <Text style={styles.statSubtitle}>
                              {stat.subtitle}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )}

                {item.key === "mission" && expanded[item.key] && (
                  <View style={styles.aboutDropdownCard}>
                    <View style={styles.aboutHeadingRow}>
                      <View
                        style={[
                          styles.aboutHeadingIcon,
                          { backgroundColor: "#EFF6FF" },
                        ]}
                      >
                        <Target size={18} color="#2563EB" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.aboutHeading}>OUR MISSION</Text>
                        <Text style={styles.aboutSubheading}>
                          Building health equity through affordable and
                          accessible care
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.aboutParagraphLast}>
                      To make healthcare accessible and affordable for
                      underprivileged families, reducing financial burdens and
                      promoting health equity.
                    </Text>
                  </View>
                )}

                {item.key === "vision" && expanded[item.key] && (
                  <View style={styles.aboutDropdownCard}>
                    <View style={styles.aboutHeadingRow}>
                      <View
                        style={[
                          styles.aboutHeadingIcon,
                          { backgroundColor: "#ECFDF5" },
                        ]}
                      >
                        <Eye size={18} color="#10B981" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.aboutHeading}>OUR VISION</Text>
                        <Text style={styles.aboutSubheading}>
                          Inclusive healthcare for every individual and family
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.aboutParagraphLast}>
                      To build a healthcare ecosystem where no one suffers due
                      to inaccessibility or lack of resources.
                    </Text>
                  </View>
                )}

                {item.key === "team" && expanded[item.key] && (
                  <View style={styles.aboutDropdownCard}>
                    <View style={styles.aboutHeadingRow}>
                      <View
                        style={[
                          styles.aboutHeadingIcon,
                          { backgroundColor: "#FFF7ED" },
                        ]}
                      >
                        <UsersThree size={18} color="#EA580C" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.aboutHeading}>What We Do?</Text>
                        <Text style={styles.aboutSubheading}>Our Services</Text>
                      </View>
                    </View>

                    <Text style={styles.aboutParagraphLast}>
                      We provide essential humanitarian services, including
                      healthcare, education for underprivileged children,
                      emergency relief, food and blanket distribution, and
                      orphan care. Our mission is to support vulnerable
                      communities with compassion and commitment, ensuring
                      access to vital resources and a better quality of life for
                      those in need.
                    </Text>
                  </View>
                )}

                {item.key === "board" && expanded[item.key] && (
                  <View style={styles.aboutDropdownCard}>
                    <View style={styles.aboutHeadingRow}>
                      <View
                        style={[
                          styles.aboutHeadingIcon,
                          { backgroundColor: "#F5F3FF" },
                        ]}
                      >
                        <Users size={18} color="#7C3AED" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.aboutHeading}>OUR BOARD</Text>
                        <Text style={styles.aboutSubheading}>
                          A foundation built on service and community impact
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.aboutParagraph}>
                      MHF was officially established in 2015 at Khairtabad,
                      Hyderabad, Telangana.
                    </Text>
                    <Text style={styles.aboutParagraph}>
                      The aim of creating this organization is to help mankind
                      with every possible effort within our hands.
                    </Text>
                    <Text style={styles.aboutParagraphLast}>
                      We focus on making the maximum meaningful contribution to
                      the community. Our members and volunteers carry the
                      momentum that drives lasting change for the cause.
                    </Text>
                  </View>
                )}

                {item.key === "contact" && expanded[item.key] && (
                  <View style={styles.aboutDropdownCard}>
                    <View style={styles.aboutHeadingRow}>
                      <View
                        style={[
                          styles.aboutHeadingIcon,
                          { backgroundColor: "#E0F2FE" },
                        ]}
                      >
                        <Phone size={18} color="#0369A1" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.aboutHeading}>Contact</Text>
                        <Text style={styles.aboutSubheading}>
                          Reach us for support, services, and partnerships
                        </Text>
                      </View>
                    </View>

                    <View style={styles.contactRow}>
                      <View
                        style={[
                          styles.contactIconWrap,
                          { backgroundColor: "#EFF6FF" },
                        ]}
                      >
                        <MapPin size={16} color="#1D4ED8" />
                      </View>
                      <Text style={styles.contactText}>
                        #6-3-1240/219/4, 3rd Floor, M.S Maqtha, Raj Bhavan,
                        Somajiguda, Hyderabad, Telangana, India - 500082
                      </Text>
                    </View>

                    <View style={styles.contactRow}>
                      <View
                        style={[
                          styles.contactIconWrap,
                          { backgroundColor: "#ECFDF5" },
                        ]}
                      >
                        <EnvelopeSimple size={16} color="#047857" />
                      </View>
                      <Text style={styles.contactText}>
                        mujtabahelpingfoundation@gmail.com
                      </Text>
                    </View>

                    <View style={styles.contactRowLast}>
                      <View
                        style={[
                          styles.contactIconWrap,
                          { backgroundColor: "#FEF2F2" },
                        ]}
                      >
                        <Phone size={16} color="#DC2626" />
                      </View>
                      <Text style={styles.contactText}>
                        {APP_CONFIG.MHF_WHATSAPP_DISPLAY_NUMBER}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.websiteRow}
                      activeOpacity={0.8}
                      onPress={handleOpenWebsite}
                    >
                      <Text style={styles.websiteLinkText}>
                        Visit Our Website
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {item.key === "whatsapp" && expanded[item.key] && (
                  <View style={styles.aboutDropdownCard}>
                    <View style={styles.aboutHeadingRow}>
                      <View
                        style={[
                          styles.aboutHeadingIcon,
                          { backgroundColor: "#DCFCE7" },
                        ]}
                      >
                        <WhatsappLogo size={18} color="#16A34A" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.aboutHeading}>
                          {t("profile.whatsapp", "WhatsApp")}
                        </Text>
                        <Text style={styles.aboutSubheading}>
                          {t(
                            "profile.whatsappSubheading",
                            "Chat with us directly on WhatsApp",
                          )}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.contactRow}>
                      <View
                        style={[
                          styles.contactIconWrap,
                          { backgroundColor: "#ECFDF5" },
                        ]}
                      >
                        <Phone size={16} color="#16A34A" />
                      </View>
                      <Text style={styles.contactText}>
                        {APP_CONFIG.MHF_WHATSAPP_DISPLAY_NUMBER}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.whatsappButton}
                      activeOpacity={0.85}
                      onPress={handleOpenWhatsapp}
                    >
                      <WhatsappLogo size={16} color="#FFFFFF" />
                      <Text style={styles.whatsappButtonText}>
                        {t("profile.openWhatsapp", "Open WhatsApp Chat")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F6F7FB" },
  content: { padding: 16, paddingBottom: 40 },
  header: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  profileTopRow: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarInitials: { color: "#fff", fontWeight: "700", fontSize: 22 },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  // Full-screen image viewer
  modalContainer: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  modalClose: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCloseIcon: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 20,
  },
  modalImage: {
    width,
    height: width,
  },
  name: { fontSize: 16, fontWeight: "700", color: "#0F172A" },
  memberSince: { color: "#6B7280", marginTop: 4 },
  activeBadge: {
    marginTop: 8,
    alignSelf: "flex-start",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadgeText: { color: "#065F46", fontWeight: "700", fontSize: 12 },
  infoRows: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#EEF2F7",
    paddingTop: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  rowLabel: { color: "#6B7280", width: (width - 64) * 0.45 },
  rowValue: {
    color: "#0F172A",
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
  },

  medCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: { fontWeight: "700", color: "#0F172A", marginBottom: 8 },
  medRow: { marginBottom: 8 },
  medLabel: { color: "#6B7280", fontSize: 13 },
  medValue: { color: "#0F172A", fontWeight: "600", marginTop: 4 },

  requestButton: {
    backgroundColor: "#10B981",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  requestButtonText: { color: "#fff", fontWeight: "700" },

  editButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E6EEF8",
    marginBottom: 12,
  },
  editButtonText: { color: "#0F172A", fontWeight: "700" },

  logoutButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FEE2E2",
    marginBottom: 12,
  },
  logoutButtonText: { color: "#DC2626", fontWeight: "700" },

  aboutCard: { backgroundColor: "#fff", borderRadius: 12, padding: 12 },
  aboutItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  aboutItemInner: { flexDirection: "row", alignItems: "center" },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  aboutItemTitle: { marginLeft: 12, color: "#0F172A", fontWeight: "600" },
  aboutDropdownCard: {
    marginTop: 8,
    marginHorizontal: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F8FAFC",
    padding: 12,
  },
  aboutHeadingRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  aboutHeadingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  aboutHeading: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "700",
  },
  aboutSubheading: {
    color: "#475569",
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },
  aboutParagraph: {
    color: "#334155",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 8,
  },
  aboutParagraphLast: {
    color: "#334155",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 10,
  },
  promiseRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#ECFDF5",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    gap: 8,
  },
  promiseText: {
    flex: 1,
    color: "#065F46",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 10,
    marginBottom: 8,
  },
  statIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  statTitle: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "700",
  },
  statSubtitle: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 2,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  contactRowLast: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  contactIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginTop: 1,
  },
  contactText: {
    flex: 1,
    color: "#334155",
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "500",
  },
  websiteRow: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
  },
  websiteLinkText: {
    color: "#1D4ED8",
    fontSize: 13,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  whatsappButton: {
    marginTop: 2,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#16A34A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  whatsappButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  accordionTitle: { color: "#0F172A" },
});
