/**
 * Device detection utilities for determining if user is on mobile or web
 */

export type DeviceType = 'mobile' | 'web';
export type SessionMode = 'player' | 'display';

/**
 * Detect if the current device is mobile
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  // Check user agent
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  // Mobile device patterns
  const mobilePatterns = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
  ];

  const isMobileUA = mobilePatterns.some((pattern) => pattern.test(userAgent));
  
  // Also check screen size as a backup
  const isMobileScreen = window.innerWidth <= 768;
  
  // Check for touch capability
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Consider it mobile if either UA matches OR (small screen AND touch capable)
  return isMobileUA || (isMobileScreen && hasTouch);
}

/**
 * Get the device type
 */
export function getDeviceType(): DeviceType {
  return isMobileDevice() ? 'mobile' : 'web';
}

/**
 * Determine session mode based on device type
 * - Web: display mode (big screen, not a player)
 * - Mobile: player mode (host can play)
 */
export function getSessionMode(): SessionMode {
  return getDeviceType() === 'web' ? 'display' : 'player';
}

/**
 * Check if current session should be in display mode
 */
export function isDisplayMode(): boolean {
  return getSessionMode() === 'display';
}

/**
 * Check if current session should be in player mode
 */
export function isPlayerMode(): boolean {
  return getSessionMode() === 'player';
}
