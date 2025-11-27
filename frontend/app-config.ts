                                                            export interface AppConfig {
  pageTitle: string;
  pageDescription: string;
  companyName: string;

  supportsChatInput: boolean;
  supportsVideoInput: boolean;
  supportsScreenShare: boolean;
  isPreConnectBufferEnabled: boolean;

  logo: string;
  startButtonText: string;
  accent?: string;
  logoDark?: string;
  accentDark?: string;

  // for LiveKit Cloud Sandbox
  sandboxId?: string;
  agentName?: string;
}

export const APP_CONFIG_DEFAULTS: AppConfig = {
  companyName: 'SecureBank Fraud Alert',
  pageTitle: 'Fraud Detection Department',
  pageDescription:
    "SecureBank Fraud Detection Department - We're calling about a suspicious transaction on your account.",

  supportsChatInput: true,
  supportsVideoInput: false,
  supportsScreenShare: false,
  isPreConnectBufferEnabled: true,

  logo: '/lk-logo.svg',
  accent: '#dc2626',
  logoDark: '/lk-logo-dark.svg',
  accentDark: '#ef4444',
  startButtonText: 'Answer Call',

  // for LiveKit Cloud Sandbox
  sandboxId: undefined,
  agentName: undefined,
};