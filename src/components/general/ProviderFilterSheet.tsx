import React, { useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Animated,
  Modal,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { X, ArrowCounterClockwise } from "phosphor-react-native";
import { useLocationDropdowns, LocationOption } from "@psi/shared-api";

export interface ProviderFilter {
  stateId: number | null;
  stateName: string;
  districtId: number | null;
  districtName: string;
  blockId: number | null;
  blockName: string;
  mandalId: number | null;
  mandalName: string;
}

export const EMPTY_FILTER: ProviderFilter = {
  stateId: null,
  stateName: "",
  districtId: null,
  districtName: "",
  blockId: null,
  blockName: "",
  mandalId: null,
  mandalName: "",
};

interface Props {
  visible: boolean;
  onClose: () => void;
  value: ProviderFilter;
  onChange: (f: ProviderFilter) => void;
}

export default function ProviderFilterSheet({
  visible,
  onClose,
  value,
  onChange,
}: Props) {
  const { height } = useWindowDimensions();
  const SHEET_HEIGHT = height * 0.62;
  const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;

  const { states, districts, blocks, mandals, statesLoading, districtsLoading, blocksLoading, mandalsLoading } =
    useLocationDropdowns(value.stateId, value.districtId, value.blockId);

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 4,
        speed: 14,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SHEET_HEIGHT,
        duration: 240,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, SHEET_HEIGHT]);

  const selectState = useCallback(
    (s: LocationOption) => {
      if (value.stateId === s.id) {
        onChange({ ...EMPTY_FILTER });
      } else {
        onChange({
          ...EMPTY_FILTER,
          stateId: s.id,
          stateName: s.name,
        });
      }
    },
    [value.stateId, onChange],
  );

  const selectDistrict = useCallback(
    (d: LocationOption) => {
      if (value.districtId === d.id) {
        onChange({ ...value, districtId: null, districtName: "", blockId: null, blockName: "", mandalId: null, mandalName: "" });
      } else {
        onChange({ ...value, districtId: d.id, districtName: d.name, blockId: null, blockName: "", mandalId: null, mandalName: "" });
      }
    },
    [value, onChange],
  );

  const selectBlock = useCallback(
    (b: LocationOption) => {
      if (value.blockId === b.id) {
        onChange({ ...value, blockId: null, blockName: "", mandalId: null, mandalName: "" });
      } else {
        onChange({ ...value, blockId: b.id, blockName: b.name, mandalId: null, mandalName: "" });
      }
    },
    [value, onChange],
  );

  const selectMandal = useCallback(
    (m: LocationOption) => {
      if (value.mandalId === m.id) {
        onChange({ ...value, mandalId: null, mandalName: "" });
      } else {
        onChange({ ...value, mandalId: m.id, mandalName: m.name });
      }
    },
    [value, onChange],
  );

  const activeCount =
    (value.stateId ? 1 : 0) +
    (value.districtId ? 1 : 0) +
    (value.blockId ? 1 : 0) +
    (value.mandalId ? 1 : 0);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[styles.sheet, { height: SHEET_HEIGHT, transform: [{ translateY: slideAnim }] }]}
      >
        {/* Handle */}
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filter Providers</Text>
          <View style={styles.headerActions}>
            {activeCount > 0 && (
              <TouchableOpacity style={styles.clearBtn} onPress={() => onChange(EMPTY_FILTER)}>
                <ArrowCounterClockwise size={14} color="#DC2626" />
                <Text style={styles.clearBtnText}>Clear all</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          {/* State */}
          <FilterSection
            label="State"
            loading={statesLoading}
            items={states}
            selectedId={value.stateId}
            onSelect={selectState}
          />

          {/* District — only once state is picked */}
          {value.stateId !== null && (
            <FilterSection
              label="District"
              loading={districtsLoading}
              items={districts}
              selectedId={value.districtId}
              onSelect={selectDistrict}
            />
          )}

          {/* Block — only once district is picked */}
          {value.districtId !== null && (
            <FilterSection
              label="Block"
              loading={blocksLoading}
              items={blocks}
              selectedId={value.blockId}
              onSelect={selectBlock}
            />
          )}

          {/* Mandal — only once block is picked */}
          {value.blockId !== null && (
            <FilterSection
              label="Mandal"
              loading={mandalsLoading}
              items={mandals}
              selectedId={value.mandalId}
              onSelect={selectMandal}
            />
          )}

          <View style={{ height: 24 }} />
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

// ─── Reusable chip row ────────────────────────────────────────────────────────
function FilterSection({
  label,
  loading,
  items,
  selectedId,
  onSelect,
}: {
  label: string;
  loading: boolean;
  items: LocationOption[];
  selectedId: number | null;
  onSelect: (item: LocationOption) => void;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label}</Text>
      {loading ? (
        <ActivityIndicator size="small" color="#0369A1" style={{ marginVertical: 8 }} />
      ) : items.length === 0 ? (
        <Text style={styles.emptyText}>No options available</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          {items.map((item) => {
            const active = item.id === selectedId;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => onSelect(item)}
                activeOpacity={0.75}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 16,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#0F172A" },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  clearBtnText: { fontSize: 12, color: "#DC2626", fontWeight: "700" },
  closeBtn: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  body: { flex: 1, paddingHorizontal: 16 },
  section: { marginTop: 16 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  chipsRow: { flexDirection: "row", gap: 8, paddingBottom: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  chipActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#0369A1",
  },
  chipText: { fontSize: 13, color: "#374151", fontWeight: "500" },
  chipTextActive: { color: "#0369A1", fontWeight: "700" },
  emptyText: { fontSize: 13, color: "#9CA3AF", paddingVertical: 4 },
});
