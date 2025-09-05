import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import { notificationService } from '@/services/api/notificationService';
import { setNotifications, markAsRead, setLoading } from '@/store/notificationSlice';
import { formatDistanceToNow } from 'date-fns';

const NotificationCenter = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const { notifications, loading } = useSelector(state => state.notifications);
  const { user } = useSelector(state => state.user);
  const [recentNotifications, setRecentNotifications] = useState([]);

  useEffect(() => {
    if (isOpen && user?.userId) {
      loadNotifications();
    }
  }, [isOpen, user?.userId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const loadNotifications = async () => {
    if (!user?.userId) return;
    
    dispatch(setLoading(true));
    try {
      const data = await notificationService.getAll({
        recipientId: user.userId,
        limit: 5,
        offset: 0
      });
      setRecentNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleMarkAsRead = async (notificationId, event) => {
    event.stopPropagation();
    
    try {
      await notificationService.update(notificationId, { is_read_c: true });
      dispatch(markAsRead(notificationId));
      
      // Update local state
      setRecentNotifications(prev => 
        prev.map(notification => 
          notification.Id === notificationId 
            ? { ...notification, is_read_c: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'Alert': return 'AlertTriangle';
      case 'System': return 'Settings';
      case 'Info': return 'Info';
      default: return 'Bell';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'Alert': return 'danger';
      case 'System': return 'secondary';
      case 'Info': return 'info';
      default: return 'default';
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ApperIcon name="X" className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading notifications...</span>
            </div>
          </div>
        ) : recentNotifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <ApperIcon name="Bell" className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentNotifications.map((notification) => (
              <NotificationItem
                key={notification.Id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                getNotificationIcon={getNotificationIcon}
                getNotificationColor={getNotificationColor}
              />
            ))}
          </div>
        )}
      </div>

      {recentNotifications.length > 0 && (
        <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <Link
            to="/notifications"
            className="block text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
            onClick={onClose}
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
};

const NotificationItem = ({ notification, onMarkAsRead, getNotificationIcon, getNotificationColor }) => {
  return (
    <div
      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
        !notification.is_read_c ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className={`p-2 rounded-full ${
            !notification.is_read_c ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
            <ApperIcon 
              name={getNotificationIcon(notification.type_c)} 
              className={`h-4 w-4 ${
                !notification.is_read_c ? 'text-blue-600' : 'text-gray-500'
              }`} 
            />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <Badge variant={getNotificationColor(notification.type_c)} className="text-xs">
              {notification.type_c}
            </Badge>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(notification.CreatedOn), { addSuffix: true })}
            </span>
          </div>
          
          <p className={`mt-1 text-sm ${
            !notification.is_read_c ? 'text-gray-900 font-medium' : 'text-gray-600'
          }`}>
            {notification.message_c}
          </p>
          
          {!notification.is_read_c && (
            <button
              onClick={(e) => onMarkAsRead(notification.Id, e)}
              className="mt-2 text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              Mark as read
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;