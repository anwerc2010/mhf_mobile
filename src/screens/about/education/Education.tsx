import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { PTCard } from "../../../components/comman";

const programs = [
    {
        icon: '💻',
        title: 'Computer Training',
        duration: '3 Months',
        seats: '20 seats available',
        schedule: 'Mon-Fri, 10 AM - 12 PM',
        description: 'Learn basic to advanced computer skills including MS Office, Internet, Email, and basic programming.',
        topics: ['MS Office', 'Internet & Email', 'Typing Skills', 'Basic Programming'],
    },
    {
        icon: '✂️',
        title: 'Tailoring & Stitching',
        duration: '4 Months',
        seats: '15 seats available',
        schedule: 'Mon-Sat, 2 PM - 4 PM',
        description: 'Professional tailoring course covering basic to advanced stitching, pattern making, and garment construction.',
        topics: ['Basic Stitching', 'Pattern Making', 'Machine Work', 'Garment Design'],
    },
    {
        icon: '🎨',
        title: 'Mehandi Designing',
        duration: '1 Month',
        seats: '12 seats available',
        schedule: 'Weekends, 10 AM - 1 PM',
        description: 'Learn traditional and modern mehandi designs, techniques, and professional application methods.',
        topics: ['Basic Patterns', 'Bridal Mehandi', 'Arabic Designs', 'Business Skills'],
    },
];

const benefits = [
    {
        icon: '🎓',
        title: 'Free / Subsidized Training',
        desc: 'Quality education at no or minimal cost',
    },
    {
        icon: '📜',
        title: 'Certificate on Completion',
        desc: '85% attendance required for certificate',
    },
    {
        icon: '👨‍🏫',
        title: 'Expert Trainers',
        desc: 'Learn from experienced professionals',
    },
];

const impact = [
    { value: '500+', label: 'Students Trained' },
    { value: '15+', label: 'Courses Offered' },
    { value: '85%', label: 'Job Placement' },
];

export default function EducationScreen() {
    const navigation = useNavigation<any>();
    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
            <View style={styles.headerCard}>
                <Text style={styles.headerTitle}>Education & Skill Development</Text>
                <Text style={styles.headerSubtitle}>Empower yourself with new skills</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('RegisterTraining')}><Text style={styles.primaryBtnText}>Register for Training</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.secondaryBtn}><Text style={styles.secondaryBtnText}>Sponsor a Student</Text></TouchableOpacity>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Available Training Programs</Text>
            {programs.map((p, idx) => (
                <View key={p.title} style={styles.programCard}>
                    <View style={styles.programHeader}>
                        <Text style={styles.programIcon}>{p.icon}</Text>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.programTitle}>{p.title}</Text>
                            <View style={styles.programTagsRow}>
                                <View style={styles.tag}><Text style={styles.tagText}>{p.duration}</Text></View>
                                <View style={styles.tagOutline}><Text style={styles.tagOutlineText}>{p.seats}</Text></View>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.programSchedule}>🕒 {p.schedule}</Text>
                    <Text style={styles.programDesc}>{p.description}</Text>
                    <View style={styles.topicsRow}>
                        {p.topics.map(t => (
                            <View key={t} style={styles.topicTag}><Text style={styles.topicTagText}>{t}</Text></View>
                        ))}
                    </View>
                    <View style={styles.programActions}>
                        <TouchableOpacity style={styles.primaryBtnSmall}><Text style={styles.primaryBtnText}>Register Now</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.secondaryBtnSmall}><Text style={styles.secondaryBtnText}>Sponsor</Text></TouchableOpacity>
                    </View>
                </View>
            ))}

            <View style={styles.benefitsCard}>
                <Text style={styles.sectionTitle}>Program Benefits</Text>
                {benefits.map(b => (
                    <View key={b.title} style={styles.benefitRow}>
                        <Text style={styles.benefitIcon}>{b.icon}</Text>
                        <View>
                            <Text style={styles.benefitTitle}>{b.title}</Text>
                            <Text style={styles.benefitDesc}>{b.desc}</Text>
                        </View>
                    </View>
                ))}
            </View>

            <View style={styles.impactCard}>
                <Text style={styles.sectionTitle}>Our Impact</Text>
                <View style={styles.impactRow}>
                    {impact.map(i => (
                        <PTCard key={i.label} style={[styles.impactBox, styles.marginLR8]}>
                            <View key={i.label} style={styles.impactBox}>
                                <Text style={styles.impactValue}>{i.value}</Text>
                                <Text style={styles.impactLabel}>{i.label}</Text>
                            </View>
                        </PTCard>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7FAFC',
        padding: 16,
    },
    headerCard: {
        backgroundColor: '#2563eb',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    headerSubtitle: {
        color: '#dbeafe',
        fontSize: 14,
        marginBottom: 16,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 4,
    },
    primaryBtn: {
        backgroundColor: '#1e40af',
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginRight: 8,
    },
    primaryBtnText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    secondaryBtn: {
        backgroundColor: '#38bdf8',
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    secondaryBtnText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#1e293b',
    },
    programCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 18,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    programHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    programIcon: {
        fontSize: 28,
        marginRight: 12,
    },
    programTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    programTagsRow: {
        flexDirection: 'row',
        marginTop: 4,
        gap: 8,
    },
    tag: {
        backgroundColor: '#dbeafe',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginRight: 6,
    },
    tagText: {
        color: '#2563eb',
        fontSize: 12,
        fontWeight: 'bold',
    },
    tagOutline: {
        borderColor: '#38bdf8',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    tagOutlineText: {
        color: '#38bdf8',
        fontSize: 12,
        fontWeight: 'bold',
    },
    programSchedule: {
        color: '#64748b',
        fontSize: 13,
        marginBottom: 4,
    },
    programDesc: {
        color: '#334155',
        fontSize: 13,
        marginBottom: 8,
    },
    topicsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginBottom: 10,
    },
    topicTag: {
        backgroundColor: '#bbf7d0',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginRight: 6,
        marginBottom: 4,
    },
    topicTagText: {
        color: '#15803d',
        fontSize: 12,
        fontWeight: 'bold',
    },
    programActions: {
        flexDirection: 'row',
        gap: 10,
    },
    primaryBtnSmall: {
        backgroundColor: '#1e40af',
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 14,
        marginRight: 8,
    },
    secondaryBtnSmall: {
        backgroundColor: '#22c55e',
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 14,
    },
    benefitsCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 18,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    benefitRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    benefitIcon: {
        fontSize: 22,
        marginRight: 10,
    },
    benefitTitle: {
        fontWeight: 'bold',
        color: '#0f172a',
        fontSize: 14,
    },
    benefitDesc: {
        color: '#64748b',
        fontSize: 13,
    },
    impactCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 18,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    impactRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    impactBox: {
        alignItems: 'center',
        flex: 1,
    },
    impactValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2563eb',
    },
    impactLabel: {
        color: '#64748b',
        fontSize: 13,
        marginTop: 2,
        textAlign: 'center',
    },
    marginLR8: {
        marginLeft: 8,
        marginRight: 8,
    },
});
