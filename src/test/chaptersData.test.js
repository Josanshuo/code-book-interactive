import { describe, it, expect } from 'vitest';
import { chaptersData } from '../data/chaptersData';

describe('chaptersData', () => {
  it('should contain exactly 28 chapters', () => {
    expect(chaptersData).toHaveLength(28);
  });

  it('should have chapters numbered 1 through 28', () => {
    const nums = chaptersData.map((c) => c.num);
    for (let i = 1; i <= 28; i++) {
      expect(nums).toContain(i);
    }
  });

  it('should have sequential numbering', () => {
    chaptersData.forEach((ch, index) => {
      expect(ch.num).toBe(index + 1);
    });
  });

  it('should have required fields on every chapter', () => {
    chaptersData.forEach((ch) => {
      expect(ch).toHaveProperty('num');
      expect(ch).toHaveProperty('title');
      expect(ch).toHaveProperty('summary');
      expect(ch).toHaveProperty('challenge');
      expect(ch).toHaveProperty('hint');
    });
  });

  it('should have non-empty strings for all fields', () => {
    chaptersData.forEach((ch) => {
      expect(typeof ch.title).toBe('string');
      expect(ch.title.length).toBeGreaterThan(0);
      expect(typeof ch.summary).toBe('string');
      expect(ch.summary.length).toBeGreaterThan(0);
      expect(typeof ch.challenge).toBe('string');
      expect(ch.challenge.length).toBeGreaterThan(0);
      expect(typeof ch.hint).toBe('string');
      expect(ch.hint.length).toBeGreaterThan(0);
    });
  });

  it('should have unique chapter numbers', () => {
    const nums = chaptersData.map((c) => c.num);
    const unique = new Set(nums);
    expect(unique.size).toBe(nums.length);
  });

  it('should have unique chapter titles', () => {
    const titles = chaptersData.map((c) => c.title);
    const unique = new Set(titles);
    expect(unique.size).toBe(titles.length);
  });

  it('should not contain the known typo "An closed circuit"', () => {
    const ch4 = chaptersData.find((c) => c.num === 4);
    expect(ch4.summary).not.toContain('An closed circuit');
    expect(ch4.summary).toContain('A closed circuit');
  });
});
