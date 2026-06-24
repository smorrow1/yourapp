import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Button } from '@/components/Button';
import { colors, radius, spacing, typography } from '@/theme';
import { usePremiumStore } from '@/store/usePremiumStore';
import { FEATURE_COPY } from '@/lib/gating';
import type { PremiumPlan } from '@/types';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Rt = RouteProp<RootStackParamList, 'Paywall'>;

const BENEFITS = [
  'Unlimited tanks & full history',
  'Dosing calculator + consumption-based maintenance dose',
  'CSV export for ICP & forums',
  'Custom parameters & ranges',
  'Unlimited test reminders',
];

interface PlanOption {
  plan: Exclude<PremiumPlan, 'free'>;
  title: string;
  price: string;
  caption: string;
  badge?: string;
}

const PLANS: PlanOption[] = [
  { plan: 'lifetime', title: 'Lifetime', price: '$39.99', caption: 'Pay once. Yours forever.', badge: 'Best value' },
  { plan: 'yearly', title: 'Yearly', price: '$24.99/yr', caption: 'Just $2.08/mo, billed yearly.' },
  { plan: 'monthly', title: 'Monthly', price: '$4.99/mo', caption: 'Cancel anytime.' },
];

export function PaywallScreen() {
  const navigation = useNavigation<Nav>();
  const feature = useRoute<Rt>().params?.feature;
  const { mockPurchase, mockRestore, isPro } = usePremiumStore();
  const [selected, setSelected] = useState<PlanOption['plan']>('lifetime');

  const headline = feature ? FEATURE_COPY[feature] : null;

  const purchase = () => {
    // TODO: replace with RevenueCat Purchases.purchasePackage(pkg)
    mockPurchase(selected);
    navigation.goBack();
  };

  const restore = () => {
    // TODO: replace with RevenueCat Purchases.restorePurchases()
    mockRestore();
    if (usePremiumStore.getState().isPro) navigation.goBack();
  };

  return (
    <ScreenContainer scroll>
      <View style={styles.hero}>
        <View style={styles.logo}>
          <Ionicons name="sparkles" size={26} color={colors.bg} />
        </View>
        <Text style={typography.title}>{headline ? headline.title : 'ReefPilot Pro'}</Text>
        <Text style={styles.sub}>
          {headline ? headline.subtitle : 'Everything you need to protect your reef.'}
        </Text>
      </View>

      <View style={styles.benefits}>
        {BENEFITS.map((b) => (
          <View key={b} style={styles.benefitRow}>
            <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
            <Text style={typography.body}>{b}</Text>
          </View>
        ))}
      </View>

      <View style={styles.plans}>
        {PLANS.map((p) => {
          const active = selected === p.plan;
          return (
            <View
              key={p.plan}
              onTouchEnd={() => setSelected(p.plan)}
              style={[styles.plan, active && styles.planActive]}
            >
              <View style={styles.flex}>
                <View style={styles.planTitleRow}>
                  <Text style={typography.heading}>{p.title}</Text>
                  {p.badge ? <Text style={styles.badge}>{p.badge}</Text> : null}
                </View>
                <Text style={typography.caption}>{p.caption}</Text>
              </View>
              <Text style={[styles.price, active && { color: colors.primary }]}>{p.price}</Text>
            </View>
          );
        })}
      </View>

      {isPro ? (
        <View style={styles.ownedNote}>
          <Ionicons name="checkmark-circle" size={18} color={colors.good} />
          <Text style={[typography.body, { color: colors.good }]}>You already have Pro. Thank you!</Text>
        </View>
      ) : (
        <Button label="Unlock ReefPilot Pro" onPress={purchase} />
      )}

      <Button label="Restore purchases" variant="ghost" onPress={restore} />
      <Text style={styles.legal}>
        Payment is charged to your store account. Subscriptions renew unless cancelled 24h before period end.
        {'\n'}TODO: link real Terms of Use & Privacy Policy before store submission.
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: spacing.sm, paddingTop: spacing.md },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sub: { ...typography.body, color: colors.textMuted, textAlign: 'center', maxWidth: 300 },
  benefits: { gap: spacing.md },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  plans: { gap: spacing.md },
  plan: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  planActive: { borderColor: colors.primary, backgroundColor: `${colors.primary}11` },
  flex: { flex: 1 },
  planTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  badge: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.bg,
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  price: { fontSize: 18, fontWeight: '700', color: colors.text },
  ownedNote: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  legal: { ...typography.caption, color: colors.textFaint, textAlign: 'center', lineHeight: 16 },
});
