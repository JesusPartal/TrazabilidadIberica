import { exportCsv } from './csv-export';

describe('exportCsv', () => {
  let originalUrl: typeof URL.createObjectURL;
  let originalRevoke: typeof URL.revokeObjectURL;
  let mockClick: ReturnType<typeof vi.fn>;
  let mockAnchor: HTMLAnchorElement;

  beforeEach(() => {
    originalUrl = URL.createObjectURL;
    originalRevoke = URL.revokeObjectURL;

    mockClick = vi.fn();
    mockAnchor = { href: '', download: '', click: mockClick } as unknown as HTMLAnchorElement;

    URL.createObjectURL = vi.fn(() => 'blob:mock');
    URL.revokeObjectURL = vi.fn();

    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor);
  });

  afterEach(() => {
    URL.createObjectURL = originalUrl;
    URL.revokeObjectURL = originalRevoke;
    vi.restoreAllMocks();
  });

  it('should create Blob with CSV type', () => {
    exportCsv('test.csv', [
      { label: 'A', value: () => '1' },
    ], [{}]);

    const blob = (URL.createObjectURL as ReturnType<typeof vi.fn>).mock.calls[0][0] as Blob;
    expect(blob.type).toBe('text/csv;charset=utf-8;');
  });

  it('should prepend UTF-8 BOM bytes (0xEF 0xBB 0xBF)', async () => {
    exportCsv('test.csv', [
      { label: 'A', value: () => '1' },
    ], [{}]);

    const blob = (URL.createObjectURL as ReturnType<typeof vi.fn>).mock.calls[0][0] as Blob;
    const buf = await blob.arrayBuffer();
    const bytes = new Uint8Array(buf);
    expect(bytes[0]).toBe(0xEF);
    expect(bytes[1]).toBe(0xBB);
    expect(bytes[2]).toBe(0xBF);
  });

  it('should generate CSV header and data rows', async () => {
    exportCsv('test.csv', [
      { label: 'Nombre', value: () => 'Juan' },
      { label: 'Edad', value: () => 30 },
    ], [{}]);

    const blob = (URL.createObjectURL as ReturnType<typeof vi.fn>).mock.calls[0][0] as Blob;
    const text = await blob.text();
    expect(text).toBe('Nombre,Edad\nJuan,30');
  });

  it('should quote values containing commas', async () => {
    exportCsv('test.csv', [
      { label: 'Nombre', value: () => 'García, López' },
      { label: 'Ciudad', value: () => 'Madrid' },
    ], [{}]);

    const blob = (URL.createObjectURL as ReturnType<typeof vi.fn>).mock.calls[0][0] as Blob;
    const text = await blob.text();
    expect(text).toBe('Nombre,Ciudad\n"García, López",Madrid');
  });

  it('should double-quote values containing quotes', async () => {
    exportCsv('test.csv', [
      { label: 'Nota', value: () => 'Dijo "hola"' },
    ], [{}]);

    const blob = (URL.createObjectURL as ReturnType<typeof vi.fn>).mock.calls[0][0] as Blob;
    const text = await blob.text();
    expect(text).toBe('Nota\n"Dijo ""hola"""');
  });

  it('should set the download filename', () => {
    exportCsv('animales.csv', [
      { label: 'ID', value: () => '1' },
    ], [{}]);

    expect(mockAnchor.download).toBe('animales.csv');
  });

  it('should trigger a click on the anchor', () => {
    exportCsv('test.csv', [
      { label: 'A', value: () => '1' },
    ], [{}]);

    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('should handle empty columns and empty data', async () => {
    exportCsv('empty.csv', [], []);

    const blob = (URL.createObjectURL as ReturnType<typeof vi.fn>).mock.calls[0][0] as Blob;
    const text = await blob.text();
    expect(text).toBe('\n');
  });

  it('should convert null and undefined to empty string', async () => {
    exportCsv('test.csv', [
      { label: 'A', value: () => null },
      { label: 'B', value: () => undefined },
    ], [{}]);

    const blob = (URL.createObjectURL as ReturnType<typeof vi.fn>).mock.calls[0][0] as Blob;
    const text = await blob.text();
    expect(text).toBe('A,B\n,');
  });
});
