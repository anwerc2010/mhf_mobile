import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface AmountEntryModalProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  actionLabel: string;
  onClose: () => void;
  onSubmit: (amount: number) => void;
}

function AmountEntryModal({
  visible,
  title,
  subtitle,
  actionLabel,
  onClose,
  onSubmit,
}: AmountEntryModalProps) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (visible) {
      setAmount("");
      setError("");
    }
  }, [visible]);

  const handleContinue = () => {
    const parsedAmount = Number(amount);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Enter a valid amount greater than 0.");
      return;
    }

    setError("");
    onSubmit(parsedAmount);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

          <Text style={styles.label}>Amount</Text>
          <TextInput
            value={amount}
            onChangeText={(value) => {
              setAmount(value.replace(/[^0-9.]/g, ""));
              if (error) {
                setError("");
              }
            }}
            keyboardType="decimal-pad"
            placeholder="Enter amount"
            placeholderTextColor="#94A3B8"
            style={styles.input}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleContinue}
            >
              <Text style={styles.confirmButtonText}>{actionLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6,
  },
  subtitle: {
    color: "#475569",
    fontSize: 14,
    marginBottom: 16,
  },
  label: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#0F172A",
  },
  error: {
    color: "#DC2626",
    fontSize: 13,
    marginTop: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#E2E8F0",
  },
  cancelButtonText: {
    color: "#334155",
    fontWeight: "700",
  },
  confirmButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#0EA5A4",
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
});

export default AmountEntryModal;
