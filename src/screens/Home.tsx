import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { GraduationCapIcon, HeartIcon, UsersIcon, CalendarBlankIcon } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useGetDashboardDetailsQuery } from '@psi/shared-api';
import FamilyCard from '../components/general/FamilyCard';

const { width } = Dimensions.get('window');

const defaultPartnerImages = [
  require('../../assets/images/carousel.png'),
  require('../../assets/images/carousel.png'),
  require('../../assets/images/carousel.png'),
];

export default function HomeScreen() {
  const { t } = useTranslation();
  const [currentPartnerIndex, setCurrentPartnerIndex] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cardRequestModalVisible, setCardRequestModalVisible] = useState(false);
  const [selectedCardRequest, setSelectedCardRequest] = useState<any>(null);
  const partnerScrollRef = useRef<ScrollView>(null);
  const familyScrollRef = useRef<ScrollView>(null);

  // Fetch dashboard details
  const { data: dashboardData, isLoading, error, refetch } = useGetDashboardDetailsQuery();

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Create merged array combining health card object with family members array
  const familyCardsData = useMemo(() => {
    if (!dashboardData?.family_members || !dashboardData?.health_card) {
      return [];
    }

    // Map family members with health card details
    const familyMembersWithCard = dashboardData.family_members.map((member: any) => ({
      ...member,
      name: member.name,
      bloodGroup: member.blood_group,
      aadharNumber: member.aadhaar_number,
      membershipId: dashboardData?.health_card?.membership_id || t('home.notAvailable'),
      dateOfIssue: dashboardData?.health_card?.date_of_issue || t('home.notAvailable'),
      dateOfExpiry: dashboardData?.health_card?.date_of_expiry || t('home.notAvailable'),
    }));

    // Create health card as standalone object
    const healthCardObject = {
      ...dashboardData.health_card,
      name: dashboardData.health_card.card_holder_name || t('home.primaryMember'),
      membershipId: dashboardData.health_card.membership_id || t('home.notAvailable'),
      bloodGroup: dashboardData.health_card.blood_group || t('home.notAvailable'),
      aadharNumber: dashboardData.health_card.aadhaar_number || t('home.notAvailable'),
      dateOfIssue: dashboardData.health_card.date_of_issue || t('home.notAvailable'),
      dateOfExpiry: dashboardData.health_card.date_of_expiry || t('home.notAvailable'),
    };

    // Combine both arrays
    return [healthCardObject, ...familyMembersWithCard];
  }, [dashboardData?.family_members, dashboardData?.health_card]);

  // Auto-scroll partners carousel
  useEffect(() => {
    const partnerImages = dashboardData?.featured_partners || defaultPartnerImages;
    const autoScrollInterval = setInterval(() => {
      const nextIndex = (currentPartnerIndex + 1) % partnerImages.length;
      setCurrentPartnerIndex(nextIndex);
      if (partnerScrollRef.current) {
        partnerScrollRef.current.scrollTo({
          x: nextIndex * (width - 32),
          animated: true,
        });
      }
    }, 4000); // Auto-scroll every 4 seconds

    return () => clearInterval(autoScrollInterval);
  }, [currentPartnerIndex, dashboardData?.featured_partners]);

  const handlePartnerScroll = (event: any) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const partnerWidth = width - 32;
    const index = Math.round(scrollX / partnerWidth);
    setCurrentPartnerIndex(index);
  };
  
  const cardWidth = width * 0.9 - 32; // cardItem width + margin
  const handleCardScroll = (event: any) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const cardWidth = width * 0.9 + 32; // cardItem width + margin
    const index = Math.round(scrollX / cardWidth);
    setCurrentCardIndex(index);
  };

  const navigation = useNavigation<any>();

  const handleCardRequestPress = (request: any) => {
    setSelectedCardRequest(request);
    setCardRequestModalVisible(true);
  };

  const getCardRequestStatusColor = (status: string) => {
    const statusLower = (status ?? '').toString().toLowerCase();
    switch (statusLower) {
      case 'approved':
        return styles.cardRequestStatusApproved;
      case 'rejected':
        return styles.cardRequestStatusRejected;
      case 'pending':
      default:
        return styles.cardRequestStatusPending;
    }
  };

  const actions = [
    { key: 'education', Icon: GraduationCapIcon, label: t('home.education') },
    { key: 'relief', Icon: HeartIcon, label: t('home.relief') },
    { key: 'volunteers', Icon: UsersIcon, label: t('home.volunteers') },
    { key: 'events', Icon: CalendarBlankIcon, label: t('home.events') },
  ];

  return (
    <>
      <ScrollView style={styles.page} contentContainerStyle={styles.content}>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1E3A8A" />
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{t('home.errorLoadingData')}</Text>
          </View>
        )}

        {/* Featured Partners */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('home.featuredPartners')}</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>{t('home.viewAll')}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.carousel}
          ref={partnerScrollRef}
          onMomentumScrollEnd={handlePartnerScroll}
          scrollEventThrottle={16}
        >
          {(dashboardData?.featured_partners || []).map((partner: any, idx: number) => (
            <View key={idx} style={styles.partnerCard}>
              {partner.image_url ? (
                <Image source={{ uri: partner.image_url }} style={styles.partnerImage} resizeMode="cover" />
              ) : (
                <Image source={defaultPartnerImages[idx % defaultPartnerImages.length]} style={styles.partnerImage} resizeMode="cover" />
              )}
            </View>
          ))}
        </ScrollView>

        {/* Pagination Dots for Partners */}
        <View style={styles.dotsContainer}>
          {(dashboardData?.featured_partners || []).map((_, i: number) => (
            <View
              key={i}
              style={[styles.dot, i === currentPartnerIndex ? styles.dotActive : styles.dotInactive]}
            />
          ))}
        </View>

        {/* Welcome / Actions card */}
        <ImageBackground
          source={require('../../assets/images/carousel_bg.png')}
          style={styles.welcomeCard}
          imageStyle={{ resizeMode: 'cover' }}
        >
          <Text style={styles.welcomeTitle}>{t('home.welcomeBack')}</Text>
          <Text style={styles.welcomeName}>{dashboardData?.customer?.fullname || t('home.guest')}</Text>

          <View style={styles.actionsRow}>
            {actions.map(({ key, Icon, label }) => (
              <TouchableOpacity
                style={styles.actionItem}
                key={key}
                onPress={() => {
                  if (key === 'relief') navigation.navigate('Relief');
                  else if (key === 'education') navigation.navigate('Education');
                  else if (key === 'events') navigation.navigate('Events');
                  else if (key === 'volunteers') navigation.navigate('Volunteers');
                }}
              >
                <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 21, padding: 12 }}>
                  <Icon color="#fff" weight="bold" size={20} />
                </View>
                <Text style={styles.actionText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ImageBackground>

        {/* Family Health Cards header */}
        <Text style={styles.smallHeader}>{t('home.familyHealthCards')}</Text>

        {familyCardsData.length > 0 ? (
          <>
              <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.familyScroll}
                        ref={familyScrollRef}
                        snapToInterval={cardWidth}
                        decelerationRate={0}
                        scrollEventThrottle={16}
                        onMomentumScrollEnd={handleCardScroll}
                        contentContainerStyle={styles.familyScrollContent}>

              {familyCardsData.map((cardData: any, i: number) => (
                <FamilyCard
                  key={i}
                  data={cardData}
                  image={require('../../assets/images/card.png')}
                />
              ))}
            </ScrollView>

            {/* Pagination Dots */}
            <View style={styles.dotsContainer}>
              {familyCardsData.map((_, i: number) => (
                <View
                  key={i}
                  style={[styles.dot, i === currentCardIndex ? styles.dotActive : styles.dotInactive]}
                />
              ))}
            </View>
          </>
        ) : (
          <View style={styles.noCardsContainer}>
            <Text style={styles.noCardsText}>{t('home.noCardsFound')}</Text>
          </View>
        )}

        <ImageBackground
          source={require('../../assets/images/button_bg.png')}
          style={styles.requestButton}
          imageStyle={styles.requestButtonImage}
        >
          <TouchableOpacity
            style={styles.requestTouchable}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('NewCardRequest')}
          >
            <Text style={styles.requestText}>{t('home.requestNewCard')}</Text>
          </TouchableOpacity>
        </ImageBackground>

        {Array.isArray(dashboardData?.card_requests) && dashboardData.card_requests.length > 0 && (
          <View style={styles.cardRequestsCard}>
            <Text style={styles.cardRequestsTitle}>{t('home.cardRequests')}</Text>
            {dashboardData.card_requests.map((req: any) => (
              <TouchableOpacity
                key={req.id}
                style={styles.cardRequestItem}
                onPress={() => handleCardRequestPress(req)}
              >
                <View>
                  <Text style={styles.cardRequestId}>#{req.id}</Text>
                  {!!req.requested_at && (
                    <Text style={styles.cardRequestDate}>{req.requested_at}</Text>
                  )}
                </View>
                <View style={[styles.cardRequestStatusBadge, getCardRequestStatusColor(req.status)]}>
                  <Text style={styles.cardRequestStatusText}>{req.status}</Text>
                </View>
              </TouchableOpacity>

            ))}
          </View>
        )}



      </ScrollView>

      <Modal
        visible={cardRequestModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCardRequestModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('home.cardRequestDetails')}</Text>
            <View style={styles.modalDivider} />
            <View style={styles.modalBody}>
              {selectedCardRequest?.id && (
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>{t('home.requestId')}</Text>
                  <Text style={styles.modalValue}>#{selectedCardRequest.id}</Text>
                </View>
              )}
              {selectedCardRequest?.status && (
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>{t('home.status')}</Text>
                  <Text style={styles.modalValue}>{selectedCardRequest.status}</Text>
                </View>
              )}
              {selectedCardRequest?.requested_at && (
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>{t('home.requested')}</Text>
                  <Text style={styles.modalValue}>{selectedCardRequest.requested_at}</Text>
                </View>
              )}
              {selectedCardRequest?.updated_at && (
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>{t('home.updated')}</Text>
                  <Text style={styles.modalValue}>{selectedCardRequest.updated_at}</Text>
                </View>
              )}
              {selectedCardRequest?.review_notes && (
                <View style={[styles.modalRow, { alignItems: 'flex-start' }]}>
                  <Text style={[styles.modalLabel, { marginTop: 0 }]}>{t('home.reviewNotes')}</Text>
                  <Text style={[styles.modalValue, { flex: 1 }]}>{selectedCardRequest.review_notes}</Text>
                </View>
              )}
              {!selectedCardRequest?.review_notes && selectedCardRequest?.id && (
                <View style={styles.modalRow}>
                  <Text style={styles.modalValue}>{t('home.noReviewNotes')}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setCardRequestModalVisible(false)}
            >
              <Text style={styles.modalCloseBtnText}>{t('home.close')}</Text>
            </TouchableOpacity>

            {selectedCardRequest?.status?.toString().toLowerCase() === 'approved' && (
              <TouchableOpacity
                style={styles.modalPrimaryBtn}
                onPress={() => {
                  setCardRequestModalVisible(false);
                  navigation.navigate('ApplyCardRequest');
                }}
              >
                <Text style={styles.modalPrimaryBtnText}>{t('home.applyForCard')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F6F7FB' },
  content: { padding: 16, paddingBottom: 40 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },
  errorContainer: { backgroundColor: '#FEE2E2', padding: 12, borderRadius: 8, marginBottom: 16 },
  errorText: { color: '#DC2626', fontSize: 14, fontWeight: '500' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#1E3A8A' },
  viewAll: { fontSize: 12, color: '#1E90FF' },
  carousel: { height: 190, marginBottom: 12 },
  partnerCard: { width: width * 0.9, height: 190, borderRadius: 10, overflow: 'hidden', backgroundColor: '#fff', marginRight: 12, elevation: 2 },
  partnerImage: { width: '100%', height: 190 },
  welcomeCard: {
    marginTop: 16,
    marginHorizontal: -16,
    paddingHorizontal: 16,
    height: 200,
    paddingVertical: 12,
    backgroundColor: '#1E3A8A',
    // simple gradient feel by layering colors
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  welcomeTitle: { color: '#fff', fontSize: 13, marginTop: 12 },
  welcomeName: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 12, marginTop: 4 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginTop: 12 },
  actionItem: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.12)', padding: 8, borderRadius: 10, width: (width - 64) / 4, height: 80, justifyContent: 'center' },
  actionText: { color: '#fff', fontSize: 12, marginTop: 6 },
  smallHeader: { marginTop: 18, fontSize: 14, fontWeight: '600', color: '#333' },
  familyScroll: { marginTop: 8,  width: "100%" },
  familyScrollContent: { paddingRight: 8 },
  noCardsContainer: { marginTop: 24, paddingVertical: 40, paddingHorizontal: 16, backgroundColor: '#F3F4F6', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  noCardsText: { fontSize: 16, fontWeight: '500', color: '#6B7280' },
  requestButton: {
    marginTop: 12, width: '100%', height: 48, borderRadius: 24, overflow: 'hidden', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6, shadowOffset: { width: 0, height: 4 }, elevation: 4
  },
  requestButtonImage: { borderRadius: 24 },
  requestTouchable: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  plusText: { color: '#fff', fontSize: 16, fontWeight: '700', marginRight: 8 },
  requestText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  dotsContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 12, gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotActive: { backgroundColor: '#1E3A8A', width: 24 },
  dotInactive: { backgroundColor: '#D1D5DB' },

  cardRequestsCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginTop: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  cardRequestsTitle: { fontSize: 14, fontWeight: '700', color: '#1E3A8A', marginBottom: 8 },
  cardRequestItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  cardRequestId: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  cardRequestDate: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  cardRequestStatusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  cardRequestStatusText: { fontSize: 12, color: '#fff', fontWeight: '700' },
  cardRequestStatusApproved: { backgroundColor: '#16A34A' },
  cardRequestStatusPending: { backgroundColor: '#F59E0B' },
  cardRequestStatusRejected: { backgroundColor: '#DC2626' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 20, width: '85%', maxWidth: 400 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 12 },
  modalDivider: { height: 1, backgroundColor: '#E2E8F0', marginBottom: 16 },
  modalBody: { marginBottom: 20 },
  modalRow: { marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
  modalLabel: { fontWeight: '700', color: '#475569', marginRight: 8, minWidth: 90 },
  modalValue: { color: '#334155', fontSize: 14, flex: 1 },
  modalCloseBtn: { backgroundColor: '#1E3A8A', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  modalCloseBtnText: { color: '#fff', fontWeight: '700' },
  modalPrimaryBtn: { backgroundColor: '#0EA5A4', borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 10 },
  modalPrimaryBtnText: { color: '#fff', fontWeight: '700' },
});