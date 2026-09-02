import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import PTDynamicForm, {
  PTDynamicFormRef,
  FormSection,
} from "../../components/general/DynamicForm/DynamicForm";
import { useNavigation } from "@react-navigation/native";
import {
  useCreateBloodRequestMutation,
  useLocationDropdowns,
} from "@psi/shared-api";
import { useTranslation } from "react-i18next";
import { GuideWrapper } from "../../components/general/GuideWrapper";
import { findGuideStep } from "../../config/guideConfig";
import { useGuideController } from "../../hooks/useGuideController";

export default function BloodRequest() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const formRef = useRef<PTDynamicFormRef>(null);
  const [createBloodRequest, { isLoading }] = useCreateBloodRequestMutation();

  // Initialize walkthrough guide for BloodRequestScreen
  useGuideController("BloodRequestScreen");

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

  const formatRequiredDatetime = (value: any) => {
    ``;
    if (!value) {
      return value;
    }

    const asString =
      typeof value === "string" ? value : new Date(value).toISOString();
    const trimmed = asString.replace("T", " ").replace("Z", "");
    return trimmed.split(".")[0];
  };

  const sections: FormSection[] = [
    {
      title: t("blood.patientDetailsTitle", "Patient Details"),
      id: "patientDetails",
      type: "object",
      fields: [
        {
          id: "patientName",
          label: t("blood.fields.patientName", "Patient Name"),
          type: "text",
          placeholder: t(
            "blood.fields.patientNamePlaceholder",
            "Enter patient name",
          ),
          validations: [{ name: "required", value: true }],
          path: "patient.name",
        },
        {
          id: "patientAge",
          label: t("blood.fields.patientAge", "Patient Age"),
          type: "number",
          placeholder: t(
            "blood.fields.patientAgePlaceholder",
            "Enter patient age",
          ),
          validations: [{ name: "required", value: true }],
          path: "patient.age",
        },
        {
          id: "patientGender",
          label: t("blood.fields.patientGender", "Patient Gender"),
          type: "radio",
          values: [
            { id: "male", name: t("forms.common.options.male") },
            { id: "female", name: t("forms.common.options.female") },
            { id: "other", name: t("forms.common.options.other") },
          ],
          validations: [{ name: "required", value: true }],
          path: "patient.gender",
        },
      ],
    },
    {
      title: t("blood.requestDetails", "Blood Request Details"),
      id: "requestDetails",
      type: "object",
      fields: [
        {
          id: "requiredBloodGroup",
          label: t("blood.fields.requiredBloodGroup", "Required Blood Group"),
          type: "select",
          options: [
            { label: "A+", value: "A+" },
            { label: "A-", value: "A-" },
            { label: "B+", value: "B+" },
            { label: "B-", value: "B-" },
            { label: "AB+", value: "AB+" },
            { label: "AB-", value: "AB-" },
            { label: "O+", value: "O+" },
            { label: "O-", value: "O-" },
          ],
          validations: [{ name: "required", value: true }],
          path: "request.bloodGroup",
        },
        {
          id: "unitsRequired",
          label: t("blood.fields.unitsRequired", "Units Required"),
          type: "number",
          placeholder: t(
            "blood.fields.unitsRequiredPlaceholder",
            "Enter units required",
          ),
          validations: [{ name: "required", value: true }],
          path: "request.unitsRequired",
        },
        {
          id: "requiredDatetime",
          label: t("blood.fields.requiredDatetime", "Required Date & Time"),
          type: "date",
          placeholder: "YYYY-MM-DD HH:mm:ss",
          validations: [{ name: "required", value: true }],
          path: "request.requiredDatetime",
        },
        {
          id: "urgencyLevel",
          label: t("blood.fields.urgencyLevel", "Urgency Level"),
          type: "select",
          options: [
            { label: t("blood.urgency.low", "Low"), value: "Low" },
            { label: t("blood.urgency.medium", "Medium"), value: "Medium" },
            { label: t("blood.urgency.high", "High"), value: "High" },
            {
              label: t("blood.urgency.critical", "Critical"),
              value: "Critical",
            },
          ],
          validations: [{ name: "required", value: true }],
          path: "request.urgencyLevel",
        },
      ],
    },
    {
      title: t("blood.hospitalDetails", "Hospital & Doctor Details"),
      id: "hospitalDetails",
      type: "object",
      fields: [
        {
          id: "hospitalName",
          label: t("blood.fields.hospitalName", "Hospital Name"),
          type: "text",
          placeholder: t(
            "blood.fields.hospitalNamePlaceholder",
            "Enter hospital name",
          ),
          validations: [{ name: "required", value: true }],
          path: "hospital.name",
        },
        {
          id: "doctorName",
          label: t("blood.fields.doctorName", "Doctor Name"),
          type: "text",
          placeholder: t(
            "blood.fields.doctorNamePlaceholder",
            "Enter doctor name",
          ),
          validations: [{ name: "required", value: true }],
          path: "hospital.doctorName",
        },
        {
          id: "doctorContact",
          label: t("blood.fields.doctorContact", "Doctor Contact"),
          type: "tel",
          placeholder: t(
            "blood.fields.doctorContactPlaceholder",
            "Enter doctor contact number",
          ),
          validations: [
            { name: "required", value: true },
            {
              name: "pattern",
              value: /^[0-9]{10}$/,
              message: t("forms.common.validation.phone10"),
            },
          ],
          path: "hospital.doctorContact",
        },
      ],
    },
    {
      title: t("blood.requesterDetailsTitle", "Requester Details"),
      id: "requesterDetails",
      type: "object",
      fields: [
        {
          id: "requesterName",
          label: t("blood.fields.requesterName", "Requester Name"),
          type: "text",
          placeholder: t(
            "blood.fields.requesterNamePlaceholder",
            "Enter requester name",
          ),
          validations: [{ name: "required", value: true }],
          path: "requester.name",
        },
        {
          id: "requesterMobile",
          label: t("blood.fields.requesterMobile", "Requester Mobile"),
          type: "tel",
          placeholder: t(
            "blood.fields.requesterMobilePlaceholder",
            "Enter requester mobile number",
          ),
          validations: [
            { name: "required", value: true },
            {
              name: "pattern",
              value: /^[0-9]{10}$/,
              message: t("forms.common.validation.phone10"),
            },
          ],
          path: "requester.mobile",
        },
        {
          id: "email",
          label: t("blood.fields.email", "Email (optional)"),
          type: "email",
          placeholder: t(
            "blood.fields.emailPlaceholder",
            "Enter email address",
          ),
          validations: [
            {
              name: "pattern",
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: t("forms.common.validation.invalidEmailAddress"),
            },
          ],
          path: "requester.email",
        },
      ],
    },
    {
      title: t("blood.addressDetailsTitle", "Address Details"),
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
          label: t("blood.fields.address", "Address"),
          type: "textarea",
          placeholder: t("blood.fields.addressPlaceholder", "Enter address"),
          validations: [{ name: "required", value: true }],
          path: "address.address",
        },
        {
          id: "pincode",
          label: t("blood.fields.pincode", "Pincode"),
          type: "text",
          placeholder: t("blood.fields.pincodePlaceholder", "Enter pincode"),
          validations: [{ name: "required", value: true }],
          path: "address.pincode",
        },
      ],
    },
    {
      title: t("blood.remarksTitle", "Remarks"),
      id: "remarksSection",
      type: "object",
      fields: [
        {
          id: "remarks",
          label: t("blood.fields.remarks", "Remarks"),
          type: "textarea",
          placeholder: t(
            "blood.fields.remarksPlaceholder",
            "Enter remarks or additional details",
          ),
          path: "remarks.remarks",
        },
      ],
    },
  ];

  const handleSubmit = async (data: Record<string, any>) => {
    console.log('[BloodRequest] form data:', JSON.stringify(data));
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

    const payload: Record<string, any> = {
      patient_name: data.patient?.name,
      patient_age: data.patient?.age,
      patient_gender: data.patient?.gender,
      required_blood_group: data.request?.bloodGroup,
      units_required: data.request?.unitsRequired,
      required_datetime: formatRequiredDatetime(data.request?.requiredDatetime),
      urgency_level: data.request?.urgencyLevel,
      hospital_name: data.hospital?.name,
      doctor_name: data.hospital?.doctorName,
      doctor_contact: data.hospital?.doctorContact,
      requester_name: data.requester?.name,
      requester_mobile: data.requester?.mobile,
      address: data.address?.address,
      state_id: stateId,
      district_id: districtId,
      block_id: blockId,
      mandal_id: mandalId,
      state: stateName,
      district: districtName,
      city: blockName,
      mandal: mandalName,
      pincode: data.address?.pincode,
      remarks: data.remarks?.remarks,
    };
    if (data.requester?.email) {
      payload.email = data.requester.email;
    }

    console.log('[BloodRequest] payload:', JSON.stringify(payload));

    try {
      const response = await createBloodRequest(payload as any).unwrap();
      console.log('[BloodRequest] success response:', JSON.stringify(response));
      Alert.alert(
        t("common.success"),
        response?.message ||
          t(
            "blood.submit.successMessage",
            "Blood request submitted successfully",
          ),
        [{ text: t("forms.common.ok"), onPress: () => navigation.goBack() }],
      );
    } catch (error: any) {
      console.log('[BloodRequest] error:', JSON.stringify(error));
      Alert.alert(
        t("common.error"),
        error?.data?.message ||
          t(
            "blood.submit.errorMessage",
            "Failed to submit blood request. Please try again.",
          ),
      );
    }
  };

  return (
    <View style={styles.container}>
      <GuideWrapper
        step={findGuideStep("BloodRequestScreen", "bloodSubmitBtn")}
        borderRadius={8}
      >
        <Text style={styles.subtitle}>
          {t("blood.subtitle", "Fill in the details below to request blood")}
        </Text>
      </GuideWrapper>
      {isLoading && (
        <ActivityIndicator
          size="large"
          color="#DC2626"
          style={{ marginBottom: 12 }}
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
            : t("blood.submitButton", "Submit Request")
        }
        onSubmit={handleSubmit}
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
