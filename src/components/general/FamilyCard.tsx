import React from 'react';
import { View, Text, ImageBackground, ImageSourcePropType, StyleSheet, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

export interface FamilyCardData {
    name: string;
    membershipId: string;
    bloodGroup: string;
    aadharNumber?: string;
    dateOfIssue?: string;
    dateOfExpiry?: string;
}

interface FamilyCardProps {
    data: FamilyCardData;
    image?: ImageSourcePropType;
}

const FamilyCard: React.FC<FamilyCardProps> = ({ data, image }) => {
    const { t } = useTranslation();

    return (
        <ImageBackground
            source={image ?? require('../../../assets/images/card.png')}
            style={styles.cardItem}
            imageStyle={styles.cardImageStyle}
        >
            <View style={styles.cardOverlay}>
                {/* Card Holder Name */}
                <View style={styles.cardSection}>
                    <Text style={styles.cardLabel}>{t('card.cardHolderName')}</Text>
                    <Text style={styles.cardNameMain}>{data.name}</Text>
                </View>

                {/* Two column layout */}
                <View style={styles.cardTwoColumn}>
                    <View style={styles.cardColumn}>
                        <View style={styles.cardFieldGroup}>
                            <Text style={styles.cardLabel}>{t('card.membershipId')}</Text>
                            <Text style={styles.cardValue}>{data.membershipId}</Text>
                        </View>
                        <View style={styles.cardFieldGroup}>
                            <Text style={styles.cardLabel}>{t('card.aadharNumber')}</Text>
                            <Text style={styles.cardValue}>{data.aadharNumber}</Text>
                        </View>
                        <View style={styles.cardFieldGroup}>
                            <Text style={styles.cardLabel}>{t('card.dateOfIssue')}</Text>
                            <Text style={styles.cardValue}>{data.dateOfIssue}</Text>
                        </View>
                    </View>

                    <View style={styles.cardColumn}>
                        <View style={styles.cardFieldGroup}>
                            <Text style={styles.cardLabel}>{t('card.bloodGroup')}</Text>
                            <Text style={styles.cardValue}>{data.bloodGroup}</Text>
                        </View>
                        <View style={styles.cardFieldGroup} />
                        <View style={styles.cardFieldGroup}>
                            <Text style={styles.cardLabel}>{t('card.dateOfExpiry')}</Text>
                            <Text style={styles.cardValue}>{data.dateOfExpiry}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    cardItem: { width: width * 0.9, height: 260, borderRadius: 12, overflow: 'hidden', marginRight: 16, backgroundColor: '#1B4968' },
    cardImageStyle: { borderRadius: 12 },
    cardOverlay: { flex: 1, padding: 16, justifyContent: 'space-between', backgroundColor: 'rgba(27, 73, 104, 0.2)' },
    cardSection: { marginBottom: 8, marginTop: 50 },
    cardLabel: { fontSize: 11, fontWeight: '500', color: '#B0C4D4', letterSpacing: 0.5 },
    cardNameMain: { fontSize: 20, fontWeight: '700', color: '#fff' },
    cardTwoColumn: { flexDirection: 'row', justifyContent: 'space-between', gap: 16 },
    cardColumn: { flex: 1 },
    cardFieldGroup: { marginBottom: 12 },
    cardValue: { fontSize: 14, fontWeight: '600', color: '#fff', marginTop: 2 },
});

export default FamilyCard;
