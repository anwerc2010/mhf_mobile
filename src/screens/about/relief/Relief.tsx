import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, Modal, Linking, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useGetReliefWelfareQuery } from '@psi/shared-api';

const { width } = Dimensions.get('window');

export default function ReliefScreen() {
    const { t } = useTranslation();
    const navigation = useNavigation<any>();
    const { data: reliefResponse, isLoading, error, refetch } = useGetReliefWelfareQuery();
    const [reviewModalVisible, setReviewModalVisible] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<any>(null);

    useFocusEffect(
        React.useCallback(() => {
            refetch();
        }, [refetch])
    );

    const handleRequestStatusPress = (request: any) => {
        setSelectedRequest(request);
        setReviewModalVisible(true);
    };

    const getStatusColor = (status: string) => {
        const statusLower = (status ?? '').toString().toLowerCase();
        switch (statusLower) {
            case 'approved':
                return styles.statusApproved;
            case 'pending':
                return styles.statusPending;
            case 'rejected':
                return styles.statusRejected;
            default:
                return styles.statusPending;
        }
    };

    const getStatusLabel = (status: string) => {
        const statusLower = (status ?? '').toString().toLowerCase();
        return statusLower ? statusLower.charAt(0).toUpperCase() + statusLower.slice(1) : '';
    };

    const getProgramStatusColor = (status: string) => {
        const statusLower = (status ?? '').toString().toLowerCase();
        switch (statusLower) {
            case 'upcoming':
                return styles.programStatusUpcoming;
            case 'ongoing':
                return styles.programStatusOngoing;
            case 'completed':
                return styles.programStatusCompleted;
            case 'canceled':
            case 'cancelled':
                return styles.programStatusCanceled;
            default:
                return styles.programStatusUpcoming;
        }
    };

    const getProgramStatusLabel = (status: string) => {
        const statusLower = (status ?? '').toString().toLowerCase();
        return statusLower ? statusLower.charAt(0).toUpperCase() + statusLower.slice(1).replace('_', ' ') : '';
    };

    // Get category icon based on category type
    const getCategoryIcon = (category: string) => {
        const cat = (category ?? '').toString().toLowerCase();
        switch (cat) {
            case 'food':
                return '🍱';
            case 'flood':
                return '💧';
            case 'winter':
                return '❄️';
            case 'medical':
                return '🩺';
            default:
                return '🎯';
        }
    };

    // Extract relief programs from API response
    const reliefProgramsSource = (
        Array.isArray(reliefResponse?.data) ? reliefResponse?.data
            : Array.isArray((reliefResponse as any)?.programs) ? (reliefResponse as any)?.programs
                : Array.isArray((reliefResponse as any)?.data?.programs) ? (reliefResponse as any)?.data?.programs
                    : Array.isArray((reliefResponse as any)?.data?.relief_programs) ? (reliefResponse as any)?.data?.relief_programs
                        : Array.isArray((reliefResponse as any)?.relief_programs) ? (reliefResponse as any)?.relief_programs
                            : []
    );

    const reliefPrograms = reliefProgramsSource.map((item: any) => {
        const program = item?.relief_welfare ?? item;
        return {
            id: program?.id,
            icon: getCategoryIcon(program?.category),
            title: program?.title,
            locations: program?.address,
            desc: program?.description,
            items_provided: Array.isArray(program?.items_provided) ? program?.items_provided : [],
            stats: `${program?.families_supported ?? 0}+ Families Supported`,
            status: program?.status,
            allow_apply: program?.allow_apply,
            allow_donate: program?.allow_donate,
            map_url: program?.map_url,
            my_registrations: item?.my_registrations,
        };
    });

    const steps = [
        { k: 1, title: t('relief.steps.formTitle'), desc: t('relief.steps.formDesc') },
        { k: 2, title: t('relief.steps.verifyTitle'), desc: t('relief.steps.verifyDesc') },
        { k: 3, title: t('relief.steps.distributeTitle'), desc: t('relief.steps.distributeDesc') },
    ];

    const impact = [
        { title: '2000+', label: t('relief.impact.families') },
        { title: '50+', label: t('relief.impact.drives') },
        { title: '₹5L+', label: t('relief.impact.aid') },
    ];

    const renderProgramItem = ({ item }: { item: any }) => (
        <View style={styles.programCard}>
            {!!item.status && (
                <View style={[styles.programStatusBadge, getProgramStatusColor(item.status)]}>
                    <Text style={styles.programStatusText}>{getProgramStatusLabel(item.status)}</Text>
                </View>
            )}
            <View style={styles.programHeader}>
                <Text style={styles.programIcon}>{item.icon}</Text>
                <View style={{ flex: 1 }}>
                    <Text style={styles.programTitle}>{item.title}</Text>
                    {!!item.locations && <Text style={styles.programLocation}>{item.locations}</Text>}
                </View>
            </View>
            {!!item.desc && <Text style={styles.programDesc}>{item.desc}</Text>}
            {item.items_provided?.length > 0 && (
                <View style={styles.tagsRow}>
                    {item.items_provided.map((tag: string, idx: number) => (
                        <View key={`${item.id}-tag-${idx}`} style={styles.tag}>
                            <Text style={styles.tagText}>{tag}</Text>
                        </View>
                    ))}
                </View>
            )}
            {!!item.stats && <Text style={styles.programStats}>{item.stats}</Text>}
            {!!item.map_url && (
                <TouchableOpacity
                    style={styles.mapLink}
                    onPress={() => Linking.openURL(item.map_url)}
                >
                    <Text style={styles.mapLinkText}>{t('relief.viewMap', 'View on Map')}</Text>
                </TouchableOpacity>
            )}
            {item.my_registrations && Array.isArray(item.my_registrations) && item.my_registrations.length > 0 ? (
                <TouchableOpacity
                    style={[styles.registrationStatusBadge, getStatusColor(item.my_registrations[0]?.status)]}
                    onPress={() => handleRequestStatusPress(item.my_registrations[0])}
                >
                    <Text style={styles.registrationStatusText}>
                        {getStatusLabel(item.my_registrations[0]?.status)}
                    </Text>
                </TouchableOpacity>
            ) : (item.allow_apply || item.allow_donate) && (
                <View style={styles.programActions}>
                    {item.allow_apply && !['canceled', 'cancelled', 'completed'].includes((item.status ?? '').toString().toLowerCase()) && (
                        <TouchableOpacity
                            style={styles.primaryBtnSmall}
                            onPress={() => navigation.navigate('ApplyNewRelief', { program: item })}
                        >
                            <Text style={styles.applyText}>{t('relief.apply')}</Text>
                        </TouchableOpacity>
                    )}
                    {item.allow_donate && (
                        <TouchableOpacity style={styles.secondaryBtnSmall}>
                            <Text style={styles.donateText}>{t('relief.donate')}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.page}>
            <ScrollView contentContainerStyle={styles.content}>
                {isLoading && (
                    <View style={styles.centerContainer}>
                        <ActivityIndicator size="large" color="#0EA5A4" />
                        <Text style={styles.loadingText}>{t('relief.loading', 'Loading relief Programs...')}</Text>
                    </View>
                )}

                {error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{t('relief.error', 'Failed to load relief Programs')}</Text>
                    </View>
                )}

                {!isLoading && !error && reliefPrograms.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>{t('relief.activePrograms', 'Active Relief Programs')}</Text>
                        <FlatList
                            data={reliefPrograms}
                            keyExtractor={(item: any) => String(item.id ?? item.title)}
                            renderItem={renderProgramItem}
                            scrollEnabled={false}
                        />
                    </>
                )}


                <View style={styles.card}>
                    <Text style={styles.cardTitle}>{t('relief.howToApply')}</Text>
                    {steps.map(s => (
                        <View key={s.k} style={styles.stepRow}>
                            <View style={styles.stepLeft}>
                                <View style={styles.stepCircle}><Text style={styles.stepNumber}>{s.k}</Text></View>
                            </View>
                            <View style={styles.stepMain}>
                                <Text style={styles.stepTitle}>{s.title}</Text>
                                <Text style={styles.stepDesc}>{s.desc}</Text>
                            </View>
                        </View>
                    ))}
                </View>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>{t('relief.impactTitle')}</Text>
                    <View style={styles.impactRow}>
                        {impact.map((it, idx) => (
                            <View key={idx} style={styles.impactItem}>
                                <Text style={styles.impactNumber}>{it.title}</Text>
                                <Text style={styles.impactLabel}>{it.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>
                <TouchableOpacity style={styles.requestButton} activeOpacity={0.9}>
                    <Text style={styles.requestButtonText}>{t('relief.requestNewCard')}</Text>
                </TouchableOpacity>
            </ScrollView>

            <Modal
                visible={reviewModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setReviewModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{selectedRequest?.registration_id ? 'Registration Status' : 'Relief Request Details'}</Text>
                        <View style={styles.modalDivider} />
                        <View style={styles.modalBody}>
                            {selectedRequest?.registration_id && (
                                <View style={styles.modalRow}>
                                    <Text style={styles.modalLabel}>Registration ID:</Text>
                                    <Text style={styles.modalValue}>#{selectedRequest.registration_id}</Text>
                                </View>
                            )}
                            {selectedRequest?.customer_status && (
                                <View style={styles.modalRow}>
                                    <Text style={styles.modalLabel}>Status:</Text>
                                    <View style={[styles.modalStatusBadge, getStatusColor(selectedRequest?.customer_status)]}>
                                        <Text style={styles.modalStatusText}>
                                            {getStatusLabel(selectedRequest?.customer_status)}
                                        </Text>
                                    </View>
                                </View>
                            )}
                            {selectedRequest?.registered_at && (
                                <View style={styles.modalRow}>
                                    <Text style={styles.modalLabel}>Registered:</Text>
                                    <Text style={styles.modalValue}>{selectedRequest.registered_at}</Text>
                                </View>
                            )}
                            {selectedRequest?.review_notes && (
                                <View style={[styles.modalRow, { alignItems: 'flex-start' }]}>
                                    <Text style={[styles.modalLabel, { marginTop: 0 }]}>Review Note:</Text>
                                    <Text style={[styles.modalValue, { flex: 1 }]}>{selectedRequest.review_notes}</Text>
                                </View>
                            )}
                            {!selectedRequest?.review_notes && selectedRequest?.registration_id && (
                                <View style={styles.modalRow}>
                                    <Text style={styles.modalValue}>No review note available</Text>
                                </View>
                            )}
                            {selectedRequest?.request_id && (
                                <View style={styles.modalRow}>
                                    <Text style={styles.modalLabel}>Request ID:</Text>
                                    <Text style={styles.modalValue}>#{selectedRequest.request_id}</Text>
                                </View>
                            )}
                            {selectedRequest?.full_name && (
                                <View style={styles.modalRow}>
                                    <Text style={styles.modalLabel}>Name:</Text>
                                    <Text style={styles.modalValue}>{selectedRequest.full_name}</Text>
                                </View>
                            )}
                            {selectedRequest?.status && !selectedRequest?.customer_status && (
                                <View style={styles.modalRow}>
                                    <Text style={styles.modalLabel}>Status:</Text>
                                    <View style={[styles.modalStatusBadge, getStatusColor(selectedRequest?.status)]}>
                                        <Text style={styles.modalStatusText}>
                                            {getStatusLabel(selectedRequest?.status)}
                                        </Text>
                                    </View>
                                </View>
                            )}
                            {selectedRequest?.mobile && (
                                <View style={styles.modalRow}>
                                    <Text style={styles.modalLabel}>Mobile:</Text>
                                    <Text style={styles.modalValue}>{selectedRequest.mobile}</Text>
                                </View>
                            )}
                            {selectedRequest?.current_address && (
                                <View style={[styles.modalRow, { alignItems: 'flex-start' }]}>
                                    <Text style={[styles.modalLabel, { marginTop: 0 }]}>Address:</Text>
                                    <Text style={[styles.modalValue, { flex: 1 }]}>{selectedRequest.current_address}</Text>
                                </View>
                            )}
                            {selectedRequest?.items_needed && selectedRequest.items_needed.length > 0 && (
                                <View style={[styles.modalRow, { alignItems: 'flex-start' }]}>
                                    <Text style={[styles.modalLabel, { marginTop: 0 }]}>Items:</Text>
                                    <View style={{ flex: 1 }}>
                                        {selectedRequest.items_needed.map((item: any, idx: number) => (
                                            <Text key={idx} style={styles.modalValue}>• {item}</Text>
                                        ))}
                                    </View>
                                </View>
                            )}
                            {selectedRequest?.remarks && (
                                <View style={[styles.modalRow, { alignItems: 'flex-start' }]}>
                                    <Text style={[styles.modalLabel, { marginTop: 0 }]}>Remarks:</Text>
                                    <Text style={[styles.modalValue, { flex: 1 }]}>{selectedRequest.remarks}</Text>
                                </View>
                            )}
                        </View>
                        <TouchableOpacity
                            style={styles.modalCloseBtn}
                            onPress={() => setReviewModalVisible(false)}
                        >
                            <Text style={styles.modalCloseBtnText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    page: { flex: 1, backgroundColor: '#F6F7FB' },
    content: { padding: 16, paddingBottom: 40 },
    actionRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
    actionButton: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
    applyButton: { backgroundColor: '#0EA5A4' },
    donateButton: { backgroundColor: '#10B981' },
    applyText: { color: '#fff', fontWeight: '700' },
    donateText: { color: '#fff', fontWeight: '700' },

    card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginTop: 12 },
    cardTitle: { fontWeight: '700', color: '#0F172A', marginBottom: 12 },

    stepRow: { flexDirection: 'row', marginBottom: 12 },
    stepLeft: { width: 40, alignItems: 'center' },
    stepCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#0EA5A4', alignItems: 'center', justifyContent: 'center' },
    stepNumber: { color: '#fff', fontWeight: '700' },
    stepMain: { flex: 1, paddingLeft: 8 },
    stepTitle: { fontWeight: '700', color: '#0F172A' },
    stepDesc: { color: '#6B7280', marginTop: 4 },

    impactRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, gap: 4 },
    impactItem: { backgroundColor: '#F8FAFC', borderRadius: 10, padding: 8, width: (width - 64) / 3, alignItems: 'center' },
    impactNumber: { fontWeight: '700', color: '#0F172A', marginBottom: 6 },
    impactLabel: { color: '#6B7280', fontSize: 12, textAlign: 'center' },

    requestButton: { marginTop: 16, backgroundColor: '#34D399', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
    requestButtonText: { color: '#fff', fontWeight: '700' },

    // Program card styles
    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginVertical: 12 },
    programCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2, position: 'relative' },
    programStatusBadge: { position: 'absolute', top: 12, right: 12, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, zIndex: 1 },
    programStatusText: { fontSize: 11, fontWeight: '700', color: '#fff' },
    programStatusUpcoming: { backgroundColor: '#2563EB' },
    programStatusOngoing: { backgroundColor: '#0EA5A4' },
    programStatusCompleted: { backgroundColor: '#16A34A' },
    programStatusCanceled: { backgroundColor: '#DC2626' },
    programHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    programIcon: { fontSize: 26, marginRight: 10 },
    programTitle: { fontWeight: '700', fontSize: 15, color: '#0F172A' },
    programLocation: { color: '#6B7280', fontSize: 12 },
    programDesc: { color: '#334155', fontSize: 13, marginTop: 4, marginBottom: 8 },
    tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 6 },
    tag: { backgroundColor: '#E0F2FE', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
    tagText: { color: '#0EA5A4', fontWeight: '700', fontSize: 12 },
    programStats: { color: '#2563EB', fontWeight: '700', fontSize: 12, marginBottom: 8 },
    mapLink: { marginBottom: 8, paddingVertical: 6 },
    mapLinkText: { color: '#0EA5A4', fontWeight: '600', fontSize: 13 },
    programActions: { flexDirection: 'row', gap: 10 },
    primaryBtnSmall: { backgroundColor: '#0EA5A4', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 },
    secondaryBtnSmall: { backgroundColor: '#10B981', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 },

    registrationStatusBadge: { marginTop: 12, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
    registrationStatusText: { color: '#fff', fontSize: 12, fontWeight: '700' },

    // Loading and error states
    centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
    loadingText: { marginTop: 12, color: '#6B7280', fontSize: 14 },
    errorContainer: { backgroundColor: '#FEE2E2', borderRadius: 8, padding: 16, marginTop: 12 },
    errorText: { color: '#DC2626', textAlign: 'center' },

    // Relief request card styles
    requestCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
    requestHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    requestId: { fontSize: 14, fontWeight: '700', color: '#0EA5A4' },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    statusApproved: { backgroundColor: '#D1FAE5' },
    statusPending: { backgroundColor: '#f6ce2e' },
    statusRejected: { backgroundColor: '#FEE2E2' },
    statusText: { fontSize: 11, fontWeight: '700', color: '#0F172A' },
    requestName: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
    requestDetail: { fontSize: 13, color: '#6B7280', marginBottom: 3 },
    itemsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 8 },
    itemTag: { backgroundColor: '#F1F5F9', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
    itemText: { fontSize: 11, color: '#475569', fontWeight: '600' },
    requestDate: { fontSize: 12, color: '#94A3B8', marginTop: 8 },

    // Modal styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 20, width: '85%', maxWidth: 400 },
    modalTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 12 },
    modalDivider: { height: 1, backgroundColor: '#E2E8F0', marginBottom: 16 },
    modalBody: { marginBottom: 20 },
    modalRow: { marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
    modalLabel: { fontWeight: '700', color: '#475569', marginRight: 8, minWidth: 80 },
    modalValue: { color: '#334155', fontSize: 14, flex: 1 },
    modalStatusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    modalStatusText: { color: '#fff', fontSize: 12, fontWeight: '700' },
    modalCloseBtn: { backgroundColor: '#0EA5A4', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
    modalCloseBtnText: { color: '#fff', fontWeight: '700' },
});