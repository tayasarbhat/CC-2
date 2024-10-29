import { ShuffleMethod } from '../types';
import { SHUFFLE_CONFIG } from '../config';
import { getRestDigits, ensureMinVariations } from '../utils';

export const transformationMethods: ShuffleMethod[] = [
  {
    id: 'digit-rotation',
    name: 'Digit Rotation Generator',
    description: 'Generates variations by rotating digits in different patterns',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      SHUFFLE_CONFIG.prefixes.forEach(prefix => {
        // Rotate whole number
        for (let rotation = 1; rotation < digits.length; rotation++) {
          const tempDigits = [...digits];
          for (let i = 0; i < digits.length; i++) {
            const newPos = (i + rotation) % digits.length;
            tempDigits[newPos] = digits[i];
          }
          numbers.push(prefix + tempDigits.join(''));
        }

        // Rotate segments
        for (let segmentSize = 2; segmentSize <= 3; segmentSize++) {
          for (let start = 0; start <= digits.length - segmentSize; start++) {
            const tempDigits = [...digits];
            const segment = digits.slice(start, start + segmentSize);
            for (let rot = 1; rot < segmentSize; rot++) {
              for (let i = 0; i < segmentSize; i++) {
                tempDigits[start + ((i + rot) % segmentSize)] = segment[i];
              }
              numbers.push(prefix + tempDigits.join(''));
            }
          }
        }
      });

      return ensureMinVariations(numbers, phoneNumber, SHUFFLE_CONFIG.prefixes);
    }
  },
  {
    id: 'binary',
    name: 'Binary Pattern Generator',
    description: 'Creates variations based on binary number patterns',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      SHUFFLE_CONFIG.prefixes.forEach(prefix => {
        // Generate binary patterns
        for (let pattern = 0; pattern < Math.pow(2, 6); pattern++) {
          for (let offset = 0; offset <= 5; offset++) {
            const tempDigits = [...digits];
            const binaryPattern = pattern.toString(2).padStart(6, '0');
            
            for (let i = 0; i < digits.length; i++) {
              const bitPosition = i % 6;
              const shouldFlip = binaryPattern[bitPosition] === '1';
              if (shouldFlip) {
                tempDigits[i] = ((9 - parseInt(digits[i]) + offset) % 10).toString();
              }
            }
            numbers.push(prefix + tempDigits.join(''));
          }
        }
      });

      return ensureMinVariations(numbers, phoneNumber, SHUFFLE_CONFIG.prefixes);
    }
  }
];