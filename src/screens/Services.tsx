import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { MagnifyingGlass, Star, Wrench, CaretRight, PhoneCall, Hospital, Syringe, Pill, Stethoscope, FolderPlus } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

// Chips layout: show 3 chips per row, divide available width equally
const CHIP_COLS = 3;
const CHIP_GAP = 12;
const CHIP_CONTAINER_HORIZONTAL_PADDING = 16; // matches content padding
const CHIP_WIDTH = Math.floor((width - CHIP_CONTAINER_HORIZONTAL_PADDING * 2 - (CHIP_COLS - 1) * CHIP_GAP) / CHIP_COLS);

const TABS = ['Providers', 'Blood', 'Equipment', 'Ambulance', 'Benefits'];

const sampleProviders = [
  {
    id: 1,
    name: 'Medicare Clinic',
    address: '789 Green Park, South Delhi',
    specialties: ['General Practice', 'Dermatology'],
    distanceKm: 0.8,
    offerPercent: 20,
    phone: '+91-11-2345-6791',
    hours: '9 AM - 8 PM',
    rating: '4.3',
  },
  {
    id: 2,
    name: 'MedPlus Pharmacy',
    address: '999 Market Street, Lajpat Nagar, New Delhi',
    specialties: ['Prescription Medicines', 'OTC Products'],
    distanceKm: 1.1,
    offerPercent: 10,
    phone: '+91-11-2345-6798',
    hours: '8 AM - 10 PM',
    rating: '4.3',
  },
  {
    id: 3,
    name: 'City General Hospital',
    address: '123 Main Street, Sector 15, New Delhi',
    specialties: ['Cardiology', 'Orthopedics'],
    distanceKm: 1.2,
    offerPercent: 30,
    phone: '+91-11-2345-6789',
    hours: '24/7',
    rating: '4.5',
  },
  {
    id: 4,
    name: 'HealthPlus Pharmacy',
    address: '567 Shopping Complex, Karol Bagh',
    specialties: ['Generic Medicines', 'Surgical Items'],
    distanceKm: 1.5,
    offerPercent: 15,
    phone: '+91-11-2345-6793',
    hours: '8 AM - 11 PM',
    rating: '4.4',
  },
];

