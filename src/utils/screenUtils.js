/**
 * Screen & Orientation Utilities for The Conceptors Animal Health E-Detailing PWA
 * Enforces immersive, distraction-free Fullscreen Landscape presentation mode on iPad, tablets, & laptops.
 */

export async function enterFullscreenLandscape() {
  try {
    const docEl = document.documentElement;

    // 1. Request Fullscreen across modern and vendor-prefixed browser APIs
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
      if (docEl.requestFullscreen) {
        await docEl.requestFullscreen({ navigationUI: 'hide' }).catch(() => {
          return docEl.requestFullscreen();
        });
      } else if (docEl.webkitRequestFullscreen) {
        await docEl.webkitRequestFullscreen();
      } else if (docEl.msRequestFullscreen) {
        await docEl.msRequestFullscreen();
      } else if (docEl.mozRequestFullScreen) {
        await docEl.mozRequestFullScreen();
      }
    }
  } catch (err) {
    // Some browsers or security contexts bypass programmatic fullscreen
    console.info('Fullscreen activation note:', err?.message || err);
  }

  try {
    // 2. Lock Orientation to Landscape (Tablet & Mobile devices)
    if (window.screen?.orientation?.lock) {
      await window.screen.orientation.lock('landscape').catch(() => {
        return window.screen.orientation.lock('landscape-primary');
      }).catch(() => {});
    } else if (window.screen?.lockOrientation) {
      window.screen.lockOrientation('landscape');
    } else if (window.screen?.webkitLockOrientation) {
      window.screen.webkitLockOrientation('landscape');
    } else if (window.screen?.mozLockOrientation) {
      window.screen.mozLockOrientation('landscape');
    }
  } catch (err) {
    console.info('Orientation lock note:', err?.message || err);
  }
}

export async function exitFullscreen() {
  try {
    if (document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
      }
    }
  } catch (err) {
    console.info('Exit fullscreen note:', err?.message || err);
  }

  try {
    if (window.screen?.orientation?.unlock) {
      window.screen.orientation.unlock();
    } else if (window.screen?.unlockOrientation) {
      window.screen.unlockOrientation();
    }
  } catch (err) {
    console.info('Unlock orientation note:', err?.message || err);
  }
}

export function isDeviceLandscape() {
  if (typeof window === 'undefined') return true;
  return window.innerWidth >= window.innerHeight;
}
