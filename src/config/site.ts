/**
 * Centralised site configuration.
 * The WhatsApp number and default message live here so they can be changed
 * in a single place (see spec §"Integración WhatsApp").
 */
export const site = {
  name: 'NUVO',
  whatsapp: {
    /** International number, digits only, no "+". */
    phone: '59165730961',
    /** Default prefilled message. */
    message: 'quiero pedir un movil para',
  },
  social: {
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
  },
} as const;

