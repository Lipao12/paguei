
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Bill } from '@/types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  private static instance: NotificationService;
  private initialized: boolean = false;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize() {
    if (this.initialized) return;

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Notification permissions not granted');
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('bills', {
        name: 'Bill Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
        enableVibrate: true,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    this.initialized = true;
  }

  async scheduleBillNotification(bill: Bill) {
    if (!this.initialized) {
      await this.initialize();
    }

    if (bill.paid || !bill.isNotifing) return;

    const dueDate = new Date(bill.dueDate);
    const notificationId = `bill-${bill.id}`;

    // Cancel any existing notifications for this bill
    await this.cancelNotification(notificationId);

    // Schedule based on bill status
    if (bill.status === 'overdue') {
      await Notifications.scheduleNotificationAsync({
        identifier: notificationId,
        content: {
          title: 'Conta Atrasada',
          body: `A conta ${bill.name} está atrasada!`,
          data: { billId: bill.id },
          sound: 'default',
        },
        trigger: {
          channelId: 'bills',
          seconds: 60 * 60 * 24, // Daily reminder
          repeats: true,
        },
      });
    } else {
      // Schedule reminders 3 days and 1 day before due date
      const reminderDays = [3, 1];
      
      for (const days of reminderDays) {
        const reminderDate = new Date(dueDate);
        reminderDate.setDate(dueDate.getDate() - days);
        
        if (reminderDate > new Date()) {
          await Notifications.scheduleNotificationAsync({
            identifier: `${notificationId}-${days}d`,
            content: {
              title: 'Lembrete de Pagamento',
              body: `A conta ${bill.name} vence em ${days} dia${days > 1 ? 's' : ''}!`,
              data: { billId: bill.id },
              sound: 'default',
            },
            trigger: {
              channelId: 'bills',
              date: reminderDate,
            },
          });
        }
      }
    }
  }

  async cancelNotification(identifier: string) {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  }

  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  async getPendingNotifications() {
    return await Notifications.getAllScheduledNotificationsAsync();
  }
}

export default NotificationService.getInstance();
