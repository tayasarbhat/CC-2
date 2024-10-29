import { ShuffleMethod } from '../types';
import { SHUFFLE_CONFIG } from '../config';
import { getRestDigits, ensureMinVariations } from '../utils';

export const basicMethods: ShuffleMethod[] = [
  {
    id: 'advanced',
    name: 'Advanced Pattern Shuffler',
    description: 'Intelligently shuffles digits based on common number patterns and preferences',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      SHUFFLE_CONFIG.prefixes.forEach(prefix => {
        // Generate more variations by modifying multiple positions
        for (let pos1 = 0; pos1 < digits.length; pos1++) {
          for (let pos2 = pos1 + 1; pos2 < digits.length; pos2++) {
            for (let d1 = 0; d1 <= 9; d1++) {
              for (let d2 = 0; d2 <= 9; d2++) {
                const tempDigits = [...digits];
                tempDigits[pos1] = d1.toString();
                tempDigits[pos2] = d2.toString();
                numbers.push(prefix + tempDigits.join(''));
              }
            }
          }
        }
      });

      return ensureMinVariations(numbers, phoneNumber, SHUFFLE_CONFIG.prefixes);
    }
  },
  {
    id: 'repeating',
    name: 'Repeating Pattern Analyzer',
    description: 'Identifies and modifies repeating digit patterns',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      SHUFFLE_CONFIG.prefixes.forEach(prefix => {
        // Generate variations by modifying consecutive digits
        for (let i = 0; i < digits.length - 1; i++) {
          for (let d1 = 0; d1 <= 9; d1++) {
            for (let d2 = 0; d2 <= 9; d2++) {
              const tempDigits = [...digits];
              tempDigits[i] = d1.toString();
              tempDigits[i + 1] = d2.toString();
              numbers.push(prefix + tempDigits.join(''));
            }
          }
        }
      });

      return ensureMinVariations(numbers, phoneNumber, SHUFFLE_CONFIG.prefixes);
    }
  }
];