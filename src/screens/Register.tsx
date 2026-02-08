import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert, I18nManager } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../store/hook';
import { useRegisterMutation } from '@psi/shared-api';
import { RegisterRequest } from '@psi/shared-api';
import { logger } from '../utils/logger';
import { spacing } from '../constants/spacing';
import PTContainer from '../components/comman/PTContainer';
import PTText from '../components/comman/PTText';
import LanguageSwitcher from '../components/general/LanguageSwitcher';
import ThemeSwitcher from '../components/general/ThemeSwitcher';
import PTDynamicForm, { FormField, FormSection, PTDynamicFormRef } from '../components/general/DynamicForm/DynamicForm';
import PTToast, { ToastType } from '../components/comman/PTToast';

interface RegisterScreenProps {
  navigation: any;
}

function RegisterScreen({ navigation }: RegisterScreenProps) {
  const { t } = useTranslation();
  const formRef = useRef<PTDynamicFormRef>(null);
  const currentLanguage = useAppSelector((state) => state.language.currentLanguage);
  const [registerMutation, { isLoading, error }] = useRegisterMutation();
  const [toastState, setToastState] = useState({
    visible: false,
    message: '',
    type: 'info' as ToastType,
    position: 'top' as 'top' | 'bottom',
  });
  const [pendingNavigate, setPendingNavigate] = useState(false);
  const sections: FormSection[] = [
    {
      title: 'Personal Details',
      id: 'personalDetails',
      type: 'object',
      fields: [
        {
          id: 'fullname',
          label: 'Full Name',
          type: 'text',
          placeholder: 'Enter full name',
          validations: [
            { name: 'required', value: true, message: t('register.validation.fullnameRequired') },
          ],
          path: 'personalDetails.fullname',
        },
        {
          id: 'date_of_birth',
          label: 'Date of Birth',
          type: 'date',
          validations: [{ name: 'required', value: true }],
          path: 'personalDetails.date_of_birth',
        },
        {
          id: 'gender',
          label: 'Gender',
          type: 'select',
          placeholder: 'Select gender',
          options: [
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
            { label: 'Other', value: 'other' },
          ],
          validations: [
            { name: 'required', value: true, message: t('register.validation.genderRequired') },
          ],
          path: 'personalDetails.gender',
        },
        {
          id: 'phone',
          label: 'Phone',
          type: 'phone',
          placeholder: 'Enter phone number',
          validations: [
            { name: 'required', value: true, message: t('register.validation.phoneRequired') },
          ],
          path: 'personalDetails.phone',
        },
        {
          id: 'email',
          label: t('common.email'),
          type: 'email',
          placeholder: t('register.emailPlaceholder'),
          validations: [
            { name: 'required', value: true, message: t('register.validation.emailRequired') },
            {
              name: 'pattern',
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: t('register.validation.emailInvalid'),
            },
          ],
          path: 'personalDetails.email',
        },
         {
          id: 'password',
          label: t('common.password'),
          type: 'password',
          placeholder: t('register.passwordPlaceholder'),
          validations: [
            { name: 'required', value: true, message: t('register.validation.passwordRequired') },
            { name: 'minLength', value: 8, message: t('register.validation.passwordMin') },
          ],
          path: 'personalDetails.password',
        },
         {
                    id: 'blood_group',
                    label: 'Blood Group',
                    type: 'select',
                    options: [
                        { id: 'A+', name: 'A+' },
                        { id: 'A-', name: 'A-' },
                        { id: 'B+', name: 'B+' },
                        { id: 'B-', name: 'B-' },
                        { id: 'O+', name: 'O+' },
                        { id: 'O-', name: 'O-' },
                        { id: 'AB+', name: 'AB+' },
                        { id: 'AB-', name: 'AB-' },
                    ],
                    validations: [{ name: 'required', value: true }],
                    path: 'personalDetails.blood_group',
                },
      ],
    },
  ];

  // Update RTL layout when language changes
  useEffect(() => {
    const isRTL = currentLanguage === 'ar';
    I18nManager.forceRTL(isRTL);
    I18nManager.allowRTL(isRTL);
  }, [currentLanguage]);

  useEffect(() => {
    if (error) {
      Alert.alert(
        t('register.registrationFailed'),
        'data' in error
          ? (error.data as { message?: string })?.message || t('register.registrationFailed')
          : t('login.errorOccurred')
      );
    }
  }, [error, t]);

  const showToast = (type: ToastType, message: string, position: 'top' | 'bottom' = 'top') => {
    setToastState({ visible: true, message, type, position });
  };

  const handleToastClose = () => {
    setToastState((prev) => ({ ...prev, visible: false }));
    if (pendingNavigate) {
      setPendingNavigate(false);
      navigation.navigate('Login');
    }
  };

  const handleRegister = async (values: Record<string, any>) => {
    let payload = { ...values.personalDetails } as any;
    payload.date_of_birth = payload.date_of_birth?.split('T')[0];
    payload['card_number'] = '';
    console.log('Register form values:', JSON.stringify(payload, null, 2));

    try {
      const result = await registerMutation(payload).unwrap();
      if (result?.error) {
        let errorMessage = t('register.toast.error');

        // Extract field-specific errors from API response
        if (result?.message && typeof result.message === 'object') {
          const fieldErrors = result.message;
          const errorFields = Object.keys(fieldErrors);

          if (errorFields.length > 0) {
            const fieldName = errorFields[0];
            const fieldError = fieldErrors[fieldName];
            errorMessage = `${fieldName}: ${Array.isArray(fieldError) ? fieldError[0] : fieldError}`;
          }
        }

        Alert.alert(
          t('register.registrationFailed'),
          errorMessage,
          [{ text: 'OK' }]
        );
        setPendingNavigate(false);
        return;
      }

      Alert.alert(
        t('register.registrationSuccess'),
        result?.message || t('register.toast.success'),
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('Login');
            },
          },
        ]
      );

    } catch (err: any) {
      let errorMessage = t('register.toast.error');

      // Extract field-specific errors from API response
      const messageObj = err?.data?.message || err?.message;
      if (messageObj && typeof messageObj === 'object') {
        const fieldErrors = messageObj;
        const errorFields = Object.keys(fieldErrors);

        if (errorFields.length > 0) {
          const fieldName = errorFields[0];
          const fieldError = fieldErrors[fieldName];
          errorMessage = `${fieldName}: ${Array.isArray(fieldError) ? fieldError[0] : fieldError}`;
        }
      } else if (typeof messageObj === 'string') {
        errorMessage = messageObj;
      }

      Alert.alert(
        t('register.registrationFailed'),
        errorMessage,
        [{ text: 'OK' }]
      );
      setPendingNavigate(false);
      logger.error('Registration error:', err);
    }
  };

  return (
    <>
      <PTContainer safeArea>
        <View style={styles.header}>
          {/* <View style={{ flexDirection: 'row', marginBottom: 16 }}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <LanguageSwitcher />
            </View>
            <View style={{ flex: 1 }}>
              <ThemeSwitcher />
            </View>
          </View> */}

          <PTText variant="h1" style={styles.title}>
            {t('register.title')}
          </PTText>
          <PTText variant="body" style={styles.subtitle}>
            {t('register.subtitle')}
          </PTText>
        </View>

        <PTDynamicForm
          ref={formRef}
          sections={sections}
          initialValues={{}}
          mode="onBlur"
          submitButtonText={t('common.signUp')}
          submitLoading={isLoading}
          onSubmit={handleRegister}
          scrollable={true}
          onValueChange={(fieldId, value) => {
            console.log(`${fieldId} changed to`, value);
          }}
        />

        <View style={styles.footer}>
          <PTText variant="body" style={styles.footerText}>
            {t('register.hasAccount')}{' '}
          </PTText>
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('Login')}
          >
            {t('common.signIn')}
          </Text>
        </View>
      </PTContainer>
      <PTToast
        visible={toastState.visible}
        message={toastState.message}
        type={toastState.type}
        position={toastState.position}
        onClose={handleToastClose}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.md,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 16,
    textAlign: 'center',
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  footerText: {
    color: '#666',
  },
  link: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default RegisterScreen;

