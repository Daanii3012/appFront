export interface Miembro {
  user_id: number;
  username: string;
  full_name: string;
  role: string;
  participation_percentage: number;
}

export interface Grupo {
  id: number;
  creator_id: number;
  title: string;
  description: string;
  objective: string;
  members?: Miembro[];
}

export interface CrearGrupo {
  title: string;
  description: string;
  objective: string;
}

export interface Invitacion {
  id: number;
  group_id: number;
  recipient_email: string;
  status: string;
}

export interface Saldo {
  user_id: number;
  username: string;
  total_owed: number;
  total_paid: number;
  balance: number;
}
