import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Button } from '@/components/Button';
import { NumberField } from '@/components/NumberField';
import { colors, radius, spacing, typography } from '@/theme';
import { useEventStore } from '@/store/useEventStore';
import { DOSING_PRODUCTS } from '@/domain/dosing';
import type { TankEventType } from '@/types';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Rt = RouteProp<RootStackParamList, 'LogEvent'>;

export function LogEventScreen() {
  const navigation = useNavigation<Nav>();
  const { tankId, presetProductId, presetAmountMl } = useRoute<Rt>().params;
  const addEvent = useEventStore((s) => s.addEvent);

  const [type, setType] = useState<TankEventType>('dose');
  const [productId, setProductId] = useState(presetProductId ?? DOSING_PRODUCTS[0].id);
  const [amountMl, setAmountMl] = useState(presetAmountMl !== undefined ? String(presetAmountMl) : '');
  const [percent, setPercent] = useState('20');
  const [note, setNote] = useState('');

  const save = () => {
    const at = new Date().toISOString();
    if (type === 'dose') {
      const product = DOSING_PRODUCTS.find((p) => p.id === productId) ?? DOSING_PRODUCTS[0];
      addEvent({
        tankId,
        at,
        type: 'dose',
        paramKey: product.parameter,
        productId: product.id,
        amountMl: parseFloat(amountMl) || 0,
        note: note.trim() || undefined,
      });
    } else {
      addEvent({
        tankId,
        at,
        type: 'waterChange',
        percent: parseFloat(percent) || 0,
        note: note.trim() || undefined,
      });
    }
    navigation.goBack();
  };

  return (
    <ScreenContainer scroll>
      <Text style={typography.caption}>
        Logging doses and water changes keeps your consumption estimate accurate while you actively dose.
      </Text>

      <View style={styles.segment}>
        {(['dose', 'waterChange'] as const).map((t) => (
          <Text
            key={t}
            onPress={() => setType(t)}
            style={[styles.segmentItem, type === t && styles.segmentActive]}
          >
            {t === 'dose' ? 'Dose' : 'Water change'}
          </Text>
        ))}
      </View>

      {type === 'dose' ? (
        <>
          <Text style={typography.label}>Product</Text>
          <View style={styles.productList}>
            {DOSING_PRODUCTS.map((p) => (
              <Text
                key={p.id}
                onPress={() => setProductId(p.id)}
                style={[styles.product, productId === p.id && styles.productActive]}
              >
                {p.name}
              </Text>
            ))}
          </View>
          <NumberField label="Amount dosed" unit="mL" value={amountMl} onChangeText={setAmountMl} step={1} />
        </>
      ) : (
        <NumberField label="Water changed" unit="% of volume" value={percent} onChangeText={setPercent} step={5} />
      )}

      <View style={styles.field}>
        <Text style={typography.label}>Note (optional)</Text>
        <TextInput
          style={styles.note}
          value={note}
          onChangeText={setNote}
          placeholder="Product brand, reason, observations…"
          placeholderTextColor={colors.textFaint}
          selectionColor={colors.primary}
          multiline
        />
      </View>

      <Button label="Save" onPress={save} style={styles.cta} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: 4,
  },
  segmentItem: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    color: colors.textMuted,
    overflow: 'hidden',
  },
  segmentActive: { backgroundColor: colors.primary, color: colors.bg, fontWeight: '700' },
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
  field: { gap: spacing.sm },
  note: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    minHeight: 80,
    color: colors.text,
    fontSize: 15,
    textAlignVertical: 'top',
  },
  cta: { marginTop: spacing.sm },
});
