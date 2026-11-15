import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { Product } from '../types';
import { colors } from '../theme/colors';

interface Props {
  wishlistProducts: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onMoveToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onExploreProducts: () => void;
}

export const WishlistScreen: React.FC<Props> = ({
  wishlistProducts,
  onRemoveFromWishlist,
  onMoveToCart,
  onSelectProduct,
  onExploreProducts
}: Props) => {
  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => onSelectProduct(item)} activeOpacity={0.85}>
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      </TouchableOpacity>
      <View style={styles.info}>
        <View style={styles.topRow}>
          <Text style={styles.brand}>{item.brand}</Text>
          <TouchableOpacity
            onPress={() => onRemoveFromWishlist(item.id)}
            style={styles.removeBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.heartActive}>❤️</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => onSelectProduct(item)} activeOpacity={0.85}>
          <Text style={styles.title} numberOfLines={2}>{item.name}</Text>
        </TouchableOpacity>

        <View style={styles.bottomRow}>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          <TouchableOpacity
            style={styles.moveCartBtn}
            onPress={() => onMoveToCart(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.moveCartText}>+ Move to Bag</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Wishlist ({wishlistProducts.length})</Text>
      </View>

      {wishlistProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🤍</Text>
          <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
          <Text style={styles.emptyDesc}>
            Tap the heart icon on any product to save your favorite picks here.
          </Text>
          <TouchableOpacity style={styles.exploreBtn} onPress={onExploreProducts}>
            <Text style={styles.exploreBtnText}>Explore Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={wishlistProducts}
          keyExtractor={(item: Product) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
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
  list: {
    padding: 16,
    paddingBottom: 90
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 12
  },
  thumbnail: {
    width: 85,
    height: 85,
    borderRadius: 10,
    backgroundColor: '#F1F5F9'
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between'
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  brand: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase'
  },
  removeBtn: {
    padding: 2
  },
  heartActive: {
    fontSize: 15
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 2
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary
  },
  moveCartBtn: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },
  moveCartText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700'
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12
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
    textAlign: 'center',
    marginBottom: 20
  },
  exploreBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10
  },
  exploreBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700'
  }
});

