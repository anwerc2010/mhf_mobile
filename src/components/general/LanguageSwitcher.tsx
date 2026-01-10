import React from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { setLanguage } from '../../store/slices/languageSlice';
import { useTheme } from '../../hooks/useTheme';
import PTText from '../comman/PTText';
import PTCard from '../comman/PTCard';

export default function LanguageSwitcher() {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector((state) => state.language.currentLanguage);
  const [modalVisible, setModalVisible] = React.useState(false);

  const languages = [
    { code: 'en' as const, name: t('language.english') },
    { code: 'ar' as const, name: t('language.arabic') },
  ];

  const handleLanguageChange = (langCode: 'en' | 'ar') => {
    dispatch(setLanguage(langCode));
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.md - 4,
          borderRadius: theme.borderRadius.md,
          backgroundColor: theme.colors.backgroundSecondary,
          marginBottom: theme.spacing.md,
        }}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <PTText variant="body" color="text" style={{ marginRight: theme.spacing.sm, fontWeight: '600' }}>
          {currentLanguage === 'en' ? t('language.english') : t('language.arabic')}
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
            justifyContent: 'center',
            alignItems: 'center',
            padding: theme.spacing.lg,
          }}
        >
          <PTCard style={{ width: '100%', maxWidth: 400 }}>
            <PTText variant="h3" color="text" style={{ marginBottom: theme.spacing.lg, textAlign: 'center' }}>
              {t('language.selectLanguage')}
            </PTText>

            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: theme.spacing.md,
                  paddingHorizontal: theme.spacing.md,
                  marginBottom: theme.spacing.sm,
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: currentLanguage === lang.code
                    ? theme.colors.primary
                    : theme.colors.backgroundSecondary,
                }}
                onPress={() => handleLanguageChange(lang.code)}
                activeOpacity={0.7}
              >
                <PTText
                  variant="body"
                  color={currentLanguage === lang.code ? 'textInverse' : 'text'}
                  style={currentLanguage === lang.code ? { fontWeight: '600' } : {}}
                >
                  {lang.name}
                </PTText>
                {currentLanguage === lang.code && (
                  <PTText style={{ color: theme.colors.textInverse, fontSize: 18, fontWeight: 'bold' }}>
                    ✓
                  </PTText>
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={{
                marginTop: theme.spacing.md,
                paddingVertical: theme.spacing.md - 4,
                alignItems: 'center',
              }}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.7}
            >
              <PTText variant="body" color="primary" style={{ fontWeight: '600' }}>
                {t('common.cancel')}
              </PTText>
            </TouchableOpacity>
          </PTCard>
        </View>
      </Modal>
    </>
  );
}


