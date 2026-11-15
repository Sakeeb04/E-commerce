import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert
} from 'react-native';
import { UserProfile, Order } from '../types';
import { colors } from '../theme/colors';

interface Props {
  user: UserProfile;
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
}

export const ProfileDashboardScreen: React.FC<Props> = ({
  user,
  orders,
  onSelectOrder,
  onUpdateUser
}: Props) => {
  const [name, setName] = useState<string>(user.name);
  const [email, setEmail] = useState<string>(user.email);
  const [phone, setPhone] = useState<string>(user.phone);

  const handleSave = (): void => {
    onUpdateUser({ name, email, phone });
    Alert.alert('Success', 'Profile saved successfully!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account & Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.profileCard}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <View style={styles.profileMeta}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
            <Text style={styles.phone}>{user.phone}</Text>
          </View>
          <View style={styles.tierPill}>
            <Text style={styles.tierText}>{user.tier}</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{orders.length}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{user.rewardPoints}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>2</Text>
            <Text style={styles.statLabel}>Addresses</Text>
          </View>
        </View>

        {/* Edit Profile Section */}
        <View style={styles.editCard}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Full Name"
              placeholderTextColor={colors.textMuted}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="Email"
              placeholderTextColor={colors.textMuted}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="Phone"
              placeholderTextColor={colors.textMuted}
            />
          </View>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save Profile Changes</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Orders */}
        <Text style={styles.sectionTitle}>Recent Orders</Text>
        {orders.map((order: Order) => (
          <TouchableOpacity
            key={order.id}
            style={styles.orderCard}
            onPress={() => onSelectOrder(order)}
            activeOpacity={0.8}
          >
            <View style={styles.orderTop}>
              <View>
                <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                <Text style={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString()}</Text>
              </View>
              <View style={styles.orderStatusPill}>
                <Text style={styles.orderStatusText}>
                  {order.status.replace(/_/g, ' ').toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.orderBottom}>
              <Text style={styles.itemCountText}>{order.items.length} item(s)</Text>
              <Text style={styles.totalText}>${order.total.toFixed(2)} ›</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: colors.border
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary
  },
  content: {
    padding: 16,
    paddingBottom: 80
  },
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E2E8F0'
  },
  profileMeta: {
    flex: 1,
    marginLeft: 12
  },
  name: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary
  },
  email: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2
  },
  phone: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2
  },
  tierPill: {
    backgroundColor: '#FEF08A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  tierText: {
    color: '#854D0E',
    fontWeight: '700',
    fontSize: 11
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    alignItems: 'center'
  },
  statVal: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary
  },
  statLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2
  },
  editCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12
  },
  inputGroup: {
    marginBottom: 10
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: colors.textPrimary,
    backgroundColor: '#FAFAFA'
  },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 6
  },
  saveBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700'
  },
  orderCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 12
  },
  orderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary
  },
  orderDate: {
    fontSize: 11,
    color: colors.textMuted
  },
  orderStatusPill: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  orderStatusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1E40AF'
  },
  orderBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: colors.borderLight,
    paddingTop: 8
  },
  itemCountText: {
    fontSize: 12,
    color: colors.textSecondary
  },
  totalText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary
  }
});
