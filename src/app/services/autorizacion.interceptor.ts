import { HttpInterceptorFn } from '@angular/common/http';

export const autorizacionInterceptor: HttpInterceptorFn = (solicitud, siguiente) => {
  const token = typeof localStorage === 'undefined'
    ? null
    : localStorage.getItem('tokenCompartirGastos');
  if (!token) return siguiente(solicitud);

  return siguiente(solicitud.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  }));
};
