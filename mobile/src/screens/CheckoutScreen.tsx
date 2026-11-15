import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { CartItem } from '../types';
import { colors } from '../theme/colors';

interface OrderPlacedInfo {
  orderNumber: string;
  total: number;
  carrier: string;
  trackingNumber: string;
}

interface Props {
  cart: CartItem[];
  onBack: () => void;
  onOrderPlaced: (orderInfo: OrderPlacedInfo) => void;
}

export const CheckoutScreen: React.FC<Props> = ({ cart, onBack, onOrderPlaced }: Props) => {
  const [name, setName] = useState<string>('Karthik Subramanian');
  const [street, setStreet] = useState<string>('42, Anna Salai, Guindy Tech Park');
  const [city, setCity] = useState<string>('Chennai');
  const [zip, setZip] = useState<string>('600032');
  const [phone, setPhone] = useState<string>('+91 98765 43210');
  const [payMethod, setPayMethod] = useState<'card' | 'upi' | 'cod'>('card');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const subtotal: number = cart.reduce((sum: number, item: CartItem) => sum + item.product.price * item.quantity, 0);
  const tax: number = subtotal * 0.08;
  const shipping: number = subtotal > 150 ? 0 : 15;
  const total: number = subtotal + tax + shipping;

  const handlePlaceOrder = (): void => {
    setIsSubmitting(true);
    globalThis.setTimeout(() => {
      setIsSubmitting(false);
      onOrderPlaced({
        orderNumber: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
        total,
        carrier: 'BlueDart Express',
        trackingNumber: `TRK-IND-${Math.floor(10000000 + Math.random() * 90000000)}`
      });
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Step 1: Delivery Address */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>1. Delivery Address</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Recipient Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Street Address</Text>
            <TextInput style={styles.input} value={street} onChangeText={setStreet} />
          </View>
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>City</Text>
              <TextInput style={styles.input} value={city} onChangeText={setCity} />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>ZIP Code</Text>
              <TextInput style={styles.input} value={zip} onChangeText={setZip} keyboardType="numeric" />
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile Phone</Text>
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          </View>
        </View>

        {/* Step 2: Payment Method */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>2. Payment Option</Text>
          <View style={styles.payOptions}>
            {[
              { id: 'card', title: 'Credit Card' },
              { id: 'upi', title: 'UPI / QR' },
              { id: 'cod', title: 'Cash on Delivery' }
            ].map(opt => {
              const isSelected = payMethod === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.payMethodCard, isSelected && styles.payMethodActive]}
                  onPress={() => setPayMethod(opt.id as any)}
                >
                  <Text style={[styles.payMethodText, isSelected && styles.payMethodTextActive]}>
                    {opt.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {payMethod === 'card' && (
            <View style={styles.cardInputWrap}>
              <TextInput style={styles.input} placeholder="Card Number (4532 •••• •••• 8821)" placeholderTextColor={colors.textMuted} />
              <View style={[styles.row, { marginTop: 8 }]}>
                <TextInput style={[styles.input, { flex: 1 }]} placeholder="MM/YY" placeholderTextColor={colors.textMuted} />
                <TextInput style={[styles.input, { flex: 1, marginLeft: 8 }]} placeholder="CVV" placeholderTextColor={colors.textMuted} secureTextEntry />
              </View>
            </View>
          )}

          {payMethod === 'upi' && (
            <View style={styles.cardInputWrap}>
              <TextInput style={styles.input} placeholder="Enter UPI ID (e.g. karthik@upi)" placeholderTextColor={colors.textMuted} />
            </View>
          )}

          {payMethod === 'cod' && (
            <View style={styles.cardInputWrap}>
              <Text style={styles.codNotice}>Pay with cash or scan QR at doorstep delivery.</Text>
            </View>
          )}
        </View>

        {/* Step 3: Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Summary</Text>
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotal</Text><Text style={styles.summaryVal}>${subtotal.toFixed(2)}</Text></View>
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Tax</Text><Text style={styles.summaryVal}>${tax.toFixed(2)}</Text></View>
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Shipping</Text><Text style={styles.summaryVal}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</Text></View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}><Text style={styles.totalLabel}>Total Payable</Text><Text style={styles.totalVal}>${total.toFixed(2)}</Text></View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.payBtn}
          onPress={handlePlaceOrder}
          disabled={isSubmitting}
        >
          <Text style={styles.payBtnText}>
            {isSubmitting ? 'Processing Payment...' : `Confirm & Pay $${total.toFixed(2)}`}
          </Text>
        </TouchableOpacity>
      </View>
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
  backBtn: {
    padding: 6
  },
  backBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary
  },
  content: {
    padding: 16,
    paddingBottom: 100
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 16
  },
  cardTitle: {
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
    color: colors.textSecondary,
    marginBottom: 4,
    fontWeight: '600'
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: colors.textPrimary,
    backgroundColor: '#FAFAFA'
  },
  row: {
    flexDirection: 'row'
  },
  payOptions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12
  },
  payMethodCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center'
  },
  payMethodActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight
  },
  payMethodText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary
  },
  payMethodTextActive: {
    color: colors.primary
  },
  cardInputWrap: {
    marginTop: 6
  },
  codNotice: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic'
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.textSecondary
  },
  summaryVal: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary
  },
  totalVal: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    padding: 16,
    borderTopWidth: 1,
    borderColor: colors.border
  },
  payBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center'
  },
  payBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700'
  }
});
