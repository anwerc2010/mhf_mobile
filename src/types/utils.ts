// Date Format Types
export type DateFormat = 'short' | 'medium' | 'long' | 'full' | 'time' | 'date' | 'datetime';

// Password Validation Result
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

// Username Validation Result
export interface UsernameValidationResult {
  isValid: boolean;
  errors: string[];
}

