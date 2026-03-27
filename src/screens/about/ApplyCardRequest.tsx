import React, { useRef, useState } from "react";
import { View, Alert, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import PTDynamicForm, {
  PTDynamicFormRef,
  FormSection,
} from "../../components/general/DynamicForm/DynamicForm";
import { PTText } from "../../components/comman";
import {
  useApplyHealthCardMutation,
  useUploadDocumentMutation,
  useLocationDropdowns,
} from "@psi/shared-api";
import { FileData } from "../../components/comman/PTFilePicker";
import { formatToDDMMYYY } from "../../utils/formatDate";

function ApplyCardRequest() {
  const navigation = useNavigation<any>();
  const formRef = useRef<PTDynamicFormRef>(null);
  const [cardType, setCardType] = useState<string>("");
  const [stateId, setStateId] = useState<number | null>(null);
  const [districtId, setDistrictId] = useState<number | null>(null);
  const [blockId, setBlockId] = useState<number | null>(null);
  const [mandalId, setMandalId] = useState<number | null>(null);
  const [applyHealthCard, { isLoading }] = useApplyHealthCardMutation();
  const [uploadDocument, { isLoading: isUploading }] =
    useUploadDocumentMutation();
  const isSubmitting = isLoading || isUploading;

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
    formRef.current?.setValue("card_holder.state_id", val);
    formRef.current?.setValue("card_holder.district_id", undefined);
    formRef.current?.setValue("card_holder.block_id", undefined);
    formRef.current?.setValue("card_holder.mandal_id", undefined);
  };

  const handleDistrictChange = (val: number) => {
    setDistrictId(val);
    setBlockId(null);
    setMandalId(null);
    formRef.current?.setValue("card_holder.district_id", val);
    formRef.current?.setValue("card_holder.block_id", undefined);
    formRef.current?.setValue("card_holder.mandal_id", undefined);
  };

  const handleBlockChange = (val: number) => {
    setBlockId(val);
    setMandalId(null);
    formRef.current?.setValue("card_holder.block_id", val);
    formRef.current?.setValue("card_holder.mandal_id", undefined);
  };

  const handleMandalChange = (val: number) => {
    setMandalId(val);
    formRef.current?.setValue("card_holder.mandal_id", val);
  };

  const sections: FormSection[] = [
    {
      title: "Card Holder Details",
      id: "cardHolder",
      type: "object",
      fields: [
        {
          id: "card_holder_name",
          label: "Card Holder Name",
          type: "text",
          placeholder: "Enter full name",
          validations: [{ name: "required", value: true }],
          path: "card_holder.card_holder_name",
        },
        {
          id: "aadhaar_number",
          label: "Aadhaar Number",
          type: "text",
          placeholder: "1111 2222 3333",
          validations: [
            { name: "required", value: true },
            {
              name: "pattern",
              value: /^[0-9]{4} [0-9]{4} [0-9]{4}$/,
              message: "Enter valid Aadhaar number (XXXX XXXX XXXX)",
            },
            {
              name: "maxLength",
              value: 14,
              message: "Aadhaar number cannot exceed 14 characters",
            },
          ],
          path: "card_holder.aadhaar_number",
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
          path: "card_holder.blood_group",
        },
        {
          id: "phone",
          label: "Phone",
          type: "tel",
          placeholder: "Enter 10 digit number",
          validations: [
            { name: "required", value: true },
            {
              name: "pattern",
              value: /^[0-9]{10}$/,
              message: "Enter valid 10 digit number",
            },
          ],
          path: "card_holder.phone",
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
          path: "card_holder.email",
        },
        {
          id: "address",
          label: "Address",
          type: "textarea",
          placeholder: "Enter address",
          validations: [{ name: "required", value: true }],
          path: "card_holder.address",
        },
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
          path: "card_holder.state_id",
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
          path: "card_holder.district_id",
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
          path: "card_holder.block_id",
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
          path: "card_holder.mandal_id",
          disabled: !blockId || mandalsLoading,
          onChange: (value: number) => handleMandalChange(value),
        },
        {
          id: "gender",
          label: "Gender",
          type: "radio",
          values: [
            { id: "Male", name: "Male" },
            { id: "Female", name: "Female" },
          ],
          validations: [{ name: "required", value: true }],
          path: "card_holder.gender",
        },
        {
          id: "age_category",
          label: "Age Category",
          type: "radio",
          values: [
            { id: "Child", name: "Child" },
            { id: "Adult", name: "Adult" },
          ],
          validations: [{ name: "required", value: true }],
          path: "card_holder.age_category",
        },
        {
          id: "family_head_image",
          label: "Family Head Image",
          type: "file",
          maxFiles: 1,
          acceptedTypes: ["image/png", "image/jpg", "image/jpeg"],
          validations: [{ name: "required", value: true }],
          path: "card_holder.family_head_image",
        },
      ],
    },
    {
      title: "Card Details",
      id: "cardDetails",
      type: "object",
      fields: [
        {
          id: "type",
          label: "Card Type",
          type: "radio",
          values: [
            { id: "individual", name: "Individual" },
            { id: "family", name: "Family" },
          ],
          validations: [{ name: "required", value: true }],
          path: "card_details.type",
        },
        {
          id: "date_of_issue",
          label: "Date of Issue",
          type: "text",
          disabled: true,
          path: "card_details.date_of_issue",
        },
        {
          id: "date_of_expiry",
          label: "Date of Expiry",
          type: "text",
          disabled: true,
          path: "card_details.date_of_expiry",
        },
      ],
    },
  ];

  // Conditionally add family members section only if card type is 'family'
  if (cardType === "family") {
    sections.push({
      title: "Family Members",
      id: "family_members",
      type: "array",
      minItems: 0,
      maxItems: 5,
      fields: [
        {
          id: "name",
          label: "Full Name",
          type: "text",
          placeholder: "Enter full name",
          validations: [{ name: "required", value: true }],
        },
        {
          id: "relationship",
          label: "Relationship",
          type: "select",
          options: [
            { id: "Spouse", name: "Spouse" },
            { id: "Son", name: "Son" },
            { id: "Daughter", name: "Daughter" },
            { id: "Father", name: "Father" },
            { id: "Mother", name: "Mother" },
            { id: "Brother", name: "Brother" },
            { id: "Sister", name: "Sister" },
          ],
          validations: [{ name: "required", value: true }],
        },
        {
          id: "aadhaar_number",
          label: "Aadhaar Number",
          type: "text",
          placeholder: "1111 2222 3333",
          validations: [
            { name: "required", value: true },
            {
              name: "pattern",
              value: /^[0-9]{4} [0-9]{4} [0-9]{4}$/,
              message: "Enter valid Aadhaar number (XXXX XXXX XXXX)",
            },
            {
              name: "maxLength",
              value: 14,
              message: "Aadhaar number cannot exceed 14 characters",
            },
          ],
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
        },
        {
          id: "date_of_birth",
          label: "Date of Birth",
          type: "date",
        },
        {
          id: "gender",
          label: "Gender",
          type: "radio",
          values: [
            { id: "Male", name: "Male" },
            { id: "Female", name: "Female" },
          ],
        },
        {
          id: "age_category",
          label: "Age Category",
          type: "radio",
          values: [
            { id: "Child", name: "Child" },
            { id: "Adult", name: "Adult" },
          ],
        },
      ],
    });
  }

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

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      const imageInputs = normalizeDocuments(
        values.card_holder?.family_head_image,
      );
      const uploadedImageUrls = await uploadDocuments(imageInputs);
      const uploadedImageUrl =
        uploadedImageUrls.length > 0 ? uploadedImageUrls[0] : "";
      // Add date of issue (today) and date of expiry (1 year from today)
      const today = new Date();
      const nextYear = new Date(today);
      nextYear.setFullYear(today.getFullYear() + 1);
      nextYear.setDate(nextYear.getDate() - 1);
      const dateOfIssue = formatToDDMMYYY(today);
      const dateOfExpiry = formatToDDMMYYY(nextYear);

      // Flatten and format data to match API expected structure
      const formattedData = {
        card_holder_name: values.card_holder?.card_holder_name,
        aadhaar_number: values.card_holder?.aadhaar_number,
        blood_group: values.card_holder?.blood_group,
        phone: values.card_holder?.phone,
        email: values.card_holder?.email,
        address: values.card_holder?.address,
        state_id: values.card_holder?.state_id ?? null,
        district_id: values.card_holder?.district_id ?? null,
        block_id: values.card_holder?.block_id ?? null,
        mandal_id: values.card_holder?.mandal_id ?? null,
        gender: values.card_holder?.gender,
        age_category: values.card_holder?.age_category,
        family_head_image: uploadedImageUrl,
        type: values.card_details?.type,
        mode: "online" as const,
        date_of_issue: dateOfIssue,
        date_of_expiry: dateOfExpiry,
        family_members: values.family_members || [],
      };

      console.log(
        "Apply card request values:",
        JSON.stringify(formattedData, null, 2),
      );

      // Call the mutation
      const response = await applyHealthCard(formattedData).unwrap();

      console.log("Health Card Application Response:", response);

      const payment = response.data?.payment;

      if (payment?.requires_payment) {
        // Paid flow → go to PaymentScreen with the pre-built Razorpay order
        navigation.navigate("Payment", {
          customerId: response.data.health_card.customer_id,
          healthCardId: response.data.health_card.id,
          cardType: formattedData.type as "individual" | "family",
          purpose: "new" as const,
          existingOrder: {
            razorpay_order_id: payment.razorpay_order_id,
            razorpay_key_id: payment.razorpay_key_id,
            amount: payment.amount,
            currency: "INR",
          },
        });
      } else {
        // Free flow → card is already created and active
        Alert.alert(
          "Success",
          "Your health card has been created successfully!",
          [{ text: "View Card", onPress: () => navigation.navigate("Card") }],
        );
      }
    } catch (err: any) {
      console.error("Error submitting health card application:", err);
      Alert.alert(
        "Error",
        err?.data?.message || err?.message || "Failed to submit application",
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
      <PTDynamicForm
        ref={formRef}
        sections={sections}
        initialValues={{
          card_details: {
            date_of_issue: formatToDDMMYYY(new Date()),
            date_of_expiry: formatToDDMMYYY(
              new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            ),
          },
        }}
        mode="onBlur"
        submitButtonText="Save Details"
        submitLoading={isSubmitting}
        onSubmit={handleSubmit}
        onValueChange={(fieldId, value, allValues, fieldPath) => {
          console.log(`${fieldId} changed to`, value);

          // Format Aadhaar number as XXXX XXXX XXXX (max 14 characters)
          if (
            fieldId === "aadhaar_number" &&
            typeof value === "string" &&
            fieldPath
          ) {
            const numbers = value.replace(/\D/g, "");
            if (numbers.length <= 12) {
              let formatted = "";
              for (let i = 0; i < numbers.length; i++) {
                if (i > 0 && i % 4 === 0) {
                  formatted += " ";
                }
                formatted += numbers[i];
              }
              if (formatted !== value) {
                formRef.current?.setValue(fieldPath, formatted);
              }
            }
          }

          if (fieldId === "type") {
            setCardType(value);
          }
        }}
      />
    </View>
  );
}

export default ApplyCardRequest;
