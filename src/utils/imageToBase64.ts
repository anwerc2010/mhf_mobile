import { CARD_IMAGE_BASE64 } from './cardImageData';
import { LOGO_IMAGE_BASE64 } from './logoImageData';

/**
 * Get card image as base64 string (embedded in app bundle)
 */
export const getCardImageBase64 = async (): Promise<string> => {
  try {
    console.log('Successfully loaded card image as base64, size:', CARD_IMAGE_BASE64.length, 'chars');
    return CARD_IMAGE_BASE64;
  } catch (error) {
    console.warn('Error reading card image:', error);
    return '';
  }
};

export const getLogoImageBase64 = async (): Promise<string> => {
  try {
    return LOGO_IMAGE_BASE64;
  } catch (error) {
    console.warn('Error reading logo image:', error);
    return '';
  }
};

/**
 * Get card image base64 with fallback to gradient
 */
export const getCardImageBase64FromRequire = async (): Promise<string> => {
  try {
    const base64 = await getCardImageBase64();
    
    if (base64) {
      console.log('Card background image will be used');
      return base64;
    }
    
    console.log('Card background image not available, will use gradient fallback');
    return '';
  } catch (error) {
    console.warn('Error getting card image:', error);
    return '';
  }
};
