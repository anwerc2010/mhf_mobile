import React from "react";
import { View, ViewStyle } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { CopilotStep, walkthroughable } from "react-native-copilot";
import type { GuideStep } from "../../config/guideConfig";

const WalkthroughableView = walkthroughable(View);

interface GuideWrapperProps {
  /** Guide step config from guideConfig.ts */
  step: GuideStep | undefined;
  /** Child elements to wrap */
  children: React.ReactNode;
  /** Optional style override for the wrapper */
  style?: ViewStyle;
  /** Border radius for the spotlight highlight (default: 24 for pill/button shape) */
  borderRadius?: number;
}

/**
 * Reusable wrapper that connects any UI element with a CopilotStep.
 * If no step is provided, renders children directly without wrapping.
 * The spotlight highlight wraps tightly around the button with a pill/circular shape.
 */
export const GuideWrapper: React.FC<GuideWrapperProps> = ({
  step,
  children,
  style,
  borderRadius = 24,
}) => {
  const isFocused = useIsFocused();

  if (!step) {
    return <>{children}</>;
  }

  return (
    <CopilotStep
      text={step.text}
      order={step.order}
      name={step.id}
      active={isFocused}
    >
      <WalkthroughableView style={[{ borderRadius }, style]}>
        {children}
      </WalkthroughableView>
    </CopilotStep>
  );
};
