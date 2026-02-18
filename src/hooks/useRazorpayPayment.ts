import { useState, useCallback } from 'react';
import RazorpayCheckout, { RazorpayCheckoutResponse } from 'react-native-razorpay';

export interface PaymentConfig {
  amount: number;
  typeOfPayment: 'donation' | 'relief' | 'medical' | 'emergency';
  email?: string;
  contact?: string;
  name?: string;
}

export interface PaymentResult {
  success: boolean;
  data?: RazorpayCheckoutResponse;
  error?: string;
}

interface UseRazorpayPaymentReturn {
  loading: boolean;
  error: string | null;
  startPayment: (config: PaymentConfig) => Promise<PaymentResult>;
}

export const useRazorpayPayment = (): UseRazorpayPaymentReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startPayment = useCallback(
    async (config: PaymentConfig): Promise<PaymentResult> => {
      setLoading(true);
      setError(null);

      try {
        const { amount, typeOfPayment, email = 'test@email.com', contact = '9999999999', name = 'Donor' } = config;

        // Convert amount to paise (Razorpay expects amount in smallest currency unit)
        const amountInPaise = Math.round(amount * 100);

        const options = {
          description: `Payment for ${typeOfPayment}`,
          image: 'https://yourlogo.com/logo.png',
          currency: 'INR',
          key: 'YOUR_KEY_ID', // Replace with your actual Razorpay Key ID
          amount: amountInPaise,
          name: 'Relief Organization',
          order_id: `${typeOfPayment}_${Date.now()}`,
          prefill: {
            email,
            contact,
            name,
          },
          theme: { color: '#0EA5A4' },
          notes: {
            paymentType: typeOfPayment,
            timestamp: new Date().toISOString(),
          },
        };

        const result = await new Promise<PaymentResult>((resolve) => {
          RazorpayCheckout.open(options)
            .then((data: RazorpayCheckoutResponse) => {
              console.log('Payment Success:', data);
              setLoading(false);
              resolve({
                success: true,
                data,
              });
            })
            .catch((err: any) => {
              const errorMessage = err?.message || 'Payment failed';
              console.log('Payment Failed:', errorMessage);
              setError(errorMessage);
              setLoading(false);
              resolve({
                success: false,
                error: errorMessage,
              });
            });
        });

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMessage);
        setLoading(false);
        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    []
  );

  return {
    loading,
    error,
    startPayment,
  };
};
