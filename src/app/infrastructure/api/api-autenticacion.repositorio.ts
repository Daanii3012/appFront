import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { configuracion } from '../configuracion';
import { AutenticacionRepositorio } from '../../domain/repositories/autenticacion.repositorio';
import { Credenciales, RegistroUsuario, TokenAcceso, Usuario } from '../../domain/models/usuario.model';

@Injectable()
export class ApiAutenticacionRepositorio extends AutenticacionRepositorio {
  private readonly http = inject(HttpClient);
  private readonly base = configuracion.urlApi;

  override iniciarSesion(datos: Credenciales): Observable<TokenAcceso> {
    return this.http.post<TokenAcceso>(`${this.base}/auth/login`, datos);
  }

  override registrarUsuario(datos: RegistroUsuario): Observable<{ message: string; user: Usuario }> {
    return this.http.post<{ message: string; user: Usuario }>(`${this.base}/auth/register`, datos);
  }

  override obtenerUsuario(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.base}/users/me`);
  }
}
