import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { Product } from '../types';
import { colors } from '../theme/colors';

interface Props {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const CATEGORIES = [
  { key: 'all', label: 'All Items' },
  { key: 'electronics', label: 'Tech & Audio' },
  { key: 'fashion', label: 'Fashion & Bags' },
  { key: 'fitness', label: 'Fitness' }
];

export const ProductListScreen: React.FC<Props> = ({ products, onSelectProduct, onAddToCart }: Props) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = products.filter((p: Product) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => onSelectProduct(item)}
    >
      <View style={styles.imageWrap}>
        <Image source={{ uri: item.thumbnail }} style={styles.productImg} resizeMode="cover" />
        {item.discountPercentage ? (
          <View style={styles.badgeSale}>
            <Text style={styles.badgeSaleText}>-{item.discountPercentage}%</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.infoWrap}>
        <Text style={styles.brandText}>{item.brand}</Text>
        <Text style={styles.titleText} numberOfLines={2}>{item.name}</Text>
        <View style={styles.ratingRow}>
          <Text style={styles.ratingStar}>★</Text>
          <Text style={styles.ratingVal}>{item.rating.toFixed(1)}</Text>
          <Text style={styles.reviewVal}>({item.reviewCount})</Text>
        </View>
        <View style={styles.priceRow}>
          <View>
            <Text style={styles.currentPrice}>${item.price.toFixed(2)}</Text>
            {item.originalPrice ? (
              <Text style={styles.origPrice}>${item.originalPrice.toFixed(2)}</Text>
            ) : null}
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => onAddToCart(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search headphones, bags, shoes..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Pills */}
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map(cat => {
            const isActive = selectedCategory === cat.key;
            return (
              <TouchableOpacity
                key={cat.key}
                style={[styles.catPill, isActive && styles.catPillActive]}
                onPress={() => setSelectedCategory(cat.key)}
              >
                <Text style={[styles.catText, isActive && styles.catTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Products Grid */}
      <FlatList
        data={filtered}
        keyExtractor={(item: Product) => item.id}
        renderItem={renderProductItem}
        numColumns={2}
        contentContainerStyle={styles.gridList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8
  },
  searchInput: {
    backgroundColor: colors.card,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.textPrimary
  },
  categoryScroll: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8
  },
  catPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border
  },
  catPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  catText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary
  },
  catTextActive: {
    color: colors.white
  },
  gridList: {
    padding: 12,
    paddingBottom: 80
  },
  card: {
    flex: 1,
    margin: 6,
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden'
  },
  imageWrap: {
    width: '100%',
    height: 150,
    backgroundColor: '#F1F5F9',
    position: 'relative'
  },
  productImg: {
    width: '100%',
    height: '100%'
  },
  badgeSale: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  badgeSaleText: {
    color: '#B91C1C',
    fontSize: 10,
    fontWeight: '700'
  },
  infoWrap: {
    padding: 10
  },
  brandText: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  titleText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 2,
    height: 36
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4
  },
  ratingStar: {
    color: '#F59E0B',
    fontSize: 12,
    marginRight: 2
  },
  ratingVal: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary
  },
  reviewVal: {
    fontSize: 11,
    color: colors.textMuted,
    marginLeft: 3
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6
  },
  currentPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary
  },
  origPrice: {
    fontSize: 11,
    color: colors.textMuted,
    textDecorationLine: 'line-through'
  },
  addBtn: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8
  },
  addBtnText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700'
  }
});
