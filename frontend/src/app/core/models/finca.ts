export interface Finca {
  id: string;
  nombre: string;
  rega: string;
  direccion: string | null;
  municipio: string | null;
  provincia: string | null;
  codigoPostal: string | null;
  ganaderoId: string;
  createdOffline: boolean;
  clientId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
