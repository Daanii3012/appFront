import { Injectable, inject } from '@angular/core';
import { switchMap } from 'rxjs';
import { AutenticacionRepositorio } from '../../domain/repositories/autenticacion.repositorio';
import { Credenciales, RegistroUsuario } from '../../domain/models/usuario.model';

@Injectable({ providedIn: 'root' })
export class AutenticacionCasosUso {
  private readonly repositorio = inject(AutenticacionRepositorio);

  iniciarSesion(datos: Credenciales) {
    return this.repositorio.iniciarSesion({
      ...datos,
      email: datos.email.trim().toLowerCase()
    });
  }

  registrarEIniciarSesion(datos: RegistroUsuario) {
    return this.repositorio.registrarUsuario(datos).pipe(
      switchMap(() => this.repositorio.iniciarSesion({
        email: datos.email,
        password: datos.password
      }))
    );
  }

  obtenerUsuario() {
    return this.repositorio.obtenerUsuario();
  }
}
