"use client";

import { useEffect, useRef } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleOneTapConfig) => void;
          prompt: (callback?: (notification: GoogleOneTapNotification) => void) => void;
          cancel: () => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

interface GoogleOneTapConfig {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
  prompt_parent_id?: string;
  nonce?: string;
  context?: 'signin' | 'signup' | 'use';
  state_cookie_domain?: string;
  ux_mode?: 'popup' | 'redirect';
  allowed_parent_origin?: string[];
  intermediate_iframe_close_callback?: () => void;
}

interface GoogleCredentialResponse {
  credential: string;
  select_by: 'auto' | 'user' | 'user_1tap' | 'user_2tap' | 'btn' | 'btn_confirm' | 'btn_add_session' | 'btn_confirm_add_session';
}

interface GoogleOneTapNotification {
  isNotDisplayed: () => boolean;
  isSkippedMoment: () => boolean;
  isDismissedMoment: () => boolean;
  getNotDisplayedReason: () => string;
  getSkippedReason: () => string;
  getDismissedReason: () => string;
}

export default function GoogleOneTap() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const initialized = useRef(false);

  // Only show on public pages and when not logged in
  const shouldShowOneTap = !session && 
    status !== 'loading' && 
    (pathname === '/' || pathname === '/login') &&
    !sessionStorage.getItem('oneTapDismissed') &&
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID; // Only if Google Client ID is configured

  useEffect(() => {
    if (!shouldShowOneTap || initialized.current) return;

    const initializeGoogleOneTap = () => {
      if (!window.google?.accounts?.id) {
        // Retry after a short delay if Google SDK not loaded yet
        setTimeout(initializeGoogleOneTap, 500);
        return;
      }

      try {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          context: 'signin',
          ux_mode: 'popup',
        });

        // Show the One Tap prompt after a short delay
        setTimeout(() => {
          if (window.google?.accounts?.id) {
            window.google.accounts.id.prompt((notification) => {
              if (notification.isDismissedMoment()) {
                // User dismissed the prompt
                sessionStorage.setItem('oneTapDismissed', 'true');
                console.log('One Tap dismissed:', notification.getDismissedReason());
              } else if (notification.isNotDisplayed()) {
                console.log('One Tap not displayed:', notification.getNotDisplayedReason());
              } else if (notification.isSkippedMoment()) {
                console.log('One Tap skipped:', notification.getSkippedReason());
              }
            });
          }
        }, 1000); // Show after 1 second delay

        initialized.current = true;
      } catch (error) {
        console.error('Error initializing Google One Tap:', error);
      }
    };

    const handleCredentialResponse = async (response: GoogleCredentialResponse) => {
      try {
        // Use NextAuth credentials provider for One Tap
        const result = await signIn('google-one-tap', {
          credential: response.credential,
          callbackUrl: '/dashboard',
          redirect: false,
        });

        if (result?.ok) {
          console.log('One Tap sign-in successful');
          // Redirect manually since we disabled automatic redirect
          window.location.href = '/dashboard';
        } else {
          console.error('One Tap sign-in failed:', result?.error);
        }
      } catch (error) {
        console.error('Error handling Google One Tap response:', error);
      }
    };

    // Initialize when Google SDK is ready
    initializeGoogleOneTap();

    // Cleanup function
    return () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.cancel();
      }
    };
  }, [shouldShowOneTap]);

  // Clean up when user navigates away from public pages
  useEffect(() => {
    if (pathname !== '/' && pathname !== '/login' && window.google?.accounts?.id) {
      window.google.accounts.id.cancel();
    }
  }, [pathname]);

  // This component doesn't render anything visible
  return null;
}