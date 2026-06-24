import React, { useRef, useState } from "react";
import { View, Alert } from "react-native";
import PTDynamicForm, {
  PTDynamicFormRef,
  FormSection,
} from "../../../components/general/DynamicForm/DynamicForm";
import { useNavigation, useRoute } from "@react-navigation/native";

import {
  TrainingProgram,
  useLocationDropdowns,
  useRegisterEducationMutation,
} from "@psi/shared-api";
import { useTranslation } from "react-i18next";

function RegisterForTraining() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const formRef = useRef<PTDynamicFormRef>(null);

  const [registerEducation, { isLoading: isSubmitting }] =
    useRegisterEducationMutation();
  const program: TrainingProgram | null = route.params?.program || null;

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

  // Generate course options from program topics
  const getCourseOptions = () => {
    if (!program?.topics_covered) {
      return [
        { id: "Computer", name: t("forms.training.course.computer") },
        { id: "Tailoring", name: t("forms.training.course.tailoring") },
        {
          id: "SpokenEnglish",
          name: t("forms.training.course.spokenEnglish"),
        },
        {
          id: "HandmadeDesigning",
          name: t("forms.training.course.handmadeDesigning"),
        },
        { id: "Other", name: t("forms.training.course.other") },
      ];
    }

    // Parse topics_covered - it can be comma-separated string or array
    const topics =
      typeof program.topics_covered === "string"
        ? program.topics_covered.split(",").map((t) => t.trim())
        : Array.isArray(program.topics_covered)
        ? program.topics_covered
        : [];

    return topics.map((topic) => ({
      id: topic,
      name: topic,
    }));
  };

  const sections: FormSection[] = [
    {
      title: t("forms.training.sections.personalDetails"),
      id: "personalDetails",
      type: "object",
      fields: [
        {
          id: "full_name",
          label: t("forms.training.fields.fullName"),
          type: "text",
          placeholder: t("forms.training.placeholders.fullName"),
          validations: [{ name: "required", value: true }],
          path: "personal.full_name",
        },
        {
          id: "date_of_birth",
          label: t("forms.training.fields.dateOfBirth"),
          type: "date",
          validations: [{ name: "required", value: true }],
          path: "personal.date_of_birth",
        },
        {
          id: "age",
          label: t("forms.training.fields.age"),
          type: "number",
          validations: [{ name: "required", value: true }],
          path: "personal.age",
        },
        {
          id: "gender",
          label: t("forms.training.fields.gender"),
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
          id: "contact_number",
          label: t("forms.training.fields.contactNumber"),
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
          path: "personal.contact_number",
        },
        {
          id: "parent_guardian_contact",
          label: t("forms.training.fields.parentGuardianContact"),
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
          path: "personal.parent_guardian_contact",
        },
        {
          id: "marital_status",
          label: t("forms.training.fields.maritalStatus"),
          type: "select",
          options: [
            { id: "Single", name: t("forms.common.options.single") },
            { id: "Married", name: t("forms.common.options.married") },
            { id: "Other", name: t("forms.common.options.other") },
          ],
          path: "personal.marital_status",
        },
        {
          id: "email",
          label: t("forms.training.fields.emailAvailable"),
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
          id: "address",
          label: t("forms.training.fields.addressWithPincode"),
          type: "textarea",
          placeholder: t("forms.training.placeholders.addressWithPincode"),
          validations: [{ name: "required", value: true }],
          path: "personal.address",
        },
        {
          id: "pincode",
          label: t("forms.training.fields.pincode"),
          type: "text",
          placeholder: t("forms.training.placeholders.pincode"),
          validations: [{ name: "required", value: true }],
          path: "personal.pincode",
        },
        {
          id: "guardian_name",
          label: t("forms.training.fields.guardianName"),
          type: "text",
          path: "personal.guardian_name",
        },
        {
          id: "id_proof_type",
          label: t("forms.training.fields.idProofType"),
          type: "text",
          placeholder: t("forms.training.placeholders.idProofType"),
          validations: [{ name: "required", value: true }],
          path: "personal.id_proof_type",
        },
        {
          id: "id_proof_number",
          label: t("forms.training.fields.identificationNumber"),
          type: "text",
          path: "personal.id_proof_number",
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
    {
      title: t("forms.training.sections.educationalBackground"),
      id: "educationDetails",
      type: "object",
      fields: [
        {
          id: "highest_qualification",
          label: t("forms.training.fields.highestQualification"),
          type: "radio",
          values: [
            { id: "10th", name: "10th" },
            { id: "12th", name: "12th" },
            {
              id: "Graduation",
              name: t("forms.training.options.graduation"),
            },
            { id: "Other", name: t("forms.common.options.other") },
          ],
          validations: [{ name: "required", value: true }],
          path: "education.highest_qualification",
        },
        {
          id: "medium_of_instruction",
          label: t("forms.training.fields.mediumOfInstruction"),
          type: "radio",
          values: [
            { id: "Hindi", name: t("forms.training.options.hindi") },
            { id: "English", name: t("forms.training.options.english") },
            { id: "Other", name: t("forms.common.options.other") },
          ],
          validations: [{ name: "required", value: true }],
          path: "education.medium_of_instruction",
        },
        {
          id: "school_college_name",
          label: t("forms.training.fields.schoolCollegeName"),
          type: "text",
          validations: [{ name: "required", value: true }],
          path: "education.school_college_name",
        },
        {
          id: "school_college_location",
          label: t("forms.training.fields.schoolCollegeLocation"),
          type: "text",
          validations: [{ name: "required", value: true }],
          path: "education.school_college_location",
        },
        {
          id: "education_gap_reason",
          label: t("forms.training.fields.educationGapReason"),
          type: "textarea",
          placeholder: t("forms.training.placeholders.educationGapReason"),
          path: "education.education_gap_reason",
        },
      ],
    },
    {
      title: t("forms.training.sections.courseSelection"),
      id: "courses",
      type: "object",
      fields: [
        {
          id: "preferredCourses",
          label: t("forms.training.fields.preferredCourses"),
          type: "multiselect",
          options: getCourseOptions(),
          validations: [{ name: "required", value: true }],
          path: "course.courses",
        },
      ],
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
<PTDynamicForm
        ref={formRef}
        sections={sections}
        initialValues={{}}
        mode="onBlur"
        submitButtonText={t("forms.common.saveDetails")}
        submitLoading={isSubmitting}
        onSubmit={async (values) => {
          console.log("Form submitted:", values);
          console.log("Registered for program:", program?.program_name);

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
            mandals.find((m: { id: number; name: string }) => m.id === mandalId)
              ?.name || "";

          const payload = {
            training_program_id: program?.id || 0,
            full_name: values.personal?.full_name || "",
            date_of_birth: values.personal?.date_of_birth
              ? values.personal.date_of_birth.split("T")[0]
              : "",
            age: values.personal?.age || 0,
            gender: values.personal?.gender || "",
            contact_number: values.personal?.contact_number || "",
            parent_guardian_contact:
              values.personal?.parent_guardian_contact || "",
            marital_status: values.personal?.marital_status || "",
            email: values.personal?.email || "",
            address: values.personal?.address || "",
            state_id: stateId,
            district_id: districtId,
            block_id: blockId,
            mandal_id: mandalId,
            state: stateName,
            district: districtName,
            city: blockName,
            mandal: mandalName,
            pincode: values.personal?.pincode || "",
            guardian_name: values.personal?.guardian_name || "",
            id_proof_type: values.personal?.id_proof_type || "",
            id_proof_number: values.personal?.id_proof_number || "",
            highest_qualification:
              values.education?.highest_qualification || "",
            medium_of_instruction:
              values.education?.medium_of_instruction || "",
            school_college_name: values.education?.school_college_name || "",
            school_college_location:
              values.education?.school_college_location || "",
            education_gap_reason: values.education?.education_gap_reason || "",
            courses: Array.isArray(values.course?.courses)
              ? values.course.courses
              : [],
            other_qualification: values.education?.other_qualification || "",
            other_medium: values.education?.other_medium || "",
            other_course: values.course?.other_course || "",
          };

          console.log(
            "Payload for registration:",
            JSON.stringify(payload, null, 2),
          );

          try {
            const response = await registerEducation(payload).unwrap();
            console.log("Registration successful:", response);

            Alert.alert(
              t("common.success"),
              t("forms.training.alerts.submitSuccess"),
              [
                {
                  text: t("forms.common.ok"),
                  onPress: () => navigation.goBack(),
                },
              ],
            );
          } catch (error: any) {
            console.error("Registration failed:", error);
            console.log("Error details:", JSON.stringify(error, null, 2));

            Alert.alert(
              t("common.error"),
              error?.data?.message || t("forms.training.alerts.submitFailed"),
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

export default RegisterForTraining;
