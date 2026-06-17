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

function maskAadhaar(raw: string | null | undefined): string {
  if (!raw) return "";
  const digits = raw.replace(/\s/g, "");
  if (digits.length < 4) return raw;
  return "**** **** " + digits.slice(-4);
}

function yearOnly(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const year = new Date(dateStr).getFullYear();
  return isNaN(year) ? dateStr : String(year);
}

export const CardText = (props: any) => {
  return <Text allowFontScaling={false} {...props} />;
};

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
  const { width, height } = useWindowDimensions();

  const isCompactLayout = width < 360 || height < 700;

  // Font scale based on usable card width (screen - 32px padding)
  const scale = Math.max(0.86, Math.min(1.08, (width - 32) / 340));
  const fs = (base: number) => Math.round(base * scale);

  const cardPaddingHorizontal = isCompactLayout ? 12 : 16;
  const cardPaddingVertical = isCompactLayout ? 10 : 12;
  const cardTopSpacing = isCompactLayout ? 12 : Math.round(width * 0.16);
  const columnGap = isCompactLayout ? 8 : 12;

  const formattedCreatedAt = yearOnly(data.created_at);
  const maskedAadhaar = maskAadhaar(data.aadharNumber);

  return (
    <ImageBackground
      source={image ?? require("../../../assets/images/card.png")}
      style={styles.cardItem}
      imageStyle={styles.cardImageStyle}
    >
      <View
        style={[
          styles.cardOverlay,
          {
            paddingHorizontal: cardPaddingHorizontal,
            paddingVertical: cardPaddingVertical,
          },
        ]}
      >
        <View style={[styles.cardSection, { marginTop: cardTopSpacing }]}> 
          <CardText
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.cardLabel, { fontSize: fs(10) }]}
          >
            {t("card.cardHolderName")}
          </CardText>
          <CardText
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
            style={[styles.cardNameMain, { fontSize: fs(14) }]}
          >
            {data.name}
          </CardText>
        </View>

        <View style={[styles.cardTwoColumn, { gap: columnGap }]}> 
          <View style={styles.cardColumn}>
            <View
              style={[
                styles.cardFieldGroup,
                { marginBottom: isCompactLayout ? 2 : 4 },
              ]}
            >
              <CardText
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[styles.cardLabel, { fontSize: fs(10) }]}
              >
                {t("card.membershipId")}
              </CardText>
              <CardText
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.75}
                style={[styles.cardValue, { fontSize: fs(11) }]}
              >
                {data.membershipId}
              </CardText>
            </View>
            <View
              style={[
                styles.cardFieldGroup,
                { marginBottom: isCompactLayout ? 2 : 4 },
              ]}
            >
              <CardText
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[styles.cardLabel, { fontSize: fs(10) }]}
              >
                {t("card.aadharNumber")}
              </CardText>
              <CardText
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.75}
                style={[styles.cardValue, { fontSize: fs(11) }]}
              >
                {maskedAadhaar}
              </CardText>
            </View>
            <View
              style={[
                styles.cardFieldGroup,
                { marginBottom: isCompactLayout ? 2 : 4 },
              ]}
            >
              <CardText
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[styles.cardLabel, { fontSize: fs(10) }]}
              >
                {t("card.dateOfIssue")}
              </CardText>
              <CardText
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.75}
                style={[styles.cardValue, { fontSize: fs(11) }]}
              >
                {data.dateOfIssue}
              </CardText>
            </View>
          </View>

          <View style={styles.cardColumn}>
            <View
              style={[
                styles.cardFieldGroup,
                { marginBottom: isCompactLayout ? 2 : 4 },
              ]}
            >
              <CardText
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[styles.cardLabel, { fontSize: fs(10) }]}
              >
                {t("card.bloodGroup")}
              </CardText>
              <CardText
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.75}
                style={[styles.cardValue, { fontSize: fs(11) }]}
              >
                {data.bloodGroup}
              </CardText>
            </View>
            <View
              style={[
                styles.cardFieldGroup,
                { marginBottom: isCompactLayout ? 2 : 4 },
              ]}
            >
              <CardText
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[styles.cardLabel, { fontSize: fs(10) }]}
              >
                {t("card.createdAt")}
              </CardText>
              <CardText
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.75}
                style={[styles.cardValue, { fontSize: fs(11) }]}
              >
                {formattedCreatedAt}
              </CardText>
            </View>
            <View
              style={[
                styles.cardFieldGroup,
                { marginBottom: isCompactLayout ? 2 : 4 },
              ]}
            >
              <CardText
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[styles.cardLabel, { fontSize: fs(10) }]}
              >
                {t("card.dateOfExpiry")}
              </CardText>
              <CardText
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.75}
                style={[styles.cardValue, { fontSize: fs(11) }]}
              >
                {data.dateOfExpiry}
              </CardText>
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
    justifyContent: "space-between",
    backgroundColor: "rgba(27, 73, 104, 0.2)",
  },
  cardSection: {},
  cardLabel: {
    fontWeight: "500",
    color: "#B0C4D4",
    letterSpacing: 0.5,
    flexShrink: 1,
  },
  cardNameMain: {
    fontWeight: "700",
    color: "#fff",
    marginTop: 2,
    flexShrink: 1,
  },
  cardTwoColumn: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    flexShrink: 1,
  },
});

export default FamilyCard;
