import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import PTDynamicForm, {
  PTDynamicFormRef,
  FormSection,
} from "../../components/general/DynamicForm/DynamicForm";
import {
  useCreateEquipmentRequestMutation,
  useLocationDropdowns,
} from "@psi/shared-api";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../store/hook";
import { GuideWrapper } from "../../components/general/GuideWrapper";
import { findGuideStep } from "../../config/guideConfig";
import { useGuideController } from "../../hooks/useGuideController";

export default function EquipmentRequest() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const user = useAppSelector((state) => state.auth.user);
  const formRef = useRef<PTDynamicFormRef>(null);
  const [createEquipmentRequest, { isLoading }] =
    useCreateEquipmentRequestMutation();

  // Initialize walkthrough guide for EquipmentScreen
  useGuideController("EquipmentScreen");

  // Location dropdown state
  const [stateId, setStateId] = useState<number | null>(null);
  const [districtId, setDistrictId] = useState<number | null>(null);
  const [blockId, setBlockId] = useState<number | null>(null);
  const [mandalId, setMandalId] = useState<number | null>(null);

  const {
    states,
    districts,
    blocks,
    mandals,
    statesLoading,
    districtsLoading,
    blocksLoading,
    mandalsLoading,
  } = useLocationDropdowns(stateId, districtId, blockId);

  const handleStateChange = (val: number) => {
    setStateId(val);
    setDistrictId(null);
    setBlockId(null);
    setMandalId(null);
    formRef.current?.setValue("address.state_id", val);
    formRef.current?.setValue("address.district_id", undefined);
    formRef.current?.setValue("address.block_id", undefined);
    formRef.current?.setValue("address.mandal_id", undefined);
  };

  const handleDistrictChange = (val: number) => {
    setDistrictId(val);
    setBlockId(null);
    setMandalId(null);
    formRef.current?.setValue("address.district_id", val);
    formRef.current?.setValue("address.block_id", undefined);
    formRef.current?.setValue("address.mandal_id", undefined);
  };

  const handleBlockChange = (val: number) => {
    setBlockId(val);
    setMandalId(null);
    formRef.current?.setValue("address.block_id", val);
    formRef.current?.setValue("address.mandal_id", undefined);
  };

  const handleMandalChange = (val: number) => {
    setMandalId(val);
    formRef.current?.setValue("address.mandal_id", val);
  };

  const sections: FormSection[] = [
    {
      title: t("forms.equipment.sections.personalInformation"),
      id: "personalInfo",
      type: "object",
      fields: [
        {
          id: "fullName",
          label: t("forms.equipment.fields.fullName"),
          type: "text",
          placeholder: t("forms.equipment.placeholders.fullName"),
          validations: [{ name: "required", value: true }],
          path: "personal.fullName",
        },
        {
          id: "age",
          label: t("forms.equipment.fields.age"),
          type: "number",
          placeholder: t("forms.equipment.placeholders.age"),
          validations: [{ name: "required", value: true }],
          path: "personal.age",
        },
        {
          id: "gender",
          label: t("forms.equipment.fields.gender"),
          type: "radio",
          values: [
            { id: "male", name: t("forms.common.options.male") },
            { id: "female", name: t("forms.common.options.female") },
            { id: "other", name: t("forms.common.options.other") },
          ],
          validations: [{ name: "required", value: true }],
          path: "personal.gender",
        },
        {
          id: "mobile",
          label: t("forms.equipment.fields.mobileNumber"),
          type: "tel",
          placeholder: t("forms.equipment.placeholders.mobileNumber"),
          validations: [
            { name: "required", value: true },
            {
              name: "pattern",
              value: /^[0-9]{10}$/,
              message: t("forms.common.validation.phone10"),
            },
          ],
          path: "personal.mobile",
        },
        {
          id: "email",
          label: t("forms.equipment.fields.email"),
          type: "email",
          placeholder: t("forms.equipment.placeholders.email"),
          validations: [
            { name: "required", value: true },
            {
              name: "pattern",
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: t("forms.common.validation.invalidEmailAddress"),
            },
          ],
          path: "personal.email",
        },
      ],
    },
    {
      title: t("forms.equipment.sections.addressDetails"),
      id: "addressDetails",
      type: "object",
      fields: [
        {
          id: "state_id",
          label: t("forms.common.fields.state"),
          type: "select",
          options: states.map((s: { id: number; name: string }) => ({
            label: s.name,
            value: s.id,
          })),
          placeholder: statesLoading
            ? t("forms.common.loading.states")
            : t("forms.common.select.state"),
          validations: [{ name: "required", value: true }],
          path: "address.state_id",
          disabled: statesLoading,
          onChange: (value: number) => handleStateChange(value),
        },
        {
          id: "district_id",
          label: t("forms.common.fields.district"),
          type: "select",
          options: districts.map((d: { id: number; name: string }) => ({
            label: d.name,
            value: d.id,
          })),
          placeholder: !stateId
            ? t("forms.common.select.stateFirst")
            : districtsLoading
            ? t("forms.common.loading.districts")
            : t("forms.common.select.district"),
          validations: [{ name: "required", value: true }],
          path: "address.district_id",
          disabled: !stateId || districtsLoading,
          onChange: (value: number) => handleDistrictChange(value),
        },
        {
          id: "block_id",
          label: t("forms.common.fields.block"),
          type: "select",
          options: blocks.map((b: { id: number; name: string }) => ({
            label: b.name,
            value: b.id,
          })),
          placeholder: !districtId
            ? t("forms.common.select.districtFirst")
            : blocksLoading
            ? t("forms.common.loading.blocks")
            : t("forms.common.select.block"),
          validations: [{ name: "required", value: true }],
          path: "address.block_id",
          disabled: !districtId || blocksLoading,
          onChange: (value: number) => handleBlockChange(value),
        },
        {
          id: "mandal_id",
          label: t("forms.common.fields.mandal"),
          type: "select",
          options: mandals.map((m: { id: number; name: string }) => ({
            label: m.name,
            value: m.id,
          })),
          placeholder: !blockId
            ? t("forms.common.select.blockFirst")
            : mandalsLoading
            ? t("forms.common.loading.mandals")
            : t("forms.common.select.mandal"),
          validations: [{ name: "required", value: true }],
          path: "address.mandal_id",
          disabled: !blockId || mandalsLoading,
          onChange: (value: number) => handleMandalChange(value),
        },
        {
          id: "address",
          label: t("forms.equipment.fields.address"),
          type: "textarea",
          placeholder: t("forms.equipment.placeholders.address"),
          validations: [{ name: "required", value: true }],
          path: "address.address",
        },
        {
          id: "pincode",
          label: t("forms.equipment.fields.pincode"),
          type: "text",
          placeholder: t("forms.equipment.placeholders.pincode"),
          validations: [
            { name: "required", value: true },
            {
              name: "pattern",
              value: /^[0-9]{6}$/,
              message: t("forms.common.validation.pincode6"),
            },
          ],
          path: "address.pincode",
        },
      ],
    },
    {
      title: t("forms.equipment.sections.equipmentDetails"),
      id: "equipmentDetails",
      type: "object",
      fields: [
        {
          id: "equipmentType",
          label: t("forms.equipment.fields.equipmentType"),
          type: "text",
          placeholder: t("forms.equipment.placeholders.equipmentType"),
          validations: [{ name: "required", value: true }],
          path: "equipment.equipmentType",
        },
        {
          id: "medicalReason",
          label: t("forms.equipment.fields.medicalReason"),
          type: "textarea",
          placeholder: t("forms.equipment.placeholders.medicalReason"),
          validations: [{ name: "required", value: true }],
          path: "equipment.medicalReason",
        },
        {
          id: "duration",
          label: t("forms.equipment.fields.durationRequired"),
          type: "text",
          placeholder: t("forms.equipment.placeholders.durationRequired"),
          validations: [{ name: "required", value: true }],
          path: "equipment.duration",
        },
      ],
    },
    {
      title: t("forms.equipment.sections.referenceDetails"),
      id: "referenceDetails",
      type: "object",
      fields: [
        {
          id: "referenceName",
          label: t("forms.equipment.fields.referenceName"),
          type: "text",
          placeholder: t("forms.equipment.placeholders.referenceName"),
          validations: [{ name: "required", value: true }],
          path: "reference.referenceName",
        },
        {
          id: "referenceContact",
          label: t("forms.equipment.fields.referenceContact"),
          type: "tel",
          placeholder: t("forms.equipment.placeholders.referenceContact"),
          validations: [
            { name: "required", value: true },
            {
              name: "pattern",
              value: /^[0-9]{10}$/,
              message: t("forms.common.validation.phone10"),
            },
          ],
          path: "reference.referenceContact",
        },
      ],
    },
    {
      title: t("forms.equipment.sections.consent"),
      id: "consent",
      type: "object",
      fields: [
        {
          id: "consent",
          label: t("forms.equipment.fields.consentDeclaration"),
          type: "switch",
          validations: [{ name: "required", value: true }],
          path: "consent.consent",
        },
      ],
    },
  ];

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      // Get location names for payload
      const stateName =
        states.find((s: { id: number; name: string }) => s.id === stateId)
          ?.name || "";
      const districtName =
        districts.find((d: { id: number; name: string }) => d.id === districtId)
          ?.name || "";
      const blockName =
        blocks.find((b: { id: number; name: string }) => b.id === blockId)
          ?.name || "";
      const mandalName =
        mandals.find((m: { id: number; name: string }) => m.id === mandalId)
          ?.name || "";

      // Create the request payload
      const payload = {
        full_name: data.personal?.fullName,
        age: data.personal?.age,
        gender: data.personal?.gender,
        mobile: data.personal?.mobile,
        email: data.personal?.email,
        address: data.address?.address,
        state_id: stateId ?? undefined,
        district_id: districtId ?? undefined,
        block_id: blockId ?? undefined,
        mandal_id: mandalId ?? undefined,
        state: stateName,
        district: districtName,
        city: blockName,
        mandal: mandalName,
        pincode: data.address?.pincode,
        equipment_type: data.equipment?.equipmentType,
        medical_reason: data.equipment?.medicalReason,
        duration: data.equipment?.duration,
        reference_name: data.reference?.referenceName,
        reference_contact: data.reference?.referenceContact,
        customer_id: Number.parseInt(String(user?.id ?? 0), 10),
        consent: data.consent?.consent || false,
        status: "pending",
      };

      console.log("Equipment Request Payload:", payload);

      const response = await createEquipmentRequest(payload).unwrap();

      Alert.alert(
        t("common.success"),
        `${t("forms.equipment.alerts.submitSuccess")} ${
          response.data?.request_id
        }`,
        [
          {
            text: t("forms.common.ok"),
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error: any) {
      console.error("Equipment Request Error:", error);
      Alert.alert(
        t("common.error"),
        error?.data?.message || t("forms.equipment.alerts.submitFailed"),
        [{ text: t("forms.common.ok") }],
      );
    }
  };

  return (
    <View style={styles.container}>
      <GuideWrapper
        step={findGuideStep("EquipmentScreen", "equipmentRequestForm")}
        borderRadius={8}
      >
        <Text style={styles.subtitle}>{t("forms.equipment.heading")}</Text>
      </GuideWrapper>
      {isLoading && (
        <ActivityIndicator
          size="large"
          color="#1E3A8A"
          style={{ marginVertical: 20 }}
        />
      )}
      <PTDynamicForm
        ref={formRef}
        sections={sections}
        initialValues={{}}
        mode="onBlur"
        submitButtonText={
          isLoading
            ? t("forms.common.submitting")
            : t("forms.equipment.submitRequest")
        }
        onSubmit={handleSubmit}
        onValueChange={(fieldId, value) => {
          console.log(`${fieldId} changed to`, value);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  subtitle: {
    fontSize: 16,
    padding: 8,
    fontWeight: "400",
    marginBottom: 12,
    color: "#6B7280",
  },
});
