import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { QrCode, CheckCircle } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import FamilyCard from '../components/general/FamilyCard';

export default function CardScreen() {
  const { t } = useTranslation();
  const [currentCard, setCurrentCard] = useState(0);
  const totalCards = 4;
  const familyScrollRef = useRef<ScrollView>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const { width } = Dimensions.get('window');

  const benefits = [
    t('card.benefits.freeConsultations', 'Free consultations at 100+ partner clinics'),
    t('card.benefits.discount', 'Up to 50% discount on medicines'),
    t('card.benefits.checkup', 'Free annual health checkup'),
    t('card.benefits.helpline', '24/7 emergency helpline support'),
  ];

  const steps = [
    t('card.howToUse.step1', 'Visit any partner healthcare facility'),
    t('card.howToUse.step2', 'Show your digital health card or Member ID'),
    t('card.howToUse.step3', 'Receive services as per your card benefits'),
  ];

  const familyCards = [
    {
      name: 'Priya Sharma',
      membershipId: 'HCN-2024-8756',
      bloodGroup: 'O+',
      aadharNumber: 'XXXX-XXXX-3456',
      dateOfIssue: 'Jan 2024',
      dateOfExpiry: 'Dec 2026',
    },
    {
      name: 'Amit Kumar',
      membershipId: 'HCN-2024-5678',
      bloodGroup: 'A+',
      aadharNumber: 'XXXX-XXXX-9876',
      dateOfIssue: 'Jan 2024',
      dateOfExpiry: 'Dec 2026',
    },
  ];

  const handleCardScroll = (event: any) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const cardWidth = width * 0.9 + 16; // cardItem width + margin
    const index = Math.round(scrollX / cardWidth);
    setCurrentCardIndex(index);
  };



  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>{t('card.title', 'Family Health Cards')}</Text>
        <TouchableOpacity style={styles.scanButton} activeOpacity={0.8}>
          <QrCode color="#fff" weight="bold" size={14} />
          <Text style={styles.scanText}>{t('card.scanQr', 'Scan QR')}</Text>
        </TouchableOpacity>
      </View>

      {/* Family Health Cards header */}
      <Text style={styles.smallHeader}>{t('home.familyHealthCards')}</Text>

      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.familyScroll} ref={familyScrollRef} onMomentumScrollEnd={handleCardScroll}>
        {familyCards.map((c, i) => (
          <FamilyCard key={i} data={c} image={require('../../assets/images/card.png')} />
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.dotsContainer}>
        {familyCards.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === currentCardIndex ? styles.dotActive : styles.dotInactive]}
          />
        ))}
      </View>

      <Text style={styles.swipeText}>{t('card.swipeHint', 'Swipe to view all 4 family member cards')}</Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>{t('card.cardBenefits', 'Card Benefits')}</Text>
        {benefits.map((b, i) => (
          <View style={styles.benefitRow} key={i}>
            <CheckCircle color="#10B981" weight="bold" size={16} />
            <Text style={styles.benefitText}>{b}</Text>
          </View>
        ))}
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>{t('card.howToUse.title', 'How to Use')}</Text>
        {steps.map((s, i) => (
          <View style={styles.stepRow} key={i}>
            <View style={styles.stepNumber}><Text style={styles.stepNumberText}>{`Step ${i + 1}`}</Text></View>
            <Text style={styles.stepText}>{s}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F6F7FB' },
  content: { padding: 16, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  headerTitle: { fontSize: 14, fontWeight: '700', color: '#1E3A8A' },
  scanButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#06B6D4', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 18 },
  scanText: { color: '#fff', marginLeft: 6, fontSize: 12, fontWeight: '600' },
  dotsContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 12, marginTop: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotActive: { backgroundColor: '#06B6D4', width: 24 },
  dotInactive: { backgroundColor: '#D1D5DB' },
  swipeText: { textAlign: 'center', color: '#6B7280', marginTop: 8, marginBottom: 12 },
  infoCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  infoTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12, color: '#111827' },
  benefitRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  benefitText: { marginLeft: 10, color: '#374151', fontSize: 13, flex: 1 },
  stepRow: { marginBottom: 12 },
  stepNumber: { backgroundColor: '#F3F4F6', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, marginBottom: 6 },
  stepNumberText: { color: '#374151', fontWeight: '600' },
  stepText: { color: '#6B7280', fontSize: 13 },
  smallHeader: { marginTop: 18, fontSize: 14, fontWeight: '600', color: '#333' },
  familyScroll: { marginTop: 8 },
});