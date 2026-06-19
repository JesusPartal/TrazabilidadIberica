import { isDevMode } from '@angular/core';

export const environment = {
  production: !isDevMode(),
  apiUrl: !isDevMode()
    ? 'https://trazabilidad-iberica-api.azurewebsites.net/api'
    : 'https://localhost:5001/api',
};
