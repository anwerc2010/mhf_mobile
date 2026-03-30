import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Bell } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { useGetNotificationsQuery } from "@psi/shared-api";
import { AppLanguage } from "../../i18n";

interface TopNavBarProps {
  notificationCount?: number;
  onLanguageChange?: (language: AppLanguage) => void;
  currentLanguage?: AppLanguage;
}

const TopNavBar: React.FC<TopNavBarProps> = ({
  notificationCount: propCount,
  onLanguageChange,
  currentLanguage = "EN",
}) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(
    currentLanguage || "en",
  );
  const { data: notificationsData } = useGetNotificationsQuery();

  const notificationCount = useMemo(() => {
    if (notificationsData?.data) {
      return Array.isArray(notificationsData.data)
        ? notificationsData.data.length
        : 0;
    }
    return propCount || 0;
  }, [notificationsData, propCount]);

  const languages = [
    { code: "en" as const, label: t("language.english") },
    { code: "ar" as const, label: t("language.arabic") },
    { code: "ur" as const, label: t("language.urdu") },
    { code: "tel" as const, label: t("language.telugu") },
  ];

  const handleLanguageSelect = (language: AppLanguage) => {
    setSelectedLanguage(language);
    if (onLanguageChange) {
      onLanguageChange(language);
    }
    setLanguageModalVisible(false);
  };

  const handleNotificationPress = () => {
    navigation.navigate("Notifications" as never);
  };

  return (
    <>
      <View style={styles.container}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../assets/images/logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Right Section - Language Switcher and Notification */}
        <View style={styles.rightSection}>
          {/* Language Switcher */}
          <TouchableOpacity
            style={styles.languageSwitcher}
            onPress={() => setLanguageModalVisible(true)}
          >
            <Text style={styles.languageIcon}>🌐</Text>
            <Text style={styles.languageText}>
              {languages.find((l) => l.code === selectedLanguage)?.label ??
                selectedLanguage.toUpperCase()}
            </Text>
          </TouchableOpacity>

          {/* Notification Bell */}
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={handleNotificationPress}
            accessible={true}
            accessibilityLabel={`Notifications ${
              notificationCount > 0 ? notificationCount + " unread" : ""
            }`}
          >
            <View style={styles.bellIconContainer}>
              <Bell size={28} weight="regular" color="#000" />
              {notificationCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Language Selection Modal */}
      <Modal
        transparent={true}
        visible={languageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setLanguageModalVisible(false)}
        >
          <Pressable
            style={styles.languageModal}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>
              {t("language.selectLanguage")}
            </Text>
            {languages.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageOption,
                  selectedLanguage === language.code &&
                    styles.selectedLanguageOption,
                ]}
                onPress={() => handleLanguageSelect(language.code)}
              >
                <Text
                  style={[
                    styles.languageOptionText,
                    selectedLanguage === language.code &&
                      styles.selectedLanguageText,
                  ]}
                >
                  {language.label}
                </Text>
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  logoImage: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
  logoTextSection: {
    justifyContent: "center",
  },
  foundationText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E3A8A",
    letterSpacing: 0.5,
  },
  taglineText: {
    fontSize: 11,
    color: "#666666",
    fontStyle: "italic",
    marginTop: 2,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  languageSwitcher: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 20,
    backgroundColor: "#FAFAFA",
  },
  languageIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  languageText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E3A8A",
  },
  notificationButton: {
    padding: 8,
  },
  bellIconContainer: {
    position: "relative",
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#DC2626",
    borderRadius: 12,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  languageModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 24,
    minWidth: 200,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 16,
    textAlign: "center",
  },
  languageOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 8,
    backgroundColor: "#F3F4F6",
  },
  selectedLanguageOption: {
    backgroundColor: "#DBEAFE",
    borderWidth: 2,
    borderColor: "#1E3A8A",
  },
  languageOptionText: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    fontWeight: "500",
  },
  selectedLanguageText: {
    color: "#1E3A8A",
    fontWeight: "700",
  },
});

export default TopNavBar;
