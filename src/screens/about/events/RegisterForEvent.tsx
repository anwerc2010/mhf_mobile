import React, { useRef } from "react";
import { View, Alert, ActivityIndicator } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import PTDynamicForm, {
  PTDynamicFormRef,
  FormSection,
} from "../../../components/general/DynamicForm/DynamicForm";
import { PTText } from "../../../components/comman";
import { useCreateEventRegistrationMutation } from "@psi/shared-api";

function RegisterForEvent() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const formRef = useRef<PTDynamicFormRef>(null);
  const route = useRoute<any>();
  const eventParam = route.params?.event;

  const [createEventRegistration, { isLoading: isSubmitting }] =
    useCreateEventRegistrationMutation();
  const handleSubmit = async (values: any) => {
    const participationType = values?.personal?.participation_type ?? "";
    const declarationAccepted =
      values?.declaration?.declaration === "accepted" ||
      values?.declaration?.declaration === true;

    try {
      let payload: any = {
        event_id: eventParam?.id,
        full_name: values?.personal?.full_name ?? "",
        date_of_birth: values?.personal?.date_of_birth
          ? values?.personal?.date_of_birth.split("T")[0]
          : "",
        gender: values?.personal?.gender ?? "",
        phone_number: values?.personal?.phone_number ?? "",
        age: String(values?.personal?.age ?? ""),
        email: values?.personal?.email ?? "",
        address: values?.personal?.address ?? "",
        participation_type: participationType,
        declaration: declarationAccepted,
      };
      console.log("Payload to be sent:", JSON.stringify(payload, null, 2));
      const response = await createEventRegistration(payload).unwrap();
      console.log("Response from API:", response);
      Alert.alert(
        t("events.register.successTitle"),
        t("events.register.successMessage"),
      );
      navigation.goBack();
    } catch (err: any) {
      const message = err?.data?.message ?? t("events.register.errorMessage");
      Alert.alert(t("events.register.errorTitle"), message, [{ text: "OK" }]);
    }
    console.log("Form Submitted with values:", values);
  };

  const sections: FormSection[] = [
    /* =======================
           1. Personal Information
        ======================== */
    {
      title: t("events.register.personalInfo"),
      id: "personalInformation",
      type: "object",
      fields: [
        {
          id: "full_name",
          label: t("events.register.fullName"),
          type: "text",
          placeholder: t("events.register.fullNamePlaceholder"),
          validations: [{ name: "required", value: true }],
          path: "personal.full_name",
        },
        {
          id: "phone_number",
          label: t("events.register.phoneNumber"),
          type: "tel",
          placeholder: t("events.register.phoneNumberPlaceholder"),
          validations: [
            { name: "required", value: true },
            {
              name: "pattern",
              value: /^[0-9]{10}$/,
              message: t("events.register.phoneInvalid"),
            },
          ],
          path: "personal.phone_number",
        },
        {
          id: "email",
          label: t("events.register.emailAddress"),
          type: "email",
          placeholder: t("events.register.emailPlaceholder"),
          validations: [
            { name: "required", value: true },
            {
              name: "pattern",
              value: /^[^@]+@[^@]+\.[^@]+$/,
              message: t("events.register.emailInvalid"),
            },
          ],
          path: "personal.email",
        },
        {
          id: "date_of_birth",
          label: t("events.register.dateOfBirth"),
          type: "date",
          validations: [{ name: "required", value: true }],
          path: "personal.date_of_birth",
        },
        {
          id: "age",
          label: t("events.register.age"),
          type: "number",
          validations: [{ name: "required", value: true }],
          path: "personal.age",
        },
        {
          id: "gender",
          label: t("events.register.gender"),
          type: "radio",
          values: [
            { id: "male", name: t("events.register.genderMale") },
            { id: "female", name: t("events.register.genderFemale") },
            { id: "other", name: t("events.register.genderOther") },
          ],
          validations: [{ name: "required", value: true }],
          path: "personal.gender",
        },
        {
          id: "address",
          label: t("events.register.address"),
          type: "textarea",
          placeholder: t("events.register.addressPlaceholder"),
          validations: [{ name: "required", value: true }],
          path: "personal.address",
        },
        {
          id: "participation_type",
          label: t("events.register.participationType"),
          type: "radio",
          values: [
            { id: "participant", name: t("events.register.participant") },
            { id: "volunteer", name: t("events.register.volunteer") },
          ],
          validations: [{ name: "required", value: true }],
          path: "personal.participation_type",
        },
      ],
    },
    /* =======================
           3. Declaration
        ======================== */
    {
      title: t("events.register.declaration"),
      id: "declaration",
      type: "object",
      fields: [
        {
          id: "declarationAccepted",
          label: t("events.register.declarationText"),
          type: "radio",
          values: [{ id: "accepted", name: t("events.register.iAgree") }],
          validations: [{ name: "required", value: true }],
          path: "declaration.declaration",
        },
      ],
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <PTText
        style={{
          fontSize: 16,
          padding: 8,
          fontWeight: "400",
          marginBottom: 12,
        }}
      >
        {t("events.register.subtitle")}
      </PTText>
      <PTDynamicForm
        ref={formRef}
        sections={sections}
        initialValues={{}}
        mode="onBlur"
        submitButtonText={
          isSubmitting
            ? t("events.register.submitting")
            : t("events.register.saveDetails")
        }
        onSubmit={handleSubmit}
        onValueChange={(fieldId, value) => {
          console.log(`${fieldId} changed to`, value);
        }}
      />
    </View>
  );
}

export default RegisterForEvent;
