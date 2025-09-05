import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '@/components/organisms/Layout';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import { Card, CardContent, CardHeader } from '@/components/atoms/Card';
import { notificationService } from '@/services/api/notificationService';
import { setNotifications, markAsRead, markMultipleAsRead, setLoading, setError } from '@/store/notificationSlice';
import { formatDistanceToNow, format } from 'date-fns';

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, loading, error } = useSelector(state => state.notifications);
  const { user } = useSelector(state => state.user);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [typeFilter, setTypeFilter] = useState('all'); // all, General, Alert, System, Info
  const [allNotifications, setAllNotifications] = useState([]);
  const [pagination, setPagination] = useState({ limit: 20, offset: 0, total: 0 });

  useEffect(() => {
    if (user?.userId) {
      loadNotifications();
    }
  }, [user?.userId, pagination.offset, filter, typeFilter]);

  const loadNotifications = async () => {
    if (!user?.userId) return;
    
    dispatch(setLoading(true));
    try {
      const params = {
        recipientId: user.userId,
        limit: pagination.limit,
        offset: pagination.offset
      };

      if (filter !== 'all') {
        params.isRead = filter === 'read';
      }

      if (typeFilter !== 'all') {
        params.type = typeFilter;
      }

      const data = await notificationService.getAll(params);
      setAllNotifications(data);
      dispatch(setNotifications(data));
    } catch (error) {
      console.error('Error loading notifications:', error);
      dispatch(setError('Failed to load notifications'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === allNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(allNotifications.map(n => n.Id));
    }
  };

  const handleSelectNotification = (notificationId) => {
    setSelectedNotifications(prev => {
      if (prev.includes(notificationId)) {
        return prev.filter(id => id !== notificationId);
      } else {
        return [...prev, notificationId];
      }
    });
  };

  const handleMarkSelectedAsRead = async () => {
    if (selectedNotifications.length === 0) return;
    
    try {
      await notificationService.markAsRead(selectedNotifications);
      dispatch(markMultipleAsRead(selectedNotifications));
      
      // Update local state
      setAllNotifications(prev =>
        prev.map(notification =>
          selectedNotifications.includes(notification.Id)
            ? { ...notification, is_read_c: true }
            : notification
        )
      );
      
      setSelectedNotifications([]);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.update(notificationId, { is_read_c: true });
      dispatch(markAsRead(notificationId));
      
      // Update local state
      setAllNotifications(prev =>
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

  const filteredNotifications = allNotifications.filter(notification => {
    const matchesReadFilter = filter === 'all' || 
      (filter === 'read' && notification.is_read_c) ||
      (filter === 'unread' && !notification.is_read_c);
    
    const matchesTypeFilter = typeFilter === 'all' || notification.type_c === typeFilter;
    
    return matchesReadFilter && matchesTypeFilter;
  });

  const headerActions = (
    <div className="flex items-center space-x-2">
      {selectedNotifications.length > 0 && (
        <Button
          onClick={handleMarkSelectedAsRead}
          variant="outline"
          size="sm"
          className="text-primary-600 border-primary-200 hover:bg-primary-50"
        >
          <ApperIcon name="Check" className="h-4 w-4 mr-2" />
          Mark Selected as Read
        </Button>
      )}
      
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        <option value="all">All Notifications</option>
        <option value="unread">Unread</option>
        <option value="read">Read</option>
      </select>
      
      <select
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
        className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        <option value="all">All Types</option>
        <option value="General">General</option>
        <option value="Alert">Alert</option>
        <option value="System">System</option>
        <option value="Info">Info</option>
      </select>
    </div>
  );

  return (
    <Layout
      title="Notifications"
      showSearch={false}
      headerActions={headerActions}
    >
      <div className="p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <Card>
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                All Notifications ({filteredNotifications.length})
              </h2>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedNotifications.length === allNotifications.length && allNotifications.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label className="text-sm text-gray-600">Select All</label>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  <span className="ml-3 text-gray-600">Loading notifications...</span>
                </div>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <ApperIcon name="Bell" className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
                <p className="text-sm">
                  {filter !== 'all' 
                    ? `No ${filter} notifications at the moment.`
                    : 'You\'re all caught up! No notifications to display.'
                  }
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map((notification) => (
                  <NotificationListItem
                    key={notification.Id}
                    notification={notification}
                    isSelected={selectedNotifications.includes(notification.Id)}
                    onSelect={handleSelectNotification}
                    onMarkAsRead={handleMarkAsRead}
                    getNotificationIcon={getNotificationIcon}
                    getNotificationColor={getNotificationColor}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

const NotificationListItem = ({ 
  notification, 
  isSelected, 
  onSelect, 
  onMarkAsRead, 
  getNotificationIcon, 
  getNotificationColor 
}) => {
  return (
    <div
      className={`p-6 hover:bg-gray-50 transition-colors ${
        !notification.is_read_c ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
      }`}
    >
      <div className="flex items-start space-x-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(notification.Id)}
          className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        
        <div className="flex-shrink-0 mt-1">
          <div className={`p-3 rounded-full ${
            !notification.is_read_c ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
            <ApperIcon 
              name={getNotificationIcon(notification.type_c)} 
              className={`h-5 w-5 ${
                !notification.is_read_c ? 'text-blue-600' : 'text-gray-500'
              }`} 
            />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <Badge variant={getNotificationColor(notification.type_c)} className="text-xs">
              {notification.type_c}
            </Badge>
            <div className="text-sm text-gray-500">
              {format(new Date(notification.CreatedOn), 'MMM dd, yyyy')} · {' '}
              {formatDistanceToNow(new Date(notification.CreatedOn), { addSuffix: true })}
            </div>
          </div>
          
          <p className={`text-sm leading-relaxed ${
            !notification.is_read_c ? 'text-gray-900 font-medium' : 'text-gray-600'
          }`}>
            {notification.message_c}
          </p>
          
          {notification.related_entity_type_c && notification.related_entity_id_c && (
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Related to {notification.related_entity_type_c} #{notification.related_entity_id_c}
              </span>
            </div>
          )}
          
          {!notification.is_read_c && (
            <button
              onClick={() => onMarkAsRead(notification.Id)}
              className="mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              <ApperIcon name="Check" className="h-4 w-4 mr-1" />
              Mark as read
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;