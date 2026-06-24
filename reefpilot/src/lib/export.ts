import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Platform, Share } from 'react-native';
import { CORE_PARAMETER_KEYS, PARAMETERS_BY_KEY } from '@/domain/parameters';
import type { Reading, Tank } from '@/types';

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

/** Build a CSV with one row per reading, oldest first — handy for ICP comparisons and forum help. */
export function readingsToCsv(readings: Reading[]): string {
  const header = [
    'Date',
    ...CORE_PARAMETER_KEYS.map((k) => {
      const def = PARAMETERS_BY_KEY[k];
      return def.unit ? `${def.label} (${def.unit})` : def.label;
    }),
    'Note',
  ];

  const rows = readings
    .slice()
    .sort((a, b) => +new Date(a.takenAt) - +new Date(b.takenAt))
    .map((r) =>
      [
        new Date(r.takenAt).toISOString(),
        ...CORE_PARAMETER_KEYS.map((k) => (r.values[k] !== undefined ? String(r.values[k]) : '')),
        r.note ?? '',
      ]
        .map(csvEscape)
        .join(','),
    );

  return [header.map(csvEscape).join(','), ...rows].join('\n');
}

/** Write the CSV to a temp file and open the system share sheet (falls back to a text share). */
export async function exportReadingsCsv(tank: Tank, readings: Reading[]): Promise<void> {
  const csv = readingsToCsv(readings);
  const safeName = tank.name.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'tank';
  const filename = `reefpilot-${safeName}-${new Date().toISOString().slice(0, 10)}.csv`;

  // Web (and anywhere file sharing is unavailable): share the CSV as text.
  if (Platform.OS === 'web') {
    await Share.share({ message: csv, title: filename });
    return;
  }

  const uri = `${FileSystem.cacheDirectory}${filename}`;
  await FileSystem.writeAsStringAsync(uri, csv, { encoding: FileSystem.EncodingType.UTF8 });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, {
      mimeType: 'text/csv',
      dialogTitle: 'Export readings',
      UTI: 'public.comma-separated-values-text',
    });
  } else {
    await Share.share({ message: csv, title: filename });
  }
}
