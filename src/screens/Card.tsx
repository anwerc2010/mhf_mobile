import React, { useRef, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { QrCode, CheckCircle, EnvelopeSimple, DownloadSimple } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import FamilyCard from '../components/general/FamilyCard';
import { useGetDashboardDetailsQuery } from '@psi/shared-api';
import { openEmailComposer } from '../utils/emailComposer';
import { downloadHealthCard, downloadAllHealthCards } from '../utils/downloadCard';
import ViewShot from 'react-native-view-shot';
import * as RNHTMLtoPDF from 'react-native-html-to-pdf';

export default function CardScreen() {
  const { t } = useTranslation();
  const familyScrollRef = useRef<ScrollView>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const { width } = Dimensions.get('window');
  const viewShotRef = useRef<any>(null);


  // Fetch dashboard details
  const { data: dashboardData, isLoading, error, refetch } = useGetDashboardDetailsQuery();

  // Refetch when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

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

  const createPdf = async () => {
    // Capture full scroll content
    const uri = await viewShotRef.current.capture({
      format: 'png',
      quality: 1,
      result: 'base64',
      snapshotContentContainer: true, // VERY IMPORTANT
    });

    // Convert captured image to PDF
    const pdf = await RNHTMLtoPDF.convert({
      html: `<img src="data:image/png;base64,${uri}" style="width:100%" />`,
      fileName: 'scrollview',
      base64: false,
    });

    console.log('PDF saved at:', pdf.filePath);
  };

  // Get family cards from API data or use default
  const familyCards = useMemo(() => {
    if (dashboardData?.family_members && Array.isArray(dashboardData.family_members) && dashboardData?.health_card) {
      // Map family members with health card info
      const familyMembersWithCard = dashboardData.family_members.map((member: any) => ({
        ...member,
        name: member.name,
        bloodGroup: member.blood_group,
        aadharNumber: member.aadhaar_number,
        membershipId: dashboardData?.health_card?.membership_id || t('home.notAvailable'),
        dateOfIssue: dashboardData?.health_card?.date_of_issue || t('home.notAvailable'),
        dateOfExpiry: dashboardData?.health_card?.date_of_expiry || t('home.notAvailable'),
      }));

      // Create health card as standalone object (primary member)
      const healthCardObject = {
        ...dashboardData.health_card,
        name: dashboardData.health_card.card_holder_name || t('home.primaryMember'),
        membershipId: dashboardData.health_card.membership_id || t('home.notAvailable'),
        bloodGroup: dashboardData.health_card.blood_group || t('home.notAvailable'),
        aadharNumber: dashboardData.health_card.aadhaar_number || t('home.notAvailable'),
        dateOfIssue: dashboardData.health_card.date_of_issue || t('home.notAvailable'),
        dateOfExpiry: dashboardData.health_card.date_of_expiry || t('home.notAvailable'),
      };

      // Combine both arrays (health card first)
      return [healthCardObject, ...familyMembersWithCard];
    }

    // Default fallback data
    return [];
  }, [dashboardData?.family_members, dashboardData?.health_card]);

  const cardWidth = width * 0.9 - 32; // cardItem width + margin

  const handleCardScroll = (event: any) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    console.log('Scroll X:', scrollX);
    const index = Math.round(scrollX / cardWidth);
    setCurrentCardIndex(Math.max(0, Math.min(index, familyCards.length - 1)));
  };

  const handleEmailCard = async () => {
    const currentCard = familyCards[currentCardIndex];
    const subject = `Health Card Details - ${currentCard.name}`;
    const body = `Family Health Card Details:

Name: ${currentCard.name}
Membership ID: ${currentCard.membershipId}
Blood Group: ${currentCard.bloodGroup}
Aadhar Number: ${currentCard.aadharNumber}
Date of Issue: ${currentCard.dateOfIssue}
Date of Expiry: ${currentCard.dateOfExpiry}

Card Benefits:
${benefits.map((b, i) => `${i + 1}. ${b}`).join('\n')}

How to Use:
${steps.map((s, i) => `Step ${i + 1}: ${s}`).join('\n')}`;

    await openEmailComposer({ subject, body });
  };

  const handleDownloadCard = async () => {
    // Download all family cards
    /*const cardsToDownload = familyCards.map(card => ({
      name: card.name,
      membershipId: card.membershipId,
      bloodGroup: card.bloodGroup,
      aadharNumber: card.aadharNumber || t('home.notAvailable'),
      dateOfIssue: card.dateOfIssue || t('home.notAvailable'),
      dateOfExpiry: card.dateOfExpiry || t('home.notAvailable'),
    }));*/
    await createPdf();
    
    //await downloadAllHealthCards(cardsToDownload);
  };


  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>{t('card.title', 'Family Health Cards')}</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.scanButton} activeOpacity={0.8} onPress={handleDownloadCard}>
            <DownloadSimple color="#fff" weight="bold" size={14} />
            <Text style={styles.scanText}>{t('card.downloadCard', 'Download')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.scanButton} activeOpacity={0.8} onPress={handleEmailCard}>
            <EnvelopeSimple color="#fff" weight="bold" size={14} />
            <Text style={styles.scanText}>{t('card.emailCard', 'Email')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Family Health Cards header */}
      {/* <Text style={styles.smallHeader}>{t('home.familyHealthCards')}</Text> */}

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#06B6D4" />
          <Text style={styles.loadingText}>{t('card.loading')}</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{t('card.loadError')}</Text>
        </View>
      ) : (
        <>
          <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1  }}>
            <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.familyScroll}
            ref={familyScrollRef}
            snapToInterval={cardWidth}
            decelerationRate={0}
            scrollEventThrottle={16}
            onMomentumScrollEnd={handleCardScroll}
            contentContainerStyle={styles.familyScrollContent}
          >
            {familyCards.map((c, i) => (
              <FamilyCard key={i} data={c} image={require('../../assets/images/card.png')} />
            ))}
            </ScrollView>
          </ViewShot>
          {/* Pagination Dots */}
          <View style={styles.dotsContainer}>
            {familyCards.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === currentCardIndex ? styles.dotActive : styles.dotInactive]}
              />
            ))}
          </View>

          <Text style={styles.swipeText}>{t('card.swipeHint')}</Text>
        </>
      )}

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>{t('card.cardBenefits')}</Text>
        {benefits.map((b, i) => (
          <View style={styles.benefitRow} key={i}>
            <CheckCircle color="#10B981" weight="bold" size={16} />
            <Text style={styles.benefitText}>{b}</Text>
          </View>
        ))}
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>{t('card.howToUse.title')}</Text>
        {steps.map((s, i) => (
          <View style={styles.stepRow} key={i}>
            <View style={styles.stepNumber}><Text style={styles.stepNumberText}>{t('common.step', `Step ${i + 1}`)}</Text></View>
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
  actionButtons: { flexDirection: 'row', gap: 8 },
  scanButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#06B6D4', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 18 },
  scanText: { color: '#fff', marginLeft: 6, fontSize: 12, fontWeight: '600' },
  dotsContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 12, marginTop: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotActive: { backgroundColor: '#06B6D4', width: 24 },
  dotInactive: { backgroundColor: '#D1D5DB' },
  swipeText: { textAlign: 'center', color: '#6B7280', marginTop: 8, marginBottom: 12 },
  loadingContainer: { padding: 40, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 12, color: '#6B7280', fontSize: 14 },
  errorContainer: { padding: 40, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: '#DC2626', fontSize: 14, fontWeight: '600' },
  infoCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  infoTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12, color: '#111827' },
  benefitRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  benefitText: { marginLeft: 10, color: '#374151', fontSize: 13, flex: 1 },
  stepRow: { marginBottom: 12 },
  stepNumber: { backgroundColor: '#F3F4F6', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, marginBottom: 6 },
  stepNumberText: { color: '#374151', fontWeight: '600' },
  stepText: { color: '#6B7280', fontSize: 13 },
  smallHeader: { marginTop: 18, fontSize: 14, fontWeight: '600', color: '#333' },
  familyScroll: { marginTop: 8, width: '100%' },
  familyScrollContent: { paddingRight: 8 },
});