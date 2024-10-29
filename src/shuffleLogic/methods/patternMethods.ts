import { ShuffleMethod } from '../types';
import { SHUFFLE_CONFIG } from '../config';
import { getRestDigits, ensureMinVariations } from '../utils';

export const patternMethods: ShuffleMethod[] = [
  {
    id: 'sequential-pairs',
    name: 'Sequential Pairs Modifier',
    description: 'Modifies sequential pairs of digits using various patterns',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      SHUFFLE_CONFIG.prefixes.forEach(prefix => {
        // Modify sequential pairs
        for (let i = 0; i < digits.length - 1; i += 2) {
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
  },
  {
    id: 'alternating',
    name: 'Alternating Pattern Generator',
    description: 'Creates variations with alternating digit patterns',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      SHUFFLE_CONFIG.prefixes.forEach(prefix => {
        // Generate alternating patterns
        for (let even = 0; even <= 9; even++) {
          for (let odd = 0; odd <= 9; odd++) {
            const tempDigits = [...digits];
            for (let i = 0; i < digits.length; i++) {
              tempDigits[i] = (i % 2 === 0 ? even : odd).toString();
            }
            numbers.push(prefix + tempDigits.join(''));
          }
        }
      });

      return ensureMinVariations(numbers, phoneNumber, SHUFFLE_CONFIG.prefixes);
    }
  },
  {
    id: 'wave',
    name: 'Wave Pattern Generator',
    description: 'Creates variations following a wave-like pattern',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      SHUFFLE_CONFIG.prefixes.forEach(prefix => {
        // Generate wave patterns with different amplitudes and phases
        for (let amplitude = 1; amplitude <= 4; amplitude++) {
          for (let phase = 0; phase <= Math.PI; phase += Math.PI / 4) {
            for (let offset = 0; offset <= 5; offset++) {
              const tempDigits = [...digits];
              for (let i = 0; i < digits.length; i++) {
                const wave = Math.floor(5 + amplitude * Math.sin(i * Math.PI / 2 + phase) + offset) % 10;
                tempDigits[i] = wave.toString();
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