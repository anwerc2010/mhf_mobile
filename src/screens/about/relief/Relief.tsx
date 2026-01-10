import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function ReliefScreen() {
    const { t } = useTranslation();
    const navigation = useNavigation<any>();
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

    const reliefPrograms = [
        {
            icon: '🍱',
            title: t('relief.programs.food.title'),
            locations: t('relief.programs.food.locations'),
            desc: t('relief.programs.food.desc'),
            tags: [t('relief.programs.food.tag1'), t('relief.programs.food.tag2'), t('relief.programs.food.tag3')],
            stats: t('relief.programs.food.stats'),
        },
        {
            icon: '💧',
            title: t('relief.programs.flood.title'),
            locations: t('relief.programs.flood.locations'),
            desc: t('relief.programs.flood.desc'),
            tags: [t('relief.programs.flood.tag1'), t('relief.programs.flood.tag2'), t('relief.programs.flood.tag3')],
            stats: t('relief.programs.flood.stats'),
        },
        {
            icon: '❄️',
            title: t('relief.programs.winter.title'),
            locations: t('relief.programs.winter.locations'),
            desc: t('relief.programs.winter.desc'),
            tags: [t('relief.programs.winter.tag1'), t('relief.programs.winter.tag2'), t('relief.programs.winter.tag3')],
            stats: t('relief.programs.winter.stats'),
        },
        {
            icon: '🩺',
            title: t('relief.programs.medical.title'),
            locations: t('relief.programs.medical.locations'),
            desc: t('relief.programs.medical.desc'),
            tags: [t('relief.programs.medical.tag1'), t('relief.programs.medical.tag2'), t('relief.programs.medical.tag3')],
            stats: t('relief.programs.medical.stats'),
        },
    ];

    return (
        <View style={styles.page}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.actionRow}>
                    <TouchableOpacity style={[styles.actionButton, styles.applyButton]} activeOpacity={0.9} onPress={() => navigation.navigate('ApplyNewRelief')}>
                        <Text style={styles.applyText}>{t('relief.apply')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, styles.donateButton]} activeOpacity={0.9}>
                        <Text style={styles.donateText}>{t('relief.donate')}</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.sectionTitle}>{t('relief.activePrograms')}</Text>
                {reliefPrograms.map((p, idx) => (
                    <View key={p.title} style={styles.programCard}>
                        <View style={styles.programHeader}>
                            <Text style={styles.programIcon}>{p.icon}</Text>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.programTitle}>{p.title}</Text>
                                <Text style={styles.programLocation}>{p.locations}</Text>
                            </View>
                        </View>
                        <Text style={styles.programDesc}>{p.desc}</Text>
                        <View style={styles.tagsRow}>
                            {p.tags.map(tag => (
                                <View key={tag} style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>
                            ))}
                        </View>
                        <Text style={styles.programStats}>{p.stats}</Text>
                        <View style={styles.programActions}>
                            <TouchableOpacity style={styles.primaryBtnSmall} onPress={() => navigation.navigate('ApplyNewRelief')}><Text style={styles.applyText}>{t('relief.apply')}</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.secondaryBtnSmall}><Text style={styles.donateText}>{t('relief.donate')}</Text></TouchableOpacity>
                        </View>
                    </View>
                ))}
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
    programCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
    programHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    programIcon: { fontSize: 26, marginRight: 10 },
    programTitle: { fontWeight: '700', fontSize: 15, color: '#0F172A' },
    programLocation: { color: '#6B7280', fontSize: 12 },
    programDesc: { color: '#334155', fontSize: 13, marginTop: 4, marginBottom: 8 },
    tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 6 },
    tag: { backgroundColor: '#E0F2FE', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
    tagText: { color: '#0EA5A4', fontWeight: '700', fontSize: 12 },
    programStats: { color: '#2563EB', fontWeight: '700', fontSize: 12, marginBottom: 8 },
    programActions: { flexDirection: 'row', gap: 10 },
    primaryBtnSmall: { backgroundColor: '#0EA5A4', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 },
    secondaryBtnSmall: { backgroundColor: '#10B981', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 },
});
