import React, { useMemo, useState } from "react";
import { Text, View, Alert } from "react-native";
import PTDynamicForm, {
  PTDynamicFormRef,
  FormSection,
} from "../../../components/general/DynamicForm/DynamicForm";
import { useRef } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";

import {
  useCreateReliefRequestMutation,
  useLocationDropdowns,
  useUploadDocumentMutation,
} from "@psi/shared-api";
import { FileData } from "../../../components/comman/PTFilePicker";
import { useTranslation } from "react-i18next";

function ApplyNewRelief() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const formRef = useRef<PTDynamicFormRef>(null);
  const [createReliefRequest, { isLoading: isSubmitting }] =
    useCreateReliefRequestMutation();
  const [uploadDocument, { isLoading: isUploading }] =
    useUploadDocumentMutation();
  const isSubmittingCombined = isSubmitting || isUploading;
  const route = useRoute<any>();
  const reliefParam = route.params?.program;

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
    formRef.current?.setValue("location.state_id", val);
    formRef.current?.setValue("location.district_id", undefined);
    formRef.current?.setValue("location.block_id", undefined);
    formRef.current?.setValue("location.mandal_id", undefined);
  };

  const handleDistrictChange = (val: number) => {
    setDistrictId(val);
    setBlockId(null);
    setMandalId(null);
    formRef.current?.setValue("location.district_id", val);
    formRef.current?.setValue("location.block_id", undefined);
    formRef.current?.setValue("location.mandal_id", undefined);
  };

  const handleBlockChange = (val: number) => {
    setBlockId(val);
    setMandalId(null);
    formRef.current?.setValue("location.block_id", val);
    formRef.current?.setValue("location.mandal_id", undefined);
  };

  const handleMandalChange = (val: number) => {
    setMandalId(val);
    formRef.current?.setValue("location.mandal_id", val);
  };

  // Convert items_provided to multiselect format
  const assistanceOptions = useMemo(() => {
    if (
      reliefParam?.items_provided &&
      Array.isArray(reliefParam.items_provided)
    ) {
      return reliefParam.items_provided.map((item: string) => ({
        id: item,
        name: item,
      }));
    }
    // Fallback to default options if items_provided not available
    return [
      { id: "Food Kit", name: t("forms.relief.options.foodKit") },
      { id: "Water", name: t("forms.relief.options.water") },
      { id: "Clothes", name: t("forms.relief.options.clothes") },
      { id: "Shelter", name: t("forms.relief.options.shelter") },
      { id: "MedicalHelp", name: t("forms.relief.options.medicalHelp") },
      { id: "Other", name: t("forms.relief.options.other") },
    ];
  }, [reliefParam?.items_provided]);

  console.log("Relief Param:", reliefParam);
  console.log("Assistance Options:", assistanceOptions);

  const sections: FormSection[] = useMemo(
    () => [
      {
        title: t("forms.relief.sections.personalInformation"),
        id: "personalInformation",
        type: "object",
        fields: [
          {
            id: "fullName",
            label: t("forms.relief.fields.fullName"),
            type: "text",
            placeholder: t("forms.relief.placeholders.fullName"),
            validations: [{ name: "required", value: true }],
            path: "personal.fullName",
          },
          {
            id: "fatherOrHusbandName",
            label: t("forms.relief.fields.fatherOrHusbandName"),
            type: "text",
            placeholder: t("forms.relief.placeholders.fatherOrHusbandName"),
            validations: [{ name: "required", value: true }],
            path: "personal.guardianName",
          },
          {
            id: "dob",
            label: t("forms.relief.fields.dateOfBirth"),
            type: "date",
            validations: [{ name: "required", value: true }],
            path: "personal.dob",
          },
          {
            id: "age",
            label: t("forms.relief.fields.age"),
            type: "number",
            validations: [{ name: "required", value: true }],
            path: "personal.age",
          },
          {
            id: "gender",
            label: t("forms.relief.fields.gender"),
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
            id: "mobileNumber",
            label: t("forms.relief.fields.mobileNumber"),
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
            path: "personal.mobileNumber",
          },
          {
            id: "alternateNumber",
            label: t("forms.relief.fields.alternateNumber"),
            type: "tel",
            placeholder: "+91-XXXXXXXXXX",
            validations: [{ name: "pattern", value: /^[0-9]{10}$/ }],
            path: "personal.alternateNumber",
          },
          {
            id: "email",
            label: t("forms.relief.fields.emailAvailable"),
            type: "email",
            validations: [
              {
                name: "pattern",
                value: /^[^@]+@[^@]+\.[^@]+$/,
                message: t("forms.common.validation.invalidEmail"),
              },
            ],
            path: "personal.email",
          },
          {
            id: "currentAddress",
            label: t("forms.relief.fields.currentAddress"),
            type: "textarea",
            placeholder: t("forms.relief.placeholders.currentAddress"),
            validations: [{ name: "required", value: true }],
            path: "personal.address",
          },
          {
            id: "pincode",
            label: t("forms.relief.fields.pincode"),
            type: "text",
            placeholder: t("forms.relief.placeholders.pincode"),
            validations: [{ name: "required", value: true }],
            path: "personal.pincode",
          },
          {
            id: "idProofType",
            label: t("forms.relief.fields.idProofType"),
            type: "select",
            options: [
              { id: "Aadhar", name: t("forms.common.options.aadhar") },
              { id: "VoterID", name: t("forms.common.options.voterId") },
              { id: "PAN", name: t("forms.common.options.panCard") },
              { id: "Other", name: t("forms.common.options.other") },
            ],
            validations: [{ name: "required", value: true }],
            path: "personal.idProofType",
          },
          {
            id: "idProofNumber",
            label: t("forms.relief.fields.idProofNumber"),
            type: "text",
            placeholder: t("forms.relief.placeholders.idProofNumber"),
            validations: [{ name: "required", value: true }],
            path: "personal.idProofNumber",
          },
        ],
      },
      {
        title: t("forms.common.sections.locationDetails"),
        id: "locationDetails",
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
            path: "location.state_id",
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
            path: "location.district_id",
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
            path: "location.block_id",
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
            path: "location.mandal_id",
            disabled: !blockId || mandalsLoading,
            onChange: (value: number) => handleMandalChange(value),
          },
        ],
      },

      /* =======================
           2. Family & Living Situation
        ======================== */
      {
        title: t("forms.relief.sections.familyAndLivingSituation"),
        id: "familyLivingSituation",
        type: "object",
        fields: [
          {
            id: "total_family_members",
            label: t("forms.relief.fields.totalFamilyMembers"),
            type: "number",
            validations: [{ name: "required", value: true }],
            path: "family.total_family_members",
          },
          {
            id: "earning_members",
            label: t("forms.relief.fields.earningMembers"),
            type: "number",
            validations: [{ name: "required", value: true }],
            path: "family.earning_members",
          },
          {
            id: "children_below_5",
            label: t("forms.relief.fields.childrenBelow5"),
            type: "number",
            path: "family.children_below_5",
          },
          {
            id: "children_school_going",
            label: t("forms.relief.fields.childrenSchoolGoing"),
            type: "number",
            path: "family.children_school_going",
          },
          {
            id: "elderly_disabled_members",
            label: t("forms.relief.fields.elderlyDisabledMembers"),
            type: "number",
            validations: [{ name: "required", value: true }],
            path: "family.elderly_disabled_members",
          },
          {
            id: "elderly_disabled_details",
            label: t("forms.relief.fields.elderlyDisabledDetails"),
            type: "textarea",
            validations: [{ name: "required", value: true }],
            path: "family.elderly_disabled_details",
          },
          {
            id: "house_type",
            label: t("forms.relief.fields.houseType"),
            type: "radio",
            values: [
              { id: "owned", name: t("forms.relief.options.owned") },
              {
                id: "temporary",
                name: t("forms.relief.options.temporary"),
              },
              { id: "rented", name: t("forms.relief.options.rented") },
              { id: "damaged", name: t("forms.relief.options.damaged") },
            ],
            validations: [{ name: "required", value: true }],
            path: "family.house_type",
          },
        ],
      },
      //   {
      //     title: "Medical Documents",
      //     id: "medicalDocuments",
      //     type: "object",
      //     fields: [
      //       {
      //         id: "documents",
      //         label: "Upload Prescription / Medical Reports",
      //         type: "file",
      //         acceptedTypes: ["application/pdf", "image/*"],
      //         maxSize: 10 * 1024 * 1024, // 10MB in bytes
      //         multiple: true,
      //         maxFiles: 5, // Maximum 5 files
      //         //validations: [{ name: 'required', value: true }],
      //         path: "documents.documents",
      //       },
      //     ],
      //   },
      /* =======================
           3. Reason for Request
        ======================== */
      {
        title: t("forms.relief.sections.reasonForRequest"),
        id: "reasonForRequest",
        type: "object",
        fields: [
          {
            id: "reason",
            label: t("forms.relief.fields.reasonForRequest"),
            type: "textarea",
            placeholder: t("forms.relief.placeholders.reasonForRequest"),
            validations: [{ name: "required", value: true }],
            path: "request.reason",
          },
        ],
      },

      /* =======================
           4. What Do You Need From Us?
        ======================== */
      {
        title: t("forms.relief.sections.assistanceRequired"),
        id: "assistanceRequired",
        type: "object",
        fields: [
          {
            id: "assistanceTypes",
            label: t("forms.relief.fields.assistanceTypes"),
            type: "multiselect",
            values: assistanceOptions,
            validations: [{ name: "required", value: true }],
            path: "assistance.items",
          },
        ],
      },
      {
        title: t("forms.common.sections.declaration"),
        id: "declaration",
        type: "object",
        fields: [
          {
            id: "declarationAccepted",
            label: t("forms.relief.fields.declaration"),
            type: "radio",
            values: [{ id: "accepted", name: t("forms.common.iAgree") }],
            validations: [{ name: "required", value: true }],
            path: "declaration.accepted",
          },
        ],
      },
    ],
    [
      assistanceOptions,
      states,
      districts,
      blocks,
      mandals,
      statesLoading,
      districtsLoading,
      blocksLoading,
      mandalsLoading,
      stateId,
      districtId,
      blockId,
    ],
  );

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

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
<PTDynamicForm
        ref={formRef}
        sections={sections}
        initialValues={{}}
        mode="onBlur"
        submitButtonText={t("forms.common.saveDetails")}
        submitLoading={isSubmittingCombined}
        onSubmit={async (values) => {
          console.log("Form submitted:", values);

          try {
            const documentInputs = normalizeDocuments(
              values.documents?.documents,
            );
            const uploadedDocumentUrls = await uploadDocuments(documentInputs);

            const stateName =
              states.find((s: { id: number; name: string }) => s.id === stateId)
                ?.name || "";
            const districtName =
              districts.find(
                (d: { id: number; name: string }) => d.id === districtId,
              )?.name || "";
            const blockName =
              blocks.find((b: { id: number; name: string }) => b.id === blockId)
                ?.name || "";
            const mandalName =
              mandals.find(
                (m: { id: number; name: string }) => m.id === mandalId,
              )?.name || "";

            const payload = {
              relief_welfare_id: reliefParam?.id || null,
              relief_camp: reliefParam?.title || "",
              full_name: values.personal?.fullName || "",
              father_or_husband_name: values.personal?.guardianName || "",
              dob: values.personal?.dob
                ? values.personal.dob.split("T")[0]
                : "",
              age: values.personal?.age || 0,
              gender: values.personal?.gender || "",
              mobile: values.personal?.mobileNumber || "",
              alternate_number: values.personal?.alternateNumber || "",
              current_address: values.personal?.address || "",
              email: values.personal?.email || "",
              id_proof_type: values.personal?.idProofType || "",
              id_proof_number: values.personal?.idProofNumber || "",
              total_family_members: values.family?.total_family_members || 0,
              earning_members: values.family?.earning_members || 0,
              children_below_5: values.family?.children_below_5 || 0,
              children_school_going: values.family?.children_school_going || 0,
              elderly_disabled_members:
                values.family?.elderly_disabled_members || 0,
              elderly_disabled_details:
                values.family?.elderly_disabled_details || "",
              house_type: values.family?.house_type || "",
              reason: values.request?.reason || "",
              items_needed: Array.isArray(values.assistance?.items)
                ? values.assistance.items
                : [],
              documents: uploadedDocumentUrls,
              state_id: stateId,
              district_id: districtId,
              block_id: blockId,
              mandal_id: mandalId,
              state: stateName,
              district: districtName,
              city: blockName,
              mandal: mandalName,
              pincode: values.personal?.pincode || "",
              customer_id: reliefParam?.customer_id,
              declaration: values.declaration?.accepted === "accepted",
            };

            console.log(
              "Payload for relief request:",
              JSON.stringify(payload, null, 2),
            );

            const response = await createReliefRequest(payload).unwrap();
            console.log("Relief request submitted successfully:", response);

            Alert.alert(
              t("common.success"),
              t("forms.relief.alerts.submitSuccess"),
              [
                {
                  text: t("forms.common.ok"),
                  onPress: () => navigation.goBack(),
                },
              ],
            );
          } catch (error: any) {
            console.error("Relief request submission failed:", error);

            Alert.alert(
              t("common.error"),
              error?.data?.message || t("forms.relief.alerts.submitFailed"),
              [{ text: t("forms.common.ok") }],
            );
          }
        }}
        onValueChange={(fieldId, value) => {
          console.log(`${fieldId} changed to`, value);
        }}
      />
    </View>
  );
}

export default ApplyNewRelief;
