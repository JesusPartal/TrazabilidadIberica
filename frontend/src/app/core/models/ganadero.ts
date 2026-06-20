export interface Ganadero {
  id: string;
  nombreRazonSocial: string;
  nif: string;
  rega: string;
  telefono: string | null;
  email: string | null;
  direccionCompleta: string | null;
  identityUserId: string | null;
  createdOffline: boolean;
  clientId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
