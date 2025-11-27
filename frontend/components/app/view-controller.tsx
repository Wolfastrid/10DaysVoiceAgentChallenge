'use client';

import { AnimatePresence, motion } from 'motion/react';
import { FraudSessionView } from '@/components/app/fraud-session-view';
import { SDRSessionView } from '@/components/app/sdr-session-view';
import { useSession } from '@/components/app/session-provider';
import { TutorSessionView } from '@/components/app/tutor-session-view';
import { WelcomeView } from '@/components/app/welcome-view';

const MotionWelcomeView = motion.create(WelcomeView);
const MotionTutorSessionView = motion.create(TutorSessionView);
const MotionSDRSessionView = motion.create(SDRSessionView);
const MotionFraudSessionView = motion.create(FraudSessionView);

const VIEW_MOTION_PROPS = {
  variants: {
    visible: {
      opacity: 1,
    },
    hidden: {
      opacity: 0,
    },
  },
  initial: 'hidden' as const,
  animate: 'visible' as const,
  exit: 'hidden' as const,
  transition: {
    duration: 0.5,
  },
};

export function ViewController() {
  const { appConfig, isSessionActive, startSession } = useSession();

  // Determine which session view to show based on app config
  const isFraudMode = appConfig.companyName === 'SecureBank Fraud Alert';
  const isSDRMode = appConfig.companyName === 'Razorpay SDR';
  const mode = isFraudMode ? 'fraud' : isSDRMode ? 'sdr' : 'tutor';

  return (
    <AnimatePresence mode="wait">
      {/* Welcome screen */}
      {!isSessionActive && (
        <MotionWelcomeView
          key="welcome"
          {...VIEW_MOTION_PROPS}
          startButtonText={appConfig.startButtonText}
          onStartCall={startSession}
          mode={mode}
        />
      )}
      {/* Fraud Alert session view */}
      {isSessionActive && isFraudMode && (
        <MotionFraudSessionView
          key="fraud-session-view"
          {...VIEW_MOTION_PROPS}
          appConfig={appConfig}
        />
      )}
      {/* SDR session view */}
      {isSessionActive && isSDRMode && (
        <MotionSDRSessionView key="sdr-session-view" {...VIEW_MOTION_PROPS} appConfig={appConfig} />
      )}
      {/* Tutor session view */}
      {isSessionActive && !isFraudMode && !isSDRMode && (
        <MotionTutorSessionView
          key="tutor-session-view"
          {...VIEW_MOTION_PROPS}
          appConfig={appConfig}
        />
      )}
    </AnimatePresence>
  );
}