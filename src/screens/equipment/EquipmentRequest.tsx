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

export default function EquipmentRequest() {
  const navigation = useNavigation<any>();
  const formRef = useRef<PTDynamicFormRef>(null);
  const [createEquipmentRequest, { isLoading }] =
    useCreateEquipmentRequestMutation();

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
      title: "Personal Information",
      id: "personalInfo",
      type: "object",
      fields: [
        {
          id: "fullName",
          label: "Full Name",
          type: "text",
          placeholder: "Enter your full name",
          validations: [{ name: "required", value: true }],
          path: "personal.fullName",
        },
        {
          id: "age",
          label: "Age",
          type: "number",
          placeholder: "Enter your age",
          validations: [{ name: "required", value: true }],
          path: "personal.age",
        },
        {
          id: "gender",
          label: "Gender",
          type: "radio",
          values: [
            { id: "male", name: "Male" },
            { id: "female", name: "Female" },
            { id: "other", name: "Other" },
          ],
          validations: [{ name: "required", value: true }],
          path: "personal.gender",
        },
        {
          id: "mobile",
          label: "Mobile Number",
          type: "tel",
          placeholder: "Enter mobile number",
          validations: [
            { name: "required", value: true },
            {
              name: "pattern",
              value: /^[0-9]{10}$/,
              message: "Enter valid 10 digit number",
            },
          ],
          path: "personal.mobile",
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
          path: "personal.email",
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
          placeholder: "Enter your address",
          validations: [{ name: "required", value: true }],
          path: "address.address",
        },
        {
          id: "pincode",
          label: "Pincode",
          type: "text",
          placeholder: "Enter pincode",
          validations: [
            { name: "required", value: true },
            {
              name: "pattern",
              value: /^[0-9]{6}$/,
              message: "Enter valid 6 digit pincode",
            },
          ],
          path: "address.pincode",
        },
      ],
    },
    {
      title: "Equipment Details",
      id: "equipmentDetails",
      type: "object",
      fields: [
        {
          id: "equipmentType",
          label: "Equipment Type",
          type: "radio",
          values: [
            { id: "Blood Pressure Monitor", name: "Blood Pressure Monitor" },
            { id: "Glucometer", name: "Glucometer" },
            { id: "Oxygen Concentrator", name: "Oxygen Concentrator" },
            { id: "Wheelchair", name: "Wheelchair" },
            { id: "Walking Aid", name: "Walking Aid" },
            { id: "Hospital Bed", name: "Hospital Bed" },
            { id: "Nebulizer", name: "Nebulizer" },
            { id: "Other", name: "Other" },
          ],
          validations: [{ name: "required", value: true }],
          path: "equipment.equipmentType",
        },
        {
          id: "medicalReason",
          label: "Medical Reason",
          type: "textarea",
          placeholder: "Describe the medical reason for requesting equipment",
          validations: [{ name: "required", value: true }],
          path: "equipment.medicalReason",
        },
        {
          id: "duration",
          label: "Duration Required",
          type: "text",
          placeholder: "e.g., 2 weeks, 1 month",
          validations: [{ name: "required", value: true }],
          path: "equipment.duration",
        },
      ],
    },
    {
      title: "Reference Details",
      id: "referenceDetails",
      type: "object",
      fields: [
        {
          id: "referenceName",
          label: "Reference Name",
          type: "text",
          placeholder: "Enter reference person name",
          validations: [{ name: "required", value: true }],
          path: "reference.referenceName",
        },
        {
          id: "referenceContact",
          label: "Reference Contact",
          type: "tel",
          placeholder: "Enter reference contact number",
          validations: [
            { name: "required", value: true },
            {
              name: "pattern",
              value: /^[0-9]{10}$/,
              message: "Enter valid 10 digit number",
            },
          ],
          path: "reference.referenceContact",
        },
      ],
    },
    {
      title: "Consent",
      id: "consent",
      type: "object",
      fields: [
        {
          id: "consent",
          label:
            "I hereby declare that the information provided is true and accurate",
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
        state_id: stateId,
        district_id: districtId,
        block_id: blockId,
        mandal_id: mandalId,
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
        customer_id: "",
        consent: data.consent?.consent || false,
        status: "pending",
      };

      console.log("Equipment Request Payload:", payload);

      const response = await createEquipmentRequest(payload).unwrap();

      Alert.alert(
        "Success",
        `Equipment request submitted successfully! Request ID: ${response.data?.request_id}`,
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error: any) {
      console.error("Equipment Request Error:", error);
      Alert.alert(
        "Error",
        error?.data?.message ||
          "Failed to submit equipment request. Please try again.",
        [{ text: "OK" }],
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>
        Fill in the details below to request medical equipment
      </Text>
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
        submitButtonText={isLoading ? "Submitting..." : "Submit Request"}
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
