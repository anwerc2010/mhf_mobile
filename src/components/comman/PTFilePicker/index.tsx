import React, { useState } from 'react';
import { View, ViewStyle, TouchableOpacity, Alert, Platform, ActivityIndicator, NativeModules, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTheme } from '../../../hooks/useTheme';
import PTText from '../PTText';
import PTButton from '../PTButton';
import { File, FileDoc, FilePdf, FileImage, FileVideo, FileAudio, Trash, UploadSimple, X } from 'phosphor-react-native';

export interface FileData {
    uri: string;
    name: string;
    type: string;
    size?: number;
}

interface PTFilePickerProps {
    /**
     * Label for the file picker
     */
    label?: string;

    /**
     * Selected file(s)
     */
    value?: FileData | FileData[] | null;

    /**
     * Callback when file(s) are selected
     */
    onFileSelect: (files: FileData | FileData[]) => void;

    /**
     * Callback when file is removed
     */
    onFileRemove?: (file: FileData) => void;

    /**
     * Allow multiple file selection
     */
    multiple?: boolean;

    /**
     * Maximum number of files (for multiple)
     */
    maxFiles?: number;

    /**
     * Maximum file size in bytes (default: 10MB)
     */
    maxSize?: number;

    /**
     * Allowed file types (MIME types)
     * e.g., ['application/pdf', 'image/*', 'video/*']
     */
    acceptedTypes?: string[];

    /**
     * Whether field is disabled
     */
    disabled?: boolean;

    /**
     * Error message
     */
    error?: string;

    /**
     * Help text
     */
    helpText?: string;

    /**
     * Custom style
     */
    style?: ViewStyle;
}

const getFileIcon = (type: string, color: string, size: number = 24) => {
    if (type.startsWith('image/')) {
        return <FileImage size={size} color={color} weight="duotone" />;
    }
    if (type.startsWith('video/')) {
        return <FileVideo size={size} color={color} weight="duotone" />;
    }
    if (type.startsWith('audio/')) {
        return <FileAudio size={size} color={color} weight="duotone" />;
    }
    if (type === 'application/pdf') {
        return <FilePdf size={size} color={color} weight="duotone" />;
    }
    if (type.includes('document') || type.includes('word') || type.includes('text')) {
        return <FileDoc size={size} color={color} weight="duotone" />;
    }
    return <File size={size} color={color} weight="duotone" />;
};

