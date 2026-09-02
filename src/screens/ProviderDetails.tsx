import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Share,
} from "react-native";
import {
  MapPin,
  Phone,
  EnvelopeSimple,
  Star,
  Heart,
  ShareNetwork,
  NavigationArrow,
} from "phosphor-react-native";
import { useRoute } from "@react-navigation/native";
import { openEmailComposer } from "../utils/emailComposer";
import { useTranslation } from "react-i18next";
import { APP_CONFIG } from "../constants/config";

export default function ProviderDetailsScreen() {
  const { t } = useTranslation();
  const route = useRoute<any>();
  const provider = route.params?.provider;

  if (!provider) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{t("providerDetails.notFound")}</Text>
      </View>
    );
  }

  const resolvedCity =
    provider.city ||
    provider.city_name ||
    provider.mandal_name ||
    provider.block_name ||
    provider.district_name ||
    "";
  const resolvedDistrict = provider.district || provider.district_name || "";
  const resolvedState = provider.state || provider.state_name || "";
  const resolvedPincode =
    provider.pincode ||
    provider.zip_code ||
    provider.postal_code ||
    provider.zip ||
    "";

  const handlePhoneCall = () => {
    const phoneNumber = provider.phone?.replace(/\s/g, "");
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`).catch(() => {
        Alert.alert(
          t("providerDetails.error"),
          t("providerDetails.phoneError"),
        );
      });
    }
  };

  const handleOpenMap = () => {
    if (provider.map_url) {
      Linking.openURL(provider.map_url).catch(() => {
        Alert.alert(t("providerDetails.error"), t("providerDetails.mapError"));
      });
    } else if (provider.latitude && provider.longitude) {
      const url = `https://www.google.com/maps?q=${provider.latitude},${provider.longitude}`;
      Linking.openURL(url).catch(() => {
        Alert.alert(t("providerDetails.error"), t("providerDetails.mapError"));
      });
    }
  };

  const handleEmail = () => {
    if (!provider.email) return;

    const providerName =
      provider.provider_name ||
      t("providerDetails.genericProvider", "Healthcare Provider");
    const notAvailable = t("home.notAvailable", "N/A");
    const subject = `${t("providerDetails.enquirySubjectPrefix", "Enquiry")} – ${providerName} | Mujtaba Helping Foundation`;
    const body = `${t("card.providerEmailGreeting", "Dear {{name}},", { name: providerName })}

${t(
      "providerDetails.enquiryIntro",
      "I found your facility through the Mujtaba Helping Foundation app and would like to get in touch.",
    )}

${t("providerDetails.providerDetailsHeading", "PROVIDER DETAILS")}
----------------
${t("common.name", "Name")}   : ${provider.provider_name || notAvailable}
${provider.type ? `${t("providerDetails.type", "Type")}   : ${provider.type}\n` : ""}${
      provider.phone ? `${t("common.phone", "Phone")}  : ${provider.phone}\n` : ""
    }${provider.address ? `${t("common.address", "Address")}: ${provider.address}\n` : ""}
${t("card.thankYou", "Thank you.")}`;

    openEmailComposer({
      to: provider.email,
      cc: APP_CONFIG.MHF_CC_EMAIL,
      subject,
      body,
    }).then((success) => {
      if (!success) {
        Alert.alert(
          t("providerDetails.error"),
          t("providerDetails.emailError"),
        );
      }
    });
  };

  const handleShare = async () => {
    try {
      const message = `Check out ${provider.provider_name}${
        provider.type ? ` - ${provider.type}` : ""
      }

${provider.phone ? `📞 ${provider.phone}` : ""}
${provider.email ? `📧 ${provider.email}` : ""}
${provider.address ? `📍 ${provider.address}` : ""}
${provider.map_url ? `\n🗺️ ${provider.map_url}` : ""}`;

      await Share.share({
        message: message.trim(),
        title: provider.provider_name || "Provider Details",
      });
    } catch (error) {
      Alert.alert(t("providerDetails.error"), t("providerDetails.shareError"));
    }
  };

  const handleFavorite = async () => {
    const subject = `Favorite Provider: ${
      provider.provider_name || "Provider"
    }`;
    const body = `I would like to save this provider as a favorite: Provider Name: ${
      provider.provider_name || "N/A"
    } Type: ${provider.type || "N/A"}
${provider.sub_type ? `Sub Type: ${provider.sub_type.replace(/_/g, " ")}` : ""}

Contact Information:
Phone: ${provider.phone || "N/A"}
Email: ${provider.email || "N/A"}
Address: ${provider.address || "N/A"}
${resolvedCity ? `City: ${resolvedCity}` : ""}
${resolvedDistrict ? `District: ${resolvedDistrict}` : ""}
${resolvedState ? `State: ${resolvedState}` : ""}
${resolvedPincode ? `Pincode: ${resolvedPincode}` : ""}

${
  provider.specialities && provider.specialities.length > 0
    ? `Specialities: ${provider.specialities.join(", ")}`
    : ""
}
${provider.benefits ? `Benefits: ${provider.benefits}` : ""}
${provider.map_url ? `Map: ${provider.map_url}` : ""}`;

    await openEmailComposer({
      subject,
      body,
    });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={18}
          weight={i <= rating ? "fill" : "regular"}
          color={i <= rating ? "#F59E0B" : "#D1D5DB"}
        />,
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {provider.provider_name?.charAt(0) || "P"}
              </Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleFavorite}
              >
                <Heart size={24} color="#DC2626" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
                <ShareNetwork size={24} color="#0369A1" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.providerName}>{provider.provider_name}</Text>

          <View style={styles.typeContainer}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>
                {provider.type?.toUpperCase() || "PROVIDER"}
              </Text>
            </View>
            {provider.sub_type && (
              <View style={styles.subTypeBadge}>
                <Text style={styles.subTypeText}>
                  {provider.sub_type.replace(/_/g, " ")}
                </Text>
              </View>
            )}
          </View>

          {!!provider.rating && (
            <View style={styles.ratingContainer}>
              <View style={styles.starsRow}>
                {renderStars(provider.rating)}
              </View>
              <Text style={styles.ratingText}>{provider.rating}.0</Text>
            </View>
          )}
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("providerDetails.contactInfo")}
          </Text>

          <TouchableOpacity
            style={styles.contactItem}
            onPress={handlePhoneCall}
          >
            <View style={styles.contactIconContainer}>
              <Phone size={20} color="#0369A1" weight="fill" />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactLabel}>
                {t("providerDetails.phone")}
              </Text>
              <Text style={styles.contactValue}>{provider.phone || "N/A"}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
            <View style={styles.contactIconContainer}>
              <EnvelopeSimple size={20} color="#0369A1" weight="fill" />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactLabel}>
                {t("providerDetails.email")}
              </Text>
              <Text style={styles.contactValue}>{provider.email || "N/A"}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem} onPress={handleOpenMap}>
            <View style={styles.contactIconContainer}>
              <MapPin size={20} color="#0369A1" weight="fill" />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactLabel}>
                {t("providerDetails.address")}
              </Text>
              <Text style={styles.contactValue}>
                {provider.address || "N/A"}
              </Text>
              <Text style={styles.contactSubValue}>
                {[
                  resolvedCity,
                  resolvedDistrict,
                  resolvedState,
                  resolvedPincode,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </Text>
            </View>
            <NavigationArrow size={20} color="#0369A1" />
          </TouchableOpacity>
        </View>

        {/* Specialities Section */}
        {provider.specialities && provider.specialities.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t("providerDetails.specialities")}
            </Text>
            <View style={styles.tagsContainer}>
              {provider.specialities.map((specialty: string, index: number) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{specialty}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Benefits Section */}
        {provider.benefits && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t("providerDetails.benefits")}
            </Text>
            <View style={styles.benefitsCard}>
              <Text style={styles.benefitsText}>{provider.benefits}</Text>
            </View>
          </View>
        )}

        {/* Map Button */}
        {(provider.map_url || (provider.latitude && provider.longitude)) && (
          <TouchableOpacity style={styles.mapButton} onPress={handleOpenMap}>
            <MapPin size={20} color="#fff" weight="fill" />
            <Text style={styles.mapButtonText}>
              {t("providerDetails.viewOnMap")}
            </Text>
          </TouchableOpacity>
        )}

        {/* Call Button */}
        {provider.phone && (
          <TouchableOpacity style={styles.callButton} onPress={handlePhoneCall}>
            <Phone size={20} color="#fff" weight="fill" />
            <Text style={styles.callButtonText}>
              {t("providerDetails.callNow")}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  content: {
    paddingBottom: 24,
  },
  errorText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#6B7280",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#0369A1",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  providerName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#DBEAFE",
    borderRadius: 6,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E40AF",
  },
  subTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#FEF3C7",
    borderRadius: 6,
  },
  subTypeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#92400E",
    textTransform: "capitalize",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  starsRow: {
    flexDirection: "row",
    gap: 4,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
    marginLeft: 4,
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contactContent: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },
  contactSubValue: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#EFF6FF",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  tagText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1E40AF",
  },
  benefitsCard: {
    padding: 16,
    backgroundColor: "#F0FDF4",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  benefitsText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#166534",
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 14,
    backgroundColor: "#0369A1",
    borderRadius: 8,
  },
  mapButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 20,
    marginTop: 12,
    paddingVertical: 14,
    backgroundColor: "#10B981",
    borderRadius: 8,
  },
  callButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
