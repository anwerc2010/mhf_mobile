import React, { useState } from "react";
import { View, Alert, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import PTDynamicForm, {
  PTDynamicFormRef,
  FormSection,
} from "../../components/general/DynamicForm/DynamicForm";
import { useRef } from "react";
import { PTText } from "../../components/comman";
import {
  useCreateCardRequestMutation,
  useGetDashboardDetailsQuery,
  useUploadDocumentMutation,
} from "@psi/shared-api";
import { FileData } from "../../components/comman/PTFilePicker";

function NewCardRequest() {
  const navigation = useNavigation<any>();
  const formRef = useRef<PTDynamicFormRef>(null);
  const [createCardRequest, { isLoading, error }] =
    useCreateCardRequestMutation();
  const [uploadDocument, { isLoading: isUploading }] =
    useUploadDocumentMutation();
  const { data: dashboardData } = useGetDashboardDetailsQuery();
  const isSubmitting = isLoading || isUploading;
  const sections: FormSection[] = [
    {
      title: "Patient Details",
      id: "patientDetails",
      type: "object",
      fields: [
        {
          id: "fullName",
          label: "Full Name",
          type: "text",
          placeholder: "Enter your full name",
          validations: [{ name: "required", value: true }],
          path: "patient.fullName",
        },
        {
          id: "email",
          label: "Email Address",
          type: "email",
          placeholder: "Enter your email address",
          validations: [
            { name: "required", value: true },
            {
              name: "pattern",
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter valid email address",
            },
          ],
          path: "patient.email",
        },
        {
          id: "contactNumber",
          label: "Contact Number",
          type: "tel",
          placeholder: "+91-XXXXXXXXXX",
          validations: [
            { name: "required", value: true },
            {
              name: "pattern",
              value: /^[0-9]{10}$/,
              message: "Enter valid 10 digit number",
            },
          ],
          path: "patient.contactNumber",
        },
        {
          id: "healthIssue",
          label: "Health Issue / Medical Condition",
          type: "textarea",
          placeholder: "Describe your health condition or medical issue",
          validations: [{ name: "required", value: true }],
          path: "patient.healthIssue",
        },
      ],
    },
    {
      title: "Treatment Details",
      id: "treatmentDetails",
      type: "object",
      fields: [
        {
          id: "hospitalName",
          label: "Hospital Name Where Treatment Taken",
          type: "text",
          placeholder: "Enter hospital name",
          validations: [{ name: "required", value: true }],
          path: "treatment.hospitalName",
        },
        {
          id: "hospitalAddress",
          label: "Hospital Address",
          type: "textarea",
          placeholder: "Enter complete hospital address with city and pincode",
          validations: [{ name: "required", value: true }],
          path: "treatment.hospitalAddress",
        },
        {
          id: "hospitalType",
          label: "Hospital Type",
          type: "radio",
          values: [
            { id: "government", name: "Government Hospital" },
            { id: "private", name: "Private Hospital" },
            { id: "clinic", name: "Clinic" },
          ],
          validations: [{ name: "required", value: true }],
          path: "treatment.hospitalType",
        },
        {
          id: "treatmentDuration",
          label: "How Many Years About Your Treatment",
          type: "text",
          placeholder: "e.g., 2 years, 6 months",
          validations: [{ name: "required", value: true }],
          path: "treatment.duration",
        },
      ],
    },
    {
      title: "Medical Documents",
      id: "medicalDocuments",
      type: "object",
      fields: [
        {
          id: "medicalReports",
          label: "Upload Prescription / Medical Reports",
          type: "file",
          acceptedTypes: ["application/pdf", "image/*"],
          maxSize: 10 * 1024 * 1024, // 10MB in bytes
          multiple: true,
          maxFiles: 5, // Maximum 5 files
          validations: [{ name: "required", value: true }],
          path: "documents.medicalReports",
        },
      ],
    },

    /* =======================
           Reference Details (Optional)
        ======================== */
    {
      title: "Reference Details (Optional)",
      id: "referenceDetails",
      type: "object",
      fields: [
        {
          id: "referenceName",
          label: "Reference Name & Details",
          type: "text",
          placeholder: "Name of person referring you",
          path: "reference.name",
        },
        {
          id: "referenceContact",
          label: "Reference Contact Number",
          type: "tel",
          placeholder: "+91-XXXXXXXXXX",
          validations: [
            {
              name: "pattern",
              value: /^[0-9]{10}$/,
              message: "Enter valid 10 digit number",
            },
          ],
          path: "reference.contactNumber",
        },
      ],
    },
  ];

  const normalizeDocuments = (
    documents: FileData | FileData[] | string | string[] | null | undefined,
  ) => {
    if (!documents) return [] as Array<FileData | string>;
    return Array.isArray(documents) ? documents : [documents];
  };

  const uploadDocuments = async (documents: Array<FileData | string>) => {
    const uploadedUrls: string[] = [];

    for (const doc of documents) {
      if (typeof doc === "string") {
        uploadedUrls.push(doc);
        continue;
      }

      const formData = new FormData();
      formData.append("document", {
        uri: doc.uri,
        name: doc.name,
        type: doc.type,
      } as any);

      const response = await uploadDocument(formData).unwrap();
      if (response?.data?.url) {
        uploadedUrls.push(response.data.url);
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      const documentInputs = normalizeDocuments(data.documents?.medicalReports);
      const uploadedDocumentUrls = await uploadDocuments(documentInputs);

      // Create the request payload based on CardRequestPayload interface
      const payload = {
        fullname: data.patient?.fullName,
        email: data.patient?.email,
        contact_number: data.patient?.contactNumber,
        health_issue: data.patient?.healthIssue,
        hospital_name: data.treatment?.hospitalName,
        hospital_type: data.treatment?.hospitalType,
        treatment_duration: data.treatment?.duration,
        reference_name: data.reference?.name || "",
        reference_contact: data.reference?.contactNumber || "",
        documents: uploadedDocumentUrls,
        blood_group: dashboardData?.customer?.blood_group || "",
        card_holder_name: dashboardData?.customer?.fullname || "",
        phone: dashboardData?.customer?.phone || "",
      };
      console.log(JSON.stringify(payload, null, 2));
      console.log("Card Request Payload:", payload);

      // Make the API call
      const response = await createCardRequest(payload).unwrap();

      Alert.alert("Success", "Card request submitted successfully", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (err: any) {
      console.error("Card Request Error:", err);
      Alert.alert(
        "Error",
        err?.data?.message ||
          "Failed to submit card request. Please try again.",
        [{ text: "OK" }],
      );
    }
  };

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
        Please fill in all the details to apply for a health card
      </PTText>
      {isSubmitting && (
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
        submitButtonText={isSubmitting ? "Submitting..." : "Save Details"}
        onSubmit={handleSubmit}
        onValueChange={(fieldId, value) => {
          console.log(`${fieldId} changed to`, value);
        }}
      />
    </View>
  );
}

export default NewCardRequest;
