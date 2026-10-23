import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { environment } from '../../environments/environment';
import { CrearGasto, Gasto } from '../models/gasto.model';
import { CrearGrupo, Grupo, Invitacion, Saldo } from '../models/grupo.model';
import { Mensaje } from '../models/mensaje.model';

@Injectable({ providedIn: 'root' })
export class GruposService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.urlApi;

  cargarInicio(): Observable<{ grupos: Grupo[]; invitaciones: Invitacion[] }> {
    return forkJoin({
      grupos: this.listarGrupos(),
      invitaciones: this.listarInvitaciones()
    });
  }

  cargarDetalle(idGrupo: number) {
    return forkJoin({
      detalle: this.obtenerGrupo(idGrupo),
      gastos: this.listarGastos(idGrupo),
      saldos: this.obtenerSaldos(idGrupo),
      mensajes: this.listarMensajes(idGrupo)
    });
  }

  listarGrupos(): Observable<Grupo[]> {
    return this.http.get<Grupo[]>(`${this.base}/groups`);
  }

  listarInvitaciones(): Observable<Invitacion[]> {
    return this.http.get<Invitacion[]>(`${this.base}/groups/invitations`);
  }

  crearGrupo(datos: CrearGrupo): Observable<Grupo> {
    return this.http.post<Grupo>(`${this.base}/groups`, datos);
  }

  obtenerGrupo(id: number): Observable<Grupo> {
    return this.http.get<Grupo>(`${this.base}/groups/${id}`);
  }

  invitarUsuario(idGrupo: number, email: string): Observable<Invitacion> {
    return this.http.post<Invitacion>(`${this.base}/groups/${idGrupo}/invite`, { email });
  }

  responderInvitacion(id: number, estado: 'accepted' | 'rejected'): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.base}/groups/invitations/${id}`, {
      status: estado
    });
  }

  listarGastos(idGrupo: number): Observable<Gasto[]> {
    return this.http.get<Gasto[]>(`${this.base}/groups/${idGrupo}/expenses`);
  }

  crearGasto(idGrupo: number, datos: CrearGasto): Observable<unknown> {
    return this.http.post(`${this.base}/groups/${idGrupo}/expenses`, datos);
  }

  obtenerSaldos(idGrupo: number): Observable<Saldo[]> {
    return this.http.get<Saldo[]>(`${this.base}/groups/${idGrupo}/balance`);
  }

  listarMensajes(idGrupo: number): Observable<Mensaje[]> {
    return this.http.get<Mensaje[]>(`${this.base}/groups/${idGrupo}/messages`);
  }

  enviarMensaje(idGrupo: number, contenido: string): Observable<Mensaje> {
    return this.http.post<Mensaje>(`${this.base}/groups/${idGrupo}/messages`, {
      content: contenido
    });
  }
}
