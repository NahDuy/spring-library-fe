import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';
import './NotificationsPage.css';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'unread'
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
    // Fetch every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationService.getAllNotifications();
      setNotifications(data);
      
      const unread = data.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      setError('Không thể tải thông báo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      setError('Không thể đánh dấu thông báo');
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setUnreadCount(prev => {
        const deleted = notifications.find(n => n.id === notificationId);
        return deleted && !deleted.isRead ? Math.max(0, prev - 1) : prev;
      });
    } catch (err) {
      setError('Không thể xóa thông báo');
    }
  };

  const displayNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => !n.isRead);

  const getTypeColor = (type) => {
    switch(type) {
      case 'LOAN_DUE_SOON':
        return '#FFA500'; // Orange
      case 'LOAN_OVERDUE':
        return '#FF0000'; // Red
      case 'FINE_NOTICE':
        return '#FF6B6B'; // Red-orange
      case 'FINE_PAYMENT_DUE':
        return '#FF8C00'; // Dark orange
      default:
        return '#0066cc'; // Blue
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      'LOAN_DUE_SOON': '📅 Sắp đến hạn',
      'LOAN_OVERDUE': '⚠️ Quá hạn',
      'FINE_NOTICE': '💰 Thông báo phạt',
      'FINE_PAYMENT_DUE': '💳 Sắp đến hạn nộp phạt'
    };
    return labels[type] || type;
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="notifications-container">
        <div className="loading">Đang tải thông báo...</div>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h1>🔔 Thông báo</h1>
        {unreadCount > 0 && (
          <span className="unread-badge">{unreadCount} chưa đọc</span>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          Tất cả ({notifications.length})
        </button>
        <button
          className={`tab ${activeTab === 'unread' ? 'active' : ''}`}
          onClick={() => setActiveTab('unread')}
        >
          Chưa đọc ({unreadCount})
        </button>
      </div>

      <div className="notifications-list">
        {displayNotifications.length === 0 ? (
          <div className="empty-state">
            <p>✨ Không có thông báo</p>
          </div>
        ) : (
          displayNotifications.map(notification => (
            <div
              key={notification.id}
              className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
            >
              <div className="notification-content">
                <div className="notification-header">
                  <span
                    className="notification-type"
                    style={{ backgroundColor: getTypeColor(notification.type) }}
                  >
                    {getTypeLabel(notification.type)}
                  </span>
                  <span className="notification-time">
                    {new Date(notification.createdAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <h3 className="notification-title">{notification.title}</h3>
                <p className="notification-message">{notification.message}</p>
              </div>

              <div className="notification-actions">
                {!notification.isRead && (
                  <button
                    className="btn-read"
                    onClick={() => handleMarkAsRead(notification.id)}
                    title="Đánh dấu là đã đọc"
                  >
                    ✓ Đánh dấu
                  </button>
                )}
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(notification.id)}
                  title="Xóa thông báo"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {notifications.length > 0 && (
        <button className="btn-refresh" onClick={fetchNotifications}>
          🔄 Làm mới
        </button>
      )}
    </div>
  );
}
