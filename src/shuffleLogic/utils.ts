export function downloadCSV(numbersArray: string[], filename: string) {
  const csvContent = 'Phone Numbers\n' + numbersArray.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function getRestDigits(phoneNumber: string): string[] {
  return phoneNumber.slice(3).split('');
}

export function ensureMinVariations(numbers: string[], minCount: number = 250): string[] {
  const uniqueNumbers = [...new Set(numbers)];
  if (uniqueNumbers.length >= minCount) {
    return uniqueNumbers;
  }

  // If we don't have enough variations, generate more by modifying existing ones
  const additional: string[] = [];
  let currentIndex = 0;

  while (uniqueNumbers.length + additional.length < minCount && currentIndex < uniqueNumbers.length) {
    const number = uniqueNumbers[currentIndex];
    const digits = number.split('');
    
    // Generate variations by changing each digit
    for (let i = 3; i < digits.length; i++) {
      for (let d = 0; d <= 9; d++) {
        if (digits[i] !== d.toString()) {
          const tempDigits = [...digits];
          tempDigits[i] = d.toString();
          additional.push(tempDigits.join(''));
        }
      }
    }
    currentIndex++;
  }

  return [...new Set([...uniqueNumbers, ...additional])];
}