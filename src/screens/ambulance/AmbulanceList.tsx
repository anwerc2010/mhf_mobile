import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Linking, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import { useGetAmbulancesQuery } from '@psi/shared-api';
import { PhoneCall, MapPin, Clock, Truck } from 'phosphor-react-native';

export default function AmbulanceList() {
    const { t } = useTranslation();
    const { data: ambulancesResponse, isLoading, error, refetch } = useGetAmbulancesQuery();

    useFocusEffect(
        React.useCallback(() => {
            refetch();
        }, [refetch])
    );

    const handlePhoneCall = (contact: string, serviceName: string) => {
        const phoneNumber = contact?.replace(/\s/g, '');
        if (phoneNumber) {
            Linking.openURL(`tel:${phoneNumber}`).catch(() => {
                Alert.alert('Error', 'Unable to make phone call');
            });
        } else {
            Alert.alert('No Contact', `No contact number available for ${serviceName}`);
        }
    };

    const getStatusStyle = (status: string) => {
        const statusLower = (status ?? '').toString().toLowerCase();
        switch (statusLower) {
            case 'available':
                return styles.statusAvailable;
            case 'unavailable':
                return styles.statusUnavailable;
            case 'busy':
                return styles.statusBusy;
            default:
                return styles.statusAvailable;
        }
    };

    const getStatusLabel = (status: string) => {
        const statusLower = (status ?? '').toString().toLowerCase();
        return statusLower ? statusLower.charAt(0).toUpperCase() + statusLower.slice(1) : '';
    };

    const ambulances = Array.isArray(ambulancesResponse?.data) ? ambulancesResponse.data : [];

    const renderAmbulanceItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.headerLeft}>
                    <Text style={styles.serviceName}>{item.service_name}</Text>
                    <Text style={styles.company}>{item.company}</Text>
                </View>
                <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
                    <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
                </View>
            </View>

            <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                    <Truck size={16} color="#64748B" />
                    <Text style={styles.detailLabel}>Vehicle Type:</Text>
                    <Text style={styles.detailValue}>{item.vehicle_type}</Text>
                </View>

                <View style={styles.detailRow}>
                    <MapPin size={16} color="#64748B" />
                    <Text style={styles.detailLabel}>Service Area:</Text>
                    <Text style={styles.detailValue}>{item.service_area}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Clock size={16} color="#64748B" />
                    <Text style={styles.detailLabel}>Response Time:</Text>
                    <Text style={styles.detailValue}>{item.response_time}</Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.callButton}
                onPress={() => handlePhoneCall(item.contact, item.service_name)}
            >
                <PhoneCall size={18} color="#fff" weight="fill" />
                <Text style={styles.callButtonText}>Call {item.contact}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.page}>
            <View style={styles.headerCard}>
                <Text style={styles.headerTitle}>{t('ambulance.title', 'Ambulance Services')}</Text>
                <Text style={styles.headerSubtitle}>
                    {t('ambulance.subtitle', '24/7 emergency ambulance services available')}
                </Text>
            </View>

            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#DC2626" />
                    <Text style={styles.loadingText}>{t('ambulance.loading', 'Loading ambulances...')}</Text>
                </View>
            )}

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{t('ambulance.error', 'Failed to load ambulances')}</Text>
                </View>
            )}

            {!isLoading && !error && ambulances.length === 0 && (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>{t('ambulance.empty', 'No ambulances available')}</Text>
                </View>
            )}

            {!isLoading && !error && ambulances.length > 0 && (
                <FlatList
                    data={ambulances}
                    renderItem={renderAmbulanceItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    page: { flex: 1, backgroundColor: '#F6F7FB' },
    headerCard: {
        backgroundColor: '#DC2626',
        borderRadius: 12,
        padding: 16,
        margin: 16,
        marginBottom: 8,
    },
    headerTitle: { color: '#fff', fontWeight: '700', fontSize: 18 },
    headerSubtitle: { color: '#FECACA', marginTop: 6, fontSize: 14 },
    listContent: { padding: 16, paddingTop: 8 },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    headerLeft: { flex: 1 },
    serviceName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 4,
    },
    company: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '500',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    statusText: { color: '#fff', fontSize: 11, fontWeight: '700' },
    statusAvailable: { backgroundColor: '#16A34A' },
    statusUnavailable: { backgroundColor: '#DC2626' },
    statusBusy: { backgroundColor: '#F59E0B' },
    detailsContainer: { marginBottom: 12 },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 13,
        color: '#64748B',
        marginLeft: 8,
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 13,
        color: '#0F172A',
        marginLeft: 6,
        fontWeight: '600',
        flex: 1,
    },
    callButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#16A34A',
        paddingVertical: 12,
        borderRadius: 10,
        gap: 8,
    },
    callButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
    },
    loadingContainer: { alignItems: 'center', paddingVertical: 40 },
    loadingText: { marginTop: 12, color: '#64748B', fontSize: 14 },
    errorContainer: {
        backgroundColor: '#FEE2E2',
        borderRadius: 10,
        padding: 16,
        margin: 16,
    },
    errorText: { color: '#B91C1C', fontWeight: '600', textAlign: 'center' },
    emptyContainer: { alignItems: 'center', paddingVertical: 40 },
    emptyText: { color: '#64748B', fontSize: 14 },
});
