import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { AutenticacionRepositorio } from './domain/repositories/autenticacion.repositorio';
import { GruposRepositorio } from './domain/repositories/grupos.repositorio';
import { ApiAutenticacionRepositorio } from './infrastructure/api/api-autenticacion.repositorio';
import { ApiGruposRepositorio } from './infrastructure/api/api-grupos.repositorio';
import { autorizacionInterceptor } from './infrastructure/interceptors/autorizacion.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([autorizacionInterceptor])),
    { provide: AutenticacionRepositorio, useClass: ApiAutenticacionRepositorio },
    { provide: GruposRepositorio, useClass: ApiGruposRepositorio }
  ]
};
