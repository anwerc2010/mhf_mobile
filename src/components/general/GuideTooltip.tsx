import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useCopilot } from "react-native-copilot";

interface GuideTooltipProps {
  labels: {
    skip?: string;
    previous?: string;
    next?: string;
    finish?: string;
  };
}

/**
 * Custom tooltip for the guided walkthrough.
 * Forces LTR button layout to prevent RTL languages from swapping Next/Previous.
 */
const GuideTooltip: React.FC<GuideTooltipProps> = ({ labels }) => {
  const {
    goToNth,
    stop,
    currentStep,
    isFirstStep,
    isLastStep,
    currentStepNumber,
    totalStepsNumber,
  } = useCopilot();

  const handleNext = () => {
    if (isLastStep) {
      void stop();
      return;
    }

    const nextStepNumber = Math.min(currentStepNumber + 1, totalStepsNumber);
    void goToNth(nextStepNumber);
  };

  const handlePrev = () => {
    if (isFirstStep) {
      return;
    }

    const previousStepNumber = Math.max(currentStepNumber - 1, 1);
    void goToNth(previousStepNumber);
  };

  const handleStop = () => {
    void stop();
  };

  return (
    <View>
      <View style={styles.tooltipContainer}>
        <Text style={styles.tooltipText}>{currentStep?.text}</Text>
      </View>
      {/* Force LTR so buttons don't swap in RTL languages */}
      <View style={styles.buttonRow}>
        {!isLastStep && (
          <TouchableOpacity onPress={handleStop} style={styles.button}>
            <Text style={styles.skipText}>{labels.skip || "Skip"}</Text>
          </TouchableOpacity>
        )}

        {!isFirstStep && (
          <TouchableOpacity onPress={handlePrev} style={styles.button}>
            <Text style={styles.buttonText}>
              {labels.previous || "Previous"}
            </Text>
          </TouchableOpacity>
        )}

        {!isLastStep ? (
          <TouchableOpacity
            onPress={handleNext}
            style={[styles.button, styles.nextButton]}
          >
            <Text style={styles.nextButtonText}>{labels.next || "Next"}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleStop}
            style={[styles.button, styles.finishButton]}
          >
            <Text style={styles.finishButtonText}>
              {labels.finish || "Finish"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tooltipContainer: {
    paddingVertical: 4,
  },
  tooltipText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 12,
    gap: 8,
    // Force LTR direction so buttons never swap in RTL mode
    writingDirection: "ltr",
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  skipText: {
    color: "#9CA3AF",
    fontSize: 13,
    fontWeight: "500",
  },
  buttonText: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "600",
  },
  nextButton: {
    backgroundColor: "#1E3A8A",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  finishButton: {
    backgroundColor: "#16A34A",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  finishButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
});

export default GuideTooltip;
