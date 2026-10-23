export interface ParteGasto {
  user_id: number;
  percentage: number;
  amount_due: number;
}

export interface Gasto {
  id: number;
  title: string;
  description?: string;
  amount: number;
  category?: string;
  paid_by_id: number;
  paid_by_username?: string;
  created_at?: string;
  shares: ParteGasto[];
}

export interface CrearGasto {
  title: string;
  description: string;
  amount: number;
  category: string;
  paid_by_id: number;
  shares: { user_id: number; percentage: number }[];
}
