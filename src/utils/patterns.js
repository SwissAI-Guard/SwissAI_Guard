// src/utils/patterns.js

const patterns = {
  // Flexiblere AHV-Nummer (erkennt 7561234567812, 756.1234.5678.12 oder 756 1234 5678 12)
  ahv: {
    regex: /756(?:\.?\d{4}\.?\d{4}\.?\d{2}|\s?\d{4}\s?\d{4}\s?\d{2})/g,
    replacementPrefix: "AHV",
    name: "ahv"
  },
  // Schweizer Telefonnummern (Festnetz & Mobil)
  // Formate: +41 79 123 45 67, 079 123 45 67, 0041791234567, etc.
  phone: {
    regex: /(?:(?:(?:\+|00)41\s?|0)[1-9]\d\s?\d{3}\s?\d{2}\s?\d{2})/g,
    replacementPrefix: "TEL",
    name: "phone"
  },
  // E-Mail-Adressen
  email: {
    regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    replacementPrefix: "EMAIL",
    name: "email"
  },
  // IBAN (Fokus auf CH-IBANs, aber fängt auch andere)
  iban: {
    regex: /\b[A-Z]{2}\d{2}(?:[\s-]?[A-Z0-9]{4}){2,7}[\s-]?[A-Z0-9]{1,4}\b/gi,
    replacementPrefix: "IBAN",
    name: "iban"
  },
  // Kreditkartennummern (16 Ziffern, optional mit Leerzeichen oder Bindestrichen)
  creditcard: {
    regex: /\b(?:\d{4}[\s-]?){3}\d{4}\b/g,
    replacementPrefix: "CARD",
    name: "creditcard"
  },
  // IPv4 Adressen
  ipv4: {
    regex: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
    replacementPrefix: "IP",
    name: "ipv4"
  },
  // Unternehmens-Identifikationsnummer (UID): CHE-123.456.789 (MWST/HR)
  uid: {
    regex: /CHE-?\d{3}\.?\d{3}\.?\d{3}(?:\s?(?:MWST|TVA|IVA))?/gi,
    replacementPrefix: "UID",
    name: "uid"
  },
  // Schweizer Autokennzeichen: ZH 123456, BE 999, etc.
  plate: {
    regex: /\b(AG|AI|AR|BE|BL|BS|FR|GE|GL|GR|JU|LU|NE|NW|OW|SG|SH|SO|SZ|TG|TI|UR|VD|VS|ZG|ZH)\s[1-9]\d{0,5}\b/g,
    replacementPrefix: "PLATE",
    name: "plate"
  },
  // Schweizer Adress-Fragmente (Postleitzahl + Kantonskürzel in Klammern)
  ch_zip: {
    regex: /\b(?:CH-)?(?:1|2|3|4|5|6|7|8|9)\d{3}\s+[a-zA-ZäöüÄÖÜ\s]+(?:\s\((?:ZH|BE|LU|UR|SZ|OW|NW|GL|ZG|FR|SO|BS|BL|SH|AR|AI|SG|GR|AG|TG|TI|VD|VS|NE|GE|JU)\))?/g,
    replacementPrefix: "ADDRESS",
    name: "zip"
  },
  // Heuristik für Namen nach Anreden (DE, EN, FR, IT)
  name_salutation: {
    regex: /\b(Herr|Frau|Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.|Miss|M\.|Mme|Mlle|Sig\.|Sig\.ra|Dott\.|Dott\.ssa)([ \t]+)((?:[A-ZÄÖÜ][a-zäöüéèà]+[ \t]+){0,2}[A-ZÄÖÜ][a-zäöüéèà]+)\b/g,
    replacementPrefix: "NAME",
    name: "salutation"
  },
  // Heuristik für Namen nach Begrüssungen (DE, EN, FR, IT)
  name_greeting_start: {
    regex: /\b(Lieber|Liebe|Dear|Cher|Chère|Caro|Cara|Hallo|Hi|Hello|Salut|Ciao|Bonjour|Buongiorno)([ \t]+)((?:[A-ZÄÖÜ][a-zäöüéèà]+[ \t]+){0,2}[A-ZÄÖÜ][a-zäöüéèà]+)\b/gi,
    replacementPrefix: "NAME",
    name: "salutation"
  },
  // Heuristik für Namen in Grussformeln (DE, EN, FR, IT)
  name_greeting: {
    regex: /\b(Freundliche Grüsse|Mit freundlichen Grüssen|Beste Grüsse|Liebe Grüsse|Viele Grüsse|Herzliche Grüsse|LG|Best regards|Kind regards|Cheers|Yours sincerely|Sincerely|Cordialement|Meilleures salutations|Cordiali saluti|Distinti saluti)\b([\s\S]{1,15}?)\b([A-ZÄÖÜ][a-zäöüéèà]+(?:[ \t]+[A-ZÄÖÜ][a-zäöüéèà]+)?)\b/gi,
    replacementPrefix: "SIGNATURE",
    name: "greeting"
  },
  // Heuristik für Namen vor Berufsbezeichnungen
  name_jobtitle: {
    regex: /\b([A-ZÄÖÜ][a-zäöüéèà]+[ \t]+[A-ZÄÖÜ][a-zäöüéèà]+)[\s\n,]+(?:Wissenschaftliche Assistentin|Wissenschaftlicher Assistent|CEO|CTO|CFO|Manager|Director|Leiter|Leiterin|Projektleiter|Projektleiterin|Consultant|Berater|Beraterin)\b/gi,
    replacementPrefix: "NAME",
    name: "salutation"
  },
  // Heuristik für alleinstehende Namen (z.B. Empfängerlisten, CC), die alleine auf einer Zeile stehen, optional mit '(s)' oder ';'
  name_standalone: {
    regex: /^([ \t]*)([A-ZÄÖÜ][a-zäöüéèà\-]+[ \t]+[A-ZÄÖÜ][a-zäöüéèà\-]+)([ \t]*(?:\(s\))?[ \t]*[;]?[ \t]*)$/gm,
    replacementPrefix: "NAME",
    name: "salutation"
  }
};

// Export for testing (Node.js environment) and browser environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = patterns;
} else {
  window.swissAiPatterns = patterns;
}