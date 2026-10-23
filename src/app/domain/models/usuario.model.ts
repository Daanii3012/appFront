export interface Usuario {
  id: number;
  username: string;
  email: string;
  full_name: string;
}

export interface Credenciales {
  email: string;
  password: string;
}

export interface RegistroUsuario {
  username: string;
  email: string;
  password: string;
  full_name: string;
}

export interface TokenAcceso {
  access_token: string;
  token_type: string;
}
