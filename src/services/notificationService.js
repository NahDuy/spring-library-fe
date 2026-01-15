import { getToken } from './localStorageService';

const API_BASE = 'http://localhost:8080/spring';
const NOTIFICATION_API_URL = `${API_BASE}/api/notifications`;

export const notificationService = {
  // Lấy tất cả thông báo
  async getAllNotifications() {
    const token = getToken();
    if (!token) throw new Error('Token không tồn tại');

    try {
      const response = await fetch(`${NOTIFICATION_API_URL}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      return data.status || [];
    } catch (error) {
      console.error('Lỗi khi lấy thông báo:', error);
      throw error;
    }
  },

  // Lấy thông báo chưa đọc
  async getUnreadNotifications() {
    const token = getToken();
    if (!token) throw new Error('Token không tồn tại');

    try {
      const response = await fetch(`${NOTIFICATION_API_URL}/unread`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      return data.status || [];
    } catch (error) {
      console.error('Lỗi khi lấy thông báo chưa đọc:', error);
      throw error;
    }
  },

  // Đánh dấu thông báo là đã đọc
  async markAsRead(notificationId) {
    const token = getToken();
    if (!token) throw new Error('Token không tồn tại');

    try {
      const response = await fetch(`${NOTIFICATION_API_URL}/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      return await response.json();
    } catch (error) {
      console.error('Lỗi khi đánh dấu thông báo:', error);
      throw error;
    }
  },

  // Xóa thông báo
  async deleteNotification(notificationId) {
    const token = getToken();
    if (!token) throw new Error('Token không tồn tại');

    try {
      const response = await fetch(`${NOTIFICATION_API_URL}/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      return await response.json();
    } catch (error) {
      console.error('Lỗi khi xóa thông báo:', error);
      throw error;
    }
  }
};
