import React, { useRef, useState } from "react";
import {
  View,
  Alert,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../store/hook";
import {
  setUser,
  useUpdateCustomerMutation,
  useUploadCustomerImageMutation,
} from "@psi/shared-api";
import PTContainer from "../components/comman/PTContainer";
import PTDynamicForm, {
  FormSection,
  PTDynamicFormRef,
} from "../components/general/DynamicForm/DynamicForm";
import PTText from "../components/comman/PTText";
import { spacing } from "../constants/spacing";
import { useTranslation } from "react-i18next";
import { FileData } from "../components/comman/PTFilePicker";

export default function EditProfileScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const formRef = useRef<PTDynamicFormRef>(null);
  const [updateCustomer, { isLoading }] = useUpdateCustomerMutation();
  const [uploadCustomerImage, { isLoading: isUploading }] =
    useUploadCustomerImageMutation();

  // Track the locally-selected file for live preview
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  // The preview shows: newly selected file → existing saved URL → nothing
  const previewUri = selectedImageUri ?? user?.image ?? null;

  const sections: FormSection[] = [
    {
      title: "Personal Details",
      id: "profile",
      type: "object",
      fields: [
        {
          id: "fullname",
          label: "Full Name",
          type: "text",
          placeholder: "Enter full name",
          validations: [
            { name: "required", value: true, message: "Full name is required" },
          ],
          path: "profile.fullname",
        },
        {
          id: "email",
          label: "Email",
          type: "email",
          placeholder: "Enter email",
          validations: [
            { name: "required", value: true, message: "Email is required" },
          ],
          path: "profile.email",
        },
        {
          id: "phone",
          label: "Phone",
          type: "phone",
          placeholder: "Enter phone number",
          validations: [
            { name: "required", value: true, message: "Phone is required" },
          ],
          path: "profile.phone",
        },
        {
          id: "aadhaar_number",
          label: "Aadhaar Number",
          type: "text",
          placeholder: "1111 2222 3333",
          validations: [
            {
              name: "pattern",
              value: /^[0-9]{4} [0-9]{4} [0-9]{4}$/,
              message: "Enter a valid 12-digit Aadhaar number",
            },
          ],
          path: "profile.aadhaar_number",
        },
        {
          id: "date_of_birth",
          label: "Date of Birth",
          type: "date",
          validations: [{ name: "required", value: true }],
          path: "profile.date_of_birth",
        },
        {
          id: "joining_date",
          label: "Joining Date",
          type: "date",
          validations: [{ name: "required", value: true }],
          path: "profile.joining_date",
        },
        {
          id: "blood_group",
          label: "Blood Group",
          type: "select",
          options: [
            { id: "A+", name: "A+" },
            { id: "A-", name: "A-" },
            { id: "B+", name: "B+" },
            { id: "B-", name: "B-" },
            { id: "O+", name: "O+" },
            { id: "O-", name: "O-" },
            { id: "AB+", name: "AB+" },
            { id: "AB-", name: "AB-" },
          ],
          validations: [{ name: "required", value: true }],
          path: "profile.blood_group",
        },
        {
          id: "allergies",
          label: "Allergies",
          type: "text",
          placeholder: "Enter any allergies (optional)",
          validations: [],
          path: "profile.allergies",
        },
        {
          id: "chronic_conditions",
          label: "Chronic Conditions",
          type: "text",
          placeholder: "Enter any chronic conditions (optional)",
          validations: [],
          path: "profile.chronic_conditions",
        },
        {
          id: "emergency_contact_number",
          label: "Emergency Contact Number",
          type: "phone",
          placeholder: "Enter emergency contact number (optional)",
          validations: [],
          path: "profile.emergency_contact_number",
        },
        {
          id: "image",
          label: t("profile.profileImage"),
          type: "file",
          maxFiles: 1,
          acceptedTypes: ["image/png", "image/jpg", "image/jpeg"],
          validations: [],
          path: "profile.image",
        },
      ],
    },
  ];

  const initialValues = {
    profile: {
      fullname: user?.fullname || "",
      email: user?.email || "",
      phone: user?.phone || "",
      aadhaar_number: user?.aadhaar_number
        ? user.aadhaar_number.replace(/(\d{4})(\d{4})(\d{4})/, "$1 $2 $3")
        : "",
      date_of_birth: user?.date_of_birth || "",
      joining_date: user?.joining_date || "",
      blood_group: user?.blood_group || "",
      allergies: user?.allergies || "",
      chronic_conditions: user?.chronic_conditions || "",
      emergency_contact_number: user?.emergency_contact_number || "",
      image: null,
    },
  };

  const uploadImageIfPresent = async (
    imageFile: FileData | FileData[] | null | undefined,
  ): Promise<string | undefined> => {
    const file = Array.isArray(imageFile) ? imageFile[0] : imageFile;
    if (!file?.uri) return undefined;
    const formData = new FormData();
    formData.append("image", {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as any);
    const response = await uploadCustomerImage(formData).unwrap();
    return response?.image_url || undefined;
  };

  const handleSubmit = async (values: Record<string, any>) => {
    const raw = values.profile;

    // Upload new image if a file was selected; keep existing URL otherwise
    let imageUrl: string | undefined = user?.image ?? undefined;
    if (raw.image) {
      try {
        const uploaded = await uploadImageIfPresent(raw.image);
        if (uploaded) imageUrl = uploaded;
      } catch {
        Alert.alert(t("common.error"), t("profile.imageUploadFailed"));
        return;
      }
    }

    const payload = {
      ...raw,
      image: imageUrl,
      aadhaar_number: raw.aadhaar_number
        ? raw.aadhaar_number.replace(/\s/g, "")
        : undefined,
      date_of_birth: raw.date_of_birth?.split("T")[0],
      joining_date: raw.joining_date?.split("T")[0],
      terms_accepted: true,
      card_number: user?.card_number || "",
      status: user?.status || "active",
      password: "",
    };

    try {
      const result = await updateCustomer({
        id: user!.id,
        data: payload,
      }).unwrap();
      if (result.error) {
        Alert.alert(
          t("profile.updateFailed", "Update Failed"),
          result.message ||
            t("profile.somethingWentWrong", "Something went wrong"),
        );
        return;
      }
      dispatch(setUser(result.data));
      Alert.alert(
        t("common.success"),
        result.message ||
          t("profile.updatedSuccessfully", "Profile updated successfully"),
        [{ text: "OK", onPress: () => navigation.goBack() }],
      );
    } catch (err: any) {
      const msg = err?.data?.message;
      const errorText =
        msg && typeof msg === "object"
          ? Object.values(msg).flat().join("\n")
          : typeof msg === "string"
          ? msg
          : "Update failed";
      Alert.alert(t("profile.updateFailed", "Update Failed"), errorText);
    }
  };

  return (
    <PTContainer safeArea>
      <View style={styles.header}>
        <PTText variant="h1" style={styles.title}>
          {t("profile.editProfile")}
        </PTText>
      </View>

      <PTDynamicForm
        ref={formRef}
        sections={sections}
        initialValues={initialValues}
        mode="onBlur"
        submitButtonText={
          isUploading ? t("profile.uploadingImage") : t("common.save")
        }
        submitLoading={isLoading || isUploading}
        onSubmit={handleSubmit}
        onValueChange={(fieldId, value, _allValues, fieldPath) => {
          // Live preview: update local state when a new image file is picked
          if (fieldId === "image") {
            const file = Array.isArray(value) ? value[0] : value;
            setSelectedImageUri(file?.uri ?? null);
          }

          if (
            fieldId === "aadhaar_number" &&
            typeof value === "string" &&
            fieldPath
          ) {
            const digits = value.replace(/\D/g, "");
            if (digits.length <= 12) {
              let formatted = "";
              for (let i = 0; i < digits.length; i++) {
                if (i > 0 && i % 4 === 0) formatted += " ";
                formatted += digits[i];
              }
              if (formatted !== value) {
                formRef.current?.setValue(fieldPath, formatted);
              }
            }
          }
        }}
        scrollable={true}
      />
    </PTContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    textAlign: "center",
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F7",
    marginBottom: 4,
  },
  avatarPreview: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#E5E7EB",
  },
  avatarPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },
  avatarHint: {
    marginTop: 6,
    fontSize: 12,
    color: "#6B7280",
  },
});
