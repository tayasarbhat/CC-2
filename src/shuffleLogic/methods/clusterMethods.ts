import { ShuffleMethod } from '../types';
import { SHUFFLE_CONFIG } from '../config';
import { getRestDigits, ensureMinVariations } from '../utils';

export const clusterMethods: ShuffleMethod[] = [
  {
    id: 'digit-cluster',
    name: 'Digit Cluster Modifier',
    description: 'Modifies clusters of similar digits',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      SHUFFLE_CONFIG.prefixes.forEach(prefix => {
        // Find and modify digit clusters
        let i = 0;
        while (i < digits.length) {
          let clusterSize = 1;
          while (i + clusterSize < digits.length && digits[i] === digits[i + clusterSize]) {
            clusterSize++;
          }

          if (clusterSize > 1) {
            for (let d = 0; d <= 9; d++) {
              if (d.toString() !== digits[i]) {
                const tempDigits = [...digits];
                for (let j = 0; j < clusterSize; j++) {
                  tempDigits[i + j] = d.toString();
                }
                numbers.push(prefix + tempDigits.join(''));
              }
            }
          }
          i += clusterSize;
        }

        // Generate additional variations
        for (let pos = 0; pos < digits.length - 1; pos++) {
          for (let d = 0; d <= 9; d++) {
            const tempDigits = [...digits];
            tempDigits[pos] = d.toString();
            tempDigits[pos + 1] = d.toString();
            numbers.push(prefix + tempDigits.join(''));
          }
        }
      });

      return ensureMinVariations(numbers, phoneNumber, SHUFFLE_CONFIG.prefixes);
    }
  },
  {
    id: 'cluster-pattern',
    name: 'Cluster Pattern Generator',
    description: 'Generates variations based on digit clustering patterns',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      SHUFFLE_CONFIG.prefixes.forEach(prefix => {
        // Generate patterns with different cluster sizes
        for (let clusterSize = 2; clusterSize <= 3; clusterSize++) {
          for (let d = 0; d <= 9; d++) {
            for (let start = 0; start <= digits.length - clusterSize; start++) {
              const tempDigits = [...digits];
              for (let i = 0; i < clusterSize; i++) {
                tempDigits[start + i] = d.toString();
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