import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../../services/notificationService';
import './NotificationBell.css';

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUnreadCount();
    // Fetch every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const data = await notificationService.getUnreadNotifications();
      setUnreadCount(data.length);
      // Show only last 3 notifications in dropdown
      setRecentNotifications(data.slice(0, 3));
    } catch (err) {
      console.error('Failed to fetch unread notifications:', err);
    }
  };

  const handleViewAll = () => {
    navigate('/notifications');
    setShowDropdown(false);
  };

  const handleMarkAsRead = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await notificationService.markAsRead(notificationId);
      fetchUnreadCount();
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const getNotificationTypeColor = (type) => {
    switch (type) {
      case 'LOAN_DUE_SOON':
        return '#ff9800'; // Orange
      case 'LOAN_OVERDUE':
        return '#f44336'; // Red
      case 'FINE_NOTICE':
        return '#e91e63'; // Pink
      case 'FINE_PAYMENT_DUE':
        return '#ff1744'; // Deep Pink
      default:
        return '#2196F3'; // Blue
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="notification-bell-container">
      <button 
        className="bell-icon"
        onClick={() => setShowDropdown(!showDropdown)}
        title="Thông báo"
      >
        🔔
        {unreadCount > 0 && (
          <span className="badge">{unreadCount}</span>
        )}
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          {recentNotifications.length > 0 ? (
            <>
              <div className="dropdown-header">
                <h3>Thông báo gần đây</h3>
                {unreadCount > 0 && (
                  <span className="unread-count">{unreadCount} chưa đọc</span>
                )}
              </div>
              <div className="dropdown-notifications">
                {recentNotifications.map(notification => (
                  <div key={notification.id} className="dropdown-item">
                    <div 
                      className="notification-type-dot"
                      style={{ backgroundColor: getNotificationTypeColor(notification.type) }}
                    />
                    <div className="notification-content">
                      <div className="notification-title">{notification.title}</div>
                      <div className="notification-message">{notification.message}</div>
                      <div className="notification-time">{formatTime(notification.createdAt)}</div>
                    </div>
                    {!notification.isRead && (
                      <button
                        className="mark-read-btn"
                        onClick={(e) => handleMarkAsRead(notification.id, e)}
                        title="Đánh dấu đã đọc"
                      >
                        ✓
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button className="dropdown-footer" onClick={handleViewAll}>
                Xem tất cả thông báo
              </button>
            </>
          ) : (
            <div className="no-notifications">
              <p>Không có thông báo mới</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
