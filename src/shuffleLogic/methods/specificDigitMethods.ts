import { ShuffleMethod } from '../types';
import { SHUFFLE_CONFIG } from '../config';
import { getRestDigits, ensureMinVariations } from '../utils';

export const specificDigitMethods: ShuffleMethod[] = [
  {
    id: 'specific-digit',
    name: 'Specific Digit Shuffler',
    description: 'Targets specific digits and positions for intelligent variations',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      SHUFFLE_CONFIG.prefixes.forEach(prefix => {
        // Shuffle first two positions
        for (let pos = 0; pos < 2; pos++) {
          for (let d = 0; d <= 9; d++) {
            if (digits[pos] !== d.toString()) {
              let tempDigits = [...digits];
              tempDigits[pos] = d.toString();
              numbers.push(prefix + tempDigits.join(''));
            }
          }
        }

        // Find and shuffle repeating digits
        let digitCounts = new Map<string, number[]>();
        digits.forEach((digit, index) => {
          if (!digitCounts.has(digit)) {
            digitCounts.set(digit, []);
          }
          digitCounts.get(digit)?.push(index);
        });

        digitCounts.forEach((positions, digit) => {
          if (positions.length > 1) {
            for (let d = 0; d <= 9; d++) {
              if (d.toString() !== digit) {
                let tempDigits = [...digits];
                positions.forEach(pos => {
                  tempDigits[pos] = d.toString();
                });
                numbers.push(prefix + tempDigits.join(''));
              }
            }
          }
        });

        // Shuffle remaining positions individually
        for (let pos = 2; pos < digits.length; pos++) {
          for (let d = 0; d <= 9; d++) {
            if (digits[pos] !== d.toString()) {
              let tempDigits = [...digits];
              tempDigits[pos] = d.toString();
              numbers.push(prefix + tempDigits.join(''));
            }
          }
        }
      });

      return ensureMinVariations(numbers, phoneNumber, SHUFFLE_CONFIG.prefixes);
    }
  }
];