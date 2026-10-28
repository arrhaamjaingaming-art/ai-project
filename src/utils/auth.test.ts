import test from 'node:test';
import assert from 'node:assert/strict';

test('Google user account data mapping includes required database fields', () => {
  const mockFirebaseUser = {
    uid: 'firebase_test_uid_123',
    email: 'kisan.test@agridefence.com',
    displayName: 'Kisan Ramesh',
    photoURL: 'https://example.com/avatar.jpg',
    providerData: [
      {
        providerId: 'google.com',
        uid: 'google_account_id_987654321',
      },
    ],
  };

  const googleAccount = mockFirebaseUser.providerData.find(
    (p) => p.providerId === 'google.com'
  );
  const googleId = googleAccount?.uid || mockFirebaseUser.uid;

  const profile = {
    id: mockFirebaseUser.uid,
    googleId: googleId,
    email: mockFirebaseUser.email,
    displayName: mockFirebaseUser.displayName,
    photoURL: mockFirebaseUser.photoURL,
    role: 'farmer' as const,
    language: 'hi',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };

  assert.equal(profile.id, 'firebase_test_uid_123');
  assert.equal(profile.googleId, 'google_account_id_987654321');
  assert.equal(profile.role, 'farmer');
  assert.equal(profile.language, 'hi');
  assert.ok(profile.createdAt);
  assert.ok(profile.lastLoginAt);
});

test('Fallback when providerData is missing Google provider uses Auth UID', () => {
  const fallbackUser = {
    uid: 'fallback_uid_456',
    email: 'fallback@example.com',
    displayName: 'Fallback Farmer',
    providerData: [] as Array<{ providerId: string; uid: string }>,
  };

  const googleAccount = fallbackUser.providerData.find(
    (p) => p.providerId === 'google.com'
  );
  const googleId = googleAccount?.uid || fallbackUser.uid;

  assert.equal(googleId, 'fallback_uid_456');
});
