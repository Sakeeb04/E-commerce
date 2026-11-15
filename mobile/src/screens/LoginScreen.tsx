import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert
} from 'react-native';
import { UserProfile } from '../types';
import { colors } from '../theme/colors';

interface Props {
  isAuthenticated: boolean;
  user: UserProfile;
  onLogin: () => void;
  onLogout: () => void;
  onSignUp: (name: string, email: string, phone: string) => void;
  onClose: () => void;
}

export const LoginScreen: React.FC<Props> = ({
  isAuthenticated,
  user,
  onLogin,
  onLogout,
  onSignUp,
  onClose
}: Props) => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('karthik.developer@example.com');
  const [password, setPassword] = useState<string>('password123');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  const handleSignIn = (): void => {
    onLogin();
    Alert.alert('Welcome Back', 'Signed in successfully!');
    onClose();
  };

  const handleSignUp = (): void => {
    if (!name || !email) {
      Alert.alert('Missing info', 'Please enter your name and email');
      return;
    }
    onSignUp(name, email, phone);
    Alert.alert('Success', `Welcome to LuminaShop, ${name}!`);
    onClose();
  };

  if (isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>✕ Close</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Account</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.loggedBox}>
          <Text style={styles.userIcon}>👤</Text>
          <Text style={styles.title}>Signed In</Text>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>

          <TouchableOpacity
            style={[styles.btn, styles.btnOutline, { marginTop: 24 }]}
            onPress={onClose}
          >
            <Text style={styles.btnOutlineText}>Continue Shopping</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.btnDanger, { marginTop: 12 }]}
            onPress={onLogout}
          >
            <Text style={styles.btnDangerText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeBtnText}>✕ Close</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isSignUp ? 'Create Account' : 'Sign In'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Logo Badge */}
        <View style={styles.logoBadge}>
          <Text style={styles.logoBadgeText}>🛍️</Text>
        </View>

        <Text style={styles.title}>
          {isSignUp ? 'Join LuminaShop' : 'Welcome Back'}
        </Text>
        <Text style={styles.subtitle}>
          {isSignUp
            ? 'Create an account to track orders & earn loyalty points'
            : 'Sign in to access your saved wishlist and orders'}
        </Text>

        {/* Tab switch */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tab, !isSignUp && styles.tabActive]}
            onPress={() => setIsSignUp(false)}
          >
            <Text style={[styles.tabText, !isSignUp && styles.tabTextActive]}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, isSignUp && styles.tabActive]}
            onPress={() => setIsSignUp(true)}
          >
            <Text style={[styles.tabText, isSignUp && styles.tabTextActive]}>Create Account</Text>
          </TouchableOpacity>
        </View>

        {isSignUp ? (
          /* Sign Up Form */
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Karthik Subramanian"
                placeholderTextColor={colors.textMuted}
                value={name}
                onChangeText={setName}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="name@example.com"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mobile Phone</Text>
              <TextInput
                style={styles.input}
                placeholder="+91 98765 43210"
                placeholderTextColor={colors.textMuted}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Create Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            <TouchableOpacity style={styles.btnPrimary} onPress={handleSignUp}>
              <Text style={styles.btnPrimaryText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Sign In Form */
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="name@example.com"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            <TouchableOpacity style={styles.btnPrimary} onPress={handleSignIn}>
              <Text style={styles.btnPrimaryText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.demoBtn} onPress={handleSignIn}>
              <Text style={styles.demoBtnText}>⚡ One-Click Demo Login</Text>
            </TouchableOpacity>
          </View>
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: colors.border
  },
  closeBtn: {
    padding: 6
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary
  },
  content: {
    padding: 24,
    alignItems: 'center'
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  logoBadgeText: {
    fontSize: 28
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 4,
    width: '100%',
    marginBottom: 20
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8
  },
  tabActive: {
    backgroundColor: colors.card
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '700'
  },
  form: {
    width: '100%'
  },
  inputGroup: {
    marginBottom: 14
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.textPrimary
  },
  btnPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 8
  },
  btnPrimaryText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700'
  },
  demoBtn: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: 12
  },
  demoBtnText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700'
  },
  loggedBox: {
    padding: 30,
    alignItems: 'center'
  },
  userIcon: {
    fontSize: 54,
    marginBottom: 12
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 6
  },
  userEmail: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2
  },
  btn: {
    width: '100%',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center'
  },
  btnOutline: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border
  },
  btnOutlineText: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 14
  },
  btnDanger: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA'
  },
  btnDangerText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 14
  }
});

