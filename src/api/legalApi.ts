import { baseApi } from "@psi/shared-api";

export interface TermsVersionResponse {
  version: string;
  updatedAt?: string;
}

export interface AcceptTermsRequest {
  version: string;
}

export interface AcceptTermsResponse {
  success: boolean;
  message: string;
}

/**
 * Legal API — injected into the shared baseApi so that
 * the auth token is automatically attached via prepareHeaders.
 */
export const legalApi = (baseApi as any).injectEndpoints({
  endpoints: (builder: any) => ({
    getTermsVersion: builder.query({
      query: () => "/customer/legal/version",
    }),
    acceptTerms: builder.mutation({
      query: (body: AcceptTermsRequest) => ({
        url: "/customer/legal/accept",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTermsVersionQuery,
  useLazyGetTermsVersionQuery,
  useAcceptTermsMutation,
} = legalApi;
