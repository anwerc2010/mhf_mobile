import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import {
    Bell,
    CheckCircle,
    Info,
    Warning,
    X,
} from 'phosphor-react-native';

interface Notification {
    id: string;
    type: 'info' | 'success' | 'warning';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
}

// Sample notifications data
const SAMPLE_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        type: 'success',
        title: 'Card Request Approved',
        message: 'Your card request has been approved and is being processed.',
        timestamp: '2 hours ago',
        read: false,
    },
    {
        id: '2',
        type: 'info',
        title: 'New Event Available',
        message: 'Health awareness camp scheduled for next week. Register now!',
        timestamp: '5 hours ago',
        read: false,
    },
    {
        id: '3',
        type: 'warning',
        title: 'Profile Incomplete',
        message: 'Please complete your profile to access all features.',
        timestamp: '1 day ago',
        read: true,
    },
    {
        id: '4',
        type: 'info',
        title: 'Relief Application Update',
        message: 'Your relief application is under review. You will be notified once processed.',
        timestamp: '2 days ago',
        read: true,
    },
    {
        id: '5',
        type: 'success',
        title: 'Training Registered',
        message: 'You have successfully registered for the skill development training program.',
        timestamp: '3 days ago',
        read: true,
    },
];

export default function NotificationsScreen() {
    const [notifications, setNotifications] = React.useState<Notification[]>(SAMPLE_NOTIFICATIONS);

    const getIconByType = (type: Notification['type']) => {
        switch (type) {
            case 'success':
                return <CheckCircle size={24} color="#10B981" weight="fill" />;
            case 'warning':
                return <Warning size={24} color="#F59E0B" weight="fill" />;
            case 'info':
            default:
                return <Info size={24} color="#0369A1" weight="fill" />;
        }
    };

    const getColorByType = (type: Notification['type']) => {
        switch (type) {
            case 'success':
                return '#D1FAE5';
            case 'warning':
                return '#FEF3C7';
            case 'info':
            default:
                return '#DBEAFE';
        }
    };

    const handleRemoveNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const handleMarkAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <View style={styles.container}>
            {/* Header Stats */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Bell size={28} color="#0369A1" weight="fill" />
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerTitle}>Notifications</Text>
                        <Text style={styles.headerSubtitle}>
                            {unreadCount > 0
                                ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                                : 'All caught up!'}
                        </Text>
                    </View>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {notifications.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Bell size={64} color="#D1D5DB" weight="thin" />
                        <Text style={styles.emptyTitle}>No Notifications</Text>
                        <Text style={styles.emptyText}>
                            You're all caught up! Check back later for updates.
                        </Text>
                    </View>
                ) : (
                    <View style={styles.notificationsList}>
                        {notifications.map(notification => (
                            <TouchableOpacity
                                key={notification.id}
                                style={[
                                    styles.notificationCard,
                                    !notification.read && styles.unreadCard,
                                ]}
                                onPress={() => handleMarkAsRead(notification.id)}
                                activeOpacity={0.7}
                            >
                                <View
                                    style={[
                                        styles.iconContainer,
                                        { backgroundColor: getColorByType(notification.type) },
                                    ]}
                                >
                                    {getIconByType(notification.type)}
                                </View>

                                <View style={styles.notificationContent}>
                                    <View style={styles.notificationHeader}>
                                        <Text style={styles.notificationTitle}>
                                            {notification.title}
                                        </Text>
                                        {!notification.read && (
                                            <View style={styles.unreadDot} />
                                        )}
                                    </View>
                                    <Text style={styles.notificationMessage}>
                                        {notification.message}
                                    </Text>
                                    <Text style={styles.notificationTime}>
                                        {notification.timestamp}
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={(e) => {
                                        e.stopPropagation();
                                        handleRemoveNotification(notification.id);
                                    }}
                                >
                                    <X size={20} color="#9CA3AF" />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerTextContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
    },
    scrollContent: {
        flexGrow: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 80,
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#374151',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 20,
    },
    notificationsList: {
        padding: 16,
        gap: 12,
    },
    notificationCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        gap: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    unreadCard: {
        borderLeftWidth: 3,
        borderLeftColor: '#0369A1',
        backgroundColor: '#F0F9FF',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationContent: {
        flex: 1,
    },
    notificationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0F172A',
        flex: 1,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#0369A1',
    },
    notificationMessage: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
        marginBottom: 8,
    },
    notificationTime: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    removeButton: {
        padding: 4,
    },
});