const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function PTFilePicker({
    label,
    value,
    onFileSelect,
    onFileRemove,
    multiple = false,
    maxFiles = 5,
    maxSize = 10 * 1024 * 1024, // 10MB default
    acceptedTypes,
    disabled = false,
    error,
    helpText,
    style,
}: PTFilePickerProps) {
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(false);

    const files = value
        ? (Array.isArray(value) ? value : [value])
        : [];

    const canAddMore = multiple ? files.length < maxFiles : files.length === 0;

    const handleImagePick = async () => {
        try {
            setIsLoading(true);

            // Use react-native-image-picker for images
            launchImageLibrary(
                {
                    mediaType: 'photo',
                    selectionLimit: multiple ? 0 : 1, // 0 means unlimited
                    assetRepresentationMode: 'current',
                },
                (response) => {
                    if (response.didCancel) {
                        setIsLoading(false);
                        return;
                    }

                    if (response.errorCode) {
                        console.error('Image picker error:', response.errorMessage);
                        Alert.alert('Error', 'Failed to pick images. Please try again.');
                        setIsLoading(false);
                        return;
                    }

                    if (response.assets && response.assets.length > 0) {
                        const selectedFiles: FileData[] = response.assets.map((asset) => ({
                            uri: asset.uri || '',
                            name: asset.fileName || `image_${Date.now()}`,
                            type: asset.type || 'image/jpeg',
                            size: asset.fileSize,
                        }));

                        // Validate file sizes
                        const oversizedFiles = selectedFiles.filter(f => f.size && f.size > maxSize);
                        if (oversizedFiles.length > 0) {
                            Alert.alert(
                                'File Too Large',
                                `Some files exceed the maximum size of ${formatFileSize(maxSize)}. Please select smaller files.`
                            );
                            setIsLoading(false);
                            return;
                        }

                        // Handle multiple vs single file selection
                        if (multiple) {
                            const currentFiles = Array.isArray(value) ? value : value ? [value] : [];
                            const combinedFiles = [...currentFiles, ...selectedFiles];

                            if (combinedFiles.length > maxFiles) {
                                Alert.alert(
                                    'Too Many Files',
                                    `Maximum ${maxFiles} files allowed. You can add ${maxFiles - currentFiles.length} more.`
                                );
                                setIsLoading(false);
                                return;
                            }

                            onFileSelect(combinedFiles);
                        } else {
                            onFileSelect(selectedFiles[0]);
                        }
                    }

                    setIsLoading(false);
                }
            );
        } catch (err: any) {
            console.error('Image picker error:', err);
            Alert.alert('Error', 'Failed to open image picker. Please try again.');
            setIsLoading(false);
        }
    };

    const handleDocumentPick = async () => {
        try {
            setIsLoading(true);

            if (Platform.OS === 'android') {
                // Use native Android file picker for other file types
                const { FilePickerModule } = NativeModules;

                if (!FilePickerModule) {
                    console.warn('FilePickerModule not available, using simulated file picker');
                    // Fallback: Show a simulated file picker
                    Alert.alert(
                        'Select File',
                        'For demo purposes, a simulated file has been created.',
                        [
                            {
                                text: 'Use Simulated File',
                                onPress: () => {
                                    const simulatedFile: FileData = {
                                        uri: `file://document_${Date.now()}.pdf`,
                                        name: `Document_${Date.now()}.pdf`,
                                        type: 'application/pdf',
                                        size: 1024 * 512, // 512KB
                                    };

                                    if (multiple) {
                                        const currentFiles = Array.isArray(value) ? value : value ? [value] : [];
                                        onFileSelect([...currentFiles, simulatedFile]);
                                    } else {
                                        onFileSelect(simulatedFile);
                                    }
                                    setIsLoading(false);
                                },
                            },
                            {
                                text: 'Cancel',
                                style: 'cancel',
                                onPress: () => setIsLoading(false),
                            },
                        ]
                    );
                    return;
                }

                try {
                    // Get MIME types from acceptedTypes
                    let mimeTypes = ['*/*'];
                    if (acceptedTypes && acceptedTypes.length > 0) {
                        mimeTypes = acceptedTypes;
                    }

                    console.log('Calling FilePickerModule with mimeTypes:', mimeTypes);
                    const result = await FilePickerModule.pickFile(multiple, mimeTypes);
                    console.log('FilePickerModule result:', result);

                    if (!result) {
                        console.log('File picker cancelled - result is null');
                        setIsLoading(false);
                        return;
                    }

                    // Handle both array and single object returns
                    let selectedFiles: FileData[] = [];

                    if (Array.isArray(result)) {
                        selectedFiles = result.map((file: any) => ({
                            uri: file.uri || file.path || '',
                            name: file.name || file.fileName || 'Unknown file',
                            type: file.type || file.mimeType || 'application/octet-stream',
                            size: file.size || file.fileSize || 0,
                        }));
                    } else if (typeof result === 'object' && result.uri) {
                        // Single file returned as object
                        selectedFiles = [{
                            uri: result.uri || result.path || '',
                            name: result.name || result.fileName || 'Unknown file',
                            type: result.type || result.mimeType || 'application/octet-stream',
                            size: result.size || result.fileSize || 0,
                        }];
                    }

                    console.log('Processed selected files:', selectedFiles);

                    if (selectedFiles.length === 0) {
                        Alert.alert('No file selected', 'Please select at least one file.');
                        setIsLoading(false);
                        return;
                    }

                    // Validate file sizes
                    const oversizedFiles = selectedFiles.filter(f => f.size && f.size > maxSize);
                    if (oversizedFiles.length > 0) {
                        Alert.alert(
                            'File Too Large',
                            `Some files exceed the maximum size of ${formatFileSize(maxSize)}. Please select smaller files.`
                        );
                        setIsLoading(false);
                        return;
                    }

                    // Handle multiple vs single file selection
                    if (multiple) {
                        const currentFiles = Array.isArray(value) ? value : value ? [value] : [];
                        const combinedFiles = [...currentFiles, ...selectedFiles];

                        if (combinedFiles.length > maxFiles) {
                            Alert.alert(
                                'Too Many Files',
                                `Maximum ${maxFiles} files allowed. You can add ${maxFiles - currentFiles.length} more.`
                            );
                            setIsLoading(false);
                            return;
                        }

                        console.log('Selecting multiple files:', combinedFiles);
                        onFileSelect(combinedFiles);
                    } else {
                        console.log('Selecting single file:', selectedFiles[0]);
                        onFileSelect(selectedFiles[0]);
                    }

                    setIsLoading(false);
                } catch (err: any) {
                    console.error('File picker error:', err);
                    console.error('Error message:', err.message);
                    console.error('Error stack:', err.stack);
                    Alert.alert('Error', `Failed to pick file: ${err.message || 'Unknown error'}. Please try again.`);
                    setIsLoading(false);
                }
            } else {
                // iOS or other platform
                Alert.alert(
                    'Select File',
                    'File picker for this platform will be implemented with a future update.',
                    [
                        {
                            text: 'Use Simulated File',
                            onPress: () => {
                                const simulatedFile: FileData = {
                                    uri: `file://document_${Date.now()}.pdf`,
                                    name: `Document_${Date.now()}.pdf`,
                                    type: 'application/pdf',
                                    size: 1024 * 512,
                                };

                                if (multiple) {
                                    const currentFiles = Array.isArray(value) ? value : value ? [value] : [];
                                    onFileSelect([...currentFiles, simulatedFile]);
                                } else {
                                    onFileSelect(simulatedFile);
                                }
                                setIsLoading(false);
                            },
                        },
                        {
                            text: 'Cancel',
                            style: 'cancel',
                            onPress: () => setIsLoading(false),
                        },
                    ]
                );
            }
        } catch (err: any) {
            console.error('Document picker error:', err);
            console.error('Error message:', err.message);
            Alert.alert('Error', `Failed to open file picker: ${err.message || 'Unknown error'}. Please try again.`);
            setIsLoading(false);
        }
    };

    const handleFilePick = async () => {
        // Show dialog to choose between file and image
        Alert.alert(
            'Choose Upload Type',
            'Would you like to upload a file or select an image from gallery?',
            [
                {
                    text: 'Image from Gallery',
                    onPress: () => handleImagePick(),
                },
                {
                    text: 'File',
                    onPress: () => handleDocumentPick(),
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ],
            { cancelable: true }
        );
    };

    const handleRemove = (file: FileData) => {
        if (onFileRemove) {
            onFileRemove(file);
        } else if (multiple && Array.isArray(value)) {
            const filtered = value.filter(f => f.uri !== file.uri);
            onFileSelect(filtered.length > 0 ? filtered : []);
        } else {
            onFileSelect(multiple ? [] : null as any);
        }
    };

    const renderFileItem = (file: FileData, index: number) => {
        const isImage = file.type.startsWith('image/');

        return (
            <View
                key={file.uri + index}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: theme.spacing.md,
                    backgroundColor: theme.colors.backgroundSecondary,
                    borderRadius: theme.borderRadius.md,
                    marginBottom: theme.spacing.sm,
                    borderWidth: 1,
                    borderColor: theme.colors.borderLight,
                }}
            >
                {/* Display image thumbnail or file icon */}
                {isImage ? (
                    <Image
                        source={{ uri: file.uri }}
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: theme.borderRadius.sm,
                            backgroundColor: theme.colors.backgroundTertiary,
                        }}
                        resizeMode="cover"
                    />
                ) : (
                    <View
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: theme.borderRadius.sm,
                            backgroundColor: theme.colors.primaryLight,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {getFileIcon(file.type, theme.colors.primary, 32)}
                    </View>
                )}

                <View style={{ flex: 1, marginLeft: theme.spacing.md }}>
                    <PTText
                        variant="body"
                        color="text"
                        numberOfLines={1}
                        style={{ fontWeight: '500' }}
                    >
                        {file.name}
                    </PTText>
                    {file.size && (
                        <PTText variant="caption" color="textSecondary">
                            {formatFileSize(file.size)}
                        </PTText>
                    )}
                </View>

                {!disabled && (
                    <TouchableOpacity
                        onPress={() => handleRemove(file)}
                        style={{
                            padding: theme.spacing.xs,
                            borderRadius: theme.borderRadius.round,
                            backgroundColor: theme.colors.errorBackground,
                        }}
                        activeOpacity={0.7}
                    >
                        <X size={18} color={theme.colors.error} weight="bold" />
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    const acceptedTypesText = acceptedTypes
        ? acceptedTypes.map((t: string) => {
            if (t === 'application/pdf') return 'PDF';
            if (t.startsWith('image/')) return 'Images';
            if (t.startsWith('video/')) return 'Videos';
            if (t.startsWith('audio/')) return 'Audio';
            if (t.includes('document') || t.includes('word')) return 'Documents';
            return t;
        }).join(', ')
        : 'All files';

    return (
        <View style={[{ marginBottom: theme.spacing.md }, style]}>
            {label && (
                <PTText
                    variant="caption"
                    color="text"
                    style={{ marginBottom: theme.spacing.sm, fontWeight: '600' }}
                >
                    {label}
                </PTText>
            )}

            {/* File list */}
            {files.length > 0 && (
                <View style={{ marginBottom: theme.spacing.sm }}>
                    {files.map((file, index) => renderFileItem(file, index))}
                </View>
            )}

            {/* Upload area */}
            {canAddMore && !disabled && (
                <TouchableOpacity
                    onPress={handleFilePick}
                    disabled={isLoading}
                    activeOpacity={0.7}
                    style={{
                        borderWidth: 2,
                        borderStyle: 'dashed',
                        borderColor: error ? theme.colors.error : theme.colors.border,
                        borderRadius: theme.borderRadius.lg,
                        padding: theme.spacing.xl,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isLoading ? theme.colors.backgroundTertiary : theme.colors.backgroundSecondary,
                        opacity: isLoading ? 0.6 : 1,
                    }}
                >
                    {isLoading ? (
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                    ) : (
                        <>
                            <UploadSimple size={40} color={theme.colors.primary} weight="duotone" />
                            <PTText
                                variant="body"
                                color="text"
                                style={{ marginTop: theme.spacing.md, fontWeight: '500' }}
                            >
                                Tap to upload
                            </PTText>
                            <PTText
                                variant="caption"
                                color="textSecondary"
                                style={{ marginTop: theme.spacing.xs, textAlign: 'center' }}
                            >
                                {acceptedTypesText} • Max {formatFileSize(maxSize)}
                            </PTText>
                            {multiple && (
                                <PTText variant="caption" color="textTertiary" style={{ marginTop: theme.spacing.xs }}>
                                    {files.length} / {maxFiles} files
                                </PTText>
                            )}
                        </>
                    )}
                </TouchableOpacity>
            )}

            {/* Disabled state when can't add more */}
            {!canAddMore && !disabled && multiple && (
                <PTText variant="caption" color="textSecondary" style={{ marginTop: theme.spacing.xs }}>
                    Maximum files reached ({maxFiles})
                </PTText>
            )}

            {/* Help text */}
            {helpText && !error && (
                <PTText variant="caption" color="textSecondary" style={{ marginTop: theme.spacing.xs }}>
                    {helpText}
                </PTText>
            )}

            {/* Error message */}
            {error && (
                <PTText variant="caption" color="error" style={{ marginTop: theme.spacing.xs }}>
                    {error}
                </PTText>
            )}
        </View>
    );
}