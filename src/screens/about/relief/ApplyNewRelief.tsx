import React from 'react'
import { Text, View } from 'react-native'
import PTDynamicForm, { PTDynamicFormRef, FormSection } from '../../../components/general/DynamicForm/DynamicForm'
import { useRef } from "react";
import { useNavigation } from '@react-navigation/native';
import { PTText } from '../../../components/comman';
function ApplyNewRelief() {
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
                    id: 'fatherOrHusbandName',
                    label: "Father's / Husband's Name",
                    type: 'text',
                    placeholder: "Enter father's or husband's name",
                    validations: [{ name: 'required', value: true }],
                    path: 'personal.guardianName',
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
                    id: 'mobileNumber',
                    label: 'Mobile Number',
                    type: 'tel',
                    placeholder: '+91-XXXXXXXXXX',
                    validations: [
                        { name: 'required', value: true },
                        { name: 'pattern', value: /^[0-9]{10}$/, message: 'Enter valid 10 digit number' },
                    ],
                    path: 'personal.mobileNumber',
                },
                {
                    id: 'alternateNumber',
                    label: 'Alternate Number',
                    type: 'tel',
                    placeholder: '+91-XXXXXXXXXX',
                    validations: [
                        { name: 'pattern', value: /^[0-9]{10}$/ },
                    ],
                    path: 'personal.alternateNumber',
                },
                {
                    id: 'currentAddress',
                    label: 'Current Address (With Pin Code)',
                    type: 'textarea',
                    placeholder: 'Enter your complete address with pin code',
                    validations: [{ name: 'required', value: true }],
                    path: 'personal.address',
                },
                {
                    id: 'idProofType',
                    label: 'ID Proof Type',
                    type: 'select',
                    options: [
                        { id: 'Aadhar', name: 'Aadhar' },
                        { id: 'VoterID', name: 'Voter ID' },
                        { id: 'PAN', name: 'PAN Card' },
                        { id: 'Other', name: 'Other' },
                    ],
                    validations: [{ name: 'required', value: true }],
                    path: 'personal.idProofType',
                },
                {
                    id: 'idProofNumber',
                    label: 'ID Proof Number',
                    type: 'text',
                    placeholder: 'Enter ID proof number',
                    validations: [{ name: 'required', value: true }],
                    path: 'personal.idProofNumber',
                },
            ],
        },

        /* =======================
           2. Family & Living Situation
        ======================== */
        {
            title: 'Family and Living Situation',
            id: 'familyLivingSituation',
            type: 'object',
            fields: [
                {
                    id: 'totalFamilyMembers',
                    label: 'Total Family Members',
                    type: 'number',
                    validations: [{ name: 'required', value: true }],
                    path: 'family.totalMembers',
                },
                {
                    id: 'earningMembers',
                    label: 'Earning Members',
                    type: 'number',
                    validations: [{ name: 'required', value: true }],
                    path: 'family.earningMembers',
                },
                {
                    id: 'childrenBelow5',
                    label: 'Children (Below 5)',
                    type: 'number',
                    path: 'family.childrenBelow5',
                },
                {
                    id: 'childrenSchoolGoing',
                    label: 'Children (School-going)',
                    type: 'number',
                    path: 'family.childrenSchoolGoing',
                },
                {
                    id: 'elderlyOrDisabled',
                    label: 'Elderly / Disabled Members',
                    type: 'radio',
                    values: [
                        { id: 'Yes', name: 'Yes' },
                        { id: 'No', name: 'No' },
                    ],
                    validations: [{ name: 'required', value: true }],
                    path: 'family.elderlyOrDisabled',
                },
                {
                    id: 'typeOfHouse',
                    label: 'Type of House',
                    type: 'radio',
                    values: [
                        { id: 'Owned', name: 'Owned' },
                        { id: 'Temporary', name: 'Temporary' },
                        { id: 'Rented', name: 'Rented' },
                        { id: 'Damaged', name: 'Damaged' },
                    ],
                    validations: [{ name: 'required', value: true }],
                    path: 'family.houseType',
                },
            ],
        },

        /* =======================
           3. Reason for Request
        ======================== */
        {
            title: 'Reason for Request',
            id: 'reasonForRequest',
            type: 'object',
            fields: [
                {
                    id: 'reason',
                    label: 'Reason for Request (Optional but helpful)',
                    type: 'textarea',
                    placeholder: 'Describe your situation and why you need assistance',
                    validations: [{ name: 'required', value: true }],
                    path: 'request.reason',
                },
            ],
        },

        /* =======================
           4. What Do You Need From Us?
        ======================== */
        {
            title: 'What Do You Need From Us?',
            id: 'assistanceRequired',
            type: 'object',
            fields: [
                {
                    id: 'assistanceTypes',
                    label: 'Please tick the items you are requesting',
                    type: 'multiselect',
                    values: [
                        { id: 'FoodKit', name: 'Food Kit' },
                        { id: 'Water', name: 'Water' },
                        { id: 'Clothes', name: 'Clothes' },
                        { id: 'Shelter', name: 'Shelter / Temporary Housing' },
                        { id: 'MedicalHelp', name: 'Medicine / Medical Help' },
                        { id: 'Other', name: 'Others (please specify)' },
                    ],
                    validations: [{ name: 'required', value: true }],
                    path: 'assistance.items',
                },
            ],
        },

        /* =======================
           5. Documents
        ======================== */
        {
            title: 'Documents',
            id: 'documents',
            type: 'object',
            fields: [
                {
                    id: 'submittedDocuments',
                    label: 'Tick if you have submitted any',
                    type: 'multiselect',
                    values: [
                        { id: 'Aadhar', name: 'Aadhar Card' },
                        { id: 'IncomeCertificate', name: 'Income Certificate' },
                        { id: 'MedicalReport', name: 'Medical Report' },
                        { id: 'RationCard', name: 'Ration Card' },
                        { id: 'DisabilityCertificate', name: 'Disability Certificate' },
                        { id: 'Photo', name: 'Photo (Passport size)' },
                    ],
                    path: 'documents.submitted',
                },
            ],
        },

        /* =======================
           6. Declaration
        ======================== */
        {
            title: 'Declaration',
            id: 'declaration',
            type: 'object',
            fields: [
                {
                    id: 'declarationAccepted',
                    label:
                        'I declare that the information provided above is true and accurate to the best of my knowledge.',
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
            <PTText style={{ fontSize: 16, padding: 8, fontWeight: '400', marginBottom: 12 }}>Apply for Support</PTText>
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

export default ApplyNewRelief
