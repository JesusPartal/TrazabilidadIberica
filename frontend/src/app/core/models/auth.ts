export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  ganaderoId: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nombreRazonSocial: string;
  nif: string;
  rega: string;
}