export default function ServicesScreen() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('Providers');
  const [query, setQuery] = useState('');
  const [activeChip, setActiveChip] = useState('All');

  const filtered = sampleProviders.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.address.toLowerCase().includes(query.toLowerCase()));

  const benefits = [
    { key: 'free', title: t('services.benefits.free.title', 'Free Consultations'), subtitle: t('services.benefits.free.subtitle', 'Access to general physicians and specialists'), icon: Stethoscope, bg: '#E0F2FE', color: '#0369A1' },
    { key: 'medicine', title: t('services.benefits.medicine.title', 'Medicine Assistance'), subtitle: t('services.benefits.medicine.subtitle', 'Subsidized medicines for chronic conditions'), icon: Pill, bg: '#FEEFEF', color: '#7C3AED' },
    { key: 'emergency', title: t('services.benefits.emergency.title', 'Emergency Transport'), subtitle: t('services.benefits.emergency.subtitle', '24/7 emergency ambulance services'), icon: PhoneCall, bg: '#FFEFE9', color: '#DC2626' },
    { key: 'checkups', title: t('services.benefits.checkups.title', 'Health Checkups'), subtitle: t('services.benefits.checkups.subtitle', 'Regular health monitoring and diagnostics'), icon: Star, bg: '#ECFDF5', color: '#10B981' },
    { key: 'records', title: t('services.benefits.records.title', 'Medical Records'), subtitle: t('services.benefits.records.subtitle', 'Digital health records management'), icon: FolderPlus, bg: '#EFF6FF', color: '#2563EB' },
    { key: 'find', title: t('services.benefits.find.title', 'Find Clinics'), subtitle: t('services.benefits.find.subtitle', 'Locate nearby partner healthcare centers'), icon: Hospital, bg: '#F3F4F6', color: '#0F172A' },
  ];

  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t('services.title', 'Services & Providers')}</Text>
        <Text style={styles.subtitle}>{t('services.subtitle', 'Find empaneled healthcare providers near you')}</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScrollContainer}>
          <View style={styles.tabRow}>
            {TABS.map(tab => (
              <TouchableOpacity key={tab} style={[styles.tabItem, activeTab === tab && styles.tabItemActive]} onPress={() => setActiveTab(tab)}>
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{t(`services.tab.${tab.toLowerCase()}`, tab)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {activeTab === 'Providers' && (
          <View style={styles.chipsContainer}>
            <View style={styles.chipsRow}>
              <TouchableOpacity style={[styles.chip, activeChip === 'All' && styles.chipActive]} onPress={() => setActiveChip('All')}>
                <Text style={[styles.chipText, activeChip === 'All' && styles.chipActiveText]}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.chip, activeChip === 'Hospitals' && styles.chipActive]} onPress={() => setActiveChip('Hospitals')}>
                <Hospital size={14} color={activeChip === 'Hospitals' ? '#0369A1' : '#0369A1'} /><Text style={[styles.chipText, activeChip === 'Hospitals' && styles.chipActiveText]}>Hospitals</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.chip, activeChip === 'Diagnostics' && styles.chipActive]} onPress={() => setActiveChip('Diagnostics')}>
                <Syringe size={14} color={activeChip === 'Diagnostics' ? '#0369A1' : '#0369A1'} /><Text style={[styles.chipText, activeChip === 'Diagnostics' && styles.chipActiveText]}>Diagnostics</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.chipsRow}>
              <TouchableOpacity style={[styles.chip, activeChip === 'Pharmacy' && styles.chipActive]} onPress={() => setActiveChip('Pharmacy')}>
                <Pill size={14} color={activeChip === 'Pharmacy' ? '#0369A1' : '#0369A1'} /><Text style={[styles.chipText, activeChip === 'Pharmacy' && styles.chipActiveText]}>Pharmacy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.chip, activeChip === 'Clinics' && styles.chipActive]} onPress={() => setActiveChip('Clinics')}>
                <Stethoscope size={14} color={activeChip === 'Clinics' ? '#0369A1' : '#0369A1'} /><Text style={[styles.chipText, activeChip === 'Clinics' && styles.chipActiveText]}>Clinics</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.chip, activeChip === 'Rehab' && styles.chipActive]} onPress={() => setActiveChip('Rehab')}>
                <FolderPlus size={14} color={activeChip === 'Rehab' ? '#0369A1' : '#0369A1'} /><Text style={[styles.chipText, activeChip === 'Rehab' && styles.chipActiveText]}>Rehab</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.searchRow}>
          <MagnifyingGlass color="#9CA3AF" size={18} />
          <TextInput placeholder={t('services.searchPlaceholder', 'Search providers, specialties, location...')} value={query} onChangeText={setQuery} style={styles.searchInput} />
        </View>

        {activeTab === 'Providers' && (
          <View>
            <Text style={styles.resultsCount}>{filtered.length} {t('services.resultsFound', 'providers found')}</Text>
            {filtered.map(p => (
              <TouchableOpacity key={p.id} style={styles.providerCard} activeOpacity={0.85}>
                <View style={styles.providerLeft}>
                  <View style={styles.providerAvatar}><Text style={styles.avatarLetter}>{p.name.charAt(0)}</Text></View>
                </View>

                <View style={styles.providerMain}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.providerName}>{p.name}</Text>
                    <View style={styles.ratingBadge}><Text style={styles.ratingBadgeText}>{p.rating}</Text></View>
                  </View>

                  <Text style={styles.providerAddress}>{p.address}</Text>

                  <View style={styles.tagsRow}>
                    {p.specialties.map((s, idx) => (
                      <View key={idx} style={styles.tagPill}><Text style={styles.tagText}>{s}</Text></View>
                    ))}
                  </View>

                  <View style={styles.bottomRow}>
                    <Text style={styles.distanceText}>{p.distanceKm} km</Text>
                    <View style={styles.offerPill}><Text style={styles.offerText}>{p.offerPercent}% OFF</Text></View>
                  </View>

                  <View style={styles.contactRow}>
                    <PhoneCall size={12} color="#6B7280" />
                    <Text style={styles.contactText}>{p.phone}</Text>
                    <Text style={styles.dot}>•</Text>
                    <Text style={styles.contactText}>{p.hours}</Text>
                  </View>
                </View>

                <View style={styles.providerRight}>
                  <CaretRight color="#9CA3AF" size={18} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab === 'Blood' && (
          <View>
            <View style={styles.alertBox}>
              <Text style={styles.alertTitle}>{t('services.blood.emergency', 'Emergency Blood Required!')}</Text>
              <Text style={styles.alertText}>{t('services.blood.cta', 'Request blood from our donor network')}</Text>
              <TouchableOpacity style={styles.alertButton}><Text style={styles.alertButtonText}>{t('services.blood.requestNow', 'Request Blood Now')}</Text></TouchableOpacity>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>{t('services.blood.search', 'Search Blood Donors')}</Text>
              <Text style={styles.infoLabel}>{t('services.blood.select', 'Select Blood Group')}</Text>
            </View>
          </View>
        )}

        {activeTab === 'Equipment' && (
          <View>
            <View style={styles.requestEquipmentCard}>
              <Wrench color="#075985" size={18} />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.requestEquipmentTitle}>{t('services.equipment.need', 'Need Medical Equipment?')}</Text>
                <Text style={styles.requestEquipmentSubtitle}>{t('services.equipment.subtitle', 'Request equipment support for home care')}</Text>
              </View>
              <TouchableOpacity style={styles.requestEquipmentButton}><Text style={styles.requestEquipmentButtonText}>{t('services.equipment.request', 'Request Equipment')}</Text></TouchableOpacity>
            </View>

            <Text style={styles.sectionHeader}>{t('services.equipment.available', 'Available Equipment')}</Text>
            <View style={styles.equipmentGrid}>
              {[{ k: 'Mobility Aids', n: 5 }, { k: 'Hospital Beds', n: 4 }, { k: 'Monitoring Devices', n: 5 }, { k: 'Respiratory Equipment', n: 6 }].map((e) => (
                <View key={e.k} style={styles.equipmentItem}>
                  <Text style={styles.equipmentTitle}>{e.k}</Text>
                  <View style={styles.equipmentCount}><Text style={styles.equipmentCountText}>{e.n} items</Text></View>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'Ambulance' && (
          <View style={styles.infoCard}><Text style={styles.infoTitle}>{t('services.ambulance.title', 'Ambulance Services')}</Text><Text style={styles.infoLabel}>{t('services.ambulance.subtitle', 'Request on-demand ambulance support')}</Text></View>
        )}

        {activeTab === 'Benefits' && (
          <View>
            <Text style={[styles.sectionHeader, { marginTop: 8 }]}>{t('services.benefits.title', 'Benefits')}</Text>

            {benefits.map(b => {
              const Icon = b.icon as any;
              return (
                <View key={b.key} style={styles.benefitCard}>
                  <View style={[styles.benefitIconCircle, { backgroundColor: b.bg }]}>
                    <Icon color={b.color} size={20} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.benefitTitle}>{b.title}</Text>
                    <Text style={styles.benefitSubtitle}>{b.subtitle}</Text>
                  </View>
                  <CaretRight color="#9CA3AF" size={18} />
                </View>
              );
            })}

            <View style={[styles.supportBox, { marginTop: 12 }]}>
              <Text style={{ fontWeight: '700', color: '#0F172A', marginBottom: 6 }}>{t('services.benefits.help.title', 'Need Help?')}</Text>
              <Text style={{ color: '#6B7280', marginBottom: 12 }}>{t('services.benefits.help.desc', 'Our support team is available 24/7 to assist you')}</Text>
              <TouchableOpacity style={styles.supportButton} activeOpacity={0.85}><Text style={styles.supportButtonText}>{t('services.benefits.help.contact', 'Contact Support')}</Text></TouchableOpacity>
            </View>
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F6F7FB' },
  content: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  subtitle: { color: '#6B7280', marginTop: 4, marginBottom: 12 },
  tabScrollContainer: { marginVertical: 8 },
  tabRow: { flexDirection: 'row', gap: 6 },
  tabItem: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#F3F4F6', borderRadius: 18, alignItems: 'center', minWidth: 80 },
  tabItemActive: { backgroundColor: '#E0F2FE' },
  tabText: { color: '#374151', fontSize: 13 },
  tabTextActive: { color: '#0369A1', fontWeight: '700' },
  searchRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 10, borderRadius: 10, marginTop: 8, shadowColor: '#000', shadowOpacity: 0.03, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  searchInput: { marginLeft: 8, flex: 1, height: 36 },
  resultsCount: { marginTop: 12, marginBottom: 8, color: '#6B7280' },
  providerCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 10, alignItems: 'center' },
  providerLeft: { width: 56, alignItems: 'center', justifyContent: 'center' },
  providerAvatar: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center' },
  avatarLetter: { color: '#fff', fontWeight: '700' },
  providerMain: { marginLeft: 12, flex: 1 },
  providerName: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  providerAddress: { color: '#6B7280', fontSize: 13, marginTop: 4 },
  providerMeta: { flexDirection: 'row', marginTop: 6 },
  rating: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { marginLeft: 6, color: '#374151' },
  ratingBadge: { backgroundColor: '#F8FAFC', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 12 },
  ratingBadgeText: { color: '#064E3B', fontWeight: '700' },
  tagsRow: { flexDirection: 'row', marginTop: 8, flexWrap: 'wrap' },
  tagPill: { backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, marginRight: 8, marginTop: 6 },
  tagText: { color: '#065F46', fontSize: 12, fontWeight: '600' },
  bottomRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  distanceText: { color: '#6B7280', fontSize: 12 },
  offerPill: { backgroundColor: '#FEF3F2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginLeft: 8 },
  offerText: { color: '#B91C1C', fontSize: 12, fontWeight: '700' },
  contactRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  contactText: { marginLeft: 6, color: '#6B7280', fontSize: 12 },
  dot: { marginHorizontal: 6, color: '#6B7280' },
  providerRight: { width: 36, alignItems: 'center', justifyContent: 'center' },
  alertBox: { backgroundColor: '#FEF3F2', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#FECACA', marginTop: 12 },
  alertTitle: { color: '#B91C1C', fontWeight: '700', marginBottom: 6 },
  alertText: { color: '#92400E', marginBottom: 8 },
  alertButton: { backgroundColor: '#DC2626', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  alertButtonText: { color: '#fff', fontWeight: '700' },
  infoCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginTop: 12 },
  infoTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 8 },
  infoLabel: { color: '#6B7280' },
  requestEquipmentCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', padding: 12, borderRadius: 12, marginTop: 12 },
  requestEquipmentTitle: { fontWeight: '700', color: '#075985' },
  requestEquipmentSubtitle: { color: '#075985', opacity: 0.8, marginTop: 4 },
  requestEquipmentButton: { backgroundColor: '#0EA5A4', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  requestEquipmentButtonText: { color: '#fff', fontWeight: '700' },
  sectionHeader: { fontSize: 14, fontWeight: '700', marginTop: 12, marginBottom: 8 },
  equipmentGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  equipmentItem: { width: (width - 64) / 2, backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12 },
  equipmentTitle: { fontWeight: '700', color: '#075985' },
  equipmentCount: { marginTop: 8, backgroundColor: '#F1F5F9', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  equipmentCountText: { color: '#0F172A', fontWeight: '600' },
  chipsContainer: { marginTop: 8, backgroundColor: '#F3F4F6', borderRadius: 16, padding: 12 },
  chipsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  chip: { width: CHIP_WIDTH, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14 },
  chipText: { marginLeft: 8, color: '#374151', fontSize: 13 },
  chipActive: { width: CHIP_WIDTH, backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, borderWidth: 1, borderColor: '#E6EEF8' },
  chipActiveText: { color: '#0369A1', fontWeight: '700' },
  benefitCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 10 },
  benefitIconCircle: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  benefitTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  benefitSubtitle: { color: '#6B7280', fontSize: 13, marginTop: 4 },
  supportBox: { backgroundColor: '#F0F9FF', borderRadius: 12, padding: 16 },
  supportButton: { backgroundColor: '#0F172A', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  supportButtonText: { color: '#fff', fontWeight: '700' },
});


