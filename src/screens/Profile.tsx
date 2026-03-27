import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
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
} from "phosphor-react-native";
import { useNavigation } from "@react-navigation/native";
import { useAppSelector, useAppDispatch } from "../store/hook";
import { clearAuth, useGetDashboardDetailsQuery } from "@psi/shared-api";
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<{ [k: string]: boolean }>({});
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { data: dashboardData } = useGetDashboardDetailsQuery();

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
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
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

        <View style={styles.profileCard}>
          <View style={styles.profileTopRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitials}>
                {getInitials(user?.fullname)}
              </Text>
            </View>
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
            {
              key: "volunteers",
              title: t("profile.ourVolunteers"),
              icon: Heart,
              bg: "#FEF2F2",
              color: "#F43F5E",
            },
            {
              key: "contact",
              title: t("profile.contactInfo"),
              icon: Phone,
              bg: "#F0F9FF",
              color: "#0369A1",
            },
          ].map((item) => {
            const Icon = item.icon as any;
            return (
              <TouchableOpacity
                key={item.key}
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
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: { color: "#fff", fontWeight: "700" },
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
  accordionTitle: { color: "#0F172A" },
});
