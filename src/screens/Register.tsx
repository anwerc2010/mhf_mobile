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
          id: 'age',
          label: 'Age',
          type: 'number',
          placeholder: 'Enter age',
          validations: [
            { name: 'required', value: true, message: t('register.validation.ageRequired') },
            { name: 'min', value: 0, message: t('register.validation.agePositive') },
          ],
          path: 'personalDetails.age',
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
          id: 'address',
          label: 'Address',
          type: 'textarea',
          placeholder: 'Enter address',
          validations: [
            { name: 'required', value: true, message: t('register.validation.addressRequired') },
          ],
          path: 'personalDetails.address',
        },
        {
          id: 'equipment_type',
          label: 'Equipment Type',
          type: 'text',
          placeholder: 'Enter equipment type',
          validations: [
            { name: 'required', value: true, message: t('register.validation.equipmentTypeRequired') },
          ],
          path: 'personalDetails.equipmentType',
        },
        {
          id: 'medical_reason',
          label: 'Medical Reason',
          type: 'textarea',
          placeholder: 'Enter medical reason',
          validations: [
            { name: 'required', value: true, message: t('register.validation.medicalReasonRequired') },
          ],
          path: 'personalDetails.medicalReason',
        },
        {
          id: 'duration',
          label: 'Duration',
          type: 'text',
          placeholder: 'Enter duration',
          validations: [
            { name: 'required', value: true, message: t('register.validation.durationRequired') },
          ],
          path: 'personalDetails.duration',
        },
        {
          id: 'reference_name',
          label: 'Reference Name',
          type: 'text',
          placeholder: 'Enter reference name',
          validations: [
            { name: 'required', value: true, message: t('register.validation.referenceNameRequired') },
          ],
          path: 'personalDetails.referenceName',
        },
        {
          id: 'reference_contact',
          label: 'Reference Contact',
          type: 'phone',
          placeholder: 'Enter reference contact',
          validations: [
            { name: 'required', value: true, message: t('register.validation.referenceContactRequired') },
          ],
          path: 'personalDetails.referenceContact',
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
    const formValues = values as RegisterRequest;
    try {
      const result = await registerMutation(formValues).unwrap();
      if (result?.error) {
        showToast('error', result?.message || t('register.toast.error'), 'bottom');
        setPendingNavigate(false);
        return;
      }

      showToast('success', result?.message || t('register.toast.success'), 'top');
      setPendingNavigate(true);

    } catch (err) {
      showToast('error', t('register.toast.error'), 'bottom');
      setPendingNavigate(false);
      logger.error('Registration error:', err);
    }
  };

  return (
    <>
      <PTContainer safeArea>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', marginBottom: 16 }}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <LanguageSwitcher />
            </View>
            <View style={{ flex: 1 }}>
              <ThemeSwitcher />
            </View>
          </View>

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
      </PTContainer>
      <View>
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
      </View>
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

