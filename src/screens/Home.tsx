import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { GraduationCapIcon, HeartIcon, UsersIcon, CalendarBlankIcon } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import FamilyCard from '../components/general/FamilyCard';

const { width } = Dimensions.get('window');

const partnerImages = [
  require('../../assets/images/carousel.png'),
  require('../../assets/images/carousel.png'),
  require('../../assets/images/carousel.png'),
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

export default function HomeScreen() {
  const { t } = useTranslation();
  const [currentPartnerIndex, setCurrentPartnerIndex] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const partnerScrollRef = useRef<ScrollView>(null);
  const familyScrollRef = useRef<ScrollView>(null);

  // Auto-scroll partners carousel
  useEffect(() => {
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
  }, [currentPartnerIndex]);

  const handlePartnerScroll = (event: any) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const partnerWidth = width - 32;
    const index = Math.round(scrollX / partnerWidth);
    setCurrentPartnerIndex(index);
  };

  const handleCardScroll = (event: any) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const cardWidth = width * 0.9 + 16; // cardItem width + margin
    const index = Math.round(scrollX / cardWidth);
    setCurrentCardIndex(index);
  };

  const navigation = useNavigation<any>();

  const actions = [
    { key: 'education', Icon: GraduationCapIcon, label: t('home.education') },
    { key: 'relief', Icon: HeartIcon, label: t('home.relief') },
    { key: 'volunteers', Icon: UsersIcon, label: t('home.volunteers') },
    { key: 'events', Icon: CalendarBlankIcon, label: t('home.events') },
  ];

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
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
        {partnerImages.map((img, idx) => (
          <View key={idx} style={styles.partnerCard}>
            <Image source={img} style={styles.partnerImage} resizeMode="cover" />
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots for Partners */}
      <View style={styles.dotsContainer}>
        {partnerImages.map((_, i) => (
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
        <Text style={styles.welcomeName}>Priya Sharma</Text>

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F6F7FB' },
  content: { padding: 16, paddingBottom: 40 },
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
  familyScroll: { marginTop: 8 },
  // card styles removed — moved to `FamilyCard` component
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
});