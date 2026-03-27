import React, { useRef, useState } from "react";
import { View, Alert } from "react-native";
import PTDynamicForm, {
  PTDynamicFormRef,
  FormSection,
} from "../../../components/general/DynamicForm/DynamicForm";
import { useNavigation, useRoute } from "@react-navigation/native";
import { PTText } from "../../../components/comman";
import {
  TrainingProgram,
  useLocationDropdowns,
  useRegisterEducationMutation,
} from "@psi/shared-api";

function RegisterForTraining() {
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
        { id: "Computer", name: "Computer" },
        { id: "Tailoring", name: "Tailoring" },
        { id: "SpokenEnglish", name: "Spoken English" },
        { id: "HandmadeDesigning", name: "Handmade Designing" },
        { id: "Other", name: "Others (please specify)" },
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
      title: "Personal Details",
      id: "personalDetails",
      type: "object",
      fields: [
        {
          id: "full_name",
          label: "Full Name",
          type: "text",
          placeholder: "Enter your full name",
          validations: [{ name: "required", value: true }],
          path: "personal.full_name",
        },
        {
          id: "date_of_birth",
          label: "Date of Birth",
          type: "date",
          validations: [{ name: "required", value: true }],
          path: "personal.date_of_birth",
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
          id: "contact_number",
          label: "Contact Number (Phone / WhatsApp)",
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
          path: "personal.contact_number",
        },
        {
          id: "parent_guardian_contact",
          label: "Parent's / Guardian's Contact Number",
          type: "tel",
          placeholder: "+91-XXXXXXXXXX",
          validations: [
            { name: "required", value: true },
            { name: "pattern", value: /^[0-9]{10}$/ },
          ],
          path: "personal.parent_guardian_contact",
        },
        {
          id: "marital_status",
          label: "Marital Status",
          type: "select",
          options: [
            { id: "Single", name: "Single" },
            { id: "Married", name: "Married" },
            { id: "Other", name: "Other" },
          ],
          path: "personal.marital_status",
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
          id: "address",
          label: "Address (With Pin Code)",
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
          id: "guardian_name",
          label: "Guardian's Name (If any)",
          type: "text",
          path: "personal.guardian_name",
        },
        {
          id: "id_proof_type",
          label: "ID Proof (Aadhar / Other)",
          type: "text",
          placeholder: "Aadhar number or other ID proof number",
          validations: [{ name: "required", value: true }],
          path: "personal.id_proof_type",
        },
        {
          id: "id_proof_number",
          label: "Identification Number",
          type: "text",
          path: "personal.id_proof_number",
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
    {
      title: "Educational Background",
      id: "educationDetails",
      type: "object",
      fields: [
        {
          id: "highest_qualification",
          label: "Highest Qualification",
          type: "radio",
          values: [
            { id: "10th", name: "10th" },
            { id: "12th", name: "12th" },
            { id: "Graduation", name: "Graduation" },
            { id: "Other", name: "Other" },
          ],
          validations: [{ name: "required", value: true }],
          path: "education.highest_qualification",
        },
        {
          id: "medium_of_instruction",
          label: "Medium of Instruction",
          type: "radio",
          values: [
            { id: "Hindi", name: "Hindi" },
            { id: "English", name: "English" },
            { id: "Other", name: "Other" },
          ],
          validations: [{ name: "required", value: true }],
          path: "education.medium_of_instruction",
        },
        {
          id: "school_college_name",
          label: "School / College Name",
          type: "text",
          validations: [{ name: "required", value: true }],
          path: "education.school_college_name",
        },
        {
          id: "school_college_location",
          label: "Location",
          type: "text",
          validations: [{ name: "required", value: true }],
          path: "education.school_college_location",
        },
        {
          id: "education_gap_reason",
          label: "Gaps in Education / Dropout Reason",
          type: "textarea",
          placeholder: "If any gaps or dropout, please mention the reason",
          path: "education.education_gap_reason",
        },
      ],
    },
    {
      title: "Course Selection",
      id: "courses",
      type: "object",
      fields: [
        {
          id: "preferredCourses",
          label: "Please tick your preferred training",
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
      <PTText
        style={{
          fontSize: 16,
          padding: 8,
          fontWeight: "400",
          marginBottom: 12,
        }}
      >
        Registration Form
      </PTText>
      <PTDynamicForm
        ref={formRef}
        sections={sections}
        initialValues={{}}
        mode="onBlur"
        submitButtonText="Save Details"
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

            Alert.alert("Success", "Registration submitted successfully!", [
              {
                text: "OK",
                onPress: () => navigation.goBack(),
              },
            ]);
          } catch (error: any) {
            console.error("Registration failed:", error);
            console.log("Error details:", JSON.stringify(error, null, 2));

            Alert.alert(
              "Error",
              error?.data?.message ||
                "Failed to submit registration. Please try again.",
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

export default RegisterForTraining;
