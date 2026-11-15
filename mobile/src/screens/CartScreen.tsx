import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert
} from 'react-native';
import { CartItem } from '../types';
import { colors } from '../theme/colors';

interface Props {
  cart: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedCheckout: () => void;
}

export const CartScreen: React.FC<Props> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedCheckout
}: Props) => {
  const [promoCode, setPromoCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  const subtotal: number = cart.reduce((sum: number, item: CartItem) => sum + item.product.price * item.quantity, 0);
  const discount: number = (subtotal * discountPercent) / 100;
  const tax: number = Math.max(0, (subtotal - discount) * 0.08);
  const shipping: number = subtotal > 150 || subtotal === 0 ? 0 : 15;
  const total: number = subtotal - discount + tax + shipping;

  const handleApplyPromo = (): void => {
    if (promoCode.trim().toUpperCase() === 'SAVE20') {
      setDiscountPercent(20);
    } else {
      Alert.alert('Coupon Info', 'Invalid promo code. Try SAVE20');
    }
  };

  const renderCartRow = ({ item, index }: { item: CartItem; index: number }) => (
    <View style={styles.cartCard}>
      <Image source={{ uri: item.product.thumbnail }} style={styles.thumb} />
      <View style={styles.details}>
        <View style={styles.rowBetween}>
          <Text style={styles.itemTitle} numberOfLines={1}>{item.product.name}</Text>
          <TouchableOpacity onPress={() => onRemoveItem(index)}>
            <Text style={styles.removeText}>✕</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.variantText}>
          {item.selectedColor ? `Color: ${item.selectedColor} ` : ''}
          {item.selectedSize ? `• Size: ${item.selectedSize}` : ''}
        </Text>
        <View style={styles.bottomRow}>
          <View style={styles.stepper}>
            <TouchableOpacity onPress={() => onUpdateQuantity(index, item.quantity - 1)}>
              <Text style={styles.stepBtn}>-</Text>
            </TouchableOpacity>
            <Text style={styles.qtyText}>{item.quantity}</Text>
            <TouchableOpacity onPress={() => onUpdateQuantity(index, item.quantity + 1)}>
              <Text style={styles.stepBtn}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.itemTotal}>
            ${(item.product.price * item.quantity).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Bag ({cart.length})</Text>
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
          <Text style={styles.emptyDesc}>Discover trending collections and add your favorite picks.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(_: CartItem, idx: number) => idx.toString()}
            renderItem={renderCartRow}
            contentContainerStyle={styles.list}
            ListFooterComponent={
              <View style={styles.footerWrap}>
                {/* Promo Code Box */}
                <View style={styles.promoRow}>
                  <TextInput
                    style={styles.promoInput}
                    placeholder="Coupon (e.g. SAVE20)"
                    placeholderTextColor={colors.textMuted}
                    value={promoCode}
                    onChangeText={setPromoCode}
                  />
                  <TouchableOpacity style={styles.promoBtn} onPress={handleApplyPromo}>
                    <Text style={styles.promoBtnText}>Apply</Text>
                  </TouchableOpacity>
                </View>

                {/* Price Breakdown */}
                <View style={styles.breakdownCard}>
                  <View style={styles.breakdownRow}>
                    <Text style={styles.metaLabel}>Subtotal</Text>
                    <Text style={styles.metaVal}>${subtotal.toFixed(2)}</Text>
                  </View>
                  {discount > 0 && (
                    <View style={styles.breakdownRow}>
                      <Text style={[styles.metaLabel, { color: colors.success }]}>Discount (20%)</Text>
                      <Text style={[styles.metaVal, { color: colors.success }]}>-${discount.toFixed(2)}</Text>
                    </View>
                  )}
                  <View style={styles.breakdownRow}>
                    <Text style={styles.metaLabel}>Estimated Tax</Text>
                    <Text style={styles.metaVal}>${tax.toFixed(2)}</Text>
                  </View>
                  <View style={styles.breakdownRow}>
                    <Text style={styles.metaLabel}>Shipping</Text>
                    <Text style={styles.metaVal}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.breakdownRow}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalVal}>${total.toFixed(2)}</Text>
                  </View>
                </View>
              </View>
            }
          />

          <View style={styles.checkoutBar}>
            <TouchableOpacity style={styles.checkoutBtn} onPress={onProceedCheckout}>
              <Text style={styles.checkoutBtnText}>Checkout • ${total.toFixed(2)}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8
  },
  emptyDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center'
  },
  list: {
    padding: 16,
    paddingBottom: 100
  },
  cartCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    flexDirection: 'row',
    marginBottom: 12
  },
  thumb: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#F1F5F9'
  },
  details: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between'
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1
  },
  removeText: {
    color: colors.danger,
    fontSize: 14,
    paddingHorizontal: 4
  },
  variantText: {
    fontSize: 11,
    color: colors.textMuted,
    marginVertical: 2
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6
  },
  stepBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary
  },
  qtyText: {
    minWidth: 20,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700'
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary
  },
  footerWrap: {
    marginTop: 8
  },
  promoRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16
  },
  promoInput: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13
  },
  promoBtn: {
    backgroundColor: colors.darkSurface,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center'
  },
  promoBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 13
  },
  breakdownCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  metaLabel: {
    fontSize: 13,
    color: colors.textSecondary
  },
  metaVal: {
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
    fontSize: 17,
    fontWeight: '800',
    color: colors.primary
  },
  checkoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    padding: 16,
    borderTopWidth: 1,
    borderColor: colors.border
  },
  checkoutBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center'
  },
  checkoutBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700'
  }
});
