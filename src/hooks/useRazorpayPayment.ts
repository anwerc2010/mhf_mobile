import { useState, useCallback } from "react";
import RazorpayCheckout from "react-native-razorpay";
import {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
  CreateOrderPayload,
  VerifyPaymentResult,
} from "@psi/shared-api";

export interface InitiatePaymentParams {
  customerId?: number | string;
  healthCardId?: number;
  cardType?: "individual" | "family";
  purpose?: "new" | "renewal";
  /** Pre-built order from the apply-card response (skips create-order call) */
  existingOrder?: {
    razorpay_order_id: string;
    razorpay_key_id: string;
    amount: number;
    currency: string;
  };
  campaignPayment?: {
    module: "education" | "events" | "relief";
    moduleId?: number | string;
    moduleTitle: string;
    actionLabel: "donation" | "sponsorship";
    amount: number;
    currency?: string;
    donorMessage?: string;
  };
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
}

export interface RazorpayPaymentResult {
  success: true;
  data: VerifyPaymentResult;
}

export interface RazorpayPaymentError {
  success: false;
  error: string;
  /** Set when user dismissed the Razorpay sheet without paying */
  dismissed?: boolean;
}

export type PaymentOutcome = RazorpayPaymentResult | RazorpayPaymentError;

interface UseRazorpayPaymentReturn {
  loading: boolean;
  error: string | null;
  paymentResult: VerifyPaymentResult | null;
  initiatePayment: (params: InitiatePaymentParams) => Promise<PaymentOutcome>;
}

export const useRazorpayPayment = (): UseRazorpayPaymentReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentResult, setPaymentResult] =
    useState<VerifyPaymentResult | null>(null);

  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  const initiatePayment = useCallback(
    async (params: InitiatePaymentParams): Promise<PaymentOutcome> => {
      setLoading(true);
      setError(null);

      try {
        // Step 1 – get / reuse order from backend
        let orderData: {
          razorpay_order_id: string;
          razorpay_key_id: string;
          amount: number;
          currency: string;
        };

        if (params.existingOrder) {
          orderData = params.existingOrder;
        } else {
          const backendModule = params.campaignPayment
            ? params.campaignPayment.module === "relief"
              ? "relief_welfare"
              : params.campaignPayment.module
            : undefined;

          const orderPayload: CreateOrderPayload = params.campaignPayment
            ? {
                amount: params.campaignPayment.amount,
                payment_type: params.campaignPayment.actionLabel,
                module: backendModule,
                module_id: params.campaignPayment.moduleId,
                ...(params.campaignPayment.currency && {
                  currency: params.campaignPayment.currency,
                }),
                ...(params.campaignPayment.donorMessage && {
                  donor_message: params.campaignPayment.donorMessage,
                }),
              }
            : {
                customer_id: params.customerId,
                card_type: params.cardType,
                purpose: params.purpose,
                ...(params.healthCardId !== undefined && {
                  health_card_id: params.healthCardId,
                }),
              };

          if (params.campaignPayment) {
            console.log("[Payment] Campaign module mapping:", {
              uiModule: params.campaignPayment.module,
              backendModule,
              moduleId: params.campaignPayment.moduleId,
            });
          }

          console.log("[Payment] Create order payload:", orderPayload);

          const orderResponse = await createOrder(orderPayload).unwrap();
          console.log("[Payment] Create order response:", orderResponse);
          orderData = orderResponse.data;
        }

        // Step 2 – open Razorpay checkout
        const razorpayOptions = {
          description: params.campaignPayment
            ? `MH Foundation ${params.campaignPayment.actionLabel} – ${params.campaignPayment.moduleTitle}`
            : `MH Foundation Health Card – ${params.purpose}`,
          currency: orderData.currency,
          key: orderData.razorpay_key_id,
          amount: orderData.amount, // already in paise from backend
          name: "MH Foundation",
          order_id: orderData.razorpay_order_id,
          prefill: {
            name: params.prefill?.name ?? "",
            email: params.prefill?.email ?? "",
            contact: params.prefill?.contact ?? "",
          },
          theme: { color: "#1E3A8A" },
        };

        console.log("[Payment] Razorpay options:", razorpayOptions);

        const razorpayResponse = await new Promise<{
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }>((resolve, reject) => {
          RazorpayCheckout.open(razorpayOptions).then(resolve).catch(reject);
        });

        console.log("[Payment] Razorpay success response:", razorpayResponse);

        // Step 3 – verify signature on backend (never on client)
        const verifyResponse = await verifyPayment({
          razorpay_order_id: razorpayResponse.razorpay_order_id,
          razorpay_payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_signature: razorpayResponse.razorpay_signature,
        }).unwrap();

        console.log("[Payment] Verify payment response:", verifyResponse);

        setPaymentResult(verifyResponse.data);
        setLoading(false);
        return { success: true, data: verifyResponse.data };
      } catch (err: unknown) {
        setLoading(false);
        console.log("[Payment] Payment error object:", err);

        // Razorpay dismiss sends code 0
        const razorpayErr = err as { code?: number; description?: string };
        if (razorpayErr?.code === 0) {
          const msg = "Payment cancelled.";
          console.log("[Payment] Razorpay dismissed:", razorpayErr);
          setError(msg);
          return { success: false, error: msg, dismissed: true };
        }

        // RTK Query / network errors
        const apiErr = err as { data?: { message?: string }; message?: string };
        console.log("[Payment] API/network error parsed:", apiErr);
        const msg =
          apiErr?.data?.message ??
          apiErr?.message ??
          "Payment failed. Please try again.";
        setError(msg);
        return { success: false, error: msg };
      }
    },
    [createOrder, verifyPayment],
  );

  return { loading, error, paymentResult, initiatePayment };
};
