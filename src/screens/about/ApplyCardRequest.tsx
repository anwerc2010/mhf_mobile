import React, { useRef, useState } from 'react';
import { View, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PTDynamicForm, { PTDynamicFormRef, FormSection } from '../../components/general/DynamicForm/DynamicForm';
import { PTText } from '../../components/comman';
import { useApplyHealthCardMutation, useUploadDocumentMutation } from '@psi/shared-api';
import { FileData } from '../../components/comman/PTFilePicker';

function ApplyCardRequest() {
    const navigation = useNavigation<any>();
    const formRef = useRef<PTDynamicFormRef>(null);
    const [cardType, setCardType] = useState<string>('');
    const [applyHealthCard, { isLoading }] = useApplyHealthCardMutation();
    const [uploadDocument, { isLoading: isUploading }] = useUploadDocumentMutation();
    const isSubmitting = isLoading || isUploading;

    const sections: FormSection[] = [
        {
            title: 'Card Holder Details',
            id: 'cardHolder',
            type: 'object',
            fields: [
                {
                    id: 'card_holder_name',
                    label: 'Card Holder Name',
                    type: 'text',
                    placeholder: 'Enter full name',
                    validations: [{ name: 'required', value: true }],
                    path: 'card_holder.card_holder_name',
                },
                {
                    id: 'aadhaar_number',
                    label: 'Aadhaar Number',
                    type: 'text',
                    placeholder: '1111 2222 3333',
                    validations: [
                        { name: 'required', value: true },
                        { name: 'pattern', value: /^[0-9]{4} [0-9]{4} [0-9]{4}$/, message: 'Enter valid Aadhaar number (XXXX XXXX XXXX)' },
                        {name: 'maxLength', value: 14, message: 'Aadhaar number cannot exceed 14 characters' },
                    ],
                    path: 'card_holder.aadhaar_number',
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
                    path: 'card_holder.blood_group',
                },
                {
                    id: 'phone',
                    label: 'Phone',
                    type: 'tel',
                    placeholder: 'Enter 10 digit number',
                    validations: [
                        { name: 'required', value: true },
                        { name: 'pattern', value: /^[0-9]{10}$/, message: 'Enter valid 10 digit number' },
                    ],
                    path: 'card_holder.phone',
                },
                {
                    id: 'email',
                    label: 'Email',
                    type: 'email',
                    placeholder: 'Enter email address',
                    validations: [
                        { name: 'required', value: true },
                        { name: 'pattern', value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter valid email address' },
                    ],
                    path: 'card_holder.email',
                },
                {
                    id: 'address',
                    label: 'Address',
                    type: 'textarea',
                    placeholder: 'Enter address',
                    validations: [{ name: 'required', value: true }],
                    path: 'card_holder.address',
                },
                {
                    id: 'city',
                    label: 'City',
                    type: 'text',
                    placeholder: 'Enter city',
                    validations: [{ name: 'required', value: true }],
                    path: 'card_holder.city',
                },
                {
                    id: 'district',
                    label: 'District',
                    type: 'text',
                    placeholder: 'Enter district',
                    validations: [{ name: 'required', value: true }],
                    path: 'card_holder.district',
                },
                {
                    id: 'state',
                    label: 'State',
                    type: 'text',
                    placeholder: 'Enter state',
                    path: 'card_holder.state',
                },
                {
                    id: 'pincode',
                    label: 'Pincode',
                    type: 'text',
                    placeholder: 'Enter pincode',
                    validations: [
                        { name: 'pattern', value: /^[0-9]{6}$/, message: 'Enter valid 6 digit pincode' },
                    ],
                    path: 'card_holder.pincode',
                },
                {
                    id: 'gender',
                    label: 'Gender',
                    type: 'radio',
                    values: [
                        { id: 'Male', name: 'Male' },
                        { id: 'Female', name: 'Female' },
                    ],
                    validations: [{ name: 'required', value: true }],
                    path: 'card_holder.gender',
                },
                {
                    id: 'age_category',
                    label: 'Age Category',
                    type: 'radio',
                    values: [
                        { id: 'Child', name: 'Child' },
                        { id: 'Adult', name: 'Adult' },
                    ],
                    validations: [{ name: 'required', value: true }],
                    path: 'card_holder.age_category',
                },
                {
                    id: 'family_head_image',
                    label: 'Family Head Image',
                    type: 'file',
                    maxFiles: 1,
                    acceptedTypes: ['image/png', 'image/jpg', 'image/jpeg'],
                    validations: [{ name: 'required', value: true }],
                    path: 'card_holder.family_head_image',
                },
            ],
        },
        {
            title: 'Card Details',
            id: 'cardDetails',
            type: 'object',
            fields: [
                {
                    id: 'type',
                    label: 'Card Type',
                    type: 'radio',
                    values: [
                        { id: 'individual', name: 'Individual' },
                        { id: 'family', name: 'Family' },
                    ],
                    validations: [{ name: 'required', value: true }],
                    path: 'card_details.type',
                },
                {
                    id: 'date_of_issue',
                    label: 'Date of Issue',
                    type: 'text',
                    disabled: true,
                    path: 'card_details.date_of_issue',
                },
                {
                    id: 'date_of_expiry',
                    label: 'Date of Expiry',
                    type: 'text',
                    disabled: true,
                    path: 'card_details.date_of_expiry',
                },
            ],
        },
    ];

    // Conditionally add family members section only if card type is 'family'
    if (cardType === 'family') {
        sections.push({
            title: 'Family Members',
            id: 'family_members',
            type: 'array',
            minItems: 0,
            maxItems: 5,
            fields: [
                {
                    id: 'name',
                    label: 'Full Name',
                    type: 'text',
                    placeholder: 'Enter full name',
                    validations: [{ name: 'required', value: true }],
                },
                {
                    id: 'relationship',
                    label: 'Relationship',
                    type: 'select',
                    options: [
                        { id: 'Spouse', name: 'Spouse' },
                        { id: 'Son', name: 'Son' },
                        { id: 'Daughter', name: 'Daughter' },
                        { id: 'Father', name: 'Father' },
                        { id: 'Mother', name: 'Mother' },
                        { id: 'Brother', name: 'Brother' },
                        { id: 'Sister', name: 'Sister' },
                    ],
                    validations: [{ name: 'required', value: true }],
                },
                {
                    id: 'aadhaar_number',
                    label: 'Aadhaar Number',
                    type: 'text',
                    placeholder: '1111 2222 3333',
                    validations:  [
                        { name: 'required', value: true },
                        { name: 'pattern', value: /^[0-9]{4} [0-9]{4} [0-9]{4}$/, message: 'Enter valid Aadhaar number (XXXX XXXX XXXX)' },
                        {name: 'maxLength', value: 14, message: 'Aadhaar number cannot exceed 14 characters' },
                    ],
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
                },
                {
                    id: 'date_of_birth',
                    label: 'Date of Birth',
                    type: 'date',
                },
                {
                    id: 'gender',
                    label: 'Gender',
                    type: 'radio',
                    values: [
                        { id: 'Male', name: 'Male' },
                        { id: 'Female', name: 'Female' },
                    ],
                },
                {
                    id: 'age_category',
                    label: 'Age Category',
                    type: 'radio',
                    values: [
                        { id: 'Child', name: 'Child' },
                        { id: 'Adult', name: 'Adult' },
                    ],
                },
            ],
        });
    }

    const normalizeDocuments = (documents: FileData | FileData[] | string | string[] | null | undefined) => {
        if (!documents) return [] as Array<FileData | string>;
        return Array.isArray(documents) ? documents : [documents];
    };

    const uploadDocuments = async (documents: Array<FileData | string>) => {
        const uploadedUrls: string[] = [];

        for (const doc of documents) {
            if (typeof doc === 'string') {
                uploadedUrls.push(doc);
                continue;
            }

            const formData = new FormData();
            formData.append('document', {
                uri: doc.uri,
                name: doc.name,
                type: doc.type,
            } as any);

            const response = await uploadDocument(formData).unwrap();
            if (response?.data?.url) {
                uploadedUrls.push(response.data.url);
            }
        }

        return uploadedUrls;
    };

    const handleSubmit = async (values: Record<string, any>) => {
        try {
            const imageInputs = normalizeDocuments(values.card_holder?.family_head_image);
            const uploadedImageUrls = await uploadDocuments(imageInputs);
            const uploadedImageUrl = uploadedImageUrls.length > 0 ? uploadedImageUrls[0] : '';
            // Add date of issue (today) and date of expiry (1 year from today)
            const today = new Date();
            const nextYear = new Date(today);
            nextYear.setFullYear(today.getFullYear() + 1);
            nextYear.setDate(nextYear.getDate() - 1);

            // Flatten and format data to match API expected structure
            const formattedData = {
                card_holder_name: values.card_holder?.card_holder_name,
                aadhaar_number: values.card_holder?.aadhaar_number,
                blood_group: values.card_holder?.blood_group,
                phone: values.card_holder?.phone,
                email: values.card_holder?.email,
                address: values.card_holder?.address,
                city: values.card_holder?.city,
                district: values.card_holder?.district,
                state: values.card_holder?.state,
                pincode: values.card_holder?.pincode,
                gender: values.card_holder?.gender,
                age_category: values.card_holder?.age_category,
                family_head_image: uploadedImageUrl,
                type: values.card_details?.type,
                date_of_issue: today.toISOString().split('T')[0],
                date_of_expiry: nextYear.toISOString().split('T')[0],
                family_members: values.family_members || [],
            };

            console.log('Apply card request values:', JSON.stringify(formattedData, null, 2));

            // Call the mutation
            const response = await applyHealthCard(formattedData).unwrap();

            console.log('Health Card Application Response:', response);

            Alert.alert('Success', 'Card application submitted successfully', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (err: any) {
            console.error('Error submitting health card application:', err);
            Alert.alert('Error', err?.data?.message || err?.message || 'Failed to submit application');
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <PTText style={{ fontSize: 16, padding: 8, fontWeight: '400', marginBottom: 12 }}>
                Please fill in all the details to apply for a health card
            </PTText>
            <PTDynamicForm
                ref={formRef}
                sections={sections}
                initialValues={{
                    card_details: {
                        date_of_issue: new Date().toLocaleDateString('en-GB'),
                        date_of_expiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('en-GB'),
                    },
                }}
                mode="onBlur"
                submitButtonText="Save Details"
                submitLoading={isSubmitting}
                onSubmit={handleSubmit}
                onValueChange={(fieldId, value, allValues, fieldPath) => {
                    console.log(`${fieldId} changed to`, value);

                    // Format Aadhaar number as XXXX XXXX XXXX (max 14 characters)
                    if (fieldId === 'aadhaar_number' && typeof value === 'string' && fieldPath) {
                        const numbers = value.replace(/\D/g, '');
                        if (numbers.length <= 12) {
                            let formatted = '';
                            for (let i = 0; i < numbers.length; i++) {
                                if (i > 0 && i % 4 === 0) {
                                    formatted += ' ';
                                }
                                formatted += numbers[i];
                            }
                            if (formatted !== value) {
                                formRef.current?.setValue(fieldPath, formatted);
                            }
                        }
                    }

                    if (fieldId === 'type') {
                        setCardType(value);
                    }
                }}
            />
        </View>
    );
}

export default ApplyCardRequest;
