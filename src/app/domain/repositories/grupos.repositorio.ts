import { Observable } from 'rxjs';
import { Gasto, CrearGasto } from '../models/gasto.model';
import { Grupo, CrearGrupo, Invitacion, Saldo } from '../models/grupo.model';
import { Mensaje } from '../models/mensaje.model';

export abstract class GruposRepositorio {
  abstract listarGrupos(): Observable<Grupo[]>;
  abstract listarInvitaciones(): Observable<Invitacion[]>;
  abstract crearGrupo(datos: CrearGrupo): Observable<Grupo>;
  abstract obtenerGrupo(id: number): Observable<Grupo>;
  abstract invitarUsuario(idGrupo: number, email: string): Observable<Invitacion>;
  abstract responderInvitacion(id: number, estado: 'accepted' | 'rejected'): Observable<{ message: string }>;
  abstract listarGastos(idGrupo: number): Observable<Gasto[]>;
  abstract crearGasto(idGrupo: number, datos: CrearGasto): Observable<unknown>;
  abstract obtenerSaldos(idGrupo: number): Observable<Saldo[]>;
  abstract listarMensajes(idGrupo: number): Observable<Mensaje[]>;
  abstract enviarMensaje(idGrupo: number, contenido: string): Observable<Mensaje>;
}
