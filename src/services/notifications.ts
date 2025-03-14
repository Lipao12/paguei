import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configura o comportamento das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // Exibe um alerta quando a notificação é recebida
    shouldPlaySound: true, // Toca um som ao receber a notificação
    shouldSetBadge: true, // Atualiza o ícone do app com um badge (número)
  }),
});

class NotificationService {
  // Solicita permissão para notificações
  async requestPermissions() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Você precisa permitir notificações para receber lembretes!');
      return false;
    }
    return true;
  }

  // Configura o canal de notificação (Android)
  async configureNotificationChannel() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('bill_reminders', {
        name: 'Lembretes de Contas',
        importance: Notifications.AndroidImportance.HIGH, // Prioridade alta
        sound: 'default', // Som padrão
        vibrationPattern: [0, 250, 250, 250], // Padrão de vibração
        lightColor: '#FF0000', // Cor do LED (se suportado)
      });
    }
  }

  // Agenda uma notificação para uma data específica
  async scheduleNotification(title: string, body: string, date: Date) {
    try {
      // Verifica se a data é futura
      if (date <= new Date()) {
        console.warn('A data da notificação deve ser no futuro.');
        return;
      }

      // Agenda a notificação
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'default', // Som ao receber a notificação
          data: { billId: '123' }, // Dados adicionais (opcional)
        },
        trigger: {
          date, // Data e hora para exibir a notificação
        },
      });

      console.log('Notificação agendada com ID:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('Erro ao agendar notificação:', error);
      throw error;
    }
  }

  // Cancela uma notificação agendada
  async cancelNotification(notificationId: string) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log('Notificação cancelada:', notificationId);
    } catch (error) {
      console.error('Erro ao cancelar notificação:', error);
      throw error;
    }
  }

  // Cancela todas as notificações agendadas
  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('Todas as notificações foram canceladas.');
    } catch (error) {
      console.error('Erro ao cancelar todas as notificações:', error);
      throw error;
    }
  }

  // Obtém todas as notificações agendadas
  async getPendingNotifications() {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      console.log('Notificações pendentes:', notifications);
      return notifications;
    } catch (error) {
      console.error('Erro ao buscar notificações pendentes:', error);
      throw error;
    }
  }
}

// Exporta uma instância do serviço
export default new NotificationService();