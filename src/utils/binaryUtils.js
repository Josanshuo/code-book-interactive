/**
 * Shared binary, hex, and octal conversion utilities.
 * Extracted from duplicate implementations across chapters 2, 10, 11, 12, 16, 21.
 */

/**
 * Convert a decimal number to a binary string with specified bit width.
 * @param {number} value - The decimal number to convert.
 * @param {number} [bits=8] - The number of bits to pad to.
 * @returns {string} The binary string representation.
 */
export function toBinary(value, bits = 8) {
  const num = typeof value === 'string' ? parseInt(value, 10) : value;
  if (isNaN(num)) return '';
  return (num & ((1 << bits) - 1)).toString(2).padStart(bits, '0');
}

/**
 * Convert a decimal number to an octal string.
 * @param {number|string} value - The decimal number to convert.
 * @returns {string} The octal string representation.
 */
export function toOctal(value) {
  const num = typeof value === 'string' ? parseInt(value, 10) : value;
  if (isNaN(num)) return '';
  return num.toString(8);
}

/**
 * Convert a decimal number to a hex string with optional padding.
 * @param {number|string} value - The decimal number to convert.
 * @param {number} [padLength=2] - Minimum hex string length.
 * @returns {string} The uppercase hex string.
 */
export function toHex(value, padLength = 2) {
  const num = typeof value === 'string' ? parseInt(value, 10) : value;
  if (isNaN(num)) return '';
  return num.toString(16).toUpperCase().padStart(padLength, '0');
}

/**
 * Convert a character to its ASCII hex byte representation.
 * @param {string} char - A single character.
 * @returns {string} Two-digit uppercase hex string.
 */
export function charToHexByte(char) {
  return char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0');
}

/**
 * Convert a character to its 8-bit binary representation.
 * @param {string} char - A single character.
 * @returns {string} 8-bit binary string.
 */
export function charToBinaryByte(char) {
  return char.charCodeAt(0).toString(2).padStart(8, '0');
}

/**
 * Generate all binary combinations for a given bit depth.
 * @param {number} bits - Number of bits (1-8 recommended).
 * @returns {string[]} Array of binary strings for all 2^bits combinations.
 */
export function generateCombinations(bits) {
  const total = Math.pow(2, bits);
  const list = [];
  for (let i = 0; i < total; i++) {
    list.push(i.toString(2).padStart(bits, '0'));
  }
  return list;
}
