import React from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { setThemeMode, toggleTheme } from '../../store/slices/themeSlice';
import { useTheme } from '../../hooks/useTheme';
import PTText from '../comman/PTText';
import PTCard from '../comman/PTCard';

export default function ThemeSwitcher() {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.theme.mode);
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);
  const [modalVisible, setModalVisible] = React.useState(false);

  const themeOptions = [
    { mode: 'light' as const, name: t('theme.light'), icon: '☀️' },
    { mode: 'dark' as const, name: t('theme.dark'), icon: '🌙' },
    { mode: 'system' as const, name: t('theme.system'), icon: '⚙️' },
  ];

  const handleThemeChange = (mode: 'light' | 'dark' | 'system') => {
    if (mode === 'system') {
      dispatch(setThemeMode('system'));
    } else {
      dispatch(setThemeMode(mode));
    }
    setModalVisible(false);
  };

  const getCurrentThemeName = () => {
    if (themeMode === 'system') {
      return t('theme.system');
    }
    return currentTheme === 'light' ? t('theme.light') : t('theme.dark');
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
          {getCurrentThemeName()}
        </PTText>
        <PTText variant="caption" style={{ fontSize: 18 }}>
          {currentTheme === 'light' ? '☀️' : '🌙'}
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
              {t('theme.selectTheme')}
            </PTText>

            {themeOptions.map((option) => (
              <TouchableOpacity
                key={option.mode}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: theme.spacing.md,
                  paddingHorizontal: theme.spacing.md,
                  marginBottom: theme.spacing.sm,
                  borderRadius: theme.borderRadius.md,
                  backgroundColor:
                    (themeMode === 'system' && option.mode === 'system') ||
                    (themeMode === option.mode && option.mode !== 'system')
                      ? theme.colors.primary
                      : theme.colors.backgroundSecondary,
                }}
                onPress={() => handleThemeChange(option.mode)}
                activeOpacity={0.7}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <PTText style={{ fontSize: 18, marginRight: theme.spacing.sm }}>
                    {option.icon}
                  </PTText>
                  <PTText
                    variant="body"
                    color={
                      (themeMode === 'system' && option.mode === 'system') ||
                      (themeMode === option.mode && option.mode !== 'system')
                        ? 'textInverse'
                        : 'text'
                    }
                    style={
                      (themeMode === 'system' && option.mode === 'system') ||
                      (themeMode === option.mode && option.mode !== 'system')
                        ? { fontWeight: '600' }
                        : {}
                    }
                  >
                    {option.name}
                  </PTText>
                </View>
                {((themeMode === 'system' && option.mode === 'system') ||
                  (themeMode === option.mode && option.mode !== 'system')) && (
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

