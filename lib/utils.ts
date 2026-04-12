// lib/utils.ts
export function generateAssetId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substr(2, 9);
  return `AST-${timestamp}-${randomStr}`.toUpperCase();
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function csvToArray(str: string): string[][] {
  const result = [];
  let current = [];
  let line = '';

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const nextChar = str[i + 1];

    if (char === '"') {
      if (nextChar === '"') {
        line += '"';
        i++;
      } else if (line === '') {
        line = '';
        while (i < str.length && str[i + 1] !== '"') {
          i++;
          line += str[i];
        }
        i++;
        current.push(line);
        line = '';
      }
    } else if (char === ',' && line === '') {
      current.push(line);
      line = '';
    } else if ((char === '\n' || char === '\r') && line === '') {
      if (current.length > 0) {
        result.push(current);
        current = [];
      }
    } else {
      line += char;
    }
  }

  if (line) current.push(line);
  if (current.length > 0) result.push(current);

  return result;
}
