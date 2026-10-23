import { Observable } from 'rxjs';
import { Credenciales, RegistroUsuario, TokenAcceso, Usuario } from '../models/usuario.model';

export abstract class AutenticacionRepositorio {
  abstract iniciarSesion(datos: Credenciales): Observable<TokenAcceso>;
  abstract registrarUsuario(datos: RegistroUsuario): Observable<{ message: string; user: Usuario }>;
  abstract obtenerUsuario(): Observable<Usuario>;
}
