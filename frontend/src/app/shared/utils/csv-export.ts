export interface CsvColumn<T> {
  label: string;
  value: (item: T) => string | number | boolean | null | undefined;
}

export function exportCsv<T>(filename: string, columns: CsvColumn<T>[], data: T[]): void {
  const bom = '\uFEFF';
  const header = columns.map(c => escapeCsv(c.label)).join(',');
  const rows = data.map(item =>
    columns.map(c => escapeCsv(String(c.value(item) ?? ''))).join(',')
  );
  const csv = bom + header + '\n' + rows.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function escapeCsv(val: string): string {
  if (val.includes(',') || val.includes('"') || val.includes('\n')) {
    return '"' + val.replace(/"/g, '""') + '"';
  }
  return val;
}
