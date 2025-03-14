export interface Bill {
    id: string;
    name: string;
    category: string;
    amount: number;
    dueDate: string;
    paid: boolean;
    reminderAt?: string;
    isNotifing?: boolean;
    createdAt: string;
    recurring: boolean;
    status: BillStatus;
  }
  
  export type FilterStatus = "all" | "paid" | "unpaid";

  export type BillStatus = "Pendente" | "Pago" | "Atrasado";
  