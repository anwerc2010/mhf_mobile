import React from "react";
import { View, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import PTDynamicForm, {
  PTDynamicFormRef,
  FormSection,
} from "../../components/general/DynamicForm/DynamicForm";
import { useRef } from "react";
import { PTText } from "../../components/comman";
import { useCreateVolunteerRegistrationMutation } from "@psi/shared-api";
import { useTranslation } from "react-i18next";

export default function VolunteersScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const formRef = useRef<PTDynamicFormRef>(null);
  const [createVolunteerRegistration, { isLoading }] =
    useCreateVolunteerRegistrationMutation();

  const handleSubmit = async (values: Record<string, any>) => {
    const declarationAccepted =
      values?.declaration?.declaration === "accepted" ||
      values?.declaration?.declaration === true ||
      values?.declaration === "accepted" ||
      values?.declaration === true;

    try {
      const formattedData = {
        full_name: values.full_name,
        date_of_birth: values.date_of_birth?.split("T")[0],
        gender: values.gender,
        phone_number: values.phone_number,
        alternate_contact: values.alternate_contact,
        email: values.email,
        address: values.address,
        qualification: values.qualification,
        employment_status: values.employment_status,
        occupation: values.occupation,
        volunteer_area: values.volunteer_area,
        availability: values.availability,
        previous_volunteering: values.previous_volunteering,
        motivation: values.motivation,
        declaration: declarationAccepted,
      };

      console.log(
        "Volunteer registration values:",
        JSON.stringify(formattedData, null, 2),
      );

      // Call the mutation
      const response = await createVolunteerRegistration(
        formattedData,
      ).unwrap();

      console.log("Volunteer Registration Response:", response);

      Alert.alert(
        t("common.success"),
        t(
          "volunteers.submitSuccess",
          "Volunteer registration submitted successfully",
        ),
        [{ text: "OK", onPress: () => navigation.goBack() }],
      );
    } catch (err: any) {
      console.error("Error submitting volunteer registration:", err);
      Alert.alert(
        t("common.error"),
        err?.data?.message ||
          err?.message ||
          t("volunteers.submitError", "Failed to submit registration"),
      );
    }
  };

  const sections: FormSection[] = [
    /* =======================
           1. Personal Details
        ======================== */
    {
      title: t("forms.volunteers.sections.personalDetails"),
      id: "personalDetails",
      type: "object",
      fields: [
        {
          id: "full_name",
          label: t("forms.volunteers.fields.fullName"),
          type: "text",
          validations: [{ name: "required", value: true }],
          path: "full_name",
        },
        {
          id: "date_of_birth",
          label: t("forms.volunteers.fields.dateOfBirth"),
          type: "date",
          validations: [{ name: "required", value: true }],
          path: "date_of_birth",
        },
        {
          id: "gender",
          label: t("forms.volunteers.fields.gender"),
          type: "radio",
          values: [
            { id: "male", name: t("forms.common.options.male") },
            { id: "female", name: t("forms.common.options.female") },
            { id: "other", name: t("forms.common.options.other") },
          ],
          validations: [{ name: "required", value: true }],
          path: "gender",
        },
        {
          id: "phone_number",
          label: t("forms.volunteers.fields.phoneNumber"),
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
          path: "phone_number",
        },
        {
          id: "alternate_contact",
          label: t("forms.volunteers.fields.alternateContact"),
          type: "tel",
          placeholder: "+91-XXXXXXXXXX",
          validations: [{ name: "pattern", value: /^[0-9]{10}$/ }],
          path: "alternate_contact",
        },
        {
          id: "email",
          label: t("forms.volunteers.fields.emailAddress"),
          type: "email",
          validations: [
            { name: "required", value: true },
            {
              name: "pattern",
              value: /^[^@]+@[^@]+\.[^@]+$/,
              message: t("forms.common.validation.invalidEmailAddress"),
            },
          ],
          path: "email",
        },
        {
          id: "address",
          label: t("forms.volunteers.fields.address"),
          type: "textarea",
          validations: [{ name: "required", value: true }],
          path: "address",
        },
      ],
    },

    /* =======================
           2. Professional Details
        ======================== */
    {
      title: t("forms.volunteers.sections.professionalDetails"),
      id: "professionalDetails",
      type: "object",
      fields: [
        {
          id: "qualification",
          label: t("forms.volunteers.fields.qualification"),
          type: "text",
          validations: [{ name: "required", value: true }],
          path: "qualification",
        },
        {
          id: "employment_status",
          label: t("forms.volunteers.fields.employmentStatus"),
          type: "radio",
          values: [
            { id: "student", name: t("forms.volunteers.options.student") },
            { id: "employee", name: t("forms.volunteers.options.employee") },
            {
              id: "self_employed",
              name: t("forms.volunteers.options.selfEmployed"),
            },
          ],
          validations: [{ name: "required", value: true }],
          path: "employment_status",
        },
        {
          id: "occupation",
          label: t("forms.volunteers.fields.occupation"),
          type: "text",
          validations: [{ name: "required", value: true }],
          path: "occupation",
        },
      ],
    },

    /* =======================
           3. Volunteering Preferences
        ======================== */
    {
      title: t("forms.volunteers.sections.volunteeringPreferences"),
      id: "volunteeringPreferences",
      type: "object",
      fields: [
        {
          id: "volunteer_area",
          label: t("forms.volunteers.fields.volunteerArea"),
          type: "select",
          options: [
            {
              id: "health_camp",
              name: t("forms.volunteers.options.healthCamps"),
            },
            {
              id: "awareness_drives",
              name: t("forms.volunteers.options.awarenessDrives"),
            },
            {
              id: "data_entry",
              name: t("forms.volunteers.options.dataEntry"),
            },
            {
              id: "social_media",
              name: t("forms.volunteers.options.socialMedia"),
            },
            {
              id: "fundraising",
              name: t("forms.volunteers.options.fundraising"),
            },
            {
              id: "community_outreach",
              name: t("forms.volunteers.options.communityOutreach"),
            },
            { id: "other", name: t("forms.common.options.other") },
          ],
          validations: [{ name: "required", value: true }],
          path: "volunteer_area",
        },
        {
          id: "availability",
          label: t("forms.volunteers.fields.availability"),
          type: "select",
          options: [
            { id: "weekdays", name: t("forms.volunteers.options.weekdays") },
            { id: "weekends", name: t("forms.volunteers.options.weekends") },
            { id: "flexible", name: t("forms.volunteers.options.flexible") },
          ],
          validations: [{ name: "required", value: true }],
          path: "availability",
        },
      ],
    },

    /* =======================
           4. Experience & Motivation
        ======================== */
    {
      title: t("forms.volunteers.sections.experienceAndMotivation"),
      id: "experienceMotivation",
      type: "object",
      fields: [
        {
          id: "previous_volunteering",
          label: t("forms.volunteers.fields.previousVolunteering"),
          type: "radio",
          values: [
            { id: "yes", name: t("forms.common.options.yes") },
            { id: "no", name: t("forms.common.options.no") },
          ],
          validations: [{ name: "required", value: true }],
          path: "previous_volunteering",
        },
        {
          id: "motivation",
          label: t("forms.volunteers.fields.motivation"),
          type: "textarea",
          placeholder: t("forms.volunteers.placeholders.motivation"),
          validations: [{ name: "required", value: true }],
          path: "motivation",
        },
      ],
    },

    /* =======================
           5. Declaration
        ======================== */
    {
      title: t("forms.common.sections.declaration"),
      id: "declaration",
      type: "object",
      fields: [
        {
          id: "declarationAccepted",
          label: t("forms.volunteers.fields.declaration"),
          type: "radio",
          values: [{ id: "accepted", name: t("forms.common.iAgree") }],
          validations: [{ name: "required", value: true }],
          path: "declaration.declaration",
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
        {t("forms.volunteers.heading")}
      </PTText>
      <PTDynamicForm
        ref={formRef}
        sections={sections}
        initialValues={{}}
        mode="onBlur"
        submitButtonText={t("forms.common.saveDetails")}
        submitLoading={isLoading}
        onSubmit={handleSubmit}
        onValueChange={(fieldId, value) => {
          console.log(`${fieldId} changed to`, value);
        }}
      />
    </View>
  );
}
