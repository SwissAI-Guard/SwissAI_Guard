// tests/patterns.test.js

const patterns = require('../src/utils/patterns');

describe('SwissGPT Guard Patterns', () => {
  
  describe('AHV Number Regex', () => {
    const regex = patterns.ahv.regex;

    beforeEach(() => {
      regex.lastIndex = 0;
    });

    test('should match valid AHV numbers', () => {
      expect(regex.test('756.1234.5678.90')).toBe(true);
      regex.lastIndex = 0;
      expect(regex.test('Meine AHV ist 756.9876.5432.10.')).toBe(true);
      regex.lastIndex = 0;
      expect(regex.test('7561234567890')).toBe(true); // Without dots
      regex.lastIndex = 0;
      expect(regex.test('756 1234 5678 90')).toBe(true); // With spaces
    });

    test('should not match invalid AHV numbers', () => {
      expect(regex.test('123.4567.8901.23')).toBe(false); // Doesn't start with 756
      regex.lastIndex = 0;
      expect(regex.test('756.123.456.78')).toBe(false); // Wrong format
    });
  });

  describe('Swiss Phone Number Regex', () => {
    const regex = patterns.phone.regex;

    beforeEach(() => {
      regex.lastIndex = 0;
    });

    test('should match valid Swiss phone numbers', () => {
      expect(regex.test('+41 79 123 45 67')).toBe(true);
      regex.lastIndex = 0;
      expect(regex.test('079 123 45 67')).toBe(true);
      regex.lastIndex = 0;
      expect(regex.test('0041791234567')).toBe(true);
      regex.lastIndex = 0;
      expect(regex.test('044 123 45 67')).toBe(true); // Festnetz
    });

    test('should not match invalid phone numbers', () => {
      expect(regex.test('+49 170 1234567')).toBe(false); // German number
      regex.lastIndex = 0;
      expect(regex.test('12345')).toBe(false); // Too short
    });
  });

  describe('Email Regex', () => {
    const regex = patterns.email.regex;

    beforeEach(() => {
      regex.lastIndex = 0;
    });

    test('should match valid emails', () => {
      expect(regex.test('test@example.com')).toBe(true);
      regex.lastIndex = 0;
      expect(regex.test('user.name+tag@domain.co.uk')).toBe(true);
    });

    test('should not match invalid emails', () => {
      expect(regex.test('test@example')).toBe(false);
      regex.lastIndex = 0;
      expect(regex.test('test.example.com')).toBe(false);
    });
  });

  describe('IBAN Regex', () => {
    const regex = patterns.iban.regex;

    beforeEach(() => {
      regex.lastIndex = 0;
    });

    test('should match valid Swiss IBANs', () => {
      expect(regex.test('CH93 0000 0000 0000 0000 0')).toBe(true);
      regex.lastIndex = 0;
      expect(regex.test('CH9300000000000000000')).toBe(true);
    });

    test('should not match invalid IBANs', () => {
      expect(regex.test('CH93 0000')).toBe(false); // Too short
    });
  });

  describe('Credit Card Regex', () => {
    const regex = patterns.creditcard.regex;

    beforeEach(() => {
      regex.lastIndex = 0;
    });

    test('should match valid credit cards', () => {
      expect(regex.test('1234-5678-9012-3456')).toBe(true);
      regex.lastIndex = 0;
      expect(regex.test('1234 5678 9012 3456')).toBe(true);
      regex.lastIndex = 0;
      expect(regex.test('1234567890123456')).toBe(true);
    });

    test('should not match invalid credit cards', () => {
      expect(regex.test('1234-5678-9012')).toBe(false); // Too short
    });
  });

  describe('IPv4 Regex', () => {
    const regex = patterns.ipv4.regex;

    beforeEach(() => {
      regex.lastIndex = 0;
    });

    test('should match valid IPv4 addresses', () => {
      expect(regex.test('192.168.1.1')).toBe(true);
      regex.lastIndex = 0;
      expect(regex.test('10.0.0.255')).toBe(true);
    });

    test('should not match invalid IPv4 addresses', () => {
      expect(regex.test('256.256.256.256')).toBe(false); // Out of range
      regex.lastIndex = 0;
      expect(regex.test('192.168.1')).toBe(false); // Too short
    });
  });

  describe('UID Regex', () => {
    const regex = patterns.uid.regex;

    beforeEach(() => {
      regex.lastIndex = 0;
    });

    test('should match valid UIDs', () => {
      expect(regex.test('CHE-123.456.789')).toBe(true);
      regex.lastIndex = 0;
      expect(regex.test('CHE123456789')).toBe(true);
      regex.lastIndex = 0;
      expect(regex.test('CHE-123.456.789 MWST')).toBe(true);
    });

    test('should not match invalid UIDs', () => {
      expect(regex.test('CHE-12.456.789')).toBe(false); // Too short
    });
  });

  describe('License Plate Regex', () => {
    const regex = patterns.plate.regex;

    beforeEach(() => {
      regex.lastIndex = 0;
    });

    test('should match valid license plates', () => {
      expect(regex.test('ZH 123456')).toBe(true);
      regex.lastIndex = 0;
      expect(regex.test('BE 999')).toBe(true);
    });

    test('should not match invalid license plates', () => {
      expect(regex.test('XX 123456')).toBe(false); // Invalid canton
      regex.lastIndex = 0;
      expect(regex.test('ZH 1234567')).toBe(false); // Too long
    });
  });

  describe('Swiss ZIP Regex', () => {
    const regex = patterns.ch_zip.regex;

    beforeEach(() => {
      regex.lastIndex = 0;
    });

    test('should match valid ZIP codes', () => {
      expect(regex.test('8000 Zürich')).toBe(true);
      regex.lastIndex = 0;
      expect(regex.test('CH-3000 Bern')).toBe(true);
      regex.lastIndex = 0;
      expect(regex.test('6000 Luzern (LU)')).toBe(true);
    });

    test('should not match invalid ZIP codes', () => {
      expect(regex.test('0123 Test')).toBe(false); // Invalid start digit
    });
  });

  describe('Name Salutation Regex', () => {
    const regex = patterns.name_salutation.regex;

    beforeEach(() => {
      regex.lastIndex = 0;
    });

    test('should match valid salutations', () => {
      expect(regex.test('Herr Müller')).toBe(true);
      regex.lastIndex = 0;
      expect(regex.test('Frau Dr. Meier')).toBe(true);
      regex.lastIndex = 0;
      expect(regex.test('Prof. Schmid')).toBe(true);
    });

    test('should not match invalid salutations', () => {
      expect(regex.test('Herr')).toBe(false); // Missing name
      regex.lastIndex = 0;
      expect(regex.test('Frau 123')).toBe(false); // Invalid name
    });
  });

  describe('Name Greeting Regex', () => {
    const regex = patterns.name_greeting.regex;

    beforeEach(() => {
      regex.lastIndex = 0;
    });

    test('should match valid greetings', () => {
      expect(regex.test('Freundliche Grüsse\n\nMax Muster')).toBe(true);
      regex.lastIndex = 0;
      expect(regex.test('Best regards,\nAnna Schmidt')).toBe(true);
    });

    test('should not match invalid greetings', () => {
      expect(regex.test('Freundliche Grüsse')).toBe(false); // Missing name
    });
  });

  describe('Name Job Title Regex', () => {
    const regex = patterns.name_jobtitle.regex;

    beforeEach(() => {
      regex.lastIndex = 0;
    });

    test('should match valid job titles', () => {
      expect(regex.test('Stephanie Kalt\nWissenschaftliche Assistentin')).toBe(true);
      regex.lastIndex = 0;
      expect(regex.test('Hans Müller, CEO')).toBe(true);
    });

    test('should not match invalid job titles', () => {
      expect(regex.test('Hans Müller ist cool')).toBe(false);
    });
  });

});