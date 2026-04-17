import React from "react";
import {
  View,
  Text,
  ImageBackground,
  ImageSourcePropType,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useTranslation } from "react-i18next";
import { formatToDDMMYYYY } from "../../utils/formatDate";

export interface FamilyCardData {
  name: string;
  membershipId: string;
  bloodGroup: string;
  aadharNumber?: string;
  dateOfIssue?: string;
  created_at?: string;
  dateOfExpiry?: string;
}

interface FamilyCardProps {
  data: FamilyCardData;
  image?: ImageSourcePropType;
}

const CARD_ASPECT_RATIO = 1.586; // ISO/IEC 7810 ID-1 standard card ratio

const FamilyCard: React.FC<FamilyCardProps> = ({ data, image }) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  // Font scale based on usable card width (screen - 32px padding)
  const scale = (width - 32) / 340;
  const fs = (base: number) => Math.round(base * scale);

  const formattedCreatedAt = data.created_at
    ? formatToDDMMYYYY(data.created_at)
    : "";

  return (
    <ImageBackground
      source={image ?? require("../../../assets/images/card.png")}
      style={styles.cardItem}
      imageStyle={styles.cardImageStyle}
    >
      <View style={styles.cardOverlay}>
        {/* Card Holder Name */}
        <View style={styles.cardSection}>
          <Text style={[styles.cardLabel, { fontSize: fs(10) }]}>
            {t("card.cardHolderName")}
          </Text>
          <Text style={[styles.cardNameMain, { fontSize: fs(14) }]}>
            {data.name}
          </Text>
        </View>

        {/* Two column layout */}
        <View style={styles.cardTwoColumn}>
          <View style={styles.cardColumn}>
            <View style={styles.cardFieldGroup}>
              <Text style={[styles.cardLabel, { fontSize: fs(10) }]}>
                {t("card.membershipId")}
              </Text>
              <Text style={[styles.cardValue, { fontSize: fs(11) }]}>
                {data.membershipId}
              </Text>
            </View>
            <View style={styles.cardFieldGroup}>
              <Text style={[styles.cardLabel, { fontSize: fs(10) }]}>
                {t("card.aadharNumber")}
              </Text>
              <Text style={[styles.cardValue, { fontSize: fs(11) }]}>
                {data.aadharNumber}
              </Text>
            </View>
            <View style={styles.cardFieldGroup}>
              <Text style={[styles.cardLabel, { fontSize: fs(10) }]}>
                {t("card.dateOfIssue")}
              </Text>
              <Text style={[styles.cardValue, { fontSize: fs(11) }]}>
                {data.dateOfIssue}
              </Text>
            </View>
          </View>

          <View style={styles.cardColumn}>
            <View style={styles.cardFieldGroup}>
              <Text style={[styles.cardLabel, { fontSize: fs(10) }]}>
                {t("card.bloodGroup")}
              </Text>
              <Text style={[styles.cardValue, { fontSize: fs(11) }]}>
                {data.bloodGroup}
              </Text>
            </View>
            <View style={styles.cardFieldGroup}>
              <Text style={[styles.cardLabel, { fontSize: fs(10) }]}>
                {t("card.createdAt")}
              </Text>
              <Text style={[styles.cardValue, { fontSize: fs(11) }]}>
                {formattedCreatedAt}
              </Text>
            </View>
            <View style={styles.cardFieldGroup}>
              <Text style={[styles.cardLabel, { fontSize: fs(10) }]}>
                {t("card.dateOfExpiry")}
              </Text>
              <Text style={[styles.cardValue, { fontSize: fs(11) }]}>
                {data.dateOfExpiry}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  cardItem: {
    width: "100%",
    aspectRatio: 1.586,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#1B4968",
  },
  cardImageStyle: {
    borderRadius: 12,
  },
  cardOverlay: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "space-between",
    backgroundColor: "rgba(27, 73, 104, 0.2)",
  },
  cardSection: {
    marginTop: "20%",
  },
  cardLabel: {
    fontWeight: "500",
    color: "#B0C4D4",
    letterSpacing: 0.5,
  },
  cardNameMain: {
    fontWeight: "700",
    color: "#fff",
    marginTop: 2,
  },
  cardTwoColumn: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  cardColumn: {
    flex: 1,
  },
  cardFieldGroup: {
    marginBottom: 4,
  },
  cardValue: {
    fontWeight: "600",
    color: "#fff",
    marginTop: 1,
  },
});

export default FamilyCard;
