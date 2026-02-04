import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert, I18nManager, ImageBackground, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { useLoginMutation } from '@psi/shared-api';
import { setAuth } from '@psi/shared-api';
import { isValidEmail } from '../utils/validator';
import { logger } from '../utils/logger';
import { spacing } from '../constants/spacing';
import PTButton from '../components/comman/PTButton';
import PTInput from '../components/comman/PTInput';
import PTContainer from '../components/comman/PTContainer';
import PTText from '../components/comman/PTText';
import LanguageSwitcher from '../components/general/LanguageSwitcher';
import ThemeSwitcher from '../components/general/ThemeSwitcher';

interface LoginScreenProps {
  navigation: any;
}

function LoginScreen({ navigation }: LoginScreenProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector((state) => state.language.currentLanguage);
  const [email, setEmail] = useState('');//('customer101@gmail.com');
  const [password, setPassword] = useState(''); //('Test@123');
  const [loginMutation, { isLoading, error }] = useLoginMutation();

  // Update RTL layout when language changes
  useEffect(() => {
    const isRTL = currentLanguage === 'ar';
    I18nManager.forceRTL(isRTL);
    I18nManager.allowRTL(isRTL);
    // Note: App restart may be required for RTL changes to take full effect on Android
  }, [currentLanguage]);

  useEffect(() => {
    if (error) {
      Alert.alert(
        t('login.loginFailed'),
        'data' in error
          ? (error.data as { message?: string })?.message || t('login.invalidCredentials')
          : t('login.errorOccurred')
      );
    }
  }, [error, t]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('common.error'), t('login.fillAllFields'));
      return;
    }

    // Validate email using config
    if (!isValidEmail(email)) {
      Alert.alert(t('common.error'), t('login.invalidCredentials'));
      return;
    }

    try {
      const result = await loginMutation({ email, password }).unwrap();
      if (!result.token || !result.customer) {
        Alert.alert(t('login.loginFailed'), t('login.invalidCredentials'));
        return;
      }

      dispatch(setAuth({
        token: result.token,
        user: result.customer,
      }));

      // Navigation will be handled automatically by RootNavigator
    } catch (err) {
      // Error is handled by useEffect above
      logger.error('Login error:', err);
    }
  };

  return (
    <PTContainer safeArea>
      <ImageBackground
        source={require('../../assets/images/background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.content}>
            <Image
              source={require('../../assets/images/logo-hd.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            <PTText variant="h1" style={styles.title}>
              {t('login.title')}
            </PTText>

            <View style={styles.form}>
              <PTInput
                label={t('common.email')}
                placeholder={t('login.emailPlaceholder')}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />

              <PTInput
                label={t('common.password')}
                placeholder={t('login.passwordPlaceholder')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
              />

              <View style={styles.button}>
                <PTButton
                  title={t('common.signIn')}
                  variant='success'
                  onPress={handleLogin}
                  loading={isLoading}
                  disabled={!email || !password}
                />
              </View>

              <View style={styles.footer}>
                <PTText variant="body" style={styles.footerText}>
                  {t('login.noAccount')}{' '}
                </PTText>
                <Text
                  style={styles.link}
                  onPress={() => navigation.navigate('Register')}
                >
                  {t('common.signUp')}
                </Text>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </PTContainer>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 40,
  },
  content: {
    flex: 1,
    padding: spacing.screenPadding,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
    color: '#020050ff',
    fontWeight: '700',
  },
  form: {
    width: '100%',
  },
  button: {
    marginTop: 16,
    width: '60%',
    alignSelf: 'center',
    color: '#4d9734ff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#666',
  },
  link: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default LoginScreen;

