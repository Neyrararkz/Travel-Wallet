import { describe, it, expect } from 'vitest';
import { convertToKzt, roundMoney, formatKzt } from './money';

describe('money', () => {
  it('100 USD при курсе 0.002 = 50000 ₸', () => {
    expect(convertToKzt(100, 'usd', { usd: 0.002 })).toBe(50000);
  });
  it('тенге не пересчитывается', () => {
    expect(convertToKzt(1500, 'kzt', {})).toBe(1500);
  });
  it('неизвестная валюта -> null', () => {
    expect(convertToKzt(100, 'xyz', { usd: 0.002 })).toBeNull();
  });
  it('roundMoney(0.1 + 0.2) = 0.3', () => {
    expect(roundMoney(0.1 + 0.2)).toBe(0.3);
  });
  it('formatKzt', () => {
    expect(formatKzt(1234567.5).replace(/[\u00a0\u202f]/g, ' ')).toBe('1 234 567,50 ₸');
  });
});