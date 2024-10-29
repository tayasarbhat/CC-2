import { ShuffleMethod } from '../types';
import { SHUFFLE_CONFIG } from '../config';
import { getRestDigits, ensureMinVariations } from '../utils';

export const advancedMethods: ShuffleMethod[] = [
  {
    id: 'advanced',
    name: 'Advanced Pattern Shuffler',
    description: 'Intelligently shuffles digits based on common number patterns and preferences',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      SHUFFLE_CONFIG.prefixes.forEach(prefix => {
        // Shuffle digits at positions 3 and 4 after code prefix
        let position3 = 3 - prefix.length;
        let position4 = 4 - prefix.length;
        [position3, position4].forEach(pos => {
          if (pos >= 0 && pos < digits.length) {
            for (let d = 0; d <= 9; d++) {
              if (digits[pos] !== d.toString()) {
                let tempDigits = [...digits];
                tempDigits[pos] = d.toString();
                numbers.push(prefix + tempDigits.join(''));
              }
            }
          }
        });

        // Shuffle other digits one at a time
        for (let pos = 0; pos < digits.length; pos++) {
          if (pos !== position3 && pos !== position4) {
            for (let d = 0; d <= 9; d++) {
              if (digits[pos] !== d.toString()) {
                let tempDigits = [...digits];
                tempDigits[pos] = d.toString();
                numbers.push(prefix + tempDigits.join(''));
              }
            }
          }
        }
      });

      return ensureMinVariations(numbers, phoneNumber, SHUFFLE_CONFIG.prefixes);
    }
  }
];