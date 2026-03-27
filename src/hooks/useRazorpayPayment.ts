import { useState, useCallback } from "react";
import RazorpayCheckout from "react-native-razorpay";
import {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
  CreateOrderPayload,
  VerifyPaymentResult,
} from "@psi/shared-api";

export interface InitiatePaymentParams {
  customerId: number;
  healthCardId?: number;
  cardType: "individual" | "family";
  purpose: "new" | "renewal";
  /** Pre-built order from the apply-card response (skips create-order call) */
  existingOrder?: {
    razorpay_order_id: string;
    razorpay_key_id: string;
    amount: number;
    currency: string;
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
          const orderPayload: CreateOrderPayload = {
            customer_id: params.customerId,
            card_type: params.cardType,
            purpose: params.purpose,
            ...(params.healthCardId !== undefined && {
              health_card_id: params.healthCardId,
            }),
          };
          const orderResponse = await createOrder(orderPayload).unwrap();
          orderData = orderResponse.data;
        }

        // Step 2 – open Razorpay checkout
        const razorpayOptions = {
          description: `MH Foundation Health Card – ${params.purpose}`,
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

        const razorpayResponse = await new Promise<{
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }>((resolve, reject) => {
          RazorpayCheckout.open(razorpayOptions).then(resolve).catch(reject);
        });

        // Step 3 – verify signature on backend (never on client)
        const verifyResponse = await verifyPayment({
          razorpay_order_id: razorpayResponse.razorpay_order_id,
          razorpay_payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_signature: razorpayResponse.razorpay_signature,
        }).unwrap();

        setPaymentResult(verifyResponse.data);
        setLoading(false);
        return { success: true, data: verifyResponse.data };
      } catch (err: unknown) {
        setLoading(false);

        // Razorpay dismiss sends code 0
        const razorpayErr = err as { code?: number; description?: string };
        if (razorpayErr?.code === 0) {
          const msg = "Payment cancelled.";
          setError(msg);
          return { success: false, error: msg, dismissed: true };
        }

        // RTK Query / network errors
        const apiErr = err as { data?: { message?: string }; message?: string };
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
