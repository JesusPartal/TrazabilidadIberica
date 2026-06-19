export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  email: string;
  ganaderoId: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface RefreshResponse {
  token: string;
  refreshToken: string;
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
