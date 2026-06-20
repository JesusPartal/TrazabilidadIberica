export interface TratamientoVeterinario {
  id: string;
  animalId: string;
  veterinarioId: string;
  nombreMedicamento: string;
  numeroLote: string | null;
  fechaAdministracion: string;
  fechaCaducidad: string | null;
  dosisAdministrada: number;
  unidadDosis: string | null;
  viaAdministracion: string | null;
  periodoSupresionDias: number;
  fechaFinSupresion: string;
  animal?: { id: string; numeroCrotal: string };
  veterinario?: { id: string; nombreCompleto: string };
  createdOffline: boolean;
  clientId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
