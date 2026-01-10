import React from 'react'
import { View } from 'react-native'
import PTDynamicForm, { PTDynamicFormRef, FormSection } from '../../../components/general/DynamicForm/DynamicForm'
import { useRef } from "react";
import { useNavigation } from '@react-navigation/native';
import { PTText } from '../../../components/comman';

function RegisterForTraining() {
    const navigation = useNavigation<any>()
    const formRef = useRef<PTDynamicFormRef>(null);

    const sections: FormSection[] = [
        /* =======================
           Personal Details
        ======================== */
        {
            title: 'Personal Details',
            id: 'personalDetails',
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
                    id: 'contactNumber',
                    label: 'Contact Number (Phone / WhatsApp)',
                    type: 'tel',
                    placeholder: '+91-XXXXXXXXXX',
                    validations: [
                        { name: 'required', value: true },
                        { name: 'pattern', value: /^[0-9]{10}$/, message: 'Enter valid 10 digit number' },
                    ],
                    path: 'personal.contactNumber',
                },
                {
                    id: 'parentContactNumber',
                    label: "Parent's / Guardian's Contact Number",
                    type: 'tel',
                    placeholder: '+91-XXXXXXXXXX',
                    validations: [
                        { name: 'required', value: true },
                        { name: 'pattern', value: /^[0-9]{10}$/ },
                    ],
                    path: 'personal.parentContactNumber',
                },
                {
                    id: 'maritalStatus',
                    label: 'Marital Status',
                    type: 'select',
                    options: [
                        { id: 'Single', name: 'Single' },
                        { id: 'Married', name: 'Married' },
                        { id: 'Other', name: 'Other' },
                    ],
                    path: 'personal.maritalStatus',
                },
                {
                    id: 'email',
                    label: 'Email ID (Available)',
                    type: 'email',
                    validations: [
                        { name: 'pattern', value: /^[^@]+@[^@]+\.[^@]+$/, message: 'Invalid email' },
                    ],
                    path: 'personal.email',
                },
                {
                    id: 'address',
                    label: 'Address (With Pin Code)',
                    type: 'textarea',
                    placeholder: 'Enter your complete address with pin code',
                    validations: [{ name: 'required', value: true }],
                    path: 'personal.address',
                },
                {
                    id: 'guardianName',
                    label: "Guardian's Name (If any)",
                    type: 'text',
                    path: 'personal.guardianName',
                },
                {
                    id: 'idProof',
                    label: 'ID Proof (Aadhar / Other)',
                    type: 'text',
                    placeholder: 'Aadhar number or other ID proof number',
                    validations: [{ name: 'required', value: true }],
                    path: 'personal.idProof',
                },
            ],
        },

        /* =======================
           Educational Background
        ======================== */
        {
            title: 'Educational Background',
            id: 'educationDetails',
            type: 'object',
            fields: [
                {
                    id: 'highestQualification',
                    label: 'Highest Qualification',
                    type: 'radio',
                    values: [
                        { id: '10th', name: '10th' },
                        { id: '12th', name: '12th' },
                        { id: 'Graduation', name: 'Graduation' },
                        { id: 'Other', name: 'Other' },
                    ],
                    validations: [{ name: 'required', value: true }],
                    path: 'education.qualification',
                },
                {
                    id: 'mediumOfInstruction',
                    label: 'Medium of Instruction',
                    type: 'radio',
                    values: [
                        { id: 'Hindi', name: 'Hindi' },
                        { id: 'English', name: 'English' },
                        { id: 'Other', name: 'Other' },
                    ],
                    validations: [{ name: 'required', value: true }],
                    path: 'education.medium',
                },
                {
                    id: 'schoolCollegeName',
                    label: 'School / College Name & Location',
                    type: 'text',
                    validations: [{ name: 'required', value: true }],
                    path: 'education.institution',
                },
                {
                    id: 'gapReason',
                    label: 'Gaps in Education / Dropout Reason',
                    type: 'textarea',
                    placeholder: 'If any gaps or dropout, please mention the reason',
                    path: 'education.gapReason',
                },
            ],
        },

        /* =======================
           Course Selection
        ======================== */
        {
            title: 'Course Selection',
            id: 'courseSelection',
            type: 'object',
            fields: [
                {
                    id: 'preferredCourses',
                    label: 'Please tick your preferred training',
                    type: 'multiselect',
                    options: [
                        { id: 'Computer', name: 'Computer' },
                        { id: 'Tailoring', name: 'Tailoring' },
                        { id: 'SpokenEnglish', name: 'Spoken English' },
                        { id: 'HandmadeDesigning', name: 'Handmade Designing' },
                        { id: 'Other', name: 'Others (please specify)' },
                    ],
                    validations: [{ name: 'required', value: true }],
                    path: 'course.preferred',
                },
            ],
        },

        /* =======================
           Documents Required
        ======================== */
        {
            title: 'Documents Required',
            id: 'documents',
            type: 'object',
            fields: [
                {
                    id: 'submittedDocuments',
                    label: 'Submitted documents',
                    type: 'multiselect',
                    options: [
                        { id: 'Photo', name: 'Photo (Passport size)' },
                        { id: 'IDProof', name: 'ID Proof (Aadhar / PAN / Other)' },
                        { id: 'CasteCertificate', name: 'Caste Certificate (If any)' },
                    ],
                    validations: [{ name: 'required', value: true }],
                    path: 'documents.submitted',
                },
            ],
        },

        /* =======================
           Declaration
        ======================== */
        {
            title: 'Declaration',
            id: 'declaration',
            type: 'object',
            fields: [
                {
                    id: 'declarationAccepted',
                    label: 'I hereby declare that all the information provided is true.',
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
            <PTText style={{ fontSize: 16, padding: 8, fontWeight: '400', marginBottom: 12 }}>Registration Form</PTText>
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

export default RegisterForTraining
