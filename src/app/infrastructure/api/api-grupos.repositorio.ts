import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { configuracion } from '../configuracion';
import { CrearGasto, Gasto } from '../../domain/models/gasto.model';
import { CrearGrupo, Grupo, Invitacion, Saldo } from '../../domain/models/grupo.model';
import { Mensaje } from '../../domain/models/mensaje.model';
import { GruposRepositorio } from '../../domain/repositories/grupos.repositorio';

@Injectable()
export class ApiGruposRepositorio extends GruposRepositorio {
  private readonly http = inject(HttpClient);
  private readonly base = configuracion.urlApi;

  override listarGrupos(): Observable<Grupo[]> {
    return this.http.get<Grupo[]>(`${this.base}/groups`);
  }

  override listarInvitaciones(): Observable<Invitacion[]> {
    return this.http.get<Invitacion[]>(`${this.base}/groups/invitations`);
  }

  override crearGrupo(datos: CrearGrupo): Observable<Grupo> {
    return this.http.post<Grupo>(`${this.base}/groups`, datos);
  }

  override obtenerGrupo(id: number): Observable<Grupo> {
    return this.http.get<Grupo>(`${this.base}/groups/${id}`);
  }

  override invitarUsuario(idGrupo: number, email: string): Observable<Invitacion> {
    return this.http.post<Invitacion>(`${this.base}/groups/${idGrupo}/invite`, { email });
  }

  override responderInvitacion(id: number, estado: 'accepted' | 'rejected'): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.base}/groups/invitations/${id}`, { status: estado });
  }

  override listarGastos(idGrupo: number): Observable<Gasto[]> {
    return this.http.get<Gasto[]>(`${this.base}/groups/${idGrupo}/expenses`);
  }

  override crearGasto(idGrupo: number, datos: CrearGasto): Observable<unknown> {
    return this.http.post(`${this.base}/groups/${idGrupo}/expenses`, datos);
  }

  override obtenerSaldos(idGrupo: number): Observable<Saldo[]> {
    return this.http.get<Saldo[]>(`${this.base}/groups/${idGrupo}/balance`);
  }

  override listarMensajes(idGrupo: number): Observable<Mensaje[]> {
    return this.http.get<Mensaje[]>(`${this.base}/groups/${idGrupo}/messages`);
  }

  override enviarMensaje(idGrupo: number, contenido: string): Observable<Mensaje> {
    return this.http.post<Mensaje>(`${this.base}/groups/${idGrupo}/messages`, { content: contenido });
  }
}
