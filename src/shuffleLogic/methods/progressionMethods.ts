import { ShuffleMethod } from '../types';
import { SHUFFLE_CONFIG } from '../config';
import { getRestDigits, ensureMinVariations } from '../utils';

export const progressionMethods: ShuffleMethod[] = [
  {
    id: 'arithmetic',
    name: 'Arithmetic Progression Generator',
    description: 'Creates variations using arithmetic progression patterns',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      SHUFFLE_CONFIG.prefixes.forEach(prefix => {
        // Generate arithmetic sequences with different starting points and differences
        for (let start = 0; start <= 9; start++) {
          for (let diff = 1; diff <= 5; diff++) {
            for (let offset = 0; offset <= 5; offset++) {
              const tempDigits = [...digits];
              for (let i = 0; i < digits.length; i++) {
                const num = (start + i * diff + offset) % 10;
                tempDigits[i] = num.toString();
              }
              numbers.push(prefix + tempDigits.join(''));
            }
          }
        }
      });

      return ensureMinVariations(numbers, phoneNumber, SHUFFLE_CONFIG.prefixes);
    }
  },
  {
    id: 'geometric',
    name: 'Geometric Progression Generator',
    description: 'Creates variations using geometric progression patterns',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      SHUFFLE_CONFIG.prefixes.forEach(prefix => {
        // Generate geometric sequences with different ratios
        for (let start = 1; start <= 9; start++) {
          for (let ratio = 2; ratio <= 4; ratio++) {
            for (let offset = 0; offset <= 5; offset++) {
              const tempDigits = [...digits];
              for (let i = 0; i < digits.length; i++) {
                const num = (start * Math.pow(ratio, i) + offset) % 10;
                tempDigits[i] = Math.floor(num).toString();
              }
              numbers.push(prefix + tempDigits.join(''));
            }
          }
        }
      });

      return ensureMinVariations(numbers, phoneNumber, SHUFFLE_CONFIG.prefixes);
    }
  }
];