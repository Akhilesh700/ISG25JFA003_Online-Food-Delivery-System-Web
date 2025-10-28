import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
// Optional, but recommended for better parsing: import UAParser from 'ua-parser-js';

/**
 * Interface matching the fields expected by the backend DeviceInfo class.
 */
export interface DeviceInfoPayload {
  ip?: string; // IP is best determined by the backend, keep optional here.
  name: string; // e.g., "Chrome on Windows", "User's iPhone"
  browserName?: string;
  browserVersion?: string;
  timezone?: string;
  deviceType?: string; // e.g., desktop, mobile, tablet
}

@Injectable({
  providedIn: 'root'
})
export class DeviceInfoService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  /**
   * Gathers device information from the browser environment.
   * Uses basic heuristics. Consider using a library like ua-parser-js for better accuracy.
   * @returns A DeviceInfoPayload object or null if not in a browser environment.
   */
  getDeviceInfo(): DeviceInfoPayload | null {
    if (!isPlatformBrowser(this.platformId)) {
      // Return null or default values if running on the server
      return this.getDefaultDeviceInfo(true); // Indicate it's SSR or non-browser
    }

    const ua = navigator.userAgent || '';
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // --- Basic Heuristics (Consider ua-parser-js for better results) ---
    let browserName = 'Unknown';
    let browserVersion = 'Unknown';
    let osName = 'Unknown'; // Helper for constructing the 'name' field
    let deviceType = 'desktop'; // Default assumption

    // Simple Browser Detection
    if (ua.includes('Firefox/')) {
        browserName = 'Firefox';
        browserVersion = ua.split('Firefox/')[1]?.split(' ')[0] ?? 'Unknown';
    } else if (ua.includes('Edg/')) { // Edge Chromium
        browserName = 'Edge';
        browserVersion = ua.split('Edg/')[1]?.split(' ')[0] ?? 'Unknown';
    } else if (ua.includes('Chrome/') && !ua.includes('Chromium/') && !ua.includes('Edg/')) { // Avoid matching Edge/Brave/etc.
        browserName = 'Chrome';
        browserVersion = ua.split('Chrome/')[1]?.split(' ')[0] ?? 'Unknown';
    } else if (ua.includes('Safari/') && !ua.includes('Chrome/') && !ua.includes('Edg/')) {
        browserName = 'Safari';
        // Safari version is often after 'Version/'
        browserVersion = ua.split('Version/')[1]?.split(' ')[0] ?? ua.split('Safari/')[1]?.split(' ')[0] ?? 'Unknown';
    }
     // Add more specific browser checks if needed

     // Simple OS Detection (Primarily for the 'name' field)
     if (ua.includes('Windows NT')) osName = 'Windows';
     else if (ua.includes('Mac OS X')) osName = 'macOS';
     else if (ua.includes('Android')) osName = 'Android';
     else if (ua.includes('iPhone') || ua.includes('iPad') || ua.includes('iPod')) osName = 'iOS';
     else if (ua.includes('Linux')) osName = 'Linux';


     // Device Type Detection
     if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        deviceType = "tablet";
    } else if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
        deviceType = "mobile";
    }
    // --- End Basic Heuristics ---

    // --- Example using ua-parser-js (if installed) ---
    /*
    const parser = new UAParser(ua);
    const result = parser.getResult();
    browserName = result.browser.name || 'Unknown';
    browserVersion = result.browser.version || 'Unknown';
    osName = result.os.name || 'Unknown'; // Use OS name from parser
    deviceType = result.device.type || 'desktop'; // Parser's device type might be more specific
    */
    // --- End ua-parser-js example ---


    const deviceInfo: DeviceInfoPayload = {
      // ip: undefined, // Let backend handle IP
      name: `${browserName} on ${osName}`, // Construct a descriptive name
      browserName: browserName,
      browserVersion: browserVersion,
      timezone: timezone,
      deviceType: deviceType,
    };

    return deviceInfo;
  }

  /**
   * Provides default device info values for SSR or if detection fails.
   */
  getDefaultDeviceInfo(isServer: boolean = false): DeviceInfoPayload {
      return {
          ip: undefined, // Never send IP from client
          name: isServer ? "Server Request" : "Unknown Device",
          browserName: undefined,
          browserVersion: undefined,
          timezone: undefined,
          deviceType: 'desktop', // Sensible default
      };
  }
}