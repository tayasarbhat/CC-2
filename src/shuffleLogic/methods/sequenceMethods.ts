import { ShuffleMethod } from '../types';
import { SHUFFLE_CONFIG } from '../config';
import { getRestDigits, ensureMinVariations } from '../utils';

export const sequenceMethods: ShuffleMethod[] = [
  {
    id: 'fibonacci',
    name: 'Fibonacci Sequence Shuffler',
    description: 'Applies Fibonacci sequence patterns to generate variations',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);
      const fibonacci = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34];

      SHUFFLE_CONFIG.prefixes.forEach(prefix => {
        // Generate variations using Fibonacci positions and values
        for (let i = 0; i < digits.length; i++) {
          for (let j = i + 1; j < digits.length; j++) {
            for (let f = 0; f < fibonacci.length; f++) {
              const tempDigits = [...digits];
              tempDigits[i] = (fibonacci[f] % 10).toString();
              tempDigits[j] = (fibonacci[(f + 1) % fibonacci.length] % 10).toString();
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
        for (let ratio = 2; ratio <= 5; ratio++) {
          for (let start = 1; start <= 9; start++) {
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