import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { CaretDown, CaretRight, Info, Eye, Target, Users, UsersThree, Heart, Phone } from 'phosphor-react-native';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const [expanded, setExpanded] = useState<{ [k: string]: boolean }>({});

  const toggle = (k: string) => setExpanded(prev => ({ ...prev, [k]: !prev[k] }));

  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>My Profile</Text>

        <View style={styles.profileCard}>
          <View style={styles.profileTopRow}>
            <View style={styles.avatar}><Text style={styles.avatarInitials}>PS</Text></View>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.name}>Priya Sharma</Text>
              <Text style={styles.memberSince}>Member since 2024</Text>
              <View style={styles.activeBadge}><Text style={styles.activeBadgeText}>Active Member</Text></View>
            </View>
          </View>

          <View style={styles.infoRows}>
            <View style={styles.row}><Text style={styles.rowLabel}>Member ID</Text><Text style={styles.rowValue}>HCN - 2024 - 8756</Text></View>
            <View style={styles.row}><Text style={styles.rowLabel}>Blood Group</Text><Text style={styles.rowValue}>O+</Text></View>
            <View style={styles.row}><Text style={styles.rowLabel}>Date of Birth</Text><Text style={styles.rowValue}>15 Mar 1990</Text></View>
            <View style={styles.row}><Text style={styles.rowLabel}>Contact</Text><Text style={styles.rowValue}>+91-9876543210</Text></View>
            <View style={styles.row}><Text style={styles.rowLabel}>Email</Text><Text style={styles.rowValue}>priya.sharma@email.com</Text></View>
          </View>
        </View>

        <View style={styles.medCard}>
          <Text style={styles.cardTitle}>Medical Information</Text>
          <View style={styles.medRow}><Text style={styles.medLabel}>Allergies</Text><Text style={styles.medValue}>Penicillin, Peanuts</Text></View>
          <View style={styles.medRow}><Text style={styles.medLabel}>Chronic Conditions</Text><Text style={styles.medValue}>Mild Asthma</Text></View>
          <View style={styles.medRow}><Text style={styles.medLabel}>Emergency Contact</Text><Text style={styles.medValue}>Raj Sharma - +91-9876543211</Text></View>
        </View>

        <TouchableOpacity style={styles.requestButton} activeOpacity={0.9}><Text style={styles.requestButtonText}>+  Request for New Card</Text></TouchableOpacity>

        <TouchableOpacity style={styles.editButton} activeOpacity={0.9}><Text style={styles.editButtonText}>Edit Profile</Text></TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.9}><Text style={styles.logoutButtonText}>Logout</Text></TouchableOpacity>

        <View style={styles.aboutCard}>
          <Text style={styles.cardTitle}>About MHF Foundation</Text>

          {[
            { key: 'about', title: 'About MHF', icon: Info, bg: '#EFF6FF', color: '#075985' },
            { key: 'vision', title: 'Our Vision', icon: Eye, bg: '#ECFDF5', color: '#10B981' },
            { key: 'mission', title: 'Our Mission', icon: Target, bg: '#EFF6FF', color: '#2563EB' },
            { key: 'board', title: 'Our Board', icon: Users, bg: '#FDF2FE', color: '#7C3AED' },
            { key: 'team', title: 'Our Team', icon: UsersThree, bg: '#FFF7ED', color: '#FB923C' },
            { key: 'volunteers', title: 'Our Volunteers', icon: Heart, bg: '#FEF2F2', color: '#F43F5E' },
            { key: 'contact', title: 'Contact Information', icon: Phone, bg: '#F0F9FF', color: '#0369A1' },
          ].map((item) => {
            const Icon = item.icon as any;
            return (
              <TouchableOpacity key={item.key} style={styles.aboutItem} onPress={() => toggle(item.key)} activeOpacity={0.85}>
                <View style={styles.aboutItemInner}>
                  <View style={[styles.iconCircle, { backgroundColor: item.bg }]}>
                    <Icon color={item.color} size={18} />
                  </View>
                  <Text style={styles.aboutItemTitle}>{item.title}</Text>
                </View>
                {expanded[item.key] ? <CaretDown size={18} color="#0F172A" /> : <CaretRight size={18} color="#9CA3AF" />}
              </TouchableOpacity>
            );
          })}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F6F7FB' },
  content: { padding: 16, paddingBottom: 40 },
  header: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 8 },
  profileCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12 },
  profileTopRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center' },
  avatarInitials: { color: '#fff', fontWeight: '700' },
  name: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  memberSince: { color: '#6B7280', marginTop: 4 },
  activeBadge: { marginTop: 8, alignSelf: 'flex-start', backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  activeBadgeText: { color: '#065F46', fontWeight: '700', fontSize: 12 },
  infoRows: { marginTop: 12, borderTopWidth: 1, borderTopColor: '#EEF2F7', paddingTop: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  rowLabel: { color: '#6B7280', width: (width - 64) * 0.45 },
  rowValue: { color: '#0F172A', fontWeight: '600', textAlign: 'right', flex: 1 },

  medCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12 },
  cardTitle: { fontWeight: '700', color: '#0F172A', marginBottom: 8 },
  medRow: { marginBottom: 8 },
  medLabel: { color: '#6B7280', fontSize: 13 },
  medValue: { color: '#0F172A', fontWeight: '600', marginTop: 4 },

  requestButton: { backgroundColor: '#10B981', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginBottom: 12 },
  requestButtonText: { color: '#fff', fontWeight: '700' },

  editButton: { backgroundColor: '#fff', paddingVertical: 12, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#E6EEF8', marginBottom: 12 },
  editButtonText: { color: '#0F172A', fontWeight: '700' },

  logoutButton: { backgroundColor: '#fff', paddingVertical: 12, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#FEE2E2', marginBottom: 12 },
  logoutButtonText: { color: '#DC2626', fontWeight: '700' },

  aboutCard: { backgroundColor: '#fff', borderRadius: 12, padding: 12 },
  aboutItem: { backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, borderWidth: 1, borderColor: '#F3F4F6' },
  aboutItemInner: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  aboutItemTitle: { marginLeft: 12, color: '#0F172A', fontWeight: '600' },
  accordionTitle: { color: '#0F172A' },
});