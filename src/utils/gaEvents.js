/**
 * Google Analytics 4 (gtag) donusum event helper.
 *
 * GA4 yalnizca KVKK consent verilmis ziyaretciler icin yuklenir.
 * Onay yoksa window.gtag tanimsizdir; trackGA sessizce no-op olur.
 *
 * Kullanim:
 *   import { trackGA, GA_EVENTS } from '../utils/gaEvents'
 *   trackGA(GA_EVENTS.PHONE_CLICK, { source: 'hero' })
 *   trackGA(GA_EVENTS.FORM_SUBMIT, { form: 'iletisim' })
 */

export function trackGA(eventName, params = {}) {
  try {
    if (typeof window === 'undefined') return;
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', eventName, params);
  } catch {
    // sessiz
  }
}

export const GA_EVENTS = {
  PHONE_CLICK: 'phone_click',
  WHATSAPP_CLICK: 'whatsapp_click',
  EMAIL_CLICK: 'email_click',
  FORM_SUBMIT: 'form_submit',
  CALCULATOR_USE: 'calculator_use',
  CALCULATOR_DOWNLOAD: 'calculator_download',
  ARTICLE_READ: 'article_read',
  ARTICLE_CTA_CLICK: 'article_cta_click',
};
