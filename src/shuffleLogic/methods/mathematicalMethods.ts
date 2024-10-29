import { ShuffleMethod } from '../types';
import { SHUFFLE_CONFIG } from '../config';
import { getRestDigits, ensureMinVariations } from '../utils';

export const mathematicalMethods: ShuffleMethod[] = [
  {
    id: 'sum-constant',
    name: 'Sum-Constant Generator',
    description: 'Generates variations maintaining a constant digit sum',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);
      const originalSum = digits.reduce((sum, digit) => sum + parseInt(digit), 0);

      SHUFFLE_CONFIG.prefixes.forEach(prefix => {
        // Generate variations maintaining sum
        for (let pos1 = 0; pos1 < digits.length; pos1++) {
          for (let pos2 = pos1 + 1; pos2 < digits.length; pos2++) {
            for (let d1 = 0; d1 <= 9; d1++) {
              const d2 = (originalSum - (d1 + digits.reduce((sum, digit, i) => 
                i !== pos1 && i !== pos2 ? sum + parseInt(digit) : sum, 0))) % 10;
              if (d2 >= 0 && d2 <= 9) {
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
    id: 'modular',
    name: 'Modular Pattern Generator',
    description: 'Creates variations using modular arithmetic patterns',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      SHUFFLE_CONFIG.prefixes.forEach(prefix => {
        // Generate modular patterns
        for (let modulus = 2; modulus <= 7; modulus++) {
          for (let offset = 0; offset < modulus; offset++) {
            const tempDigits = [...digits];
            for (let i = 0; i < digits.length; i++) {
              tempDigits[i] = ((i + offset) % modulus).toString();
            }
            numbers.push(prefix + tempDigits.join(''));
          }
        }
      });

      return ensureMinVariations(numbers, phoneNumber, SHUFFLE_CONFIG.prefixes);
    }
  },
  {
    id: 'harmonic',
    name: 'Harmonic Pattern Generator',
    description: 'Creates variations using harmonic series patterns',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      SHUFFLE_CONFIG.prefixes.forEach(prefix => {
        // Generate harmonic patterns
        for (let frequency = 1; frequency <= 4; frequency++) {
          for (let phase = 0; phase <= Math.PI; phase += Math.PI / 4) {
            for (let amplitude = 1; amplitude <= 3; amplitude++) {
              const tempDigits = [...digits];
              for (let i = 0; i < digits.length; i++) {
                const harmonic = Math.floor(5 + amplitude * Math.sin(frequency * i * Math.PI / 2 + phase)) % 10;
                tempDigits[i] = harmonic.toString();
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