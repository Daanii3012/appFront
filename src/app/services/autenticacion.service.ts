import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Credenciales, RegistroUsuario, TokenAcceso, Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class AutenticacionService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.urlApi;

  iniciarSesion(datos: Credenciales): Observable<TokenAcceso> {
    return this.http.post<TokenAcceso>(`${this.base}/auth/login`, {
      ...datos,
      email: datos.email.trim().toLowerCase()
    });
  }

  registrarEIniciarSesion(datos: RegistroUsuario): Observable<TokenAcceso> {
    return this.http.post(`${this.base}/auth/register`, datos).pipe(
      switchMap(() => this.iniciarSesion({
        email: datos.email,
        password: datos.password
      }))
    );
  }

  obtenerUsuario(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.base}/users/me`);
  }
}
