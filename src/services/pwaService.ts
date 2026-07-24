// Событие установки PWA
export interface PWAInstallEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferredPrompt: PWAInstallEvent | null = null;

/**
 * Инициализация Service Worker и перехват предложения установки PWA
 */
export function initPWASericeWorker(onStatusChange?: (installed: boolean, backgroundActive: boolean) => void) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('[PWA] Service Worker успешно зарегистрирован:', registration.scope);
        if (onStatusChange) {
          onStatusChange(true, true);
        }
      } catch (err) {
        console.error('[PWA] Ошибка регистрации Service Worker:', err);
        if (onStatusChange) {
          onStatusChange(false, false);
        }
      }
    });
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as PWAInstallEvent;
  });
}

/**
 * Показать системное окно установки PWA
 */
export async function promptPWAInstall(): Promise<boolean> {
  if (!deferredPrompt) {
    return false;
  }
  try {
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    deferredPrompt = null;
    return choice.outcome === 'accepted';
  } catch (err) {
    console.error('[PWA] Ошибка запроса установки:', err);
    return false;
  }
}

/**
 * Проверка запуска в автономном режиме PWA
 */
export function isStandalonePWA(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

/**
 * Определение текущей платформы устройства
 */
export function detectPlatform(): 'ios' | 'android' | 'desktop' {
  const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
  if (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) {
    return 'ios';
  }
  if (/android/i.test(ua)) {
    return 'android';
  }
  return 'desktop';
}

/**
 * Запрос разрешения на отправку браузерных push-уведомлений
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
}

/**
 * Отправка системного уведомления о статусе WireGuard
 */
export function showStatusNotification(title: string, body: string, icon = '🛡️') {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(`${icon} ${title}`, {
        body,
        badge: '/manifest.webmanifest',
        tag: 'wireguard-vpn-status'
      });
    } catch (e) {
      console.log('Ошибка отправки уведомления:', e);
    }
  }
}
