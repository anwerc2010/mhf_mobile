import React from 'react';
import { View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PTDynamicForm, { PTDynamicFormRef, FormSection } from '../../components/general/DynamicForm/DynamicForm'
import { useRef, useState } from "react";
import { PTText } from '../../components/comman';
import { useCreateVolunteerRegistrationMutation } from '@psi/shared-api';

export default function VolunteersScreen() {
    const navigation = useNavigation<any>();
    const formRef = useRef<PTDynamicFormRef>(null);
    const [createVolunteerRegistration, { isLoading }] = useCreateVolunteerRegistrationMutation();

    const handleSubmit = async (values: Record<string, any>) => {
        try {
            const formattedData = {
                full_name: values.full_name,
                date_of_birth: values.date_of_birth?.split('T')[0],
                gender: values.gender,
                phone_number: values.phone_number,
                alternate_contact: values.alternate_contact,
                email: values.email,
                address: values.address,
                qualification: values.qualification,
                employment_status: values.employment_status,
                occupation: values.occupation,
                volunteer_area: values.volunteer_area,
                availability: values.availability,
                previous_volunteering: values.previous_volunteering,
                motivation: values.motivation,
                declaration: values.declaration,
            };

            console.log('Volunteer registration values:', JSON.stringify(formattedData, null, 2));

            // Call the mutation
            const response = await createVolunteerRegistration(formattedData).unwrap();

            console.log('Volunteer Registration Response:', response);

            Alert.alert('Success', 'Volunteer registration submitted successfully', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (err: any) {
            console.error('Error submitting volunteer registration:', err);
            Alert.alert('Error', err?.data?.message || err?.message || 'Failed to submit registration');
        }
    };

    const sections: FormSection[] = [
        /* =======================
           1. Personal Details
        ======================== */
        {
            title: 'Personal Details',
            id: 'personalDetails',
            type: 'object',
            fields: [
                {
                    id: 'full_name',
                    label: 'Full Name',
                    type: 'text',
                    validations: [{ name: 'required', value: true }],
                    path: 'full_name',
                },
                {
                    id: 'date_of_birth',
                    label: 'Date of Birth',
                    type: 'date',
                    validations: [{ name: 'required', value: true }],
                    path: 'date_of_birth',
                },
                {
                    id: 'gender',
                    label: 'Gender',
                    type: 'radio',
                    values: [
                        { id: 'male', name: 'Male' },
                        { id: 'female', name: 'Female' },
                        { id: 'other', name: 'Other' },
                    ],
                    validations: [{ name: 'required', value: true }],
                    path: 'gender',
                },
                {
                    id: 'phone_number',
                    label: 'Phone Number',
                    type: 'tel',
                    placeholder: '+91-XXXXXXXXXX',
                    validations: [
                        { name: 'required', value: true },
                        { name: 'pattern', value: /^[0-9]{10}$/, message: 'Enter valid 10 digit number' },
                    ],
                    path: 'phone_number',
                },
                {
                    id: 'alternate_contact',
                    label: 'Alternate Contact No.',
                    type: 'tel',
                    placeholder: '+91-XXXXXXXXXX',
                    validations: [
                        { name: 'pattern', value: /^[0-9]{10}$/ },
                    ],
                    path: 'alternate_contact',
                },
                {
                    id: 'email',
                    label: 'Email Address',
                    type: 'email',
                    validations: [
                        { name: 'required', value: true },
                        { name: 'pattern', value: /^[^@]+@[^@]+\.[^@]+$/, message: 'Invalid email address' },
                    ],
                    path: 'email',
                },
                {
                    id: 'address',
                    label: 'Address',
                    type: 'textarea',
                    validations: [{ name: 'required', value: true }],
                    path: 'address',
                },
            ],
        },

        /* =======================
           2. Professional Details
        ======================== */
        {
            title: 'Professional Details',
            id: 'professionalDetails',
            type: 'object',
            fields: [
                {
                    id: 'qualification',
                    label: 'Qualification',
                    type: 'text',
                    validations: [{ name: 'required', value: true }],
                    path: 'qualification',
                },
                {
                    id: 'employment_status',
                    label: 'Employment Status',
                    type: 'radio',
                    values: [
                        { id: 'student', name: 'Student' },
                        { id: 'employee', name: 'Employee' },
                        { id: 'self_employed', name: 'Self Employed' },
                    ],
                    validations: [{ name: 'required', value: true }],
                    path: 'employment_status',
                },
                {
                    id: 'occupation',
                    label: 'Occupation',
                    type: 'text',
                    validations: [{ name: 'required', value: true }],
                    path: 'occupation',
                },
            ],
        },

        /* =======================
           3. Volunteering Preferences
        ======================== */
        {
            title: 'Volunteering Preferences',
            id: 'volunteeringPreferences',
            type: 'object',
            fields: [
                {
                    id: 'volunteer_area',
                    label: 'Which areas would you like to volunteer in?',
                    type: 'select',
                    options: [
                        { id: 'health_camp', name: 'Health Camps' },
                        { id: 'awareness_drives', name: 'Awareness Drives' },
                        { id: 'data_entry', name: 'Data Entry / Office Work' },
                        { id: 'social_media', name: 'Social Media Promotion' },
                        { id: 'fundraising', name: 'Fundraising' },
                        { id: 'community_outreach', name: 'Community Outreach' },
                        { id: 'other', name: 'Other' },
                    ],
                    validations: [{ name: 'required', value: true }],
                    path: 'volunteer_area',
                },
                {
                    id: 'availability',
                    label: 'Availability',
                    type: 'select',
                    options: [
                        { id: 'weekdays', name: 'Weekdays' },
                        { id: 'weekends', name: 'Weekends' },
                        { id: 'flexible', name: 'Flexible' },
                    ],
                    validations: [{ name: 'required', value: true }],
                    path: 'availability',
                },
            ],
        },

        /* =======================
           4. Experience & Motivation
        ======================== */
        {
            title: 'Experience & Motivation',
            id: 'experienceMotivation',
            type: 'object',
            fields: [
                {
                    id: 'previous_volunteering',
                    label: 'Have you volunteered before?',
                    type: 'radio',
                    values: [
                        { id: 'yes', name: 'Yes' },
                        { id: 'no', name: 'No' },
                    ],
                    validations: [{ name: 'required', value: true }],
                    path: 'previous_volunteering',
                },
                {
                    id: 'motivation',
                    label: 'Why do you want to join Muthala Helping Foundation as a volunteer?',
                    type: 'textarea',
                    placeholder: 'Please share your motivation and what drives you to volunteer with us...',
                    validations: [{ name: 'required', value: true }],
                    path: 'motivation',
                },
            ],
        }
    ];


    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <PTText style={{ fontSize: 16, padding: 8, fontWeight: '400', marginBottom: 12 }}>Join Mujtaba Helping Foundation as a Volunteer</PTText>
            <PTDynamicForm
                ref={formRef}
                sections={sections}
                initialValues={{}}
                mode="onBlur"
                submitButtonText="Save Details"
                submitLoading={isLoading}
                onSubmit={handleSubmit}
                onValueChange={(fieldId, value) => {
                    console.log(`${fieldId} changed to`, value);
                }} />
        </View>
    );
}
