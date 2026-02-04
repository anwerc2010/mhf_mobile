import React, { useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import PTDynamicForm, { PTDynamicFormRef, FormSection } from '../../components/general/DynamicForm/DynamicForm';
import { useNavigation } from '@react-navigation/native';
import { useCreateBloodRequestMutation } from '@psi/shared-api';

export default function BloodRequest() {
    const navigation = useNavigation<any>();
    const formRef = useRef<PTDynamicFormRef>(null);
    const [createBloodRequest, { isLoading }] = useCreateBloodRequestMutation();

    const formatRequiredDatetime = (value: any) => {
        if (!value) {
            return value;
        }

        const asString = typeof value === 'string' ? value : new Date(value).toISOString();
        const trimmed = asString.replace('T', ' ').replace('Z', '');
        return trimmed.split('.')[0];
    };

    const sections: FormSection[] = [
        {
            title: 'Patient Details',
            id: 'patientDetails',
            type: 'object',
            fields: [
                {
                    id: 'patientName',
                    label: 'Patient Name',
                    type: 'text',
                    placeholder: 'Enter patient name',
                    validations: [{ name: 'required', value: true }],
                    path: 'patient.name',
                },
                {
                    id: 'patientAge',
                    label: 'Patient Age',
                    type: 'number',
                    placeholder: 'Enter patient age',
                    validations: [{ name: 'required', value: true }],
                    path: 'patient.age',
                },
                {
                    id: 'patientGender',
                    label: 'Patient Gender',
                    type: 'radio',
                    values: [
                        { id: 'male', name: 'Male' },
                        { id: 'female', name: 'Female' },
                        { id: 'other', name: 'Other' },
                    ],
                    validations: [{ name: 'required', value: true }],
                    path: 'patient.gender',
                },
            ],
        },
        {
            title: 'Blood Request Details',
            id: 'requestDetails',
            type: 'object',
            fields: [
                {
                    id: 'requiredBloodGroup',
                    label: 'Required Blood Group',
                    type: 'select',
                    options: [
                        { label: 'A+', value: 'A+' },
                        { label: 'A-', value: 'A-' },
                        { label: 'B+', value: 'B+' },
                        { label: 'B-', value: 'B-' },
                        { label: 'AB+', value: 'AB+' },
                        { label: 'AB-', value: 'AB-' },
                        { label: 'O+', value: 'O+' },
                        { label: 'O-', value: 'O-' },
                    ],
                    validations: [{ name: 'required', value: true }],
                    path: 'request.bloodGroup',
                },
                {
                    id: 'unitsRequired',
                    label: 'Units Required',
                    type: 'number',
                    placeholder: 'Enter units required',
                    validations: [{ name: 'required', value: true }],
                    path: 'request.unitsRequired',
                },
                {
                    id: 'requiredDatetime',
                    label: 'Required Date & Time',
                    type: 'date',
                    placeholder: 'YYYY-MM-DD HH:mm:ss',
                    validations: [{ name: 'required', value: true }],
                    path: 'request.requiredDatetime',
                },
                {
                    id: 'urgencyLevel',
                    label: 'Urgency Level',
                    type: 'select',
                    options: [
                        { label: 'Low', value: 'Low' },
                        { label: 'Medium', value: 'Medium' },
                        { label: 'High', value: 'High' },
                        { label: 'Critical', value: 'Critical' },
                    ],
                    validations: [{ name: 'required', value: true }],
                    path: 'request.urgencyLevel',
                },
            ],
        },
        {
            title: 'Hospital & Doctor Details',
            id: 'hospitalDetails',
            type: 'object',
            fields: [
                {
                    id: 'hospitalName',
                    label: 'Hospital Name',
                    type: 'text',
                    placeholder: 'Enter hospital name',
                    validations: [{ name: 'required', value: true }],
                    path: 'hospital.name',
                },
                {
                    id: 'doctorName',
                    label: 'Doctor Name',
                    type: 'text',
                    placeholder: 'Enter doctor name',
                    validations: [{ name: 'required', value: true }],
                    path: 'hospital.doctorName',
                },
                {
                    id: 'doctorContact',
                    label: 'Doctor Contact',
                    type: 'tel',
                    placeholder: 'Enter doctor contact number',
                    validations: [
                        { name: 'required', value: true },
                        { name: 'pattern', value: /^[0-9]{10}$/, message: 'Enter valid 10 digit number' },
                    ],
                    path: 'hospital.doctorContact',
                },
            ],
        },
        {
            title: 'Requester Details',
            id: 'requesterDetails',
            type: 'object',
            fields: [
                {
                    id: 'requesterName',
                    label: 'Requester Name',
                    type: 'text',
                    placeholder: 'Enter requester name',
                    validations: [{ name: 'required', value: true }],
                    path: 'requester.name',
                },
                {
                    id: 'requesterMobile',
                    label: 'Requester Mobile',
                    type: 'tel',
                    placeholder: 'Enter requester mobile number',
                    validations: [
                        { name: 'required', value: true },
                        { name: 'pattern', value: /^[0-9]{10}$/, message: 'Enter valid 10 digit number' },
                    ],
                    path: 'requester.mobile',
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
                    path: 'requester.email',
                },
            ],
        },
        {
            title: 'Address Details',
            id: 'addressDetails',
            type: 'object',
            fields: [
                {
                    id: 'address',
                    label: 'Address',
                    type: 'textarea',
                    placeholder: 'Enter address',
                    validations: [{ name: 'required', value: true }],
                    path: 'address.address',
                },
                {
                    id: 'city',
                    label: 'City',
                    type: 'text',
                    placeholder: 'Enter city',
                    validations: [{ name: 'required', value: true }],
                    path: 'address.city',
                },
                {
                    id: 'district',
                    label: 'District',
                    type: 'text',
                    placeholder: 'Enter district',
                    validations: [{ name: 'required', value: true }],
                    path: 'address.district',
                },
                {
                    id: 'state',
                    label: 'State',
                    type: 'text',
                    placeholder: 'Enter state',
                    validations: [{ name: 'required', value: true }],
                    path: 'address.state',
                },
                {
                    id: 'pincode',
                    label: 'Pincode',
                    type: 'text',
                    placeholder: 'Enter pincode',
                    validations: [
                        { name: 'required', value: true },
                        { name: 'pattern', value: /^[0-9]{6}$/, message: 'Enter valid 6 digit pincode' },
                    ],
                    path: 'address.pincode',
                },
            ],
        },
        {
            title: 'Remarks',
            id: 'remarksSection',
            type: 'object',
            fields: [
                {
                    id: 'remarks',
                    label: 'Remarks',
                    type: 'textarea',
                    placeholder: 'Enter remarks or additional details',
                    path: 'remarks.remarks',
                },
            ],
        },
    ];

    const handleSubmit = async (data: Record<string, any>) => {
        const payload = {
            email: data.requester?.email,
            patient_name: data.patient?.name,
            patient_age: data.patient?.age,
            patient_gender: data.patient?.gender,
            required_blood_group: data.request?.bloodGroup,
            units_required: data.request?.unitsRequired,
            required_datetime: formatRequiredDatetime(data.request?.requiredDatetime),
            urgency_level: data.request?.urgencyLevel,
            hospital_name: data.hospital?.name,
            doctor_name: data.hospital?.doctorName,
            doctor_contact: data.hospital?.doctorContact,
            requester_name: data.requester?.name,
            requester_mobile: data.requester?.mobile,
            address: data.address?.address,
            state: data.address?.state,
            district: data.address?.district,
            city: data.address?.city,
            pincode: data.address?.pincode,
            remarks: data.remarks?.remarks,
            status: ''
        };

        try {
            console.log('Submitting payload:', JSON.stringify(payload, null, 2));
            const response = await createBloodRequest(payload).unwrap();
            Alert.alert(
                'Success',
                response?.message || 'Blood request submitted successfully',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        } catch (error: any) {
            Alert.alert(
                'Error',
                error?.data?.message || 'Failed to submit blood request. Please try again.'
            );
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.subtitle}>
                Fill in the details below to request blood
            </Text>
            {isLoading && <ActivityIndicator size="large" color="#DC2626" style={{ marginBottom: 12 }} />}
            <PTDynamicForm
                ref={formRef}
                sections={sections}
                initialValues={{}}
                mode="onBlur"
                submitButtonText={isLoading ? 'Submitting...' : 'Submit Request'}
                onSubmit={handleSubmit}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    subtitle: {
        fontSize: 16,
        padding: 8,
        fontWeight: '400',
        marginBottom: 12,
        color: '#6B7280',
    },
});
