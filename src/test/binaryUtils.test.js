import { describe, it, expect } from 'vitest';
import {
  toBinary,
  toOctal,
  toHex,
  charToHexByte,
  charToBinaryByte,
  generateCombinations,
} from '../utils/binaryUtils';

describe('binaryUtils', () => {
  describe('toBinary', () => {
    it('should convert 0 to 8-bit binary string', () => {
      expect(toBinary(0)).toBe('00000000');
    });

    it('should convert 42 to 8-bit binary', () => {
      expect(toBinary(42)).toBe('00101010');
    });

    it('should convert 255 to 8-bit binary', () => {
      expect(toBinary(255)).toBe('11111111');
    });

    it('should respect custom bit width', () => {
      expect(toBinary(5, 4)).toBe('0101');
      expect(toBinary(3, 2)).toBe('11');
    });

    it('should handle string input', () => {
      expect(toBinary('10', 8)).toBe('00001010');
    });

    it('should return empty string for NaN', () => {
      expect(toBinary('abc')).toBe('');
      expect(toBinary(NaN)).toBe('');
    });

    it('should mask overflow values to bit width', () => {
      // 256 in 8 bits should wrap to 0
      expect(toBinary(256, 8)).toBe('00000000');
    });
  });

  describe('toOctal', () => {
    it('should convert 0 to "0"', () => {
      expect(toOctal(0)).toBe('0');
    });

    it('should convert 42 to "52"', () => {
      expect(toOctal(42)).toBe('52');
    });

    it('should convert 255 to "377"', () => {
      expect(toOctal(255)).toBe('377');
    });

    it('should handle string input', () => {
      expect(toOctal('8')).toBe('10');
    });

    it('should return empty string for NaN', () => {
      expect(toOctal('xyz')).toBe('');
    });
  });

  describe('toHex', () => {
    it('should convert 0 with default 2-char padding', () => {
      expect(toHex(0)).toBe('00');
    });

    it('should convert 255 to "FF"', () => {
      expect(toHex(255)).toBe('FF');
    });

    it('should convert 42 to "2A"', () => {
      expect(toHex(42)).toBe('2A');
    });

    it('should respect custom padding', () => {
      expect(toHex(15, 4)).toBe('000F');
    });

    it('should handle string input', () => {
      expect(toHex('16')).toBe('10');
    });

    it('should return empty string for NaN', () => {
      expect(toHex('invalid')).toBe('');
    });
  });

  describe('charToHexByte', () => {
    it('should convert "A" to "41"', () => {
      expect(charToHexByte('A')).toBe('41');
    });

    it('should convert "a" to "61"', () => {
      expect(charToHexByte('a')).toBe('61');
    });

    it('should convert space to "20"', () => {
      expect(charToHexByte(' ')).toBe('20');
    });

    it('should convert "0" to "30"', () => {
      expect(charToHexByte('0')).toBe('30');
    });
  });

  describe('charToBinaryByte', () => {
    it('should convert "A" to 8-bit binary', () => {
      expect(charToBinaryByte('A')).toBe('01000001');
    });

    it('should convert space to "00100000"', () => {
      expect(charToBinaryByte(' ')).toBe('00100000');
    });
  });

  describe('generateCombinations', () => {
    it('should generate 2 combinations for 1 bit', () => {
      const result = generateCombinations(1);
      expect(result).toEqual(['0', '1']);
    });

    it('should generate 4 combinations for 2 bits', () => {
      const result = generateCombinations(2);
      expect(result).toEqual(['00', '01', '10', '11']);
    });

    it('should generate 8 combinations for 3 bits', () => {
      const result = generateCombinations(3);
      expect(result).toHaveLength(8);
      expect(result[0]).toBe('000');
      expect(result[7]).toBe('111');
    });

    it('should pad all values to the specified bit width', () => {
      const result = generateCombinations(4);
      result.forEach((combo) => {
        expect(combo).toHaveLength(4);
      });
    });

    it('should generate 2^n total combinations', () => {
      expect(generateCombinations(5)).toHaveLength(32);
      expect(generateCombinations(6)).toHaveLength(64);
    });
  });
});
