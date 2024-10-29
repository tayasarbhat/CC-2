import { ShuffleMethod } from '../types';
import { SHUFFLE_CONFIG } from '../config';
import { getRestDigits, ensureMinVariations } from '../utils';

function permute(arr: any[]) {
  let results: any[] = [];

  function helper(tempArr: any[], m: any[] = []) {
    if (tempArr.length === 0) {
      results.push(m);
    } else {
      for (let i = 0; i < tempArr.length; i++) {
        let curr = tempArr.slice();
        let next = curr.splice(i, 1);
        helper(curr.slice(), m.concat(next));
      }
    }
  }

  helper(arr);
  return results;
}

export const zeroPairMethods: ShuffleMethod[] = [
  {
    id: 'zero-pair',
    name: 'Zero-Pair Shuffler',
    description: 'Identifies and modifies pairs of digits where one is zero',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      SHUFFLE_CONFIG.prefixes.forEach(prefix => {
        const originalDigits = [...digits];

        // Identify non-zero-digit and zero pairs
        let digitZeroPairs = [];
        for (let i = 0; i < digits.length - 1; i++) {
          if (digits[i] !== '0' && digits[i + 1] === '0') {
            digitZeroPairs.push([i, i + 1]);
            i++; // Skip the zero since it's part of a pair
          }
        }

        // Generate permutations
        let pairPermutations = permute(digitZeroPairs);

        pairPermutations.forEach(permutation => {
          let tempDigits = [...digits];
          let mapping: { [key: number]: string } = {};
          for (let i = 0; i < digitZeroPairs.length; i++) {
            let originalPair = digitZeroPairs[i];
            let permutedPair = permutation[i];
            mapping[originalPair[0]] = digits[permutedPair[0]];
            mapping[originalPair[1]] = digits[permutedPair[1]];
          }
          for (let index in mapping) {
            tempDigits[parseInt(index)] = mapping[index];
          }
          numbers.push(prefix + tempDigits.join(''));
        });

        // Change non-zero digits not in pairs from 1 to 9
        let nonPairNonZeroPositions = [];
        for (let i = 0; i < digits.length; i++) {
          if (digits[i] !== '0' && !digitZeroPairs.some(pair => pair.includes(i))) {
            nonPairNonZeroPositions.push(i);
          }
        }

        nonPairNonZeroPositions.forEach(pos => {
          for (let d = 1; d <= 9; d++) {
            if (digits[pos] !== d.toString()) {
              let tempDigits = [...digits];
              tempDigits[pos] = d.toString();
              numbers.push(prefix + tempDigits.join(''));
            }
          }
        });
      });

      return ensureMinVariations(numbers, phoneNumber, SHUFFLE_CONFIG.prefixes);
    }
  }
];