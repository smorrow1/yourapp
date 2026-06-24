import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

/** Shared AsyncStorage-backed persistence for all zustand stores. Offline-first. */
export const zustandStorage = createJSONStorage(() => AsyncStorage);
