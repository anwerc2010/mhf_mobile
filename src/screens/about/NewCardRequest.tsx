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
import { useTranslation } from "react-i18next";

function NewCardRequest() {
  const { t } = useTranslation();
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
      title: t("newCard.patientDetails", "Patient Details"),
      id: "patientDetails",
      type: "object",
      fields: [
        {
          id: "fullName",
          label: t("forms.newCard.fields.fullName"),
          type: "text",
          placeholder: t("forms.newCard.placeholders.fullName"),
          validations: [{ name: "required", value: true }],
          path: "patient.fullName",
        },
        {
          id: "email",
          label: t("forms.newCard.fields.emailAddress"),
          type: "email",
          placeholder: t("forms.newCard.placeholders.emailAddress"),
          validations: [
            { name: "required", value: true },
            {
              name: "pattern",
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: t("forms.common.validation.invalidEmailAddress"),
            },
          ],
          path: "patient.email",
        },
        {
          id: "contactNumber",
          label: t("forms.newCard.fields.contactNumber"),
          type: "tel",
          placeholder: "+91-XXXXXXXXXX",
          validations: [
            { name: "required", value: true },
            {
              name: "pattern",
              value: /^[0-9]{10}$/,
              message: t("forms.common.validation.phone10"),
            },
          ],
          path: "patient.contactNumber",
        },
        {
          id: "healthIssue",
          label: t("forms.newCard.fields.healthIssue"),
          type: "textarea",
          placeholder: t("forms.newCard.placeholders.healthIssue"),
          validations: [{ name: "required", value: true }],
          path: "patient.healthIssue",
        },
      ],
    },
    {
      title: t("forms.newCard.sections.treatmentDetails"),
      id: "treatmentDetails",
      type: "object",
      fields: [
        {
          id: "hospitalName",
          label: t("forms.newCard.fields.hospitalName"),
          type: "text",
          placeholder: t("forms.newCard.placeholders.hospitalName"),
          validations: [{ name: "required", value: true }],
          path: "treatment.hospitalName",
        },
        {
          id: "hospitalAddress",
          label: t("forms.newCard.fields.hospitalAddress"),
          type: "textarea",
          placeholder: t("forms.newCard.placeholders.hospitalAddress"),
          validations: [{ name: "required", value: true }],
          path: "treatment.hospitalAddress",
        },
        {
          id: "hospitalType",
          label: t("forms.newCard.fields.hospitalType"),
          type: "radio",
          values: [
            {
              id: "government",
              name: t("forms.newCard.options.governmentHospital"),
            },
            { id: "private", name: t("forms.newCard.options.privateHospital") },
            { id: "clinic", name: t("forms.newCard.options.clinic") },
          ],
          validations: [{ name: "required", value: true }],
          path: "treatment.hospitalType",
        },
        {
          id: "treatmentDuration",
          label: t("forms.newCard.fields.treatmentDuration"),
          type: "text",
          placeholder: t("forms.newCard.placeholders.treatmentDuration"),
          validations: [{ name: "required", value: true }],
          path: "treatment.duration",
        },
      ],
    },
    {
      title: t("forms.newCard.sections.medicalDocuments"),
      id: "medicalDocuments",
      type: "object",
      fields: [
        {
          id: "medicalReports",
          label: t("forms.newCard.fields.medicalReports"),
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
      title: t("forms.newCard.sections.referenceDetails"),
      id: "referenceDetails",
      type: "object",
      fields: [
        {
          id: "referenceName",
          label: t("forms.newCard.fields.referenceName"),
          type: "text",
          placeholder: t("forms.newCard.placeholders.referenceName"),
          path: "reference.name",
        },
        {
          id: "referenceContact",
          label: t("forms.newCard.fields.referenceContact"),
          type: "tel",
          placeholder: "+91-XXXXXXXXXX",
          validations: [
            {
              name: "pattern",
              value: /^[0-9]{10}$/,
              message: t("forms.common.validation.phone10"),
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

      Alert.alert(
        t("common.success"),
        t("forms.newCard.alerts.submitSuccess"),
        [
          {
            text: t("forms.common.ok"),
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (err: any) {
      console.error("Card Request Error:", err);
      Alert.alert(
        t("common.error"),
        err?.data?.message || t("forms.newCard.alerts.submitFailed"),
        [{ text: t("forms.common.ok") }],
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
        {t("forms.newCard.heading")}
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
        submitButtonText={
          isSubmitting
            ? t("forms.common.submitting")
            : t("forms.common.saveDetails")
        }
        onSubmit={handleSubmit}
        onValueChange={(fieldId, value) => {
          console.log(`${fieldId} changed to`, value);
        }}
      />
    </View>
  );
}

export default NewCardRequest;
