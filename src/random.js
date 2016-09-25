// This is the minimized-transformed version of meteor/random package: https://github.com/meteor/meteor/tree/devel/packages/random

import nodeCrypto from 'crypto';

const UNMISTAKABLE_CHARS = '23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz';

const hexString = function hexString(digits) {
  const numBytes = Math.ceil(digits / 2);

  let bytes;

  try {
    bytes = nodeCrypto.randomBytes(numBytes);
  } catch (e) {
    bytes = nodeCrypto.pseudoRandomBytes(numBytes);
  }

  const result = bytes.toString('hex');

  return result.substring(0, digits);
};

const fraction = function fraction() {
  return parseInt(hexString(8), 16) * 2.3283064365386963e-10; // 2^-32
};

const choice = function choice(arrayOrString) {
  const index = Math.floor(fraction() * arrayOrString.length);

  if (typeof arrayOrString === 'string') {
    return arrayOrString.substr(index, 1);
  }

  return arrayOrString[index];
};

const randomString = function randomString(charsCount, alphabet) {
  const digits = [];

  for (let i = 0; i < charsCount; i++) {
    digits[i] = choice(alphabet);
  }

  return digits.join('');
};

export const id = function id(charsCount = 17) {
  return randomString(charsCount, UNMISTAKABLE_CHARS);
};
