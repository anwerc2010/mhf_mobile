import React from 'react';
import { View } from 'react-native';
import PTDynamicForm, { PTDynamicFormRef, FormSection } from '../../components/general/DynamicForm/DynamicForm'
import { useRef } from "react";
import { PTText } from '../../components/comman';

export default function VolunteersScreen() {
    const formRef = useRef<PTDynamicFormRef>(null);
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
                    id: 'fullName',
                    label: 'Full Name',
                    type: 'text',
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
                        { name: 'pattern', value: /^[0-9]{10}$/, message: 'Enter valid 10 digit number' },
                    ],
                    path: 'personal.phoneNumber',
                },
                {
                    id: 'alternateContact',
                    label: 'Alternate Contact No.',
                    type: 'tel',
                    placeholder: '+91-XXXXXXXXXX',
                    validations: [
                        { name: 'pattern', value: /^[0-9]{10}$/ },
                    ],
                    path: 'personal.alternateContact',
                },
                {
                    id: 'email',
                    label: 'Email Address',
                    type: 'email',
                    validations: [
                        { name: 'required', value: true },
                        { name: 'pattern', value: /^[^@]+@[^@]+\.[^@]+$/, message: 'Invalid email address' },
                    ],
                    path: 'personal.email',
                },
                {
                    id: 'address',
                    label: 'Address',
                    type: 'textarea',
                    validations: [{ name: 'required', value: true }],
                    path: 'personal.address',
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
                    path: 'professional.qualification',
                },
                {
                    id: 'employmentStatus',
                    label: 'Employment Status',
                    type: 'radio',
                    values: [
                        { id: 'Student', name: 'Student' },
                        { id: 'Employee', name: 'Employee' },
                        { id: 'SelfEmployed', name: 'Self Employed' },
                    ],
                    validations: [{ name: 'required', value: true }],
                    path: 'professional.employmentStatus',
                },
                {
                    id: 'occupation',
                    label: 'Occupation',
                    type: 'text',
                    validations: [{ name: 'required', value: true }],
                    path: 'professional.occupation',
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
                    id: 'volunteerAreas',
                    label: 'Which areas would you like to volunteer in?',
                    type: 'multiselect',
                    values: [
                        { id: 'HealthCamps', name: 'Health Camps' },
                        { id: 'AwarenessDrives', name: 'Awareness Drives' },
                        { id: 'DataEntry', name: 'Data Entry / Office Work' },
                        { id: 'SocialMedia', name: 'Social Media Promotion' },
                        { id: 'Fundraising', name: 'Fundraising' },
                        { id: 'CommunityOutreach', name: 'Community Outreach' },
                        { id: 'Other', name: 'Other' },
                    ],
                    validations: [{ name: 'required', value: true }],
                    path: 'volunteering.areas',
                },
                {
                    id: 'availability',
                    label: 'Availability',
                    type: 'multiselect',
                    values: [
                        { id: 'Weekdays', name: 'Weekdays' },
                        { id: 'Weekends', name: 'Weekends' },
                        { id: 'Flexible', name: 'Flexible' },
                    ],
                    validations: [{ name: 'required', value: true }],
                    path: 'volunteering.availability',
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
                    id: 'previousVolunteerExperience',
                    label: 'Have you volunteered before?',
                    type: 'radio',
                    values: [
                        { id: 'Yes', name: 'Yes' },
                        { id: 'No', name: 'No' },
                    ],
                    validations: [{ name: 'required', value: true }],
                    path: 'experience.volunteeredBefore',
                },
                {
                    id: 'motivation',
                    label: 'Why do you want to join Muthala Helping Foundation as a volunteer?',
                    type: 'textarea',
                    placeholder: 'Please share your motivation and what drives you to volunteer with us...',
                    validations: [{ name: 'required', value: true }],
                    path: 'experience.motivation',
                },
            ],
        },

        /* =======================
           5. Declaration
        ======================== */
        {
            title: 'Declaration',
            id: 'declaration',
            type: 'object',
            fields: [
                {
                    id: 'declarationAccepted',
                    label:
                        'I hereby declare that the above information is true to the best of my knowledge. I agree to follow the principles and values of Muthala Helping Foundation and to carry out my volunteer responsibilities with sincerity and respect.',
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
            <PTText style={{ fontSize: 16, padding: 8, fontWeight: '400', marginBottom: 12 }}>Join Mujtaba Helping Foundation as a Volunteer</PTText>
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
    );
}
