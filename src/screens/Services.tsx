import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ActivityIndicator,
  Linking,
  Alert,
} from "react-native";
import {
  MagnifyingGlass,
  Star,
  Wrench,
  CaretRight,
  PhoneCall,
  Hospital,
  Syringe,
  Pill,
  Stethoscope,
  FolderPlus,
  Truck,
  MapPin,
  Clock,
  SlidersHorizontal,
  X,
} from "phosphor-react-native";
import ProviderFilterSheet, {
  ProviderFilter,
  EMPTY_FILTER,
} from "../components/general/ProviderFilterSheet";
import { useTranslation } from "react-i18next";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  useGetBloodRequestsQuery,
  useGetProvidersQuery,
  useGetAmbulancesQuery,
} from "@psi/shared-api";
import { GuideWrapper } from "../components/general/GuideWrapper";
import { findGuideStep } from "../config/guideConfig";
import { useGuideController } from "../hooks/useGuideController";

const { width } = Dimensions.get("window");

// Chips layout: show 3 chips per row, divide available width equally
const CHIP_COLS = 3;
const CHIP_GAP = 12;
const CHIP_CONTAINER_HORIZONTAL_PADDING = 16; // matches content padding
const CHIP_WIDTH = Math.floor(
  (width - CHIP_CONTAINER_HORIZONTAL_PADDING * 2 - (CHIP_COLS - 1) * CHIP_GAP) /
    CHIP_COLS,
);

const TABS = ["Providers", "Blood", "Equipment", "Ambulance", "Benefits"];

/** Map tab names to guide target keys in guideConfig */
const TAB_GUIDE_MAP: Record<string, string> = {
  Providers: "providersTab",
  Blood: "bloodTab",
  Equipment: "equipmentTab",
  Ambulance: "ambulanceTab",
};

