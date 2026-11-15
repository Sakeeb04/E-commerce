import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { Product } from '../types';
import { colors } from '../theme/colors';

interface Props {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number, color?: string, size?: string) => void;
}

export const ProductDetailScreen: React.FC<Props> = ({ product, onBack, onAddToCart }: Props) => {
  const [selectedColor, setSelectedColor] = useState<string | undefined>(product.colors ? product.colors[0] : undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(product.sizes ? product.sizes[0] : undefined);
  const [quantity, setQuantity] = useState<number>(1);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{product.brand}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Image source={{ uri: product.thumbnail }} style={styles.heroImg} resizeMode="cover" />

        <View style={styles.body}>
          <View style={styles.brandRow}>
            <Text style={styles.brandBadge}>{product.brand}</Text>
            <Text style={styles.stockText}>In Stock ({product.stock})</Text>
          </View>

          <Text style={styles.title}>{product.name}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            {product.originalPrice ? (
              <Text style={styles.origPrice}>${product.originalPrice.toFixed(2)}</Text>
            ) : null}
            {product.discountPercentage ? (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>Save {product.discountPercentage}%</Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.sectionHeading}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Color Selector */}
          {product.colors ? (
            <View style={styles.variantSection}>
              <Text style={styles.sectionHeading}>Select Color: <Text style={styles.variantVal}>{selectedColor}</Text></Text>
              <View style={styles.pillRow}>
                {product.colors.map((c: string) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.pill, selectedColor === c && styles.pillActive]}
                    onPress={() => setSelectedColor(c)}
                  >
                    <Text style={[styles.pillText, selectedColor === c && styles.pillTextActive]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : null}

          {/* Size Selector */}
          {product.sizes ? (
            <View style={styles.variantSection}>
              <Text style={styles.sectionHeading}>Select Size: <Text style={styles.variantVal}>{selectedSize}</Text></Text>
              <View style={styles.pillRow}>
                {product.sizes.map((s: string) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.pill, selectedSize === s && styles.pillActive]}
                    onPress={() => setSelectedSize(s)}
                  >
                    <Text style={[styles.pillText, selectedSize === s && styles.pillTextActive]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : null}

          {/* Features */}
          <View style={styles.variantSection}>
            <Text style={styles.sectionHeading}>Key Features</Text>
            {product.features.map((f: string, i: number) => (
              <Text key={i} style={styles.featureItem}>✓ {f}</Text>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.stepper}>
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => quantity > 1 && setQuantity(quantity - 1)}
          >
            <Text style={styles.stepBtnText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.stepVal}>{quantity}</Text>
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => quantity < product.stock && setQuantity(quantity + 1)}
          >
            <Text style={styles.stepBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.addToCartBtn}
          onPress={() => onAddToCart(product, quantity, selectedColor, selectedSize)}
        >
          <Text style={styles.addToCartText}>
            Add to Bag • ${(product.price * quantity).toFixed(2)}
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
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary
  },
  content: {
    paddingBottom: 100
  },
  heroImg: {
    width: '100%',
    height: 280,
    backgroundColor: '#E2E8F0'
  },
  body: {
    padding: 16
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  brandBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase'
  },
  stockText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16
  },
  price: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary
  },
  origPrice: {
    fontSize: 14,
    color: colors.textMuted,
    textDecorationLine: 'line-through'
  },
  discountBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  discountText: {
    color: '#B91C1C',
    fontSize: 11,
    fontWeight: '700'
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 12,
    marginBottom: 6
  },
  variantVal: {
    fontWeight: '400',
    color: colors.textSecondary
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20
  },
  variantSection: {
    marginTop: 10
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card
  },
  pillActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary
  },
  pillTextActive: {
    color: colors.primary
  },
  featureItem: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderColor: colors.border
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.card
  },
  stepBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8
  },
  stepBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary
  },
  stepVal: {
    minWidth: 24,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700'
  },
  addToCartBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  addToCartText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700'
  }
});
