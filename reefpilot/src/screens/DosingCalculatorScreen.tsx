import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { NumberField } from '@/components/NumberField';
import { colors, radius, spacing, typography } from '@/theme';
import { useTankStore } from '@/store/useTankStore';
import { useReadingStore } from '@/store/useReadingStore';
import { usePremiumStore } from '@/store/usePremiumStore';
import { calculateDose, DOSING_PRODUCTS } from '@/domain/dosing';
import { PARAMETERS_BY_KEY } from '@/domain/parameters';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Rt = RouteProp<RootStackParamList, 'DosingCalculator'>;

export function DosingCalculatorScreen() {
  const navigation = useNavigation<Nav>();
  const { tankId, paramKey } = useRoute<Rt>().params;
  const isPro = usePremiumStore((s) => s.isPro);

  const tank = useTankStore((s) => s.tanks.find((t) => t.id === tankId));
  const latest = useReadingStore((s) => s.latestForTank(tankId));

  // Default to the product matching the parameter the user tapped, else the first.
  const initialProduct =
    DOSING_PRODUCTS.find((p) => p.parameter === paramKey) ?? DOSING_PRODUCTS[0];
  const [productId, setProductId] = useState(initialProduct.id);
  const product = DOSING_PRODUCTS.find((p) => p.id === productId) ?? DOSING_PRODUCTS[0];

  const def = PARAMETERS_BY_KEY[product.parameter];
  const [volume, setVolume] = useState(String(tank?.volumeGallons ?? 40));
  const [current, setCurrent] = useState(
    latest?.values[product.parameter] !== undefined ? String(latest.values[product.parameter]) : String(def.min),
  );
  const [target, setTarget] = useState(String((def.min + def.max) / 2));

  if (!isPro) {
    return <ProGate onUnlock={() => navigation.replace('Paywall', { feature: 'dosing' })} />;
  }

  const result = calculateDose({
    product,
    volumeGallons: parseFloat(volume) || 0,
    current: parseFloat(current) || 0,
    target: parseFloat(target) || 0,
  });

  return (
    <ScreenContainer scroll>
      <Text style={typography.label}>Product</Text>
      <View style={styles.productList}>
        {DOSING_PRODUCTS.map((p) => (
          <Text
            key={p.id}
            onPress={() => {
              setProductId(p.id);
              const d = PARAMETERS_BY_KEY[p.parameter];
              setCurrent(latest?.values[p.parameter] !== undefined ? String(latest.values[p.parameter]) : String(d.min));
              setTarget(String((d.min + d.max) / 2));
            }}
            style={[styles.product, productId === p.id && styles.productActive]}
          >
            {p.name}
          </Text>
        ))}
      </View>

      <NumberField label="System volume" unit="gal" value={volume} onChangeText={setVolume} step={5} />
      <NumberField label={`Current ${def.label}`} unit={def.unit} value={current} onChangeText={setCurrent} step={def.step} />
      <NumberField label={`Target ${def.label}`} unit={def.unit} value={target} onChangeText={setTarget} step={def.step} />

      <Card style={styles.result}>
        {result.needsReduction ? (
          <>
            <Text style={typography.label}>Already above target</Text>
            <Text style={[typography.body, { marginTop: 4 }]}>
              You can't lower {def.label.toLowerCase()} by dosing. Consider a water change.
            </Text>
          </>
        ) : (
          <>
            <Text style={typography.label}>Suggested dose</Text>
            <Text style={styles.doseValue}>{result.doseMl} mL</Text>
            <Text style={typography.caption}>
              to raise {def.label.toLowerCase()} by {result.delta.toFixed(def.decimals)} {def.unit}
            </Text>
          </>
        )}
      </Card>

      <View style={styles.disclaimer}>
        <Ionicons name="information-circle-outline" size={16} color={colors.textFaint} />
        <Text style={styles.disclaimerText}>
          Informational estimate only. Always dose gradually, follow your product label, and re-test.
          {'\n'}TODO: verify preset strengths against manufacturer instructions.
        </Text>
      </View>
    </ScreenContainer>
  );
}

function ProGate({ onUnlock }: { onUnlock: () => void }) {
  return (
    <ScreenContainer>
      <Card style={styles.gate}>
        <Ionicons name="lock-closed" size={28} color={colors.primary} />
        <Text style={[typography.heading, { marginTop: spacing.md }]}>Dosing Calculator is a Pro feature</Text>
        <Text style={[typography.body, { color: colors.textMuted, textAlign: 'center', marginTop: 6 }]}>
          Get the exact mL to dose for your tank volume — no more guesswork.
        </Text>
        <Button label="Unlock ReefPilot Pro" onPress={onUnlock} style={{ alignSelf: 'stretch', marginTop: spacing.lg }} />
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  productList: { gap: spacing.sm },
  product: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.textMuted,
    overflow: 'hidden',
  },
  productActive: { backgroundColor: `${colors.primary}22`, borderColor: colors.primary, color: colors.primary },
  result: { alignItems: 'center', gap: 4, backgroundColor: colors.surfaceAlt },
  doseValue: { fontSize: 40, fontWeight: '800', color: colors.primary },
  disclaimer: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.xs },
  disclaimerText: { ...typography.caption, color: colors.textFaint, flex: 1, lineHeight: 17 },
  gate: { alignItems: 'center', marginTop: spacing.xxl },
});
