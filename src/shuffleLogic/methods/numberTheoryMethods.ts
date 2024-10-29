import { ShuffleMethod } from '../types';
import { SHUFFLE_CONFIG } from '../config';
import { getRestDigits, ensureMinVariations } from '../utils';

function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

function getTriangularNumber(n: number): number {
  return (n * (n + 1)) / 2;
}

export const numberTheoryMethods: ShuffleMethod[] = [
  {
    id: 'prime-position',
    name: 'Prime Position Shuffler',
    description: 'Modifies digits at prime number positions',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      SHUFFLE_CONFIG.prefixes.forEach(prefix => {
        // Find prime positions
        const primePositions = digits.map((_, i) => i).filter(isPrime);

        // Modify prime positions
        for (const pos of primePositions) {
          for (let d = 0; d <= 9; d++) {
            if (digits[pos] !== d.toString()) {
              const tempDigits = [...digits];
              tempDigits[pos] = d.toString();
              numbers.push(prefix + tempDigits.join(''));
            }
          }
        }

        // Generate combinations of prime position modifications
        for (let i = 0; i < primePositions.length - 1; i++) {
          for (let j = i + 1; j < primePositions.length; j++) {
            for (let d1 = 0; d1 <= 9; d1++) {
              for (let d2 = 0; d2 <= 9; d2++) {
                const tempDigits = [...digits];
                tempDigits[primePositions[i]] = d1.toString();
                tempDigits[primePositions[j]] = d2.toString();
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
    id: 'triangular',
    name: 'Triangular Number Pattern',
    description: 'Generates variations based on triangular number sequences',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      SHUFFLE_CONFIG.prefixes.forEach(prefix => {
        // Generate variations using triangular numbers
        for (let start = 0; start <= 9; start++) {
          for (let offset = 0; offset <= 5; offset++) {
            const tempDigits = [...digits];
            for (let i = 0; i < digits.length; i++) {
              const triangular = (getTriangularNumber(i + start) + offset) % 10;
              tempDigits[i] = triangular.toString();
            }
            numbers.push(prefix + tempDigits.join(''));
          }
        }
      });

      return ensureMinVariations(numbers, phoneNumber, SHUFFLE_CONFIG.prefixes);
    }
  }
];