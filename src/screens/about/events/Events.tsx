import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function EventsScreen() {
    const { t } = useTranslation();
    const navigation = useNavigation<any>();

    const events = [
        {
            icon: '🩺',
            title: t('events.items.medical.title'),
            date: t('events.items.medical.date'),
            time: t('events.items.medical.time'),
            location: t('events.items.medical.location'),
            desc: t('events.items.medical.desc'),
            tags: [
                t('events.items.medical.tag1'),
                t('events.items.medical.tag2'),
                t('events.items.medical.tag3'),
                t('events.items.medical.tag4'),
            ],
            stats: t('events.items.medical.stats'),
        },
        {
            icon: '💉',
            title: t('events.items.blood.title'),
            date: t('events.items.blood.date'),
            time: t('events.items.blood.time'),
            location: t('events.items.blood.location'),
            desc: t('events.items.blood.desc'),
            tags: [
                t('events.items.blood.tag1'),
                t('events.items.blood.tag2'),
                t('events.items.blood.tag3'),
                t('events.items.blood.tag4'),
            ],
            stats: t('events.items.blood.stats'),
        },
        {
            icon: '🎓',
            title: t('events.items.awareness.title'),
            date: t('events.items.awareness.date'),
            time: t('events.items.awareness.time'),
            location: t('events.items.awareness.location'),
            desc: t('events.items.awareness.desc'),
            tags: [
                t('events.items.awareness.tag1'),
                t('events.items.awareness.tag2'),
                t('events.items.awareness.tag3'),
            ],
            stats: t('events.items.awareness.stats'),
        },
    ];

    const impact = [
        { value: '50+', label: t('events.impact.events') },
        { value: '5000+', label: t('events.impact.people') },
        { value: '200+', label: t('events.impact.volunteers') },
    ];

    return (
        <View style={styles.page}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.headerCard}>
                    <Text style={styles.headerTitle}>{t('events.title')}</Text>
                    <Text style={styles.headerSubtitle}>{t('events.subtitle')}</Text>
                    <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.navigate('RegisterForEvent')}>
                        <Text style={styles.headerBtnText}>{t('events.registerHeader')}</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>{t('events.upcoming')}</Text>
                {events.map((e) => (
                    <View key={e.title} style={styles.card}>
                        <View style={styles.rowHeader}>
                            <Text style={styles.icon}>{e.icon}</Text>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.cardTitle}>{e.title}</Text>
                                <View style={{ marginTop: 6 }}>
                                    <Text style={styles.meta}>{e.date}</Text>
                                    <Text style={styles.meta}>{e.time}</Text>
                                    <Text style={styles.meta}>{e.location}</Text>
                                </View>
                            </View>
                        </View>
                        <Text style={styles.desc}>{e.desc}</Text>
                        <View style={styles.tagsRow}>
                            {e.tags.map((tkey) => (
                                <View key={tkey} style={styles.tag}><Text style={styles.tagText}>{tkey}</Text></View>
                            ))}
                        </View>
                        <Text style={styles.stats}>{e.stats}</Text>
                        <TouchableOpacity style={styles.registerBtn} onPress={() => navigation.navigate('RegisterForEvents')}>
                            <Text style={styles.registerBtnText}>{t('events.registerNow')}</Text>
                        </TouchableOpacity>
                    </View>
                ))}

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>{t('events.impactTitle')}</Text>
                    <View style={styles.impactRow}>
                        {impact.map((i) => (
                            <View key={i.label} style={styles.impactItem}>
                                <Text style={styles.impactValue}>{i.value}</Text>
                                <Text style={styles.impactLabel}>{i.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    page: { flex: 1, backgroundColor: '#F6F7FB' },
    content: { padding: 16, paddingBottom: 40 },

    headerCard: { backgroundColor: '#2563EB', borderRadius: 12, padding: 16, marginBottom: 14 },
    headerTitle: { color: '#fff', fontWeight: '700', fontSize: 16 },
    headerSubtitle: { color: '#DBEAFE', marginTop: 6 },
    headerBtn: { marginTop: 10, alignSelf: 'flex-start', backgroundColor: '#0EA5A4', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
    headerBtnText: { color: '#fff', fontWeight: '700' },

    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginVertical: 12 },

    card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
    rowHeader: { flexDirection: 'row' },
    icon: { fontSize: 22, marginRight: 10 },
    cardTitle: { fontWeight: '700', color: '#0F172A' },
    meta: { color: '#64748B', fontSize: 12 },
    desc: { color: '#334155', fontSize: 13, marginTop: 8 },

    tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 8 },
    tag: { backgroundColor: '#E0F2FE', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
    tagText: { color: '#0EA5A4', fontWeight: '700', fontSize: 12 },

    stats: { color: '#2563EB', fontWeight: '700', fontSize: 12, marginBottom: 8 },

    registerBtn: { backgroundColor: '#0EA5A4', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
    registerBtnText: { color: '#fff', fontWeight: '700' },

    impactRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
    impactItem: { backgroundColor: '#F8FAFC', borderRadius: 10, padding: 10, width: (width - 64) / 3, alignItems: 'center' },
    impactValue: { fontWeight: '700', color: '#0F172A', marginBottom: 6 },
    impactLabel: { color: '#6B7280', fontSize: 12, textAlign: 'center' },
});
