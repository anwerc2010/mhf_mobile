import React from "react";
import { View, TouchableOpacity, Modal, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { setLanguage } from "../../store/slices/languageSlice";
import { useTheme } from "../../hooks/useTheme";
import PTText from "../comman/PTText";
import PTCard from "../comman/PTCard";
import { AppLanguage } from "../../i18n";

export default function LanguageSwitcher() {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector(
    (state) => state.language.currentLanguage,
  );
  const [modalVisible, setModalVisible] = React.useState(false);

  const languages = [
    { code: "en" as const, name: t("language.english") },
    { code: "ar" as const, name: t("language.arabic") },
    { code: "ur" as const, name: t("language.urdu") },
    { code: "tel" as const, name: t("language.telugu") },
    { code: "hi" as const, name: t("language.hindi") },
    { code: "mr" as const, name: t("language.marathi") },
    { code: "ta" as const, name: t("language.tamil") },
    { code: "pa" as const, name: t("language.punjabi") },
    { code: "kn" as const, name: t("language.kannada") },
    { code: "bn" as const, name: t("language.bengali") },
    { code: "gu" as const, name: t("language.gujarati") },
  ];

  const handleLanguageChange = (langCode: AppLanguage) => {
    dispatch(setLanguage(langCode));
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.md - 4,
          borderRadius: theme.borderRadius.md,
          backgroundColor: theme.colors.backgroundSecondary,
          marginBottom: theme.spacing.md,
        }}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <PTText
          variant="body"
          color="text"
          style={{ marginRight: theme.spacing.sm, fontWeight: "600" }}
        >
          {languages.find((lang) => lang.code === currentLanguage)?.name ??
            t("language.english")}
        </PTText>
        <PTText variant="caption" style={{ fontSize: 18 }}>
          🌐
        </PTText>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.overlay,
            justifyContent: "center",
            alignItems: "center",
            padding: theme.spacing.lg,
          }}
        >
          <PTCard style={{ width: "100%", maxWidth: 400 }}>
            <PTText
              variant="h3"
              color="text"
              style={{ marginBottom: theme.spacing.lg, textAlign: "center" }}
            >
              {t("language.selectLanguage")}
            </PTText>

            <ScrollView
              style={{ maxHeight: 360 }}
              showsVerticalScrollIndicator={true}
            >
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: theme.spacing.md,
                    paddingHorizontal: theme.spacing.md,
                    marginBottom: theme.spacing.sm,
                    borderRadius: theme.borderRadius.md,
                    backgroundColor:
                      currentLanguage === lang.code
                        ? theme.colors.primary
                        : theme.colors.backgroundSecondary,
                  }}
                  onPress={() => handleLanguageChange(lang.code)}
                  activeOpacity={0.7}
                >
                  <PTText
                    variant="body"
                    color="text"
                    style={
                      currentLanguage === lang.code
                        ? { fontWeight: "600", color: theme.colors.textInverse }
                        : {}
                    }
                  >
                    {lang.name}
                  </PTText>
                  {currentLanguage === lang.code && (
                    <PTText
                      style={{
                        color: theme.colors.textInverse,
                        fontSize: 18,
                        fontWeight: "bold",
                      }}
                    >
                      ✓
                    </PTText>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={{
                marginTop: theme.spacing.md,
                paddingVertical: theme.spacing.md - 4,
                alignItems: "center",
              }}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.7}
            >
              <PTText
                variant="body"
                color="primary"
                style={{ fontWeight: "600" }}
              >
                {t("common.cancel")}
              </PTText>
            </TouchableOpacity>
          </PTCard>
        </View>
      </Modal>
    </>
  );
}
