/**
 * Centralized Guide Configuration
 *
 * Each screen defines its walkthrough steps with:
 * - id: unique identifier for the step
 * - text: tooltip text shown to the user
 * - order: display order of the step in the walkthrough
 * - target: key used to match the GuideWrapper in the screen
 *
 * To add a new screen guide, add a new key with its steps array.
 * To update guide text after an app update, bump GUIDE_VERSION.
 */

export const GUIDE_VERSION = "v1";

export interface GuideStep {
  id: string;
  text: string;
  order: number;
  target: string;
}

export interface GuideConfig {
  [screenName: string]: GuideStep[];
}

export const GUIDE_CONFIG: GuideConfig = {
  HomeScreen: [
    {
      id: "home_apply_card",
      text: "Tap here to apply for your Family Health Card. Get access to healthcare benefits for you and your family.",
      order: 1,
      target: "applyForCardBtn",
    },
    {
      id: "home_education",
      text: "Explore free education & training programs available for community members.",
      order: 2,
      target: "educationAction",
    },
    {
      id: "home_relief",
      text: "Apply for relief & welfare programs. Get support during emergencies.",
      order: 3,
      target: "reliefAction",
    },
    {
      id: "home_events",
      text: "View upcoming community events and register to participate.",
      order: 4,
      target: "eventsAction",
    },
  ],

  ServicesScreen: [
    {
      id: "services_providers",
      text: "Browse empaneled healthcare providers. Tap on any provider to view details and contact them.",
      order: 1,
      target: "providersTab",
    },
    {
      id: "services_blood",
      text: "Request blood from our donor network. Track your blood request status here.",
      order: 2,
      target: "bloodTab",
    },
    {
      id: "services_equipment",
      text: "Apply for medical equipment support for home care needs.",
      order: 3,
      target: "equipmentTab",
    },
    {
      id: "services_ambulance",
      text: "Call emergency ambulance services available 24/7 in your area.",
      order: 4,
      target: "ambulanceTab",
    },
    {
      id: "services_provider_filter",
      text: "Tap here to filter providers by State, District, Block and Mandal. Find providers closest to your location.",
      order: 5,
      target: "providerFilterBtn",
    },
  ],

  BloodRequestScreen: [
    {
      id: "blood_submit",
      text: "Fill the form and tap Submit to request blood. Our team will process your request immediately.",
      order: 1,
      target: "bloodSubmitBtn",
    },
  ],

  AmbulanceScreen: [
    {
      id: "ambulance_call",
      text: "In case of emergency, tap the call button to reach the nearest available ambulance service instantly.",
      order: 1,
      target: "ambulanceCallBtn",
    },
  ],

  EquipmentScreen: [
    {
      id: "equipment_apply",
      text: "Apply for medical equipment support. Fill in your details and equipment requirements.",
      order: 1,
      target: "equipmentRequestForm",
    },
    {
      id: "equipment_view",
      text: "View all your submitted equipment requests and track their status.",
      order: 2,
      target: "equipmentViewRequests",
    },
  ],

  ReliefScreen: [
    {
      id: "relief_apply",
      text: "Tap here to apply for relief & welfare programs. Check eligibility and submit your application.",
      order: 1,
      target: "reliefApplyBtn",
    },
    {
      id: "relief_donate",
      text: "Donate to support relief programs and help families in need.",
      order: 2,
      target: "reliefDonateBtn",
    },
  ],

  EventsScreen: [
    {
      id: "events_register",
      text: "Register now to participate in this community event and reserve your spot.",
      order: 1,
      target: "eventsRegisterBtn",
    },
    {
      id: "events_sponsor",
      text: "Sponsor this event and support community activities.",
      order: 2,
      target: "eventsSponsorBtn",
    },
  ],

  EducationScreen: [
    {
      id: "education_register",
      text: "Enroll in this training program. Gain new skills and earn certificates.",
      order: 1,
      target: "educationRegisterBtn",
    },
    {
      id: "education_sponsor",
      text: "Sponsor this program to help others access quality education.",
      order: 2,
      target: "educationSponsorBtn",
    },
  ],
};

/**
 * Helper to get steps for a specific screen
 */
export const getGuideSteps = (screenName: string): GuideStep[] => {
  return GUIDE_CONFIG[screenName] ?? [];
};

/**
 * Helper to find a specific step by target name
 */
export const findGuideStep = (
  screenName: string,
  target: string,
): GuideStep | undefined => {
  return GUIDE_CONFIG[screenName]?.find((step) => step.target === target);
};
