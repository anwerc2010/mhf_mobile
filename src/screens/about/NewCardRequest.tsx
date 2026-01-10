import React from 'react'
import { View, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import PTDynamicForm, { PTDynamicFormRef, FormSection } from '../../components/general/DynamicForm/DynamicForm'
import { useRef } from "react";
import { PTText } from '../../components/comman';

function NewCardRequest() {
    const navigation = useNavigation<any>()
    const formRef = useRef<PTDynamicFormRef>(null);
    const sections: FormSection[] = [
        /* =======================
           Patient Details
        ======================== */
        {
            title: 'Patient Details',
            id: 'patientDetails',
            type: 'object',
            fields: [
                {
                    id: 'fullName',
                    label: 'Full Name',
                    type: 'text',
                    placeholder: 'Enter your full name',
                    validations: [{ name: 'required', value: true }],
                    path: 'patient.fullName',
                },
                {
                    id: 'contactNumber',
                    label: 'Contact Number',
                    type: 'tel',
                    placeholder: '+91-XXXXXXXXXX',
                    validations: [
                        { name: 'required', value: true },
                        { name: 'pattern', value: /^[0-9]{10}$/, message: 'Enter valid 10 digit number' },
                    ],
                    path: 'patient.contactNumber',
                },
                {
                    id: 'alternateNumber',
                    label: 'Alternate Number',
                    type: 'tel',
                    placeholder: '+91-XXXXXXXXXX',
                    validations: [
                        { name: 'pattern', value: /^[0-9]{10}$/, message: 'Enter valid 10 digit number' },
                    ],
                    path: 'patient.alternateNumber',
                },
                {
                    id: 'healthIssue',
                    label: 'Health Issue / Medical Condition',
                    type: 'textarea',
                    placeholder: 'Describe your health condition or medical issue',
                    validations: [{ name: 'required', value: true }],
                    path: 'patient.healthIssue',
                },
            ],
        },

        /* =======================
           Treatment Details
        ======================== */
        {
            title: 'Treatment Details',
            id: 'treatmentDetails',
            type: 'object',
            fields: [
                {
                    id: 'hospitalName',
                    label: 'Hospital Name Where Treatment Taken',
                    type: 'text',
                    placeholder: 'Enter hospital name',
                    validations: [{ name: 'required', value: true }],
                    path: 'treatment.hospitalName',
                },
                {
                    id: 'hospitalAddress',
                    label: 'Hospital Address',
                    type: 'textarea',
                    placeholder: 'Enter complete hospital address with city and pincode',
                    validations: [{ name: 'required', value: true }],
                    path: 'treatment.hospitalAddress',
                },
                {
                    id: 'hospitalType',
                    label: 'Hospital Type',
                    type: 'radio',
                    values: [
                        { id: 'Government', name: 'Government Hospital' },
                        { id: 'Private', name: 'Private Hospital' },
                        { id: 'Clinic', name: 'Clinic' },
                    ],
                    validations: [{ name: 'required', value: true }],
                    path: 'treatment.hospitalType',
                },
                {
                    id: 'treatmentDuration',
                    label: 'How Many Years About Your Treatment',
                    type: 'text',
                    placeholder: 'e.g., 2 years, 6 months',
                    validations: [{ name: 'required', value: true }],
                    path: 'treatment.duration',
                },
            ],
        },

        /* =======================
           Medical Documents
        ======================== */
        {
            title: 'Medical Documents',
            id: 'medicalDocuments',
            type: 'object',
            fields: [
                {
                    id: 'medicalReports',
                    label: 'Upload Prescription / Medical Reports',
                    type: 'file',
                    accept: ['application/pdf', 'image/*'],
                    maxSizeMB: 10,
                    multiple: true,
                    validations: [{ name: 'required', value: true }],
                    path: 'documents.medicalReports',
                },
            ],
        },

        /* =======================
           Reference Details (Optional)
        ======================== */
        {
            title: 'Reference Details (Optional)',
            id: 'referenceDetails',
            type: 'object',
            fields: [
                {
                    id: 'referenceName',
                    label: 'Reference Name & Details',
                    type: 'text',
                    placeholder: 'Name of person referring you',
                    path: 'reference.name',
                },
                {
                    id: 'referenceContact',
                    label: 'Reference Contact Number',
                    type: 'tel',
                    placeholder: '+91-XXXXXXXXXX',
                    validations: [
                        { name: 'pattern', value: /^[0-9]{10}$/, message: 'Enter valid 10 digit number' },
                    ],
                    path: 'reference.contactNumber',
                },
            ],
        },
    ];


    const handleSubmit = (data: Record<string, any>) => {
        // You get the JSON object here — do what you need (API call, navigation, etc.)
        console.log('NewCardRequest submit:', data)
        Alert.alert('Form submitted', JSON.stringify(data, null, 2), [
            { text: 'OK', onPress: () => navigation.goBack() }
        ])
    }

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

export default NewCardRequest
