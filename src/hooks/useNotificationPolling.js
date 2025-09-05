import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { notificationService } from '@/services/api/notificationService';
import { setNotifications, setUnreadCount, addNotification } from '@/store/notificationSlice';

export const useNotificationPolling = (intervalMs = 30000) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const { lastUpdated } = useSelector(state => state.notifications);
  const intervalRef = useRef(null);
  const lastUpdatedRef = useRef(lastUpdated);

  useEffect(() => {
    lastUpdatedRef.current = lastUpdated;
  }, [lastUpdated]);

  useEffect(() => {
    if (!user?.userId) return;

    const pollNotifications = async () => {
      try {
        // Get recent notifications
        const notifications = await notificationService.getAll({
          recipientId: user.userId,
          limit: 50,
          offset: 0
        });

        // Get unread count
        const unreadCount = await notificationService.getUnreadCount(user.userId);
        
        dispatch(setNotifications(notifications));
        dispatch(setUnreadCount(unreadCount));

        // Check for new notifications since last update
        if (lastUpdatedRef.current) {
          const lastUpdateTime = new Date(lastUpdatedRef.current);
          const newNotifications = notifications.filter(
            n => new Date(n.CreatedOn) > lastUpdateTime
          );
          
          // Add each new notification individually for potential UI animations
          newNotifications.forEach(notification => {
            dispatch(addNotification(notification));
          });
        }
      } catch (error) {
        console.error('Error polling notifications:', error);
      }
    };

    // Initial load
    pollNotifications();

    // Set up polling interval
    intervalRef.current = setInterval(pollNotifications, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [user?.userId, intervalMs, dispatch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
};

export default useNotificationPolling;