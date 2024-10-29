import { ShuffleMethod } from './types';
import { SHUFFLE_CONFIG } from './config';
import { getRestDigits, ensureMinVariations } from './utils';

const PREFIXES = SHUFFLE_CONFIG.prefixes;

export const shuffleMethods: ShuffleMethod[] = [
  {
    id: 'advanced',
    name: 'Advanced Pattern Shuffler',
    description: 'Intelligently shuffles digits based on common number patterns',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      PREFIXES.forEach(prefix => {
        for (let pos = 0; pos < digits.length; pos++) {
          for (let d = 0; d <= 9; d++) {
            if (digits[pos] !== d.toString()) {
              let tempDigits = [...digits];
              tempDigits[pos] = d.toString();
              numbers.push(prefix + tempDigits.join(''));
            }
          }
        }
      });

      return ensureMinVariations(numbers, phoneNumber, PREFIXES);
    }
  },
  {
    id: 'sequential-pairs',
    name: 'Sequential Pairs Modifier',
    description: 'Modifies sequential pairs of digits using various patterns',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      PREFIXES.forEach(prefix => {
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

      return ensureMinVariations(numbers, phoneNumber, PREFIXES);
    }
  },
  {
    id: 'palindrome',
    name: 'Palindrome Pattern Generator',
    description: 'Creates variations based on palindromic patterns',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      PREFIXES.forEach(prefix => {
        for (let i = 0; i < digits.length - 2; i++) {
          for (let d1 = 0; d1 <= 9; d1++) {
            for (let d2 = 0; d2 <= 9; d2++) {
              const tempDigits = [...digits];
              tempDigits[i] = d1.toString();
              tempDigits[i + 1] = d2.toString();
              tempDigits[digits.length - 1 - i] = d1.toString();
              tempDigits[digits.length - 2 - i] = d2.toString();
              numbers.push(prefix + tempDigits.join(''));
            }
          }
        }
      });

      return ensureMinVariations(numbers, phoneNumber, PREFIXES);
    }
  },
  {
    id: 'arithmetic',
    name: 'Arithmetic Progression Generator',
    description: 'Creates variations using arithmetic progression patterns',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      PREFIXES.forEach(prefix => {
        for (let start = 0; start <= 9; start++) {
          for (let diff = 1; diff <= 5; diff++) {
            const tempDigits = [...digits];
            for (let i = 0; i < digits.length; i++) {
              tempDigits[i] = ((start + i * diff) % 10).toString();
            }
            numbers.push(prefix + tempDigits.join(''));
          }
        }
      });

      return ensureMinVariations(numbers, phoneNumber, PREFIXES);
    }
  },
  {
    id: 'geometric',
    name: 'Geometric Progression Generator',
    description: 'Creates variations using geometric progression patterns',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      PREFIXES.forEach(prefix => {
        for (let start = 1; start <= 9; start++) {
          for (let ratio = 2; ratio <= 4; ratio++) {
            const tempDigits = [...digits];
            for (let i = 0; i < digits.length; i++) {
              tempDigits[i] = Math.floor((start * Math.pow(ratio, i)) % 10).toString();
            }
            numbers.push(prefix + tempDigits.join(''));
          }
        }
      });

      return ensureMinVariations(numbers, phoneNumber, PREFIXES);
    }
  },
  {
    id: 'alternating',
    name: 'Alternating Pattern Generator',
    description: 'Creates variations with alternating digit patterns',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      PREFIXES.forEach(prefix => {
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

      return ensureMinVariations(numbers, phoneNumber, PREFIXES);
    }
  },
  {
    id: 'wave',
    name: 'Wave Pattern Generator',
    description: 'Creates variations following a wave-like pattern',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      PREFIXES.forEach(prefix => {
        for (let amplitude = 1; amplitude <= 4; amplitude++) {
          for (let phase = 0; phase <= Math.PI; phase += Math.PI / 4) {
            const tempDigits = [...digits];
            for (let i = 0; i < digits.length; i++) {
              const wave = Math.floor(5 + amplitude * Math.sin(i * Math.PI / 2 + phase)) % 10;
              tempDigits[i] = wave.toString();
            }
            numbers.push(prefix + tempDigits.join(''));
          }
        }
      });

      return ensureMinVariations(numbers, phoneNumber, PREFIXES);
    }
  },
  {
    id: 'digit-cluster',
    name: 'Digit Cluster Modifier',
    description: 'Modifies clusters of similar digits',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      PREFIXES.forEach(prefix => {
        let i = 0;
        while (i < digits.length) {
          let clusterSize = 1;
          while (i + clusterSize < digits.length && digits[i] === digits[i + clusterSize]) {
            clusterSize++;
          }

          if (clusterSize > 1) {
            for (let d = 0; d <= 9; d++) {
              const tempDigits = [...digits];
              for (let j = 0; j < clusterSize; j++) {
                tempDigits[i + j] = d.toString();
              }
              numbers.push(prefix + tempDigits.join(''));
            }
          }
          i += clusterSize;
        }
      });

      return ensureMinVariations(numbers, phoneNumber, PREFIXES);
    }
  },
  {
    id: 'sum-constant',
    name: 'Sum-Constant Generator',
    description: 'Generates variations maintaining a constant digit sum',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);
      const originalSum = digits.reduce((sum, digit) => sum + parseInt(digit), 0);

      PREFIXES.forEach(prefix => {
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

      return ensureMinVariations(numbers, phoneNumber, PREFIXES);
    }
  },
  {
    id: 'digit-rotation',
    name: 'Digit Rotation Generator',
    description: 'Generates variations by rotating digits in different patterns',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      PREFIXES.forEach(prefix => {
        for (let rotation = 1; rotation < digits.length; rotation++) {
          const tempDigits = [...digits];
          for (let i = 0; i < digits.length; i++) {
            const newPos = (i + rotation) % digits.length;
            tempDigits[newPos] = digits[i];
          }
          numbers.push(prefix + tempDigits.join(''));
        }
      });

      return ensureMinVariations(numbers, phoneNumber, PREFIXES);
    }
  },
  {
    id: 'modular',
    name: 'Modular Pattern Generator',
    description: 'Creates variations using modular arithmetic patterns',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      PREFIXES.forEach(prefix => {
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

      return ensureMinVariations(numbers, phoneNumber, PREFIXES);
    }
  },
  {
    id: 'binary',
    name: 'Binary Pattern Generator',
    description: 'Creates variations based on binary number patterns',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      PREFIXES.forEach(prefix => {
        for (let pattern = 0; pattern < Math.pow(2, 6); pattern++) {
          const tempDigits = [...digits];
          const binaryPattern = pattern.toString(2).padStart(6, '0');
          
          for (let i = 0; i < digits.length; i++) {
            const bitPosition = i % 6;
            const shouldFlip = binaryPattern[bitPosition] === '1';
            if (shouldFlip) {
              tempDigits[i] = (9 - parseInt(digits[i])).toString();
            }
          }
          numbers.push(prefix + tempDigits.join(''));
        }
      });

      return ensureMinVariations(numbers, phoneNumber, PREFIXES);
    }
  },
  {
    id: 'harmonic',
    name: 'Harmonic Pattern Generator',
    description: 'Creates variations using harmonic series patterns',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      PREFIXES.forEach(prefix => {
        for (let frequency = 1; frequency <= 4; frequency++) {
          for (let phase = 0; phase <= Math.PI; phase += Math.PI / 4) {
            const tempDigits = [...digits];
            for (let i = 0; i < digits.length; i++) {
              const harmonic = Math.floor(5 + 3 * Math.sin(frequency * i * Math.PI / 2 + phase)) % 10;
              tempDigits[i] = harmonic.toString();
            }
            numbers.push(prefix + tempDigits.join(''));
          }
        }
      });

      return ensureMinVariations(numbers, phoneNumber, PREFIXES);
    }
  },
  {
    id: 'triangular',
    name: 'Triangular Number Pattern',
    description: 'Generates variations based on triangular number sequences',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      PREFIXES.forEach(prefix => {
        for (let start = 0; start <= 9; start++) {
          const tempDigits = [...digits];
          for (let i = 0; i < digits.length; i++) {
            const n = start + i;
            const triangular = Math.floor((n * (n + 1) / 2) % 10);
            tempDigits[i] = triangular.toString();
          }
          numbers.push(prefix + tempDigits.join(''));
        }
      });

      return ensureMinVariations(numbers, phoneNumber, PREFIXES);
    }
  },
  {
    id: 'cluster-pattern',
    name: 'Cluster Pattern Generator',
    description: 'Generates variations based on digit clustering patterns',
    generate: (phoneNumber: string) => {
      const numbers: string[] = [];
      const digits = getRestDigits(phoneNumber);

      PREFIXES.forEach(prefix => {
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

      return ensureMinVariations(numbers, phoneNumber, PREFIXES);
    }
  }
];