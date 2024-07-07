import { encryptString, decryptString } from '@utilities/crypto.util';

describe('Crypt and Decrypt Test', () => {
  const targetString = '김동현';

  const encodedString = encryptString(targetString);

  const decodedString = decryptString(encodedString);

  test('Compare', () => {
    expect(decodedString).toBe(targetString);
  });
});
