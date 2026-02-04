import { Alert, Share } from 'react-native';

interface CardData {
    name: string;
    membershipId: string;
    bloodGroup: string;
    aadharNumber: string;
    dateOfIssue: string;
    dateOfExpiry: string;
}

/**
 * Share health card content using native Share API
 * @param cardData - Health card data to share
 */
export const downloadHealthCard = async (cardData: CardData): Promise<boolean> => {
    try {
        // Create text content for the card
        const cardContent = `
═══════════════════════════════════
       FAMILY HEALTH CARD
═══════════════════════════════════

Card Holder: ${cardData.name}
Membership ID: ${cardData.membershipId}
Blood Group: ${cardData.bloodGroup}
Aadhar Number: ${cardData.aadharNumber}

Date of Issue: ${cardData.dateOfIssue}
Date of Expiry: ${cardData.dateOfExpiry}

───────────────────────────────────
CARD BENEFITS
───────────────────────────────────
• Free consultations at 100+ clinics
• Up to 50% discount on medicines
• Free annual health checkup
• 24/7 emergency helpline support

───────────────────────────────────
HOW TO USE
───────────────────────────────────
1. Visit any partner healthcare facility
2. Show your digital health card or Member ID
3. Receive services as per your card benefits

═══════════════════════════════════
    MHF Foundation - Service to Humanity
═══════════════════════════════════
`;

        // Share the card using native Share API
        const result = await Share.share({
            message: cardContent,
            title: `Health Card - ${cardData.name}`,
        });

        if (result.action === Share.sharedAction) {
            return true;
        }
        return false;
    } catch (error: any) {
        Alert.alert('Error', 'Unable to share health card');
        console.error('Share error:', error);
        return false;
    }
};

/**
 * Share all family health cards as text content
 * @param cardsData - Array of health card data to share
 */
export const downloadAllHealthCards = async (cardsData: CardData[]): Promise<boolean> => {
    try {
        // Create text content for all cards
        const allCardsContent = cardsData.map((cardData, index) => `
═══════════════════════════════════
   FAMILY HEALTH CARD ${index + 1}
═══════════════════════════════════

Card Holder: ${cardData.name}
Membership ID: ${cardData.membershipId}
Blood Group: ${cardData.bloodGroup}
Aadhar Number: ${cardData.aadharNumber}

Date of Issue: ${cardData.dateOfIssue}
Date of Expiry: ${cardData.dateOfExpiry}

───────────────────────────────────
CARD BENEFITS
───────────────────────────────────
• Free consultations at 100+ clinics
• Up to 50% discount on medicines
• Free annual health checkup
• 24/7 emergency helpline support

───────────────────────────────────
HOW TO USE
───────────────────────────────────
1. Visit any partner healthcare facility
2. Show your digital health card or Member ID
3. Receive services as per your card benefits

`).join('\n');

        const fullContent = `${allCardsContent}
═══════════════════════════════════
    MHF Foundation - Service to Humanity
═══════════════════════════════════

Total Cards: ${cardsData.length}
`;

        // Share all cards using native Share API
        const result = await Share.share({
            message: fullContent,
            title: 'Family Health Cards',
        });

        if (result.action === Share.sharedAction) {
            return true;
        }
        return false;
    } catch (error: any) {
        Alert.alert('Error', 'Unable to share health cards');
        console.error('Share error:', error);
        return false;
    }
};
