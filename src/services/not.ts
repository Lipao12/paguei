import { Bill } from '@/types';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const configureNotifications = async () => {
  await Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    await Notifications.requestPermissionsAsync();
  }
};

export async function scheduleBillNotifications(bill: Bill) {
  if (bill.paid || !bill.isNotifing) return;

  const now = new Date();
  const dueDate = new Date(bill.dueDate);

  // Cancelar notificações anteriores
  await Notifications.cancelScheduledNotificationAsync(`${bill.id}-3days`);
  // ... outros cancels

  // Lógica de agendamento (ajustada para status)
  if (bill.status === 'overdue') {
    // Notificação diária às 8h
    await Notifications.scheduleNotificationAsync({
      identifier: `${bill.id}-overdue`,
      content: { title: 'Conta em atraso!', body: bill.name },
      trigger: { 
        type: 'daily',
        hour: 8,
        minute: 0,
        repeats: true
      }
    });
  } else if (bill.status === 'pending') {
    // Lógica para notificações pré-vencimento
    const daysBefore = [3, 1];
    
    daysBefore.forEach(days => {
      const triggerDate = new Date(dueDate);
      triggerDate.setDate(dueDate.getDate() - days);
      
      if (triggerDate > now) {
        Notifications.scheduleNotificationAsync({
          identifier: `${bill.id}-${days}days`,
          content: { title: 'Conta em atraso!', body: bill.name },
          trigger: { 
            type: 'date',
            date: triggerDate.getTime()
          }
        });
      }
    });
  }
}

export const cancelBillNotifications = async (billId: string) => {
  await Notifications.cancelScheduledNotificationAsync(`${billId}-3days`);
  await Notifications.cancelScheduledNotificationAsync(`${billId}-1day`);
  await Notifications.cancelScheduledNotificationAsync(`${billId}-overdue`);
};