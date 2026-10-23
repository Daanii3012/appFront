import { Injectable, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CrearGasto } from '../../domain/models/gasto.model';
import { CrearGrupo } from '../../domain/models/grupo.model';
import { GruposRepositorio } from '../../domain/repositories/grupos.repositorio';

@Injectable({ providedIn: 'root' })
export class GruposCasosUso {
  private readonly repositorio = inject(GruposRepositorio);

  cargarInicio() {
    return forkJoin({
      grupos: this.repositorio.listarGrupos(),
      invitaciones: this.repositorio.listarInvitaciones()
    });
  }

  cargarDetalle(idGrupo: number) {
    return forkJoin({
      detalle: this.repositorio.obtenerGrupo(idGrupo),
      gastos: this.repositorio.listarGastos(idGrupo),
      saldos: this.repositorio.obtenerSaldos(idGrupo),
      mensajes: this.repositorio.listarMensajes(idGrupo)
    });
  }

  listarGrupos() {
    return this.repositorio.listarGrupos();
  }

  crearGrupo(datos: CrearGrupo) {
    return this.repositorio.crearGrupo(datos);
  }

  invitarUsuario(idGrupo: number, email: string) {
    return this.repositorio.invitarUsuario(idGrupo, email);
  }

  responderInvitacion(id: number, estado: 'accepted' | 'rejected') {
    return this.repositorio.responderInvitacion(id, estado);
  }

  crearGasto(idGrupo: number, datos: CrearGasto) {
    return this.repositorio.crearGasto(idGrupo, datos);
  }

  enviarMensaje(idGrupo: number, contenido: string) {
    return this.repositorio.enviarMensaje(idGrupo, contenido);
  }
}
