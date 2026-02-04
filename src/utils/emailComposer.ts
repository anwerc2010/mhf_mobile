import { Linking, Alert } from 'react-native';

export interface EmailOptions {
    to?: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    subject?: string;
    body?: string;
}

/**
 * Opens the native email composer with the specified options
 * @param options - Email composition options (to, cc, bcc, subject, body)
 * @returns Promise<boolean> - Returns true if successful, false otherwise
 */
export const openEmailComposer = async (options: EmailOptions): Promise<boolean> => {
    try {
        const {
            to = [],
            cc = [],
            bcc = [],
            subject = '',
            body = '',
        } = options;

        // Convert to arrays if single string
        const toArray = Array.isArray(to) ? to : [to];
        const ccArray = Array.isArray(cc) ? cc : [cc];
        const bccArray = Array.isArray(bcc) ? bcc : [bcc];

        // Build mailto URL
        const toEmails = toArray.filter(Boolean).join(',');
        const params: string[] = [];

        if (ccArray.length > 0 && ccArray[0]) {
            params.push(`cc=${encodeURIComponent(ccArray.join(','))}`);
        }

        if (bccArray.length > 0 && bccArray[0]) {
            params.push(`bcc=${encodeURIComponent(bccArray.join(','))}`);
        }

        if (subject) {
            params.push(`subject=${encodeURIComponent(subject)}`);
        }

        if (body) {
            params.push(`body=${encodeURIComponent(body)}`);
        }

        const url = `mailto:${toEmails}${params.length > 0 ? '?' + params.join('&') : ''}`;

        const canOpen = await Linking.canOpenURL(url);

        if (canOpen) {
            await Linking.openURL(url);
            return true;
        } else {
            Alert.alert('Error', 'No email app found on this device');
            return false;
        }
    } catch (error) {
        Alert.alert('Error', 'Unable to open email composer');
        return false;
    }
};
