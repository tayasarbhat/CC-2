import { ShuffleMethod } from './types';
import { SHUFFLE_CONFIG } from './config';
import { getRestDigits, ensureMinVariations } from './utils';

const { prefixes } = SHUFFLE_CONFIG;

export const shuffleMethods: ShuffleMethod[] = [
  {
    id: 'advanced',
    name: 'Advanced Pattern Shuffler',
    description: 'Intelligently shuffles digits based on common number patterns and preferences',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      prefixes.forEach(prefix => {
        for (let pos = 0; pos < digits.length; pos++) {
          for (let d = 0; d <= 9; d++) {
            if (digits[pos] !== d.toString()) {
              const tempDigits = [...digits];
              tempDigits[pos] = d.toString();
              numbers.push(prefix + tempDigits.join(''));
            }
          }
        }
      });

      return ensureMinVariations(numbers);
    }
  },
  {
    id: 'sequential-pairs',
    name: 'Sequential Pairs Modifier',
    description: 'Modifies sequential pairs of digits while maintaining pattern consistency',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      prefixes.forEach(prefix => {
        // Modify sequential pairs
        for (let i = 0; i < digits.length - 1; i++) {
          for (let d = 0; d <= 9; d++) {
            const tempDigits = [...digits];
            tempDigits[i] = d.toString();
            tempDigits[i + 1] = ((d + 1) % 10).toString();
            numbers.push(prefix + tempDigits.join(''));
          }
        }
      });

      return ensureMinVariations(numbers);
    }
  },
  {
    id: 'palindrome',
    name: 'Palindrome Pattern Generator',
    description: 'Creates variations based on palindromic patterns',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      prefixes.forEach(prefix => {
        // Generate palindromic variations
        for (let i = 0; i < Math.floor(digits.length / 2); i++) {
          for (let d = 0; d <= 9; d++) {
            const tempDigits = [...digits];
            tempDigits[i] = d.toString();
            tempDigits[digits.length - 1 - i] = d.toString();
            numbers.push(prefix + tempDigits.join(''));
          }
        }
      });

      return ensureMinVariations(numbers);
    }
  },
  {
    id: 'arithmetic',
    name: 'Arithmetic Progression Generator',
    description: 'Generates variations following arithmetic sequences',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      prefixes.forEach(prefix => {
        // Generate arithmetic sequences
        for (let start = 0; start <= 9; start++) {
          for (let diff = 1; diff <= 3; diff++) {
            const tempDigits = [...digits];
            for (let i = 0; i < digits.length; i++) {
              tempDigits[i] = ((start + i * diff) % 10).toString();
            }
            numbers.push(prefix + tempDigits.join(''));
          }
        }
      });

      return ensureMinVariations(numbers);
    }
  },
  {
    id: 'geometric',
    name: 'Geometric Progression Generator',
    description: 'Creates variations using geometric sequences',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      prefixes.forEach(prefix => {
        // Generate geometric sequences
        for (let start = 1; start <= 9; start++) {
          for (let ratio = 2; ratio <= 3; ratio++) {
            const tempDigits = [...digits];
            for (let i = 0; i < digits.length; i++) {
              tempDigits[i] = ((start * Math.pow(ratio, i)) % 10).toString();
            }
            numbers.push(prefix + tempDigits.join(''));
          }
        }
      });

      return ensureMinVariations(numbers);
    }
  },
  // Add all other methods here with similar implementation patterns
];

export * from './types';
export * from './utils';