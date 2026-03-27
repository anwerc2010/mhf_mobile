import React, { useMemo, useState } from "react";
import { Text, View, Alert } from "react-native";
import PTDynamicForm, {
  PTDynamicFormRef,
  FormSection,
} from "../../../components/general/DynamicForm/DynamicForm";
import { useRef } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { PTText } from "../../../components/comman";
import {
  useCreateReliefRequestMutation,
  useLocationDropdowns,
  useUploadDocumentMutation,
} from "@psi/shared-api";
import { FileData } from "../../../components/comman/PTFilePicker";

function ApplyNewRelief() {
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
      { id: "Food Kit", name: "Food Kit" },
      { id: "Water", name: "Water" },
      { id: "Clothes", name: "Clothes" },
      { id: "Shelter", name: "Shelter / Temporary Housing" },
      { id: "MedicalHelp", name: "Medicine / Medical Help" },
      { id: "Other", name: "Others (please specify)" },
    ];
  }, [reliefParam?.items_provided]);

  console.log("Relief Param:", reliefParam);
  console.log("Assistance Options:", assistanceOptions);

  const sections: FormSection[] = useMemo(
    () => [
      {
        title: "Personal Information",
        id: "personalInformation",
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
            id: "fatherOrHusbandName",
            label: "Father's / Husband's Name",
            type: "text",
            placeholder: "Enter father's or husband's name",
            validations: [{ name: "required", value: true }],
            path: "personal.guardianName",
          },
          {
            id: "dob",
            label: "Date of Birth",
            type: "date",
            validations: [{ name: "required", value: true }],
            path: "personal.dob",
          },
          {
            id: "age",
            label: "Age",
            type: "number",
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
            id: "mobileNumber",
            label: "Mobile Number",
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
            path: "personal.mobileNumber",
          },
          {
            id: "alternateNumber",
            label: "Alternate Number",
            type: "tel",
            placeholder: "+91-XXXXXXXXXX",
            validations: [{ name: "pattern", value: /^[0-9]{10}$/ }],
            path: "personal.alternateNumber",
          },
          {
            id: "email",
            label: "Email ID (Available)",
            type: "email",
            validations: [
              {
                name: "pattern",
                value: /^[^@]+@[^@]+\.[^@]+$/,
                message: "Invalid email",
              },
            ],
            path: "personal.email",
          },
          {
            id: "currentAddress",
            label: "Current Address (With Pin Code)",
            type: "textarea",
            placeholder: "Enter your complete address with pin code",
            validations: [{ name: "required", value: true }],
            path: "personal.address",
          },
          {
            id: "pincode",
            label: "Pin code",
            type: "text",
            placeholder: "Enter your Pin code",
            validations: [{ name: "required", value: true }],
            path: "personal.pincode",
          },
          {
            id: "idProofType",
            label: "ID Proof Type",
            type: "select",
            options: [
              { id: "Aadhar", name: "Aadhar" },
              { id: "VoterID", name: "Voter ID" },
              { id: "PAN", name: "PAN Card" },
              { id: "Other", name: "Other" },
            ],
            validations: [{ name: "required", value: true }],
            path: "personal.idProofType",
          },
          {
            id: "idProofNumber",
            label: "ID Proof Number",
            type: "text",
            placeholder: "Enter ID proof number",
            validations: [{ name: "required", value: true }],
            path: "personal.idProofNumber",
          },
        ],
      },
      {
        title: "Location Details",
        id: "locationDetails",
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
            path: "location.state_id",
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
            path: "location.district_id",
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
            path: "location.block_id",
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
        title: "Family and Living Situation",
        id: "familyLivingSituation",
        type: "object",
        fields: [
          {
            id: "total_family_members",
            label: "Total Family Members",
            type: "number",
            validations: [{ name: "required", value: true }],
            path: "family.total_family_members",
          },
          {
            id: "earning_members",
            label: "Earning Members",
            type: "number",
            validations: [{ name: "required", value: true }],
            path: "family.earning_members",
          },
          {
            id: "children_below_5",
            label: "Children (Below 5)",
            type: "number",
            path: "family.children_below_5",
          },
          {
            id: "children_school_going",
            label: "Children (School-going)",
            type: "number",
            path: "family.children_school_going",
          },
          {
            id: "elderly_disabled_members",
            label: "Elderly / Disabled Members",
            type: "number",
            validations: [{ name: "required", value: true }],
            path: "family.elderly_disabled_members",
          },
          {
            id: "elderly_disabled_details",
            label: "Elderly / Disabled Members",
            type: "textarea",
            validations: [{ name: "required", value: true }],
            path: "family.elderly_disabled_details",
          },
          {
            id: "house_type",
            label: "Type of House",
            type: "radio",
            values: [
              { id: "owned", name: "Owned" },
              { id: "temporary", name: "Temporary" },
              { id: "rented", name: "Rented" },
              { id: "damaged", name: "Damaged" },
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
        title: "Reason for Request",
        id: "reasonForRequest",
        type: "object",
        fields: [
          {
            id: "reason",
            label: "Reason for Request (Optional but helpful)",
            type: "textarea",
            placeholder: "Describe your situation and why you need assistance",
            validations: [{ name: "required", value: true }],
            path: "request.reason",
          },
        ],
      },

      /* =======================
           4. What Do You Need From Us?
        ======================== */
      {
        title: "What Do You Need From Us?",
        id: "assistanceRequired",
        type: "object",
        fields: [
          {
            id: "assistanceTypes",
            label: "Please tick the items you are requesting",
            type: "multiselect",
            values: assistanceOptions,
            validations: [{ name: "required", value: true }],
            path: "assistance.items",
          },
        ],
      },
      {
        title: "Declaration",
        id: "declaration",
        type: "object",
        fields: [
          {
            id: "declarationAccepted",
            label:
              "I declare that the information provided above is true and accurate to the best of my knowledge.",
            type: "radio",
            values: [{ id: "accepted", name: "I Agree" }],
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
      <PTText
        style={{
          fontSize: 16,
          padding: 8,
          fontWeight: "400",
          marginBottom: 12,
        }}
      >
        Apply for Support
      </PTText>
      <PTDynamicForm
        ref={formRef}
        sections={sections}
        initialValues={{}}
        mode="onBlur"
        submitButtonText="Save Details"
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
              status: "pending",
              declaration: values.declaration?.accepted === "accepted",
            };

            console.log(
              "Payload for relief request:",
              JSON.stringify(payload, null, 2),
            );

            const response = await createReliefRequest(payload).unwrap();
            console.log("Relief request submitted successfully:", response);

            Alert.alert(
              "Success",
              "Your relief request has been submitted successfully!",
              [
                {
                  text: "OK",
                  onPress: () => navigation.goBack(),
                },
              ],
            );
          } catch (error: any) {
            console.error("Relief request submission failed:", error);

            Alert.alert(
              "Error",
              error?.data?.message ||
                "Failed to submit relief request. Please try again.",
              [{ text: "OK" }],
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
