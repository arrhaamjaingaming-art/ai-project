import { test } from 'node:test';
import assert from 'node:assert';
import { isRtlLanguage, t, LANGUAGES } from './translations.ts';

test('isRtlLanguage identifies Urdu as RTL and others as LTR', () => {
  assert.strictEqual(isRtlLanguage('ur'), true);
  assert.strictEqual(isRtlLanguage('en'), false);
  assert.strictEqual(isRtlLanguage('hi'), false);
  assert.strictEqual(isRtlLanguage('ta'), false);
});

test('translations dictionary contains all 12 requested regional languages', () => {
  const codes = LANGUAGES.map((l) => l.code);
  const expected = ['en', 'hi', 'ta', 'te', 'kn', 'ml', 'mr', 'bn', 'gu', 'pa', 'or', 'ur'];
  for (const exp of expected) {
    assert.ok(codes.includes(exp as any), `Expected language code ${exp} to be present`);
  }
});

test('t() returns localized strings correctly with fallback', () => {
  const enTitle = t('diagnoseMyCrop', 'en');
  assert.strictEqual(enTitle, 'Diagnose My Crop');

  const hiTitle = t('diagnoseMyCrop', 'hi');
  assert.ok(hiTitle.includes('रोग'), 'Hindi translation should contain रोग');

  const urTitle = t('diagnoseMyCrop', 'ur');
  assert.ok(urTitle.includes('فصل'), 'Urdu translation should contain فصل');

  // Fallback to English for non-existent key
  const fallback = t('nonExistentKey123', 'en');
  assert.strictEqual(fallback, 'nonExistentKey123');
});
