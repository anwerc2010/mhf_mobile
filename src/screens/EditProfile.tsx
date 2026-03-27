import React, { useRef } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { setUser, useUpdateCustomerMutation } from '@psi/shared-api';
import PTContainer from '../components/comman/PTContainer';
import PTDynamicForm, { FormSection, PTDynamicFormRef } from '../components/general/DynamicForm/DynamicForm';
import PTText from '../components/comman/PTText';
import { spacing } from '../constants/spacing';

export default function EditProfileScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const formRef = useRef<PTDynamicFormRef>(null);
  const [updateCustomer, { isLoading }] = useUpdateCustomerMutation();

  const sections: FormSection[] = [
    {
      title: 'Personal Details',
      id: 'profile',
      type: 'object',
      fields: [
        {
          id: 'fullname',
          label: 'Full Name',
          type: 'text',
          placeholder: 'Enter full name',
          validations: [{ name: 'required', value: true, message: 'Full name is required' }],
          path: 'profile.fullname',
        },
        {
          id: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'Enter email',
          validations: [{ name: 'required', value: true, message: 'Email is required' }],
          path: 'profile.email',
        },
        {
          id: 'phone',
          label: 'Phone',
          type: 'phone',
          placeholder: 'Enter phone number',
          validations: [{ name: 'required', value: true, message: 'Phone is required' }],
          path: 'profile.phone',
        },
        {
          id: 'date_of_birth',
          label: 'Date of Birth',
          type: 'date',
          validations: [{ name: 'required', value: true }],
          path: 'profile.date_of_birth',
        },
        {
          id: 'joining_date',
          label: 'Joining Date',
          type: 'date',
          validations: [{ name: 'required', value: true }],
          path: 'profile.joining_date',
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
          path: 'profile.blood_group',
        },
        {
          id: 'allergies',
          label: 'Allergies',
          type: 'text',
          placeholder: 'Enter any allergies (optional)',
          validations: [],
          path: 'profile.allergies',
        },
        {
          id: 'chronic_conditions',
          label: 'Chronic Conditions',
          type: 'text',
          placeholder: 'Enter any chronic conditions (optional)',
          validations: [],
          path: 'profile.chronic_conditions',
        },
        {
          id: 'emergency_contact_number',
          label: 'Emergency Contact Number',
          type: 'phone',
          placeholder: 'Enter emergency contact number (optional)',
          validations: [],
          path: 'profile.emergency_contact_number',
        },
      ],
    },
  ];

  const initialValues = {
    profile: {
      fullname: user?.fullname || '',
      email: user?.email || '',
      phone: user?.phone || '',
      date_of_birth: user?.date_of_birth || '',
      joining_date: user?.joining_date || '',
      blood_group: user?.blood_group || '',
      allergies: user?.allergies || '',
      chronic_conditions: user?.chronic_conditions || '',
      emergency_contact_number: user?.emergency_contact_number || '',
    },
  };

  const handleSubmit = async (values: Record<string, any>) => {
    const raw = values.profile;
    const payload = {
      ...raw,
      date_of_birth: raw.date_of_birth?.split('T')[0],
      joining_date: raw.joining_date?.split('T')[0],
      card_number: user?.card_number || '',
      status: user?.status || 'active',
      password: '',
    };

    try {
      const result = await updateCustomer({ id: user!.id, data: payload }).unwrap();
      if (result.error) {
        Alert.alert('Update Failed', result.message || 'Something went wrong');
        return;
      }
      dispatch(setUser(result.data));
      Alert.alert('Success', result.message || 'Profile updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      const msg = err?.data?.message;
      const errorText = msg && typeof msg === 'object'
        ? Object.values(msg).flat().join('\n')
        : typeof msg === 'string' ? msg : 'Update failed';
      Alert.alert('Update Failed', errorText);
    }
  };

  return (
    <PTContainer safeArea>
      <View style={styles.header}>
        <PTText variant="h1" style={styles.title}>Edit Profile</PTText>
      </View>
      <PTDynamicForm
        ref={formRef}
        sections={sections}
        initialValues={initialValues}
        mode="onBlur"
        submitButtonText="Save Changes"
        submitLoading={isLoading}
        onSubmit={handleSubmit}
        scrollable={true}
      />
    </PTContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    textAlign: 'center',
  },
});

