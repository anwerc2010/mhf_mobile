import React, { useRef, useState } from "react";
import { View, Alert } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import PTDynamicForm, {
  PTDynamicFormRef,
  FormSection,
} from "../../components/general/DynamicForm/DynamicForm";
import { PTText } from "../../components/comman";
import {
  useApplyHealthCardMutation,
  useUploadDocumentMutation,
  useLocationDropdowns,
  useGetProfessionsQuery,
  HealthCardResponseData,
} from "@psi/shared-api";
import { FileData } from "../../components/comman/PTFilePicker";
import { formatToDDMMYYY } from "../../utils/formatDate";
import { useTranslation } from "react-i18next";

type ApplyCardRouteParams = {
  ApplyCardRequest?: {
    paymentType?: "free" | "paid" | string;
    paymentStatus?: "free" | "pending" | "paid" | string;
    canApply?: boolean;
    canPay?: boolean;
  };
};

function ApplyCardRequest() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<ApplyCardRouteParams, "ApplyCardRequest">>();
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

  // Fetch profession list once on mount
  const { data: professionsResponse } = useGetProfessionsQuery();
  const professionOptions = (professionsResponse?.data ?? []).map((p) => ({
    label: p.occupation_name,
    value: p.id,
  }));

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
      title: t("forms.applyCard.sections.cardHolderDetails"),
      id: "cardHolder",
      type: "object",
      fields: [
        {
          id: "card_holder_name",
          label: t("forms.applyCard.fields.cardHolderName"),
          type: "text",
          placeholder: t("forms.applyCard.placeholders.fullName"),
          validations: [{ name: "required", value: true }],
          path: "card_holder.card_holder_name",
        },
        {
          id: "phone",
          label: t("forms.applyCard.fields.phone"),
          type: "tel",
          placeholder: t("forms.applyCard.placeholders.phone"),
          validations: [
            { name: "required", value: true },
            {
              name: "pattern",
              value: /^[0-9]{10}$/,
              message: t("forms.common.validation.phone10"),
            },
          ],
          path: "card_holder.phone",
        },
        {
          id: "email",
          label: t("forms.applyCard.fields.email"),
          type: "email",
          placeholder: t("forms.applyCard.placeholders.email"),
          validations: [
            { name: "required", value: true },
            {
              name: "pattern",
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: t("forms.common.validation.invalidEmailAddress"),
            },
          ],
          path: "card_holder.email",
        },
        {
          id: "aadhaar_number",
          label: t("forms.applyCard.fields.aadhaarNumber"),
          type: "text",
          placeholder: "1111 2222 3333",
          validations: [
            { name: "required", value: true },
            {
              name: "pattern",
              value: /^[0-9]{4} [0-9]{4} [0-9]{4}$/,
              message: t("forms.applyCard.validation.aadhaarFormat"),
            },
            {
              name: "maxLength",
              value: 14,
              message: t("forms.applyCard.validation.aadhaarMaxLength"),
            },
          ],
          path: "card_holder.aadhaar_number",
        },
        {
          id: "blood_group",
          label: t("forms.applyCard.fields.bloodGroup"),
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
          id: "address",
          label: t("forms.applyCard.fields.address"),
          type: "textarea",
          placeholder: t("forms.applyCard.placeholders.address"),
          validations: [{ name: "required", value: true }],
          path: "card_holder.address",
        },
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
          path: "card_holder.state_id",
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
          path: "card_holder.district_id",
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
          path: "card_holder.block_id",
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
          path: "card_holder.mandal_id",
          disabled: !blockId || mandalsLoading,
          onChange: (value: number) => handleMandalChange(value),
        },
        {
          id: "gender",
          label: t("forms.applyCard.fields.gender"),
          type: "radio",
          values: [
            { id: "Male", name: t("forms.common.options.male") },
            { id: "Female", name: t("forms.common.options.female") },
          ],
          validations: [{ name: "required", value: true }],
          path: "card_holder.gender",
        },
        {
          id: "age_category",
          label: t("forms.applyCard.fields.ageCategory"),
          type: "radio",
          values: [
            { id: "Child", name: t("forms.applyCard.options.child") },
            { id: "Adult", name: t("forms.applyCard.options.adult") },
          ],
          validations: [{ name: "required", value: true }],
          path: "card_holder.age_category",
        },
        {
          id: "professions",
          label: t("forms.applyCard.fields.professions", "Profession"),
          type: "autocomplete",
          placeholder: t(
            "forms.applyCard.placeholders.professions",
            "Enter your profession (optional)",
          ),
          options: professionOptions,
          validations: [],
          path: "card_holder.professions",
        },
        {
          id: "reference_name",
          label: t("forms.applyCard.fields.referenceName", "Reference Name"),
          type: "text",
          placeholder: t(
            "forms.applyCard.placeholders.referenceName",
            "Enter reference name (optional)",
          ),
          validations: [],
          path: "card_holder.reference_name",
        },
        {
          id: "family_head_image",
          label: t("forms.applyCard.fields.familyHeadImage"),
          type: "file",
          maxFiles: 1,
          acceptedTypes: ["image/png", "image/jpg", "image/jpeg"],
          validations: [{ name: "required", value: true }],
          path: "card_holder.family_head_image",
        },
        {
          id: "aadhaar_image",
          label: t("forms.applyCard.fields.aadhaarImage", "Aadhaar Image"),
          type: "file",
          maxFiles: 1,
          acceptedTypes: ["image/png", "image/jpg", "image/jpeg"],
          validations: [{ name: "required", value: true }],
          path: "card_holder.aadhaar_image",
        },
      ],
    },
    {
      title: t("forms.applyCard.sections.cardDetails"),
      id: "cardDetails",
      type: "object",
      fields: [
        {
          id: "type",
          label: t("forms.applyCard.fields.cardType"),
          type: "radio",
          values: [
            {
              id: "individual",
              name: t("forms.applyCard.options.individual"),
            },
            { id: "family", name: t("forms.applyCard.options.family") },
          ],
          validations: [{ name: "required", value: true }],
          path: "card_details.type",
        },
        {
          id: "date_of_issue",
          label: t("forms.applyCard.fields.dateOfIssue"),
          type: "text",
          disabled: true,
          path: "card_details.date_of_issue",
        },
        {
          id: "date_of_expiry",
          label: t("forms.applyCard.fields.dateOfExpiry"),
          type: "text",
          disabled: true,
          path: "card_details.date_of_expiry",
        },
      ],
    },
  ];

  if (cardType === "family") {
    sections.push({
      title: t("forms.applyCard.sections.familyMembers"),
      id: "family_members",
      type: "array",
      minItems: 0,
      maxItems: 5,
      fields: [
        {
          id: "name",
          label: t("forms.applyCard.fields.fullName"),
          type: "text",
          placeholder: t("forms.applyCard.placeholders.fullName"),
          validations: [{ name: "required", value: true }],
        },
        {
          id: "relationship",
          label: t("forms.applyCard.fields.relationship"),
          type: "select",
          options: [
            { id: "Spouse", name: t("forms.applyCard.options.spouse") },
            { id: "Son", name: t("forms.applyCard.options.son") },
            { id: "Daughter", name: t("forms.applyCard.options.daughter") },
            { id: "Father", name: t("forms.applyCard.options.father") },
            { id: "Mother", name: t("forms.applyCard.options.mother") },
            { id: "Brother", name: t("forms.applyCard.options.brother") },
            { id: "Sister", name: t("forms.applyCard.options.sister") },
          ],
          validations: [{ name: "required", value: true }],
        },
        {
          id: "aadhaar_number",
          label: t("forms.applyCard.fields.aadhaarNumber"),
          type: "text",
          placeholder: "1111 2222 3333",
          validations: [
            { name: "required", value: true },
            {
              name: "pattern",
              value: /^[0-9]{4} [0-9]{4} [0-9]{4}$/,
              message: t("forms.applyCard.validation.aadhaarFormat"),
            },
            {
              name: "maxLength",
              value: 14,
              message: t("forms.applyCard.validation.aadhaarMaxLength"),
            },
          ],
        },
        {
          id: "blood_group",
          label: t("forms.applyCard.fields.bloodGroup"),
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
          label: t("forms.applyCard.fields.dateOfBirth"),
          type: "date",
        },
        {
          id: "gender",
          label: t("forms.applyCard.fields.gender"),
          type: "radio",
          values: [
            { id: "Male", name: t("forms.common.options.male") },
            { id: "Female", name: t("forms.common.options.female") },
          ],
          validations: [{ name: "required", value: true }],
        },
        {
          id: "age_category",
          label: t("forms.applyCard.fields.ageCategory"),
          type: "radio",
          values: [
            { id: "Child", name: t("forms.applyCard.options.child") },
            { id: "Adult", name: t("forms.applyCard.options.adult") },
          ],
          validations: [{ name: "required", value: true }],
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

      const aadhaarImageInputs = normalizeDocuments(
        values.card_holder?.aadhaar_image,
      );
      const uploadedAadhaarImageUrls = await uploadDocuments(
        aadhaarImageInputs,
      );
      const uploadedAadhaarImageUrl =
        uploadedAadhaarImageUrls.length > 0 ? uploadedAadhaarImageUrls[0] : "";

      const addressImageInputs = normalizeDocuments(
        values.card_holder?.address_image,
      );
      const uploadedAddressImageUrls = await uploadDocuments(
        addressImageInputs,
      );
      const uploadedAddressImageUrl =
        uploadedAddressImageUrls.length > 0 ? uploadedAddressImageUrls[0] : "";

      const today = new Date();
      const nextYear = new Date(today);
      nextYear.setFullYear(today.getFullYear() + 1);
      nextYear.setDate(nextYear.getDate() - 1);
      const dateOfIssue = formatToDDMMYYY(today);
      const dateOfExpiry = formatToDDMMYYY(nextYear);

      const selectedPaymentType =
        route.params?.paymentType?.toString().toLowerCase() || "";
      const selectedPaymentStatus =
        route.params?.paymentStatus?.toString().toLowerCase() || "";
      const requestCanPay = Boolean(route.params?.canPay);
      const isLockedFreeRequest =
        selectedPaymentType === "free" || selectedPaymentStatus === "free";
      const resolvedMode = isLockedFreeRequest ? "free" : "online";

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
        reference_name: values.card_holder?.reference_name || null,
        professions:
          values.card_holder?.professions != null
            ? String(values.card_holder.professions)
            : null,
        family_head_image: uploadedImageUrl,
        aadhaar_image: uploadedAadhaarImageUrl,
        address_image: uploadedAddressImageUrl,
        type: values.card_details?.type,
        mode: resolvedMode as "free" | "online",
        date_of_issue: dateOfIssue,
        date_of_expiry: dateOfExpiry,
        family_members: (values.family_members || []).map((m: any) => ({
          ...m,
          gender: m.gender || "Male",
          age_category: m.age_category || "Adult",
        })),
      };

      console.log(
        "Apply card request values:",
        JSON.stringify(formattedData, null, 2),
      );

      const response = await applyHealthCard(formattedData).unwrap();

      console.log("Health Card Application Response:", response);

      const payment: any = response.data?.payment;
      const healthCard = response.data?.health_card;
      const customer = response.data?.customer;
      const responseData: HealthCardResponseData = response?.data ?? {};
      const responseCardRequest: any = responseData?.card_request ?? {};
      const normalizeLower = (value: unknown): string =>
        typeof value === "string" ? value.toLowerCase() : "";
      const resolvedPaymentType =
        responseData?.payment_type ??
        responseCardRequest?.payment_type ??
        selectedPaymentType;
      const resolvedPaymentStatus =
        responseData?.payment_status ?? responseCardRequest?.payment_status;
      const normalizedPaymentType = normalizeLower(resolvedPaymentType);
      const normalizedPaymentStatus = normalizeLower(resolvedPaymentStatus);
      const resolvedOrderId =
        payment?.razorpay_order_id ??
        payment?.order_id ??
        responseData?.active_payment_order_id;
      const resolvedKeyId =
        payment?.razorpay_key_id ?? payment?.key_id ?? payment?.razorpay_key;
      const resolvedAmount = Number(payment?.amount ?? 0);
      const resolvedCurrency = payment?.currency ?? "INR";
      const hasOrder = Boolean(
        resolvedOrderId && resolvedKeyId && resolvedAmount > 0,
      );
      const requiresPayment = Boolean(
        payment?.requires_payment ?? responseData?.requires_payment,
      );
      const canPay = Boolean(
        responseData?.can_pay ?? responseCardRequest?.can_pay ?? requestCanPay,
      );
      const cardCreated = Boolean(responseData?.card_created);
      const zohoSynced: boolean | undefined =
        typeof responseData?.zoho_synced === "boolean"
          ? responseData.zoho_synced
          : undefined;

      const isFreeFlow =
        isLockedFreeRequest ||
        normalizedPaymentType === "free" ||
        normalizedPaymentStatus === "free" ||
        normalizeLower(healthCard?.mode) === "free";

      const isPaidFlow =
        !isFreeFlow &&
        (normalizedPaymentType === "paid" ||
          requiresPayment ||
          Boolean(payment));
      const shouldOpenPayment =
        isPaidFlow &&
        (requiresPayment || normalizedPaymentStatus === "pending" || canPay) &&
        hasOrder;

      const shouldCompleteFreeFlow =
        isFreeFlow && !requiresPayment && cardCreated && Boolean(healthCard);

      if (shouldOpenPayment) {
        Alert.alert(
          t("common.success"),
          response?.message ||
            t(
              "forms.applyCard.alerts.paymentOrderCreated",
              "Payment order created. Complete payment to generate and activate the card.",
            ),
          [
            {
              text: t("forms.common.ok"),
              onPress: () =>
                navigation.navigate("Payment", {
                  customerId: healthCard?.customer_id ?? customer?.id,
                  healthCardId: healthCard?.id,
                  cardType: formattedData.type as "individual" | "family",
                  purpose: "new" as const,
                  ...(payment
                    ? {
                        existingOrder: {
                          razorpay_order_id: resolvedOrderId,
                          razorpay_key_id: resolvedKeyId,
                          amount: resolvedAmount,
                          currency: resolvedCurrency,
                        },
                      }
                    : {}),
                }),
            },
          ],
        );
      } else if (isPaidFlow) {
        Alert.alert(
          t("common.error"),
          t(
            "forms.applyCard.alerts.paymentInitFailed",
            "Payment initialization failed. Please try again from pending payments.",
          ),
        );
      } else if (shouldCompleteFreeFlow) {
        Alert.alert(
          t("common.success"),
          t("forms.applyCard.alerts.createdSuccess"),
          [
            {
              text: t("forms.applyCard.viewCard"),
              onPress: () =>
                navigation.navigate("BottomTabs", {
                  screen: "Card",
                  params: { zohoSynced },
                }),
            },
          ],
        );
      } else {
        Alert.alert(
          t("common.error"),
          response?.message || t("forms.applyCard.alerts.failed"),
        );
      }
    } catch (err: any) {
      console.error("Error submitting health card application:", err);
      Alert.alert(
        t("common.error"),
        err?.data?.message ||
          err?.message ||
          t("forms.applyCard.alerts.failed"),
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
        {t("forms.applyCard.heading")}
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
        submitButtonText={t("forms.common.saveDetails")}
        submitLoading={isSubmitting}
        onSubmit={handleSubmit}
        onValueChange={(fieldId, value, allValues, fieldPath) => {
          console.log(`${fieldId} changed to`, value);

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