export default function ServicesScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState("Providers");
  const [query, setQuery] = useState("");
  const [activeChip, setActiveChip] = useState("All");
  const [filterVisible, setFilterVisible] = useState(false);
  const [locationFilter, setLocationFilter] = useState<ProviderFilter>(EMPTY_FILTER);

  // Initialize walkthrough guide for ServicesScreen
  useGuideController("ServicesScreen");

  // Fetch providers from API
  const {
    data: providersData,
    isLoading,
    error,
    refetch,
  } = useGetProvidersQuery();
  const {
    data: bloodRequestsData,
    isLoading: bloodLoading,
    error: bloodError,
    refetch: refetchBlood,
  } = useGetBloodRequestsQuery();
  const {
    data: ambulancesResponse,
    isLoading: ambulanceLoading,
    error: ambulanceError,
    refetch: refetchAmbulances,
  } = useGetAmbulancesQuery();

  // console.log("Providers data:", error ? error : providersData);
  // console.log(
  //   "Blood requests data:",
  //   bloodError ? bloodError : bloodRequestsData,
  // );

  // Refetch providers when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refetch();
      refetchBlood();
      refetchAmbulances();
    }, [refetch, refetchBlood, refetchAmbulances]),
  );

  const activeFilterCount =
    (locationFilter.stateId ? 1 : 0) +
    (locationFilter.districtId ? 1 : 0) +
    (locationFilter.blockId ? 1 : 0) +
    (locationFilter.mandalId ? 1 : 0);

  // Filter providers based on activeChip, search query and location filters
  const filtered = useMemo(() => {
    let providers: any[] = providersData?.data || [];

    // Category chip filter
    if (activeChip !== "All") {
      providers = providers.filter((p: any) => {
        const category =
          p.category?.toLowerCase() || p.type?.toLowerCase() || "";
        return category === activeChip.toLowerCase();
      });
    }

    // Text search filter
    if (query.trim()) {
      const searchLower = query.toLowerCase();
      providers = providers.filter((p: any) => {
        const name = (p.provider_name || "").toLowerCase();
        const address = (p.address || "").toLowerCase();
        const specialties = (p.specialities || []).join(" ").toLowerCase();
        return (
          name.includes(searchLower) ||
          address.includes(searchLower) ||
          specialties.includes(searchLower)
        );
      });
    }

    // Location filter — name-based match (providers may not carry IDs)
    if (activeFilterCount > 0) {
      const match = (fieldValue: any, filterName: string, filterId: number | null): boolean => {
        const haystack = [
          String(fieldValue ?? ""),
        ].map((v) => v.toLowerCase());
        // Accept either an exact ID match OR a case-insensitive name match
        if (filterId !== null && haystack.includes(String(filterId))) return true;
        if (filterName && haystack.some((v) => v === filterName.toLowerCase())) return true;
        return false;
      };

      providers = providers.filter((p: any) => {
        if (locationFilter.stateId) {
          const pVal = p.state_id ?? p.state_name ?? p.state ?? "";
          if (!match(pVal, locationFilter.stateName, locationFilter.stateId)) return false;
        }
        if (locationFilter.districtId) {
          const pVal = p.district_id ?? p.district_name ?? p.district ?? "";
          if (!match(pVal, locationFilter.districtName, locationFilter.districtId)) return false;
        }
        if (locationFilter.blockId) {
          const pVal = p.block_id ?? p.block_name ?? p.block ?? "";
          if (!match(pVal, locationFilter.blockName, locationFilter.blockId)) return false;
        }
        if (locationFilter.mandalId) {
          const pVal = p.mandal_id ?? p.mandal_name ?? p.mandal ?? "";
          if (!match(pVal, locationFilter.mandalName, locationFilter.mandalId)) return false;
        }
        return true;
      });
    }

    return providers;
  }, [providersData?.data, activeChip, query, locationFilter, activeFilterCount]);

  const handleProviderPress = (provider: any) => {
    navigation.navigate("ProviderDetails", { provider: provider });
  };

  const benefits = [
    {
      key: "free",
      title: t("services.benefits.free.title", "Free Consultations"),
      subtitle: t(
        "services.benefits.free.subtitle",
        "Access to general physicians and specialists",
      ),
      icon: Stethoscope,
      bg: "#E0F2FE",
      color: "#0369A1",
    },
    {
      key: "medicine",
      title: t("services.benefits.medicine.title", "Medicine Assistance"),
      subtitle: t(
        "services.benefits.medicine.subtitle",
        "Subsidized medicines for chronic conditions",
      ),
      icon: Pill,
      bg: "#FEEFEF",
      color: "#7C3AED",
    },
    {
      key: "emergency",
      title: t("services.benefits.emergency.title", "Emergency Transport"),
      subtitle: t(
        "services.benefits.emergency.subtitle",
        "24/7 emergency ambulance services",
      ),
      icon: PhoneCall,
      bg: "#FFEFE9",
      color: "#DC2626",
    },
    {
      key: "checkups",
      title: t("services.benefits.checkups.title", "Health Checkups"),
      subtitle: t(
        "services.benefits.checkups.subtitle",
        "Regular health monitoring and diagnostics",
      ),
      icon: Star,
      bg: "#ECFDF5",
      color: "#10B981",
    },
    {
      key: "records",
      title: t("services.benefits.records.title", "Medical Records"),
      subtitle: t(
        "services.benefits.records.subtitle",
        "Digital health records management",
      ),
      icon: FolderPlus,
      bg: "#EFF6FF",
      color: "#2563EB",
    },
    {
      key: "find",
      title: t("services.benefits.find.title", "Find Clinics"),
      subtitle: t(
        "services.benefits.find.subtitle",
        "Locate nearby partner healthcare centers",
      ),
      icon: Hospital,
      bg: "#F3F4F6",
      color: "#0F172A",
    },
  ];

  const handlePhoneCall = (contact: string, serviceName: string) => {
    const phoneNumber = (contact ?? "").replace(/\s/g, "");
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`).catch(() => {
        Alert.alert(
          t("providerDetails.error"),
          t("providerDetails.phoneError"),
        );
      });
    } else {
      Alert.alert(
        t("common.error"),
        t("services.noContactFor", { serviceName }),
      );
    }
  };

  const getAmbulanceStatusStyle = (status: string) => {
    const s = (status ?? "").toLowerCase();
    switch (s) {
      case "available":
        return styles.ambStatusAvailable;
      case "unavailable":
        return styles.ambStatusUnavailable;
      case "busy":
        return styles.ambStatusBusy;
      default:
        return styles.ambStatusAvailable;
    }
  };

  const getBloodStatusStyle = (status?: string) => {
    const normalized = (status ?? "").toLowerCase();
    switch (normalized) {
      case "approved":
        return styles.bloodStatusApproved;
      case "rejected":
        return styles.bloodStatusRejected;
      case "completed":
        return styles.bloodStatusCompleted;
      case "hold":
        return styles.bloodStatusHold;
      case "pending":
      default:
        return styles.bloodStatusPending;
    }
  };

  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>
          {t("services.title", "Services & Providers")}
        </Text>
        <Text style={styles.subtitle}>
          {t(
            "services.subtitle",
            "Find empaneled healthcare providers near you",
          )}
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabScrollContainer}
        >
          <View style={styles.tabRow}>
            {TABS.map((tab) => (
              <GuideWrapper
                key={tab}
                step={
                  TAB_GUIDE_MAP[tab]
                    ? findGuideStep("ServicesScreen", TAB_GUIDE_MAP[tab])
                    : undefined
                }
              >
                <TouchableOpacity
                  style={[
                    styles.tabItem,
                    activeTab === tab && styles.tabItemActive,
                  ]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === tab && styles.tabTextActive,
                    ]}
                  >
                    {t(`services.tab.${tab.toLowerCase()}`, tab)}
                  </Text>
                </TouchableOpacity>
              </GuideWrapper>
            ))}
          </View>
        </ScrollView>

        {activeTab === "Providers" && (
          <View style={styles.chipsContainer}>
            <View style={styles.chipsRow}>
              <TouchableOpacity
                style={[styles.chip, activeChip === "All" && styles.chipActive]}
                onPress={() => setActiveChip("All")}
              >
                <Text
                  style={[
                    styles.chipText,
                    activeChip === "All" && styles.chipActiveText,
                  ]}
                >
                  {t("services.categories.all")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.chip,
                  activeChip === "Hospital" && styles.chipActive,
                ]}
                onPress={() => setActiveChip("Hospital")}
              >
                <Hospital
                  size={14}
                  color={activeChip === "Hospital" ? "#0369A1" : "#0369A1"}
                />
                <Text
                  style={[
                    styles.chipText,
                    activeChip === "Hospital" && styles.chipActiveText,
                  ]}
                >
                  {t("services.categories.hospital")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.chip,
                  activeChip === "Diagnostics" && styles.chipActive,
                ]}
                onPress={() => setActiveChip("Diagnostics")}
              >
                <Syringe
                  size={14}
                  color={activeChip === "Diagnostics" ? "#0369A1" : "#0369A1"}
                />
                <Text
                  style={[
                    styles.chipText,
                    activeChip === "Diagnostics" && styles.chipActiveText,
                  ]}
                >
                  {t("services.categories.diagnostics")}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.chipsRow}>
              <TouchableOpacity
                style={[
                  styles.chip,
                  activeChip === "Pharmacy" && styles.chipActive,
                ]}
                onPress={() => setActiveChip("Pharmacy")}
              >
                <Pill
                  size={14}
                  color={activeChip === "Pharmacy" ? "#0369A1" : "#0369A1"}
                />
                <Text
                  style={[
                    styles.chipText,
                    activeChip === "Pharmacy" && styles.chipActiveText,
                  ]}
                >
                  {t("services.categories.pharmacy")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.chip,
                  activeChip === "clinic" && styles.chipActive,
                ]}
                onPress={() => setActiveChip("clinic")}
              >
                <Stethoscope
                  size={14}
                  color={activeChip === "clinic" ? "#0369A1" : "#0369A1"}
                />
                <Text
                  style={[
                    styles.chipText,
                    activeChip === "clinic" && styles.chipActiveText,
                  ]}
                >
                  {t("services.categories.clinics")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.chip,
                  activeChip === "Rehab" && styles.chipActive,
                ]}
                onPress={() => setActiveChip("Rehab")}
              >
                <FolderPlus
                  size={14}
                  color={activeChip === "Rehab" ? "#0369A1" : "#0369A1"}
                />
                <Text
                  style={[
                    styles.chipText,
                    activeChip === "Rehab" && styles.chipActiveText,
                  ]}
                >
                  {t("services.categories.rehab")}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.chipsRow}>
              <TouchableOpacity
                style={[
                  styles.chip,
                  activeChip === "Labs" && styles.chipActive,
                ]}
                onPress={() => setActiveChip("Labs")}
              >
                <Syringe
                  size={14}
                  color={activeChip === "Labs" ? "#0369A1" : "#0369A1"}
                />
                <Text
                  style={[
                    styles.chipText,
                    activeChip === "Labs" && styles.chipActiveText,
                  ]}
                >
                  {t("services.categories.labs")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.chip,
                  activeChip === "surgicals" && styles.chipActive,
                ]}
                onPress={() => setActiveChip("surgicals")}
              >
                <Wrench
                  size={14}
                  color={activeChip === "surgicals" ? "#0369A1" : "#0369A1"}
                />
                <Text
                  style={[
                    styles.chipText,
                    activeChip === "surgicals" && styles.chipActiveText,
                  ]}
                >
                  {t("services.categories.surgical")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === "Providers" && (
          <>
            <View style={styles.searchRow}>
              <MagnifyingGlass color="#9CA3AF" size={18} />
              <TextInput
                placeholder={t(
                  "services.searchPlaceholder",
                  "Search providers, specialties, location...",
                )}
                value={query}
                onChangeText={setQuery}
                style={styles.searchInput}
              />
              <GuideWrapper
                step={findGuideStep("ServicesScreen", "providerFilterBtn")}
                borderRadius={8}
              >
                <TouchableOpacity
                  style={[styles.filterBtn, activeFilterCount > 0 && styles.filterBtnActive]}
                  onPress={() => setFilterVisible(true)}
                  activeOpacity={0.8}
                >
                  <SlidersHorizontal
                    size={16}
                    color={activeFilterCount > 0 ? "#0369A1" : "#6B7280"}
                    weight={activeFilterCount > 0 ? "bold" : "regular"}
                  />
                  {activeFilterCount > 0 && (
                    <View style={styles.filterBadge}>
                      <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </GuideWrapper>
            </View>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.activeFiltersRow}
                contentContainerStyle={{ gap: 6, paddingRight: 4 }}
              >
                {locationFilter.stateName ? (
                  <TouchableOpacity
                    style={styles.activeFilterChip}
                    onPress={() => setLocationFilter(EMPTY_FILTER)}
                  >
                    <Text style={styles.activeFilterChipText}>{locationFilter.stateName}</Text>
                    <X size={11} color="#0369A1" weight="bold" />
                  </TouchableOpacity>
                ) : null}
                {locationFilter.districtName ? (
                  <TouchableOpacity
                    style={styles.activeFilterChip}
                    onPress={() =>
                      setLocationFilter({
                        ...locationFilter,
                        districtId: null,
                        districtName: "",
                        blockId: null,
                        blockName: "",
                        mandalId: null,
                        mandalName: "",
                      })
                    }
                  >
                    <Text style={styles.activeFilterChipText}>{locationFilter.districtName}</Text>
                    <X size={11} color="#0369A1" weight="bold" />
                  </TouchableOpacity>
                ) : null}
                {locationFilter.blockName ? (
                  <TouchableOpacity
                    style={styles.activeFilterChip}
                    onPress={() =>
                      setLocationFilter({
                        ...locationFilter,
                        blockId: null,
                        blockName: "",
                        mandalId: null,
                        mandalName: "",
                      })
                    }
                  >
                    <Text style={styles.activeFilterChipText}>{locationFilter.blockName}</Text>
                    <X size={11} color="#0369A1" weight="bold" />
                  </TouchableOpacity>
                ) : null}
                {locationFilter.mandalName ? (
                  <TouchableOpacity
                    style={styles.activeFilterChip}
                    onPress={() =>
                      setLocationFilter({ ...locationFilter, mandalId: null, mandalName: "" })
                    }
                  >
                    <Text style={styles.activeFilterChipText}>{locationFilter.mandalName}</Text>
                    <X size={11} color="#0369A1" weight="bold" />
                  </TouchableOpacity>
                ) : null}
              </ScrollView>
            )}
          </>
        )}

        {activeTab === "Providers" && (
          <View>
            {isLoading ? (
              <View style={{ padding: 20, alignItems: "center" }}>
                <ActivityIndicator size="large" color="#0369A1" />
                <Text style={{ marginTop: 8, color: "#6B7280" }}>
                  {t("services.loading")}
                </Text>
              </View>
            ) : error ? (
              <View style={{ padding: 20, alignItems: "center" }}>
                <Text style={{ color: "#DC2626" }}>
                  {t("services.loadError")}
                </Text>
              </View>
            ) : (
              <>
                <Text style={styles.resultsCount}>
                  {filtered.length}{" "}
                  {t("services.resultsFound", "providers found")}
                </Text>
                {filtered.map((p: any) => (
                  <TouchableOpacity
                    key={p.id}
                    style={styles.providerCard}
                    activeOpacity={0.85}
                    onPress={() => handleProviderPress(p)}
                  >
                    <View style={styles.providerLeft}>
                      <View style={styles.providerAvatar}>
                        <Text style={styles.avatarLetter}>
                          {p.provider_name?.charAt(0) || "P"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.providerMain}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text style={styles.providerName}>
                          {p.provider_name || t("services.provider.unknown")}
                        </Text>
                        {!!p.rating && (
                          <View style={styles.ratingBadge}>
                            <Text style={styles.ratingBadgeText}>
                              {p.rating}
                            </Text>
                          </View>
                        )}
                      </View>

                      <Text style={styles.providerAddress}>
                        {p.address || t("services.provider.noAddress")}
                      </Text>

                      <View style={styles.tagsRow}>
                        {(p.specialities || []).map(
                          (s: string, idx: number) => (
                            <View key={idx} style={styles.tagPill}>
                              <Text style={styles.tagText}>{s}</Text>
                            </View>
                          ),
                        )}
                      </View>

                      {(p.distanceKm || p.offerPercent) && (
                        <View style={styles.bottomRow}>
                          {p.distanceKm && (
                            <Text style={styles.distanceText}>
                              {p.distanceKm} km
                            </Text>
                          )}
                          {p.offerPercent && (
                            <View style={styles.offerPill}>
                              <Text style={styles.offerText}>
                                {p.offerPercent}% OFF
                              </Text>
                            </View>
                          )}
                        </View>
                      )}

                      <View style={styles.contactRow}>
                        <PhoneCall size={12} color="#6B7280" />
                        <Text style={styles.contactText}>
                          {p.phone || t("services.provider.noPhone")}
                          {p.hours && ` • ${p.hours}`}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.providerRight}>
                      <CaretRight color="#9CA3AF" size={18} />
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </View>
        )}

        {activeTab === "Blood" && (
          <View>
            <View style={styles.alertBox}>
              <Text style={styles.alertTitle}>
                {t("services.blood.emergency", "Emergency Blood Required!")}
              </Text>
              <Text style={styles.alertText}>
                {t(
                  "services.blood.cta",
                  "Request blood from our donor network",
                )}
              </Text>
              <TouchableOpacity
                style={styles.alertButton}
                onPress={() => navigation.navigate("BloodRequest")}
              >
                <Text style={styles.alertButtonText}>
                  {t("services.blood.requestNow", "Request Blood Now")}
                </Text>
              </TouchableOpacity>
            </View>

            {(() => {
              const bloodRequests = Array.isArray(bloodRequestsData?.data)
                ? bloodRequestsData.data
                : Array.isArray(bloodRequestsData)
                ? bloodRequestsData
                : [];

              if (bloodLoading) {
                return (
                  <View style={{ padding: 20, alignItems: "center" }}>
                    <ActivityIndicator size="large" color="#DC2626" />
                    <Text style={{ marginTop: 8, color: "#6B7280" }}>
                      {t("services.blood.loading")}
                    </Text>
                  </View>
                );
              }

              if (bloodError) {
                return (
                  <View style={{ padding: 20, alignItems: "center" }}>
                    <Text style={{ color: "#DC2626" }}>
                      {t("services.blood.loadError")}
                    </Text>
                  </View>
                );
              }

              if (bloodRequests.length === 0) {
                return (
                  <View style={{ padding: 20, alignItems: "center" }}>
                    <Text style={{ color: "#6B7280" }}>
                      {t("services.blood.noRequests")}
                    </Text>
                  </View>
                );
              }

              return (
                <View style={{ marginTop: 12 }}>
                  <Text style={styles.sectionHeader}>
                    {t("services.blood.myRequests", "My Blood Requests")}
                  </Text>
                  {bloodRequests.map((req: any, idx: number) => (
                    <View
                      key={`${
                        req.blood_request.id ?? req.blood_request.id ?? idx
                      }`}
                      style={styles.bloodCard}
                    >
                      <View style={styles.bloodHeaderRow}>
                        <Text style={styles.bloodTitle}>
                          {req.blood_request.patient_name ||
                            t("services.blood.patient")}
                        </Text>
                        {!!req.blood_request.status && (
                          <View
                            style={[
                              styles.bloodStatusBadge,
                              getBloodStatusStyle(req.blood_request.status),
                            ]}
                          >
                            <Text style={styles.bloodStatusText}>
                              {String(req.blood_request.status)}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.bloodMeta}>
                        {t("services.blood.bloodGroup")}{" "}
                        {req.blood_request.required_blood_group}
                      </Text>
                      <Text style={styles.bloodMeta}>
                        {t("services.blood.units")}{" "}
                        {req.blood_request.units_required}
                      </Text>
                      {!!req.blood_request.required_datetime && (
                        <Text style={styles.bloodMeta}>
                          {t("services.blood.required")}{" "}
                          {req.blood_request.required_datetime}
                        </Text>
                      )}
                      {!!req.blood_request.urgency_level && (
                        <Text style={styles.bloodMeta}>
                          {t("services.blood.urgency")}{" "}
                          {req.blood_request.urgency_level}
                        </Text>
                      )}
                      {!!req.blood_request.hospital_name && (
                        <Text style={styles.bloodMeta}>
                          {t("services.blood.hospital")}{" "}
                          {req.blood_request.hospital_name}
                        </Text>
                      )}
                      {!!req.blood_request.requester_mobile && (
                        <Text style={styles.bloodMeta}>
                          {t("services.blood.contact")}{" "}
                          {req.blood_request.requester_mobile}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              );
            })()}
          </View>
        )}

        {activeTab === "Equipment" && (
          <View>
            <View style={styles.requestEquipmentCard}>
              <Wrench color="#075985" size={18} />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.requestEquipmentTitle}>
                  {t("services.equipment.need", "Need Medical Equipment?")}
                </Text>
                <Text style={styles.requestEquipmentSubtitle}>
                  {t(
                    "services.equipment.subtitle",
                    "Request equipment support for home care",
                  )}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.requestEquipmentButton}
                onPress={() => navigation.navigate("EquipmentRequest")}
              >
                <Text style={styles.requestEquipmentButtonText}>
                  {t("services.equipment.request", "Request Equipment")}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.equipmentGrid}>
              {[
                { k: "Mobility Aids", n: 5 },
                { k: "Hospital Beds", n: 4 },
                { k: "Monitoring Devices", n: 5 },
                { k: "Respiratory Equipment", n: 6 },
              ].map((e) => (
                <View key={e.k} style={styles.equipmentItem}>
                  <Text style={styles.equipmentTitle}>{e.k}</Text>
                  <View style={styles.equipmentCount}>
                    <Text style={styles.equipmentCountText}>{e.n} items</Text>
                  </View>
                </View>
              ))}
            </View>

            <Text style={styles.sectionHeader}>
              {t("services.equipment.myRequests", "My Equipment Requests")}
            </Text>
            <TouchableOpacity
              style={styles.viewRequestsButton}
              onPress={() => navigation.navigate("EquipmentRequestList")}
            >
              <Text style={styles.viewRequestsButtonText}>
                {t("services.equipment.viewAll", "View All Requests")}
              </Text>
              <CaretRight size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {activeTab === "Ambulance" && (
          <View>
            <View style={styles.ambHeaderCard}>
              <Text style={styles.ambHeaderTitle}>
                {t("ambulance.title", "Ambulance Services")}
              </Text>
              <Text style={styles.ambHeaderSubtitle}>
                {t(
                  "ambulance.subtitle",
                  "24/7 emergency ambulance services available",
                )}
              </Text>
            </View>

            {ambulanceLoading && (
              <View style={styles.ambCenterBox}>
                <ActivityIndicator size="large" color="#DC2626" />
                <Text style={styles.ambLoadingText}>
                  {t("ambulance.loading", "Loading ambulances...")}
                </Text>
              </View>
            )}

            {ambulanceError && (
              <View style={styles.ambErrorBox}>
                <Text style={styles.ambErrorText}>
                  {t("ambulance.error", "Failed to load ambulances")}
                </Text>
              </View>
            )}

            {!ambulanceLoading &&
              !ambulanceError &&
              (() => {
                const ambulances = Array.isArray(
                  (ambulancesResponse as any)?.data,
                )
                  ? (ambulancesResponse as any).data
                  : [];
                if (ambulances.length === 0) {
                  return (
                    <View style={styles.ambCenterBox}>
                      <Text style={styles.ambEmptyText}>
                        {t("ambulance.empty", "No ambulances available")}
                      </Text>
                    </View>
                  );
                }
                return ambulances.map((item: any) => (
                  <View key={item.id?.toString()} style={styles.ambCard}>
                    <View style={styles.ambCardHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.ambServiceName}>
                          {item.service_name}
                        </Text>
                        <Text style={styles.ambCompany}>{item.company}</Text>
                      </View>
                      <View
                        style={[
                          styles.ambStatusBadge,
                          getAmbulanceStatusStyle(item.status),
                        ]}
                      >
                        <Text style={styles.ambStatusText}>
                          {((item.status ?? "") as string)
                            .charAt(0)
                            .toUpperCase() +
                            ((item.status ?? "") as string)
                              .slice(1)
                              .toLowerCase()}
                        </Text>
                      </View>
                    </View>

                    <View style={{ marginBottom: 12 }}>
                      <View style={styles.ambDetailRow}>
                        <Truck size={16} color="#64748B" />
                        <Text style={styles.ambDetailLabel}>
                          {t("ambulance.details.vehicleType")}
                        </Text>
                        <Text style={styles.ambDetailValue}>
                          {item.vehicle_type}
                        </Text>
                      </View>
                      <View style={styles.ambDetailRow}>
                        <MapPin size={16} color="#64748B" />
                        <Text style={styles.ambDetailLabel}>
                          {t("ambulance.details.serviceArea")}
                        </Text>
                        <Text style={styles.ambDetailValue}>
                          {item.service_area}
                        </Text>
                      </View>
                      <View style={styles.ambDetailRow}>
                        <Clock size={16} color="#64748B" />
                        <Text style={styles.ambDetailLabel}>
                          {t("ambulance.details.responseTime")}
                        </Text>
                        <Text style={styles.ambDetailValue}>
                          {item.response_time}
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.ambCallButton}
                      onPress={() =>
                        handlePhoneCall(item.contact, item.service_name)
                      }
                    >
                      <PhoneCall size={18} color="#fff" weight="fill" />
                      <Text style={styles.ambCallButtonText}>
                        {t("ambulance.call", { contact: item.contact })}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ));
              })()}
          </View>
        )}

        {activeTab === "Benefits" && (
          <View>
            <Text style={[styles.sectionHeader, { marginTop: 8 }]}>
              {t("services.benefits.title", "Benefits")}
            </Text>

            {benefits.map((b) => {
              const Icon = b.icon as any;
              return (
                <View key={b.key} style={styles.benefitCard}>
                  <View
                    style={[
                      styles.benefitIconCircle,
                      { backgroundColor: b.bg },
                    ]}
                  >
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
              <Text
                style={{ fontWeight: "700", color: "#0F172A", marginBottom: 6 }}
              >
                {t("services.help.title", "Need Help?")}
              </Text>
              <Text style={{ color: "#6B7280", marginBottom: 12 }}>
                {t(
                  "services.help.desc",
                  "Our support team is available 24/7 to assist you",
                )}
              </Text>
              <TouchableOpacity
                style={styles.supportButton}
                activeOpacity={0.85}
              >
                <Text style={styles.supportButtonText}>
                  {t("services.help.contact", "Contact Support")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      <ProviderFilterSheet
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        value={locationFilter}
        onChange={(f) => setLocationFilter(f)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F6F7FB" },
  content: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 18, fontWeight: "700", color: "#0F172A" },
  subtitle: { color: "#6B7280", marginTop: 4, marginBottom: 12 },
  tabScrollContainer: { marginVertical: 8 },
  tabRow: { flexDirection: "row", gap: 6 },
  tabItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 18,
    alignItems: "center",
    minWidth: 80,
  },
  tabItemActive: { backgroundColor: "#E0F2FE" },
  tabText: { color: "#374151", fontSize: 13 },
  tabTextActive: { color: "#0369A1", fontWeight: "700" },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 8,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    gap: 8,
  },
  searchInput: { flex: 1, height: 36 },
  filterBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  filterBtnActive: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  filterBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#0369A1",
    alignItems: "center",
    justifyContent: "center",
  },
  filterBadgeText: { fontSize: 9, color: "#fff", fontWeight: "800" },
  activeFiltersRow: { marginTop: 8 },
  activeFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  activeFilterChipText: { fontSize: 12, color: "#0369A1", fontWeight: "600" },
  resultsCount: { marginTop: 12, marginBottom: 8, color: "#6B7280" },
  providerCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
  },
  providerLeft: { width: 56, alignItems: "center", justifyContent: "center" },
  providerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: { color: "#fff", fontWeight: "700" },
  providerMain: { marginLeft: 12, flex: 1 },
  providerName: { fontSize: 14, fontWeight: "700", color: "#0F172A" },
  providerAddress: { color: "#6B7280", fontSize: 13, marginTop: 4 },
  providerMeta: { flexDirection: "row", marginTop: 6 },
  rating: { flexDirection: "row", alignItems: "center" },
  ratingText: { marginLeft: 6, color: "#374151" },
  ratingBadge: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ratingBadgeText: { color: "#064E3B", fontWeight: "700" },
  tagsRow: { flexDirection: "row", marginTop: 8, flexWrap: "wrap" },
  tagPill: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 8,
    marginTop: 6,
  },
  tagText: { color: "#065F46", fontSize: 12, fontWeight: "600" },
  bottomRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  distanceText: { color: "#6B7280", fontSize: 12 },
  offerPill: {
    backgroundColor: "#FEF3F2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  offerText: { color: "#B91C1C", fontSize: 12, fontWeight: "700" },
  contactRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  contactText: { marginLeft: 6, color: "#6B7280", fontSize: 12 },
  dot: { marginHorizontal: 6, color: "#6B7280" },
  providerRight: { width: 36, alignItems: "center", justifyContent: "center" },
  alertBox: {
    backgroundColor: "#FEF3F2",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
    marginTop: 12,
  },
  alertTitle: { color: "#B91C1C", fontWeight: "700", marginBottom: 6 },
  alertText: { color: "#92400E", marginBottom: 8 },
  alertButton: {
    backgroundColor: "#DC2626",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  alertButtonText: { color: "#fff", fontWeight: "700" },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },
  infoLabel: { color: "#6B7280" },
  requestEquipmentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  requestEquipmentTitle: { fontWeight: "700", color: "#075985" },
  requestEquipmentSubtitle: { color: "#075985", opacity: 0.8, marginTop: 4 },
  requestEquipmentButton: {
    backgroundColor: "#0EA5A4",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  requestEquipmentButtonText: { color: "#fff", fontWeight: "700" },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 8,
  },
  bloodCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  bloodHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  bloodTitle: { fontSize: 14, fontWeight: "700", color: "#0F172A" },
  bloodMeta: { color: "#6B7280", fontSize: 12, marginTop: 2 },
  bloodStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bloodStatusText: { color: "#B91C1C", fontSize: 11, fontWeight: "700" },
  bloodStatusPending: { backgroundColor: "#FEF3C7" },
  bloodStatusApproved: { backgroundColor: "#DCFCE7" },
  bloodStatusRejected: { backgroundColor: "#FEE2E2" },
  bloodStatusCompleted: { backgroundColor: "#CCFBF1" },
  bloodStatusHold: { backgroundColor: "#EDE9FE" },
  viewRequestsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0369A1",
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  viewRequestsButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  equipmentGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 8,
  },
  equipmentItem: {
    width: (width - 64) / 2,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  equipmentTitle: { fontWeight: "700", color: "#075985" },
  equipmentCount: {
    marginTop: 8,
    backgroundColor: "#F1F5F9",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  equipmentCountText: { color: "#0F172A", fontWeight: "600" },
  chipsContainer: {
    marginTop: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    padding: 12,
  },
  chipsRow: {
    flexDirection: "row",
    gap: CHIP_GAP,
    marginBottom: 8,
  },
  chip: {
    width: CHIP_WIDTH,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  chipText: { marginLeft: 8, color: "#374151", fontSize: 13 },
  chipActive: {
    width: CHIP_WIDTH,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E6EEF8",
  },
  chipActiveText: { color: "#0369A1", fontWeight: "700" },
  benefitCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  benefitIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  benefitTitle: { fontSize: 14, fontWeight: "700", color: "#0F172A" },
  benefitSubtitle: { color: "#6B7280", fontSize: 13, marginTop: 4 },
  supportBox: { backgroundColor: "#F0F9FF", borderRadius: 12, padding: 16 },
  supportButton: {
    backgroundColor: "#0F172A",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  supportButtonText: { color: "#fff", fontWeight: "700" },
  // Ambulance tab styles
  ambHeaderCard: {
    backgroundColor: "#DC2626",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  ambHeaderTitle: { color: "#fff", fontWeight: "700", fontSize: 18 },
  ambHeaderSubtitle: { color: "#FECACA", marginTop: 6, fontSize: 14 },
  ambCenterBox: { alignItems: "center", paddingVertical: 40 },
  ambLoadingText: { marginTop: 12, color: "#64748B", fontSize: 14 },
  ambEmptyText: { color: "#64748B", fontSize: 14 },
  ambErrorBox: {
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    padding: 16,
    marginTop: 8,
  },
  ambErrorText: { color: "#B91C1C", fontWeight: "600", textAlign: "center" },
  ambCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  ambCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  ambServiceName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  ambCompany: { fontSize: 13, color: "#64748B", fontWeight: "500" },
  ambStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  ambStatusText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  ambStatusAvailable: { backgroundColor: "#16A34A" },
  ambStatusUnavailable: { backgroundColor: "#DC2626" },
  ambStatusBusy: { backgroundColor: "#F59E0B" },
  ambDetailRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  ambDetailLabel: {
    fontSize: 13,
    color: "#64748B",
    marginLeft: 8,
    fontWeight: "500",
  },
  ambDetailValue: {
    fontSize: 13,
    color: "#0F172A",
    marginLeft: 6,
    fontWeight: "600",
    flex: 1,
  },
  ambCallButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#16A34A",
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  ambCallButtonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
