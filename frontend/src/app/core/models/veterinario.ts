export interface Veterinario {
  id: string;
  nombreCompleto: string;
  numeroColegiado: string;
  telefono: string | null;
  email: string | null;
  createdOffline: boolean;
  clientId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
