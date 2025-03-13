import { Bill } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const loadBills = async (): Promise<Bill[]> => {
    try {
      const storedBills = await AsyncStorage.getItem("bills");
  
      if (!storedBills) return [];
  
      let parsedBills: Bill[] = JSON.parse(storedBills);
  
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Zerar horas para evitar problemas de comparação
  
      // Processar contas
      const cleanedBills = parsedBills.map((bill) => {
        const dueDate = new Date(bill.dueDate);
        return {
          ...bill,
          enableNotification: dueDate >= today || bill.paid, // Notificação só ativa se estiver no prazo ou pago
        };
      });
  
      // Ordenar por data de vencimento (mais antigos primeiro)
      const sortedBills = cleanedBills.sort((a, b) => {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
  
      // Filtrar apenas os últimos 6 meses ou contas não pagas
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
      const filteredBills = sortedBills.filter((bill) => {
        const billDate = new Date(bill.dueDate);
        return billDate >= sixMonthsAgo || !bill.paid;
      });
  
      // Atualizar armazenamento se houve mudanças
      if (filteredBills.length !== parsedBills.length) {
        await AsyncStorage.setItem("bills", JSON.stringify(filteredBills));
      }
  
      return filteredBills;
    } catch (error) {
      console.error("Erro ao carregar contas:", error);
      throw new Error("Não foi possível carregar as contas");
    }
  };

  export const deleteBill = async (id: string) => {
    try {
      const storedBills = await AsyncStorage.getItem("bills");
      const bills: Bill[] = storedBills ? JSON.parse(storedBills) : [];
  
      const updatedBills = bills.filter((bill) => bill.id !== id);
  
      // Atualiza o AsyncStorage
      await AsyncStorage.setItem("bills", JSON.stringify(updatedBills));
  
      console.log("Conta excluída com sucesso.");
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
    }
  }

  export const updateStatusBill = async (id:string, newStatus: string) =>{
    try {
      const storedBills = await AsyncStorage.getItem("bills");
      const bills: Bill[] = storedBills ? JSON.parse(storedBills) : [];

      const updatedBills = bills.map((bill) => {
        if (bill.id === id) {
          return { ...bill, status: newStatus };  // Atualiza o status da conta
        }
        return bill;  // Mantém as contas não modificadas
      });
  
      // Atualiza o AsyncStorage
      await AsyncStorage.setItem("bills", JSON.stringify(updatedBills));
  
      console.log("Conta atualizada com sucesso.");
    } catch (error) {
      console.error("Erro ao atualizar conta:", error);
    }
  }