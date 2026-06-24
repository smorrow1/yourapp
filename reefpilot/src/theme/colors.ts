export const colors = {
  bg: '#0B1622',
  surface: '#13212E',
  surfaceAlt: '#1B2E3D',
  border: '#243A4D',

  primary: '#21C0A6',
  primaryDark: '#179683',
  accent: '#F5A623',

  text: '#E8F1F5',
  textMuted: '#8CA3B0',
  textFaint: '#5C7384',

  good: '#34D399',
  warn: '#FBBF24',
  danger: '#F87171',

  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(4, 10, 16, 0.75)',
} as const;

export type ColorKey = keyof typeof colors;
