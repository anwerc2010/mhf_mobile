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

export default function BloodRequest() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const formRef = useRef<PTDynamicFormRef>(null);
  const [createBloodRequest, { isLoading }] = useCreateBloodRequestMutation();

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
      title: "Patient Details",
      id: "patientDetails",
      type: "object",
      fields: [
        {
          id: "patientName",
          label: "Patient Name",
          type: "text",
          placeholder: "Enter patient name",
          validations: [{ name: "required", value: true }],
          path: "patient.name",
        },
        {
          id: "patientAge",
          label: "Patient Age",
          type: "number",
          placeholder: "Enter patient age",
          validations: [{ name: "required", value: true }],
          path: "patient.age",
        },
        {
          id: "patientGender",
          label: "Patient Gender",
          type: "radio",
          values: [
            { id: "male", name: "Male" },
            { id: "female", name: "Female" },
            { id: "other", name: "Other" },
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
          label: "Required Blood Group",
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
          label: "Units Required",
          type: "number",
          placeholder: "Enter units required",
          validations: [{ name: "required", value: true }],
          path: "request.unitsRequired",
        },
        {
          id: "requiredDatetime",
          label: "Required Date & Time",
          type: "date",
          placeholder: "YYYY-MM-DD HH:mm:ss",
          validations: [{ name: "required", value: true }],
          path: "request.requiredDatetime",
        },
        {
          id: "urgencyLevel",
          label: "Urgency Level",
          type: "select",
          options: [
            { label: "Low", value: "Low" },
            { label: "Medium", value: "Medium" },
            { label: "High", value: "High" },
            { label: "Critical", value: "Critical" },
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
          label: "Hospital Name",
          type: "text",
          placeholder: "Enter hospital name",
          validations: [{ name: "required", value: true }],
          path: "hospital.name",
        },
        {
          id: "doctorName",
          label: "Doctor Name",
          type: "text",
          placeholder: "Enter doctor name",
          validations: [{ name: "required", value: true }],
          path: "hospital.doctorName",
        },
        {
          id: "doctorContact",
          label: "Doctor Contact",
          type: "tel",
          placeholder: "Enter doctor contact number",
          validations: [
            { name: "required", value: true },
            {
              name: "pattern",
              value: /^[0-9]{10}$/,
              message: "Enter valid 10 digit number",
            },
          ],
          path: "hospital.doctorContact",
        },
      ],
    },
    {
      title: "Requester Details",
      id: "requesterDetails",
      type: "object",
      fields: [
        {
          id: "requesterName",
          label: "Requester Name",
          type: "text",
          placeholder: "Enter requester name",
          validations: [{ name: "required", value: true }],
          path: "requester.name",
        },
        {
          id: "requesterMobile",
          label: "Requester Mobile",
          type: "tel",
          placeholder: "Enter requester mobile number",
          validations: [
            { name: "required", value: true },
            {
              name: "pattern",
              value: /^[0-9]{10}$/,
              message: "Enter valid 10 digit number",
            },
          ],
          path: "requester.mobile",
        },
        {
          id: "email",
          label: "Email",
          type: "email",
          placeholder: "Enter email address",
          validations: [
            { name: "required", value: true },
            {
              name: "pattern",
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter valid email address",
            },
          ],
          path: "requester.email",
        },
      ],
    },
    {
      title: "Address Details",
      id: "addressDetails",
      type: "object",
      fields: [
        {
          id: "state_id",
          label: "State",
          type: "select",
          options: states.map((s: { id: number; name: string }) => ({
            label: s.name,
            value: s.id,
          })),
          placeholder: statesLoading ? "Loading states..." : "Select state",
          validations: [{ name: "required", value: true }],
          path: "address.state_id",
          disabled: statesLoading,
          onChange: (value: number) => handleStateChange(value),
        },
        {
          id: "district_id",
          label: "District",
          type: "select",
          options: districts.map((d: { id: number; name: string }) => ({
            label: d.name,
            value: d.id,
          })),
          placeholder: !stateId
            ? "Select state first"
            : districtsLoading
            ? "Loading districts..."
            : "Select district",
          validations: [{ name: "required", value: true }],
          path: "address.district_id",
          disabled: !stateId || districtsLoading,
          onChange: (value: number) => handleDistrictChange(value),
        },
        {
          id: "block_id",
          label: "Block",
          type: "select",
          options: blocks.map((b: { id: number; name: string }) => ({
            label: b.name,
            value: b.id,
          })),
          placeholder: !districtId
            ? "Select district first"
            : blocksLoading
            ? "Loading blocks..."
            : "Select block",
          validations: [{ name: "required", value: true }],
          path: "address.block_id",
          disabled: !districtId || blocksLoading,
          onChange: (value: number) => handleBlockChange(value),
        },
        {
          id: "mandal_id",
          label: "Mandal",
          type: "select",
          options: mandals.map((m: { id: number; name: string }) => ({
            label: m.name,
            value: m.id,
          })),
          placeholder: !blockId
            ? "Select block first"
            : mandalsLoading
            ? "Loading mandals..."
            : "Select mandal",
          validations: [{ name: "required", value: true }],
          path: "address.mandal_id",
          disabled: !blockId || mandalsLoading,
          onChange: (value: number) => handleMandalChange(value),
        },
        {
          id: "address",
          label: "Address",
          type: "textarea",
          placeholder: "Enter address",
          validations: [{ name: "required", value: true }],
          path: "address.address",
        },
        {
          id: "pincode",
          label: "Pincode",
          type: "text",
          placeholder: "Enter pincode",
          validations: [{ name: "required", value: true }],
          path: "address.pincode",
        },
      ],
    },
    {
      title: "Remarks",
      id: "remarksSection",
      type: "object",
      fields: [
        {
          id: "remarks",
          label: "Remarks",
          type: "textarea",
          placeholder: "Enter remarks or additional details",
          path: "remarks.remarks",
        },
      ],
    },
  ];

  const handleSubmit = async (data: Record<string, any>) => {
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

    const payload = {
      email: data.requester?.email,
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
      status: "pending",
    };

    try {
      const response = await createBloodRequest(payload).unwrap();
      Alert.alert(
        t("common.success"),
        response?.message ||
          t(
            "blood.submit.successMessage",
            "Blood request submitted successfully",
          ),
        [{ text: "OK", onPress: () => navigation.goBack() }],
      );
    } catch (error: any) {
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
      <Text style={styles.subtitle}>
        {t("blood.subtitle", "Fill in the details below to request blood")}
      </Text>
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
        submitButtonText={isLoading ? "Submitting..." : "Submit Request"}
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
