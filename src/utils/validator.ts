import { VALIDATION_CONFIG } from '../constants/config';

/**
 * Validation utility functions
 * Uses configuration from config.ts for all validation rules
 */

/**
 * Validates an email address
 * @param email - Email address to validate
 * @returns true if email is valid, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  return VALIDATION_CONFIG.EMAIL_REGEX.test(email.trim());
};

/**
 * Validates a password
 * @param password - Password to validate
 * @returns Object with isValid boolean and errors array
 */
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];

  if (!password || typeof password !== 'string') {
    return { isValid: false, errors: ['Password is required'] };
  }

  if (password.length < VALIDATION_CONFIG.MIN_PASSWORD_LENGTH) {
    errors.push(
      `Password must be at least ${VALIDATION_CONFIG.MIN_PASSWORD_LENGTH} characters long`
    );
  }

  if (password.length > VALIDATION_CONFIG.MAX_PASSWORD_LENGTH) {
    errors.push(
      `Password must be no more than ${VALIDATION_CONFIG.MAX_PASSWORD_LENGTH} characters long`
    );
  }

  if (VALIDATION_CONFIG.PASSWORD_REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (VALIDATION_CONFIG.PASSWORD_REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (VALIDATION_CONFIG.PASSWORD_REQUIRE_NUMBER && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (VALIDATION_CONFIG.PASSWORD_REQUIRE_SPECIAL && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates a phone number
 * @param phone - Phone number to validate
 * @returns true if phone is valid, false otherwise
 */
export const isValidPhone = (phone: string): boolean => {
  if (!phone || typeof phone !== 'string') {
    return false;
  }
  return VALIDATION_CONFIG.PHONE_REGEX.test(phone.trim());
};

/**
 * Validates a username
 * @param username - Username to validate
 * @returns Object with isValid boolean and errors array
 */
export interface UsernameValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateUsername = (username: string): UsernameValidationResult => {
  const errors: string[] = [];

  if (!username || typeof username !== 'string') {
    return { isValid: false, errors: ['Username is required'] };
  }

  const trimmedUsername = username.trim();

  if (trimmedUsername.length < VALIDATION_CONFIG.MIN_USERNAME_LENGTH) {
    errors.push(
      `Username must be at least ${VALIDATION_CONFIG.MIN_USERNAME_LENGTH} characters long`
    );
  }

  if (trimmedUsername.length > VALIDATION_CONFIG.MAX_USERNAME_LENGTH) {
    errors.push(
      `Username must be no more than ${VALIDATION_CONFIG.MAX_USERNAME_LENGTH} characters long`
    );
  }

  if (!VALIDATION_CONFIG.USERNAME_REGEX.test(trimmedUsername)) {
    errors.push('Username can only contain letters, numbers, and underscores');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates if a string is not empty
 * @param value - Value to validate
 * @returns true if value is not empty, false otherwise
 */
export const isNotEmpty = (value: string): boolean => {
  return value !== null && value !== undefined && value.trim().length > 0;
};

/**
 * Validates if passwords match
 * @param password - Original password
 * @param confirmPassword - Confirmation password
 * @returns true if passwords match, false otherwise
 */
export const doPasswordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword && password.length > 0;
};

