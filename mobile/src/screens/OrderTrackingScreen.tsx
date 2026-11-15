import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { Order, TimelineEvent } from '../types';
import { colors } from '../theme/colors';

interface Props {
  order: Order;
  onBack: () => void;
}

export const OrderTrackingScreen: React.FC<Props> = ({ order, onBack }: Props) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹ Orders</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track Order</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <View style={styles.statusBanner}>
          <View style={styles.badgeWrap}>
            <Text style={styles.badgeText}>{order.status.replace(/_/g, ' ').toUpperCase()}</Text>
          </View>
          <Text style={styles.deliveryTime}>{order.estimatedDelivery}</Text>
          <Text style={styles.trackingNo}>
            {order.carrier} • Waybill: {order.trackingNumber}
          </Text>
        </View>

        {/* Timeline */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Shipment Progress</Text>
          {order.timeline.map((step: TimelineEvent, idx: number) => {
            return (
              <View key={idx} style={styles.timelineRow}>
                <View style={styles.indicatorCol}>
                  <View
                    style={[
                      styles.circle,
                      step.completed && styles.circleCompleted,
                      step.current && styles.circleCurrent
                    ]}
                  >
                    <Text style={styles.circleText}>
                      {step.completed ? '✓' : idx + 1}
                    </Text>
                  </View>
                  {idx < order.timeline.length - 1 && (
                    <View
                      style={[
                        styles.verticalLine,
                        step.completed && styles.lineCompleted
                      ]}
                    />
                  )}
                </View>
                <View style={styles.detailsCol}>
                  <View style={styles.stepTitleRow}>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                    <Text style={styles.stepTime}>{step.timestamp}</Text>
                  </View>
                  <Text style={styles.stepDesc}>{step.description}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Delivery Address */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Destination Address</Text>
          <Text style={styles.addrName}>{order.shippingAddress.fullName}</Text>
          <Text style={styles.addrLine}>{order.shippingAddress.street}</Text>
          <Text style={styles.addrLine}>
            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
          </Text>
        </View>
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
    padding: 16
  },
  statusBanner: {
    backgroundColor: colors.darkSurface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16
  },
  badgeWrap: {
    alignSelf: 'flex-start',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700'
  },
  deliveryTime: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4
  },
  trackingNo: {
    color: colors.textMuted,
    fontSize: 12
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 16
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16
  },
  timelineRow: {
    flexDirection: 'row',
    minHeight: 65
  },
  indicatorCol: {
    alignItems: 'center',
    width: 32
  },
  circle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center'
  },
  circleCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success
  },
  circleCurrent: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  circleText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary
  },
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginVertical: 4
  },
  lineCompleted: {
    backgroundColor: colors.success
  },
  detailsCol: {
    flex: 1,
    marginLeft: 12,
    paddingBottom: 16
  },
  stepTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline'
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary
  },
  stepTime: {
    fontSize: 11,
    color: colors.textMuted
  },
  stepDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2
  },
  addrName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2
  },
  addrLine: {
    fontSize: 12,
    color: colors.textSecondary
  }
});
