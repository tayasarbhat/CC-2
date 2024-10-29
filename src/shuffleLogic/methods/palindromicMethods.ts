import { ShuffleMethod } from '../types';
import { SHUFFLE_CONFIG } from '../config';
import { getRestDigits, ensureMinVariations } from '../utils';

export const palindromicMethods: ShuffleMethod[] = [
  {
    id: 'palindromic',
    name: 'Palindromic Number Shuffler',
    description: 'Identifies and modifies palindromic patterns in the number',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      SHUFFLE_CONFIG.prefixes.forEach(prefix => {
        let palindromeFound = false;
        let positions: {
          center: number;
          pairs: number[][];
          rest: number[];
        } = {
          center: -1,
          pairs: [],
          rest: []
        };

        // Find palindrome pattern
        for (let i = 0; i <= digits.length - 5; i++) {
          if (digits[i] === digits[i + 4] && digits[i + 1] === digits[i + 3]) {
            palindromeFound = true;
            positions = {
              center: i + 2,
              pairs: [
                [i, i + 4],
                [i + 1, i + 3]
              ],
              rest: []
            };
            for (let j = 0; j < digits.length; j++) {
              if (![i, i + 1, i + 2, i + 3, i + 4].includes(j)) {
                positions.rest.push(j);
              }
            }
            break;
          }
        }

        if (palindromeFound) {
          // Change central digit
          for (let d = 0; d <= 9; d++) {
            let tempDigits = [...digits];
            tempDigits[positions.center] = d.toString();
            numbers.push(prefix + tempDigits.join(''));
          }

          // Change pairs symmetrically
          positions.pairs.forEach(pair => {
            for (let d = 0; d <= 9; d++) {
              let tempDigits = [...digits];
              tempDigits[pair[0]] = d.toString();
              tempDigits[pair[1]] = d.toString();
              numbers.push(prefix + tempDigits.join(''));
            }
          });

          // Change both pairs together
          for (let outer = 0; outer <= 9; outer++) {
            for (let inner = 0; inner <= 9; inner++) {
              let tempDigits = [...digits];
              tempDigits[positions.pairs[0][0]] = outer.toString();
              tempDigits[positions.pairs[0][1]] = outer.toString();
              tempDigits[positions.pairs[1][0]] = inner.toString();
              tempDigits[positions.pairs[1][1]] = inner.toString();
              numbers.push(prefix + tempDigits.join(''));
            }
          }

          // Change rest positions
          positions.rest.forEach(pos => {
            for (let d = 0; d <= 9; d++) {
              if (digits[pos] !== d.toString()) {
                let tempDigits = [...digits];
                tempDigits[pos] = d.toString();
                numbers.push(prefix + tempDigits.join(''));
              }
            }
          });
        } else {
          // If no palindrome found, change each digit
          for (let pos = 0; pos < digits.length; pos++) {
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