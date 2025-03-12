export interface Bill {
    id: string;
    name: string;
    category: string;
    amount: number;
    dueDate: string;
    description?: string;
    paid: boolean;
    reminderAt?: string;
    createdAt: string;
    updatedAt: string;
    recurring: boolean
  }
  
  export type FilterStatus = "all" | "paid" | "unpaid";
  