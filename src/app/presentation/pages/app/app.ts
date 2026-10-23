import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AutenticacionCasosUso } from '../../../application/use-cases/autenticacion.casos-uso';
import { GruposCasosUso } from '../../../application/use-cases/grupos.casos-uso';
import { Gasto } from '../../../domain/models/gasto.model';
import { Grupo, Invitacion, Saldo } from '../../../domain/models/grupo.model';
import { Mensaje } from '../../../domain/models/mensaje.model';
import { Usuario } from '../../../domain/models/usuario.model';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly autenticacion = inject(AutenticacionCasosUso);
  private readonly gruposUso = inject(GruposCasosUso);

  usuario: Usuario | null = null;
  grupos: Grupo[] = [];
  invitaciones: Invitacion[] = [];
  grupoActual: Grupo | null = null;
  gastos: Gasto[] = [];
  saldos: Saldo[] = [];
  mensajes: Mensaje[] = [];
  pantalla: 'entrar' | 'registro' = 'entrar';
  cargando = false;
  error = '';
  exito = '';
  mostrarNuevoGrupo = false;
  mostrarNuevoGasto = false;
  mostrarInvitar = false;
  reparto: Record<number, number> = {};

  formularioAcceso = { email: '', password: '' };
  formularioRegistro = { username: '', email: '', password: '', full_name: '' };
  formularioGrupo = { title: '', description: '', objective: '' };
  formularioInvitacion = { email: '' };
  formularioGasto = {
    title: '',
    description: '',
    amount: 0,
    category: '',
    paid_by_id: 0
  };
  textoMensaje = '';

  ngOnInit(): void {
    if (localStorage.getItem('tokenCompartirGastos')) {
      this.cargarUsuario();
    }
  }

  get invitacionesPendientes(): Invitacion[] {
    return this.invitaciones.filter((invitacion) => invitacion.status === 'pending');
  }

  iniciarSesion(): void {
    this.limpiarAvisos();
    this.cargando = true;
    this.autenticacion.iniciarSesion(this.formularioAcceso).subscribe({
      next: (respuesta) => {
        localStorage.setItem('tokenCompartirGastos', respuesta.access_token);
        this.cargarUsuario();
      },
      error: (error: HttpErrorResponse) => this.mostrarError(error),
      complete: () => this.cargando = false
    });
  }

  registrarse(): void {
    this.limpiarAvisos();
    this.cargando = true;
    this.autenticacion.registrarEIniciarSesion(this.formularioRegistro).subscribe({
      next: (respuesta) => {
        localStorage.setItem('tokenCompartirGastos', respuesta.access_token);
        this.exito = 'Cuenta creada. ¡Bienvenido!';
        this.cargarUsuario();
      },
      error: (error: HttpErrorResponse) => this.mostrarError(error),
      complete: () => this.cargando = false
    });
  }

  cerrarSesion(): void {
    localStorage.removeItem('tokenCompartirGastos');
    this.usuario = null;
    this.grupoActual = null;
    this.grupos = [];
    this.invitaciones = [];
    this.pantalla = 'entrar';
    this.limpiarAvisos();
  }

  cargarUsuario(): void {
    this.autenticacion.obtenerUsuario().subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        this.cargarInicio();
      },
      error: (error: HttpErrorResponse) => {
        this.cargando = false;
        if (error.status === 401) {
          this.cerrarSesion();
          this.error = 'Tu sesión ha caducado. Vuelve a entrar.';
        } else {
          this.mostrarError(error);
        }
      }
    });
  }

  cargarInicio(): void {
    this.cargando = true;
    this.gruposUso.cargarInicio().subscribe({
      next: (datos) => {
        this.grupos = datos.grupos;
        this.invitaciones = datos.invitaciones;
      },
      error: (error: HttpErrorResponse) => this.mostrarError(error),
      complete: () => this.cargando = false
    });
  }

  abrirGrupo(grupo: Grupo): void {
    this.limpiarAvisos();
    this.cargando = true;
    this.gruposUso.cargarDetalle(grupo.id).subscribe({
      next: (datos) => {
        this.grupoActual = datos.detalle;
        this.gastos = datos.gastos;
        this.saldos = datos.saldos;
        this.mensajes = datos.mensajes;
        this.inicializarReparto();
        this.formularioGasto.paid_by_id = this.usuario?.id ?? 0;
        this.mostrarNuevoGasto = false;
      },
      error: (error: HttpErrorResponse) => this.mostrarError(error),
      complete: () => this.cargando = false
    });
  }

  crearGrupo(): void {
    this.limpiarAvisos();
    this.cargando = true;
    this.gruposUso.crearGrupo(this.formularioGrupo).subscribe({
      next: (grupo) => {
        this.formularioGrupo = { title: '', description: '', objective: '' };
        this.mostrarNuevoGrupo = false;
        this.exito = 'Grupo creado correctamente.';
        this.cargarInicio();
        this.abrirGrupo(grupo);
      },
      error: (error: HttpErrorResponse) => this.mostrarError(error),
      complete: () => this.cargando = false
    });
  }

  invitar(): void {
    if (!this.grupoActual) return;
    this.limpiarAvisos();
    this.cargando = true;
    this.gruposUso.invitarUsuario(this.grupoActual.id, this.formularioInvitacion.email).subscribe({
      next: () => {
        this.formularioInvitacion.email = '';
        this.mostrarInvitar = false;
        this.exito = 'Invitación enviada.';
        this.cargando = false;
      },
      error: (error: HttpErrorResponse) => this.mostrarError(error),
      complete: () => this.cargando = false
    });
  }

  responderInvitacion(invitacion: Invitacion, estado: 'accepted' | 'rejected'): void {
    this.limpiarAvisos();
    this.gruposUso.responderInvitacion(invitacion.id, estado).subscribe({
      next: () => {
        this.exito = estado === 'accepted' ? 'Te has unido al grupo.' : 'Invitación rechazada.';
        this.cargarInicio();
      },
      error: (error: HttpErrorResponse) => this.mostrarError(error)
    });
  }

  registrarGasto(): void {
    if (!this.grupoActual) return;
    this.limpiarAvisos();
    const miembros = this.grupoActual.members ?? [];
    const partes = miembros
      .map((miembro) => ({
        user_id: miembro.user_id,
        percentage: Number(this.reparto[miembro.user_id] ?? 0)
      }))
      .filter((parte) => parte.percentage > 0);
    const total = partes.reduce((suma, parte) => suma + parte.percentage, 0);

    if (Math.abs(total - 100) > 0.001) {
      this.error = 'El reparto debe sumar exactamente el 100 %.';
      return;
    }

    this.cargando = true;
    this.gruposUso.crearGasto(this.grupoActual.id, {
      ...this.formularioGasto,
      amount: Number(this.formularioGasto.amount),
      paid_by_id: Number(this.formularioGasto.paid_by_id),
      shares: partes
    }).subscribe({
      next: () => {
        this.exito = 'Gasto registrado correctamente.';
        this.formularioGasto = {
          title: '',
          description: '',
          amount: 0,
          category: '',
          paid_by_id: this.usuario?.id ?? 0
        };
        this.mostrarNuevoGasto = false;
        this.abrirGrupo(this.grupoActual!);
      },
      error: (error: HttpErrorResponse) => this.mostrarError(error),
      complete: () => this.cargando = false
    });
  }

  enviarMensaje(): void {
    if (!this.grupoActual || !this.textoMensaje.trim()) return;
    this.gruposUso.enviarMensaje(this.grupoActual.id, this.textoMensaje.trim()).subscribe({
      next: (mensaje) => {
        this.mensajes = [...this.mensajes, mensaje];
        this.textoMensaje = '';
      },
      error: (error: HttpErrorResponse) => this.mostrarError(error)
    });
  }

  volverAInicio(): void {
    this.grupoActual = null;
    this.limpiarAvisos();
    this.cargarInicio();
  }

  esCreador(): boolean {
    return Boolean(this.usuario && this.grupoActual?.creator_id === this.usuario.id);
  }

  formatoDinero(cantidad: number): string {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(cantidad);
  }

  nombreMiembro(idUsuario: number): string {
    return this.grupoActual?.members?.find((miembro) => miembro.user_id === idUsuario)?.full_name ?? `Usuario ${idUsuario}`;
  }

  private inicializarReparto(): void {
    const miembros = this.grupoActual?.members ?? [];
    this.reparto = {};
    if (!miembros.length) return;
    const parte = Math.floor((100 / miembros.length) * 100) / 100;
    miembros.forEach((miembro, indice) => {
      this.reparto[miembro.user_id] = indice === miembros.length - 1
        ? Math.round((100 - parte * (miembros.length - 1)) * 100) / 100
        : parte;
    });
  }

  private mostrarError(error: HttpErrorResponse): void {
    const detalle = error.error?.detail;
    if (Array.isArray(detalle)) {
      this.error = detalle.map((item: { msg?: string }) => item.msg ?? 'Dato no válido').join('. ');
    } else if (typeof detalle === 'string') {
      this.error = detalle;
    } else if (error.status === 0) {
      this.error = 'No se pudo conectar con el servidor. Comprueba que FastAPI está funcionando.';
    } else {
      this.error = 'Ha ocurrido un error. Inténtalo de nuevo.';
    }
    this.cargando = false;
  }

  limpiarAvisos(): void {
    this.error = '';
    this.exito = '';
  }
}
