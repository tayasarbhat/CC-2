export function getRestDigits(phoneNumber: string): string[] {
  return phoneNumber.slice(3).split('');
}

export function generatePermutations(digits: string[], positions: number[], values: number[]): string[] {
  const results: string[] = [];
  const tempDigits = [...digits];

  function permute(index: number = 0) {
    if (index === positions.length) {
      results.push(tempDigits.join(''));
      return;
    }

    const position = positions[index];
    for (const value of values) {
      if (tempDigits[position] !== value.toString()) {
        const original = tempDigits[position];
        tempDigits[position] = value.toString();
        permute(index + 1);
        tempDigits[position] = original;
      }
    }
  }

  permute();
  return results;
}

export function ensureMinVariations(numbers: string[], phoneNumber: string, prefixes: string[]): string[] {
  if (numbers.length >= 250) {
    return [...new Set(numbers)];
  }

  const digits = getRestDigits(phoneNumber);
  const positions = Array.from({ length: digits.length }, (_, i) => i);
  const values = Array.from({ length: 10 }, (_, i) => i);

  while (numbers.length < 250) {
    const randomPositions = positions
      .slice()
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const newVariations = generatePermutations(digits, randomPositions, values);
    
    prefixes.forEach(prefix => {
      newVariations.forEach(variation => {
        numbers.push(prefix + variation);
      });
    });
  }

  return [...new Set(numbers)];
}

export function downloadCSV(numbers: string[], filename: string): void {
  const csvContent = 'Phone Numbers\n' + numbers.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}