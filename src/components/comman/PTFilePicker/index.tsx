import React, { useState } from 'react';
import { View, ViewStyle, TouchableOpacity, Alert, Platform } from 'react-native';
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

    const files = value
        ? (Array.isArray(value) ? value : [value])
        : [];

    const canAddMore = multiple ? files.length < maxFiles : files.length === 0;

    const handleFilePick = () => {
        // In a real implementation, you would use react-native-document-picker
        // Example:
        // import DocumentPicker from 'react-native-document-picker';
        // const result = await DocumentPicker.pick({
        //   type: acceptedTypes || [DocumentPicker.types.allFiles],
        //   allowMultiSelection: multiple,
        // });

        Alert.alert(
            'Select File',
            'To enable file picking, install react-native-document-picker:\n\nnpm install react-native-document-picker',
            [
                {
                    text: 'Simulate File',
                    onPress: () => {
                        // Simulate file selection for demo
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
                    },
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ]
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

    const renderFileItem = (file: FileData, index: number) => (
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
            {getFileIcon(file.type, theme.colors.primary, 32)}

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

    const acceptedTypesText = acceptedTypes
        ? acceptedTypes.map(t => {
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
                    activeOpacity={0.7}
                    style={{
                        borderWidth: 2,
                        borderStyle: 'dashed',
                        borderColor: error ? theme.colors.error : theme.colors.border,
                        borderRadius: theme.borderRadius.lg,
                        padding: theme.spacing.xl,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: theme.colors.backgroundSecondary,
                    }}
                >
                    <UploadSimple size={40} color={theme.colors.primary} weight="duotone" />
                    <PTText
                        variant="body"
                        color="text"
                        style={{ marginTop: theme.spacing.md, fontWeight: '500' }}
                    >
                        Tap to upload file
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