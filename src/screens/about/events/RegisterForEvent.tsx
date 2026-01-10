import React from 'react'
import { View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import PTDynamicForm, { PTDynamicFormRef, FormSection } from '../../../components/general/DynamicForm/DynamicForm'
import { useRef } from "react";
import { PTText } from '../../../components/comman';

function RegisterForEvent() {
    const navigation = useNavigation<any>()
    const formRef = useRef<PTDynamicFormRef>(null);
    const sections: FormSection[] = [
        /* =======================
           1. Personal Information
        ======================== */
        {
            title: 'Personal Information',
            id: 'personalInformation',
            type: 'object',
            fields: [
                {
                    id: 'fullName',
                    label: 'Full Name',
                    type: 'text',
                    placeholder: 'Enter your full name',
                    validations: [{ name: 'required', value: true }],
                    path: 'personal.fullName',
                },
                {
                    id: 'dob',
                    label: 'Date of Birth',
                    type: 'date',
                    validations: [{ name: 'required', value: true }],
                    path: 'personal.dob',
                },
                {
                    id: 'age',
                    label: 'Age',
                    type: 'number',
                    validations: [{ name: 'required', value: true }],
                    path: 'personal.age',
                },
                {
                    id: 'gender',
                    label: 'Gender',
                    type: 'radio',
                    values: [
                        { id: 'Male', name: 'Male' },
                        { id: 'Female', name: 'Female' },
                        { id: 'Other', name: 'Other' },
                    ],
                    validations: [{ name: 'required', value: true }],
                    path: 'personal.gender',
                },
                {
                    id: 'phoneNumber',
                    label: 'Phone Number',
                    type: 'tel',
                    placeholder: '+91-XXXXXXXXXX',
                    validations: [
                        { name: 'required', value: true },
                        {
                            name: 'pattern',
                            value: /^[0-9]{10}$/,
                            message: 'Enter valid 10 digit number',
                        },
                    ],
                    path: 'personal.phoneNumber',
                },
                {
                    id: 'alternateNumber',
                    label: 'Alternate No.',
                    type: 'tel',
                    placeholder: '+91-XXXXXXXXXX',
                    validations: [
                        { name: 'pattern', value: /^[0-9]{10}$/ },
                    ],
                    path: 'personal.alternateNumber',
                },
                {
                    id: 'email',
                    label: 'Email Address',
                    type: 'email',
                    placeholder: 'your.email@example.com',
                    validations: [
                        { name: 'required', value: true },
                        {
                            name: 'pattern',
                            value: /^[^@]+@[^@]+\.[^@]+$/,
                            message: 'Invalid email address',
                        },
                    ],
                    path: 'personal.email',
                },
                {
                    id: 'address',
                    label: 'Address',
                    type: 'textarea',
                    placeholder: 'Enter your complete address',
                    validations: [{ name: 'required', value: true }],
                    path: 'personal.address',
                },
            ],
        },

        /* =======================
           2. Event Selection
        ======================== */
        {
            title: 'Event Selection',
            id: 'eventSelection',
            type: 'object',
            fields: [
                {
                    id: 'events',
                    label: 'Select the event(s) you want to register for',
                    type: 'multiselect',
                    options: [
                        {
                            id: 'MedicalCamp',
                            name: 'Medical Camp – Free health check-ups, consultations, and medicines',
                        },
                        {
                            id: 'BloodDonation',
                            name: 'Blood Donation Drive – Donate blood safely to help save lives',
                        },
                        {
                            id: 'AwarenessSession',
                            name: 'Awareness Session – Learn about health, hygiene, nutrition, and preventive care',
                        },
                    ],
                    validations: [{ name: 'required', value: true }],
                    path: 'event.selectedEvents',
                },
            ],
        },

        /* =======================
           3. Participation Type
        ======================== */
        {
            title: 'Participation Type',
            id: 'participationType',
            type: 'object',
            fields: [
                {
                    id: 'participationRole',
                    label: 'Choose how you want to participate',
                    type: 'radio',
                    values: [
                        { id: 'Participant', name: 'Participant' },
                        { id: 'Volunteer', name: 'Volunteer' },
                    ],
                    validations: [{ name: 'required', value: true }],
                    path: 'participation.role',
                },
            ],
        },

        /* =======================
           4. Declaration
        ======================== */
        {
            title: 'Declaration',
            id: 'declaration',
            type: 'object',
            fields: [
                {
                    id: 'declarationAccepted',
                    label:
                        'I hereby declare that the information provided is true. I agree to follow the principles and guidelines of Mujtaba Helping Foundation and participate responsibly in the selected event(s).',
                    type: 'radio',
                    values: [{ id: 'accepted', name: 'I Agree' }],
                    validations: [{ name: 'required', value: true }],
                    path: 'declaration.accepted',
                },
            ],
        },
    ];

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <PTText style={{ fontSize: 16, padding: 8, fontWeight: '400', marginBottom: 12 }}>Please fill in all the details to apply for a health card</PTText>
            <PTDynamicForm
                ref={formRef}
                sections={sections}
                initialValues={{}}
                mode="onBlur"
                submitButtonText="Save Details"
                onSubmit={(values) => console.log('Form submitted:', values)}
                onValueChange={(fieldId, value) => {
                    console.log(`${fieldId} changed to`, value);
                }} />
        </View>
    )
}

export default RegisterForEvent
