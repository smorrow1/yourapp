import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import { colors, spacing, typography } from '@/theme';
import { PARAMETERS_BY_KEY } from '@/domain/parameters';
import type { ParameterKey } from '@/types';

interface Point {
  takenAt: string;
  value: number;
}

interface Props {
  paramKey: ParameterKey;
  data: Point[];
  width: number;
  height?: number;
}

/** Lightweight SVG line chart with the ideal-range band drawn behind the line. */
export function TrendChart({ paramKey, data, width, height = 160 }: Props) {
  const def = PARAMETERS_BY_KEY[paramKey];
  const padX = 12;
  const padY = 16;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  if (data.length < 2) {
    return (
      <View style={[styles.empty, { width, height }]}>
        <Text style={typography.caption}>Log at least 2 tests to see a trend.</Text>
      </View>
    );
  }

  const values = data.map((d) => d.value);
  const lo = Math.min(...values, def.warnMin);
  const hi = Math.max(...values, def.warnMax);
  const span = hi - lo || 1;

  const x = (i: number) => padX + (i / (data.length - 1)) * innerW;
  const y = (v: number) => padY + innerH - ((v - lo) / span) * innerH;

  const linePath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(d.value).toFixed(1)}`)
    .join(' ');

  const bandTop = y(def.max);
  const bandBottom = y(def.min);

  return (
    <Svg width={width} height={height}>
      {/* ideal range band */}
      <Rect
        x={padX}
        y={Math.min(bandTop, bandBottom)}
        width={innerW}
        height={Math.abs(bandBottom - bandTop)}
        fill={colors.good}
        opacity={0.12}
      />
      <Line x1={padX} y1={bandTop} x2={width - padX} y2={bandTop} stroke={colors.good} strokeWidth={1} opacity={0.4} strokeDasharray="4 4" />
      <Line x1={padX} y1={bandBottom} x2={width - padX} y2={bandBottom} stroke={colors.good} strokeWidth={1} opacity={0.4} strokeDasharray="4 4" />

      {/* line */}
      <Path d={linePath} stroke={colors.primary} strokeWidth={2.5} fill="none" />

      {/* points */}
      {data.map((d, i) => (
        <Circle key={d.takenAt} cx={x(i)} cy={y(d.value)} r={3.5} fill={colors.primary} />
      ))}
    </Svg>
  );
}

const styles = StyleSheet.create({
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    padding: spacing.lg,
  },
});
