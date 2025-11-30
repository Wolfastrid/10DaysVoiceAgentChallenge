import { cache } from 'react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { APP_CONFIG_DEFAULTS } from '@/app-config';
import type { AppConfig } from '@/app-config';

// You are NOT using sandbox config → disable it
export const CONFIG_ENDPOINT = undefined;
export const SANDBOX_ID = "";

// Theme constants
export const THEME_STORAGE_KEY = 'theme-mode';
export const THEME_MEDIA_QUERY = '(prefers-color-scheme: dark)';

export interface SandboxConfig {
  [key: string]:
    | { type: 'string'; value: string }
    | { type: 'number'; value: number }
    | { type: 'boolean'; value: boolean }
    | null;
}

// Tailwind merge helper
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// FINAL FIX — No fetch, no sandbox, always use defaults
export const getAppConfig = cache(async (_headers: Headers): Promise<AppConfig> => {
  return {
    ...APP_CONFIG_DEFAULTS,
    sandboxId: "",   // required field for type safety
  };
});

// Accent color handling
export function getStyles(appConfig: AppConfig) {
  const { accent, accentDark } = appConfig;

  return [
    accent
      ? `:root { --primary: ${accent}; --primary-hover: color-mix(in srgb, ${accent} 80%, #000); }`
      : '',
    accentDark
      ? `.dark { --primary: ${accentDark}; --primary-hover: color-mix(in srgb, ${accentDark} 80%, #000); }`
      : '',
  ]
    .filter(Boolean)
    .join('\n');
}
