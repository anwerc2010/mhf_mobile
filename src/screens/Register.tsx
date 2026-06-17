import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  I18nManager,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../store/hook";
import {
  useRegisterMutation,
  useUploadCustomerImageMutation,
} from "@psi/shared-api";
import { RegisterRequest } from "@psi/shared-api";
import { FileData } from "../components/comman/PTFilePicker";
import { logger } from "../utils/logger";
import { spacing } from "../constants/spacing";
import PTContainer from "../components/comman/PTContainer";
import PTText from "../components/comman/PTText";
import LanguageSwitcher from "../components/general/LanguageSwitcher";
import ThemeSwitcher from "../components/general/ThemeSwitcher";
import PTDynamicForm, {
  FormField,
  FormSection,
  PTDynamicFormRef,
} from "../components/general/DynamicForm/DynamicForm";
import PTToast, { ToastType } from "../components/comman/PTToast";
import PTButton from "../components/comman/PTButton";
import TermsAccordion from "../components/general/TermsAccordion";

interface RegisterScreenProps {
  navigation: any;
}

function RegisterScreen({ navigation }: RegisterScreenProps) {
  const { t } = useTranslation();
  const formRef = useRef<PTDynamicFormRef>(null);
  const currentLanguage = useAppSelector(
    (state) => state.language.currentLanguage,
  );
  const [registerMutation, { isLoading, error }] = useRegisterMutation();
  const [uploadCustomerImage, { isLoading: isUploading }] =
    useUploadCustomerImageMutation();
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [toastState, setToastState] = useState({
    visible: false,
    message: "",
    type: "info" as ToastType,
    position: "top" as "top" | "bottom",
  });
  const [pendingNavigate, setPendingNavigate] = useState(false);
  const sections: FormSection[] = [
    {
      title: "Personal Details",
      id: "personalDetails",
      type: "object",
      fields: [
        {
          id: "fullname",
          label: "Full Name",
          type: "text",
          placeholder: "Enter full name",
          validations: [
            {
              name: "required",
              value: true,
              message: t("register.validation.fullnameRequired"),
            },
          ],
          path: "personalDetails.fullname",
        },
        {
          id: "date_of_birth",
          label: "Date of Birth",
          type: "date",
          validations: [{ name: "required", value: true }],
          path: "personalDetails.date_of_birth",
        },
        {
          id: "joining_date",
          label: "Joining Date",
          type: "date",
          validations: [{ name: "required", value: true }],
          path: "personalDetails.joining_date",
        },
        {
          id: "phone",
          label: "Phone",
          type: "phone",
          placeholder: "Enter phone number",
          validations: [
            {
              name: "required",
              value: true,
              message: t("register.validation.phoneRequired"),
            },
          ],
          path: "personalDetails.phone",
        },
        {
          id: "email",
          label: t("common.email"),
          type: "email",
          placeholder: t("register.emailPlaceholder"),
          validations: [
            {
              name: "required",
              value: true,
              message: t("register.validation.emailRequired"),
            },
            {
              name: "pattern",
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: t("register.validation.emailInvalid"),
            },
          ],
          path: "personalDetails.email",
        },
        {
          id: "password",
          label: t("common.password"),
          type: "password",
          placeholder: t("register.passwordPlaceholder"),
          validations: [
            {
              name: "required",
              value: true,
              message: t("register.validation.passwordRequired"),
            },
            {
              name: "minLength",
              value: 8,
              message: t("register.validation.passwordMin"),
            },
          ],
          path: "personalDetails.password",
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
          path: "personalDetails.aadhaar_number",
        },
        {
          id: "image",
          label: t("register.profileImageLabel"),
          type: "file",
          maxFiles: 1,
          acceptedTypes: ["image/png", "image/jpg", "image/jpeg"],
          validations: [],
          path: "personalDetails.image",
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
          path: "personalDetails.blood_group",
        },
        {
          id: "allergies",
          label: "Allergies",
          type: "text",
          placeholder: "Enter any allergies (optional)",
          validations: [],
          path: "personalDetails.allergies",
        },
        {
          id: "chronic_conditions",
          label: "Chronic Conditions",
          type: "text",
          placeholder: "Enter any chronic conditions (optional)",
          validations: [],
          path: "personalDetails.chronic_conditions",
        },
        {
          id: "emergency_contact_number",
          label: "Emergency Contact Number",
          type: "phone",
          placeholder: "Enter emergency contact number (optional)",
          validations: [],
          path: "personalDetails.emergency_contact_number",
        },
      ],
    },
  ];

  // Update RTL layout when language changes
  useEffect(() => {
    const isRTL = currentLanguage === "ar" || currentLanguage === "ur";
    I18nManager.forceRTL(isRTL);
    I18nManager.allowRTL(isRTL);
  }, [currentLanguage]);

  useEffect(() => {
    if (error) {
      let msg = t("login.errorOccurred");
      if ("data" in error) {
        const raw = (error.data as any)?.message;
        if (typeof raw === "string") {
          msg = raw;
        } else if (raw && typeof raw === "object") {
          const keys = Object.keys(raw);
          if (keys.length > 0) {
            const val = raw[keys[0]];
            msg = `${keys[0]}: ${Array.isArray(val) ? val[0] : val}`;
          }
        }
      }
      Alert.alert(t("register.registrationFailed"), String(msg));
    }
  }, [error, t]);

  const showToast = (
    type: ToastType,
    message: string,
    position: "top" | "bottom" = "top",
  ) => {
    setToastState({ visible: true, message, type, position });
  };

  const handleToastClose = () => {
    setToastState((prev) => ({ ...prev, visible: false }));
    if (pendingNavigate) {
      setPendingNavigate(false);
      navigation.navigate("Login");
    }
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

  const handleRegister = async (values: Record<string, any>) => {
    if (!termsAgreed) {
      Alert.alert(
        "Terms Required",
        "Please agree to the Terms & Conditions and Privacy Policy to register.",
      );
      return;
    }
    let payload = { ...values.personalDetails } as any;
    payload.date_of_birth = payload.date_of_birth?.split("T")[0];
    payload.joining_date = payload.joining_date?.split("T")[0];
    payload.card_number = payload.card_number || "";
    payload.status = "active";
    payload.termsAccepted = true;
    // Backend stores raw 12 digits (max:12), strip display spaces
    if (payload.aadhaar_number) {
      payload.aadhaar_number = payload.aadhaar_number.replace(/\s/g, "");
    }

    // Upload profile image if provided
    if (payload.image) {
      try {
        const imageUrl = await uploadImageIfPresent(payload.image);
        payload.image = imageUrl;
      } catch {
        Alert.alert(
          t("common.error"),
          t("profile.imageUploadFailed"),
        );
        return;
      }
    } else {
      delete payload.image;
    }

    console.log("Register form values:", JSON.stringify(payload, null, 2));

    try {
      const result = await registerMutation(payload).unwrap();
      if (result?.error) {
        let errorMessage = t("register.toast.error");

        // Extract field-specific errors from API response
        if (result?.message && typeof result.message === "object") {
          const fieldErrors = result.message;
          const errorFields = Object.keys(fieldErrors);

          if (errorFields.length > 0) {
            const fieldName = errorFields[0];
            const fieldError = fieldErrors[fieldName];
            errorMessage = Array.isArray(fieldError) ? fieldError[0] : fieldError;

            if (fieldName === "phone") {
              formRef.current?.setError("personalDetails.phone", {
                type: "manual",
                message: errorMessage,
              });
              showToast("error", errorMessage);
              setPendingNavigate(false);
              return;
            }
          }
        }
        Alert.alert(t("register.registrationFailed"), errorMessage, [
          { text: "OK" },
        ]);
        setPendingNavigate(false);
        return;
      }

      const successMsg =
        typeof result?.message === "string"
          ? result.message
          : t("register.toast.success");
      Alert.alert(t("register.registrationSuccess"), successMsg, [
        {
          text: "OK",
          onPress: () => {
            navigation.navigate("Login");
          },
        },
      ]);
    } catch (err: any) {
      let errorMessage = t("register.toast.error");

      // Extract field-specific errors from API response
      const errorsObj = err?.data?.errors;
      const messageObj = err?.data?.message || err?.message;

      if (errorsObj && typeof errorsObj === "object") {
        if (errorsObj.phone) {
          const phoneMsg = Array.isArray(errorsObj.phone)
            ? errorsObj.phone[0]
            : errorsObj.phone;
          formRef.current?.setError("personalDetails.phone", {
            type: "manual",
            message: phoneMsg,
          });
          showToast("error", phoneMsg);
          setPendingNavigate(false);
          return;
        }
        const firstField = Object.keys(errorsObj)[0];
        if (firstField) {
          const fieldError = errorsObj[firstField];
          errorMessage = Array.isArray(fieldError) ? fieldError[0] : fieldError;
        }
      } else if (messageObj && typeof messageObj === "object") {
        const fieldErrors = messageObj;
        const errorFields = Object.keys(fieldErrors);

        if (errorFields.length > 0) {
          const fieldName = errorFields[0];
          const fieldError = fieldErrors[fieldName];
          errorMessage = `${fieldName}: ${
            Array.isArray(fieldError) ? fieldError[0] : fieldError
          }`;
        }
      } else if (typeof messageObj === "string") {
        errorMessage = messageObj;
      }

      Alert.alert(t("register.registrationFailed"), String(errorMessage), [
        { text: "OK" },
      ]);
      setPendingNavigate(false);
      logger.error("Registration error:", JSON.stringify(err, null, 2));
    }
  };

  return (
    <>
      <PTContainer safeArea>
        <View style={styles.header}>
          {/* <View style={{ flexDirection: 'row', marginBottom: 16 }}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <LanguageSwitcher />
            </View>
            <View style={{ flex: 1 }}>
              <ThemeSwitcher />
            </View>
          </View> */}

          <PTText variant="h1" style={styles.title}>
            {t("register.title")}
          </PTText>
          <PTText variant="body" style={styles.subtitle}>
            {t("register.subtitle")}
          </PTText>
        </View>

        <PTDynamicForm
          ref={formRef}
          sections={sections}
          initialValues={{}}
          mode="onBlur"
          submitLoading={isLoading}
          onSubmit={handleRegister}
          scrollable={true}
          onValueChange={(fieldId, value, _allValues, fieldPath) => {
            console.log(`${fieldId} changed to`, value);

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
          customSubmitButton={
            <View style={styles.customSubmitArea}>
              <TermsAccordion value={termsAgreed} onChange={setTermsAgreed} />
              <PTButton
                title={
                  isUploading
                    ? t("profile.uploadingImage")
                    : t("common.signUp")
                }
                onPress={() => formRef.current?.submit()}
                loading={isLoading || isUploading}
                disabled={!termsAgreed || isLoading || isUploading}
              />
              <View style={styles.footer}>
                <PTText variant="body" style={styles.footerText}>
                  {t("register.hasAccount")}{" "}
                </PTText>
                <Text
                  style={styles.link}
                  onPress={() => navigation.navigate("Login")}
                >
                  {t("common.signIn")}
                </Text>
              </View>
            </View>
          }
        />
      </PTContainer>
      <PTToast
        visible={toastState.visible}
        message={toastState.message}
        type={toastState.type}
        position={toastState.position}
        onClose={handleToastClose}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.md,
  },
  title: {
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    marginBottom: 16,
    textAlign: "center",
    color: "#666",
  },
  termsContainer: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.sm,
  },
  customSubmitArea: {
    marginTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  footerText: {
    color: "#666",
  },
  link: {
    color: "#007AFF",
    fontWeight: "600",
  },
});

export default RegisterScreen;
