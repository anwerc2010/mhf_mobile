import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert, ImageBackground, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useResetPasswordMutation } from '@psi/shared-api';
import { logger } from '../utils/logger';
import { spacing } from '../constants/spacing';
import PTButton from '../components/comman/PTButton';
import PTInput from '../components/comman/PTInput';
import PTContainer from '../components/comman/PTContainer';
import PTText from '../components/comman/PTText';

interface ResetPasswordScreenProps {
  navigation: any;
  route?: any;
}

function ResetPasswordScreen({ navigation, route }: ResetPasswordScreenProps) {
  const { t } = useTranslation();
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetPasswordMutation, { isLoading, error }] = useResetPasswordMutation();

  useEffect(() => {
    if (!error) {
      return;
    }

    const message =
      'data' in error
        ? (error.data as { message?: string })?.message || t('resetPassword.errorMessage', 'Failed to reset password. Please check your reset token and try again.')
        : t('resetPassword.errorMessage', 'Failed to reset password. Please check your reset token and try again.');

    Alert.alert(t('common.error'), message);
  }, [error, t]);

  const handleResetPassword = async () => {
    if (!resetToken || !newPassword || !confirmPassword) {
      Alert.alert(
        t('common.error'),
        t('resetPassword.fillAllFields', 'Please fill in all fields')
      );
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(
        t('common.error'),
        t('resetPassword.passwordTooShort', 'Password must be at least 6 characters long')
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        t('common.error'),
        t('resetPassword.passwordMismatch', 'Passwords do not match')
      );
      return;
    }

    try {
      const result = await resetPasswordMutation({
        token: resetToken,
        password: newPassword,
        password_confirmation: confirmPassword,
      }).unwrap();

      if (result?.error) {
        const apiMessage =
          result?.message || t('resetPassword.errorMessage', 'Failed to reset password. Please check your reset token and try again.');
        Alert.alert(t('common.error'), apiMessage);
        return;
      }

      logger.info('Password reset successful');

      Alert.alert(
        t('resetPassword.success', 'Success'),
        t('resetPassword.successMessage', 'Your password has been reset successfully. Please login with your new password.'),
        [
          {
            text: t('common.ok'),
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (err) {
      logger.error('Reset password error:', err);

      const message =
        typeof err === 'object' && err && 'data' in (err as any)
          ? ((err as any).data as { message?: string })?.message || t('resetPassword.errorMessage', 'Failed to reset password. Please check your reset token and try again.')
          : t('resetPassword.errorMessage', 'Failed to reset password. Please check your reset token and try again.');

      Alert.alert(t('common.error'), message);
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
              {t('resetPassword.title', 'Reset Password')}
            </PTText>

            <PTText variant="body" style={styles.subtitle}>
              {t('resetPassword.subtitle', 'Enter the reset token from your email and choose a new password.')}
            </PTText>

            <View style={styles.form}>
              <PTInput
                label={t('resetPassword.resetToken', 'Reset Token')}
                placeholder={t('resetPassword.resetTokenPlaceholder', 'Enter reset token from email')}
                value={resetToken}
                onChangeText={setResetToken}
                autoCapitalize="none"
              />

              <PTInput
                label={t('resetPassword.newPassword', 'New Password')}
                placeholder={t('resetPassword.newPasswordPlaceholder', 'Enter new password')}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password-new"
              />

              <PTInput
                label={t('resetPassword.confirmPassword', 'Confirm Password')}
                placeholder={t('resetPassword.confirmPasswordPlaceholder', 'Confirm new password')}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password-new"
              />

              <View style={styles.button}>
                <PTButton
                  title={t('resetPassword.resetPassword', 'Reset Password')}
                  variant='success'
                  onPress={handleResetPassword}
                  loading={isLoading}
                  disabled={!resetToken || !newPassword || !confirmPassword}
                />
              </View>

              <View style={styles.footer}>
                <PTText variant="body" style={styles.footerText}>
                  {t('resetPassword.backToLogin', 'Back to')}{' '}
                </PTText>
                <Text
                  style={styles.link}
                  onPress={() => navigation.navigate('Login')}
                >
                  {t('common.signIn', 'Sign In')}
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
  subtitle: {
    marginBottom: 24,
    textAlign: 'center',
    color: '#666',
    paddingHorizontal: 20,
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

export default ResetPasswordScreen;
