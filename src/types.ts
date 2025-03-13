export interface Bill {
    id: string;
    name: string;
    category: string;
    amount: number;
    dueDate: string;
    paid: boolean;
    reminderAt?: string;
    createdAt: string;
    updatedAt: string;
    recurring: boolean;
    status: string;
  }
  
  export type FilterStatus = "all" | "paid" | "unpaid";
  