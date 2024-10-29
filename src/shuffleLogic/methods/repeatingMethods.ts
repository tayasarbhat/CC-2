import { ShuffleMethod } from '../types';
import { SHUFFLE_CONFIG } from '../config';
import { getRestDigits, ensureMinVariations } from '../utils';

function findRepeatingSequences(digits: string[]) {
  let sequences = [];
  let i = 0;
  while (i < digits.length) {
    let currentDigit = digits[i];
    let positions = [i];
    let j = i + 1;
    while (j < digits.length && digits[j] === currentDigit) {
      positions.push(j);
      j++;
    }
    if (positions.length >= 2) {
      sequences.push({ digit: currentDigit, positions: positions });
    }
    i = j;
  }
  return sequences;
}

export const repeatingMethods: ShuffleMethod[] = [
  {
    id: 'repeating',
    name: 'Repeating Pattern Analyzer',
    description: 'Identifies and modifies repeating digit patterns',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      SHUFFLE_CONFIG.prefixes.forEach(prefix => {
        const originalDigits = [...digits];
        const repeatingSequences = findRepeatingSequences(digits);

        // For each repeating sequence, generate variations
        repeatingSequences.forEach(seq => {
          for (let d = 0; d <= 9; d++) {
            if (d.toString() !== originalDigits[seq.positions[0]]) {
              let tempDigits = [...originalDigits];
              seq.positions.forEach(pos => {
                tempDigits[pos] = d.toString();
              });
              numbers.push(prefix + tempDigits.join(''));
            }
          }
        });

        // Shuffle other digits one at a time
        let otherPositions = [...Array(digits.length).keys()].filter(pos => {
          return !repeatingSequences.some(seq => seq.positions.includes(pos));
        });

        otherPositions.forEach(pos => {
          for (let d = 0; d <= 9; d++) {
            if (originalDigits[pos] !== d.toString()) {
              let tempDigits = [...originalDigits];
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