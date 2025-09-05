import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  lastUpdated: null,
};

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(n => !n.is_read_c).length;
      state.lastUpdated = new Date().toISOString();
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.is_read_c) {
        state.unreadCount += 1;
      }
    },
    markAsRead: (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(n => n.Id === notificationId);
      if (notification && !notification.is_read_c) {
        notification.is_read_c = true;
        state.unreadCount -= 1;
      }
    },
    markMultipleAsRead: (state, action) => {
      const notificationIds = action.payload;
      notificationIds.forEach(id => {
        const notification = state.notifications.find(n => n.Id === id);
        if (notification && !notification.is_read_c) {
          notification.is_read_c = true;
          state.unreadCount -= 1;
        }
      });
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    removeNotification: (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(n => n.Id === notificationId);
      if (notification && !notification.is_read_c) {
        state.unreadCount -= 1;
      }
      state.notifications = state.notifications.filter(n => n.Id !== notificationId);
    },
  },
});

export const { 
  setNotifications, 
  addNotification, 
  markAsRead, 
  markMultipleAsRead,
  setUnreadCount, 
  setLoading, 
  setError, 
  clearError,
  removeNotification 
} = notificationSlice.actions;

export default notificationSlice.reducer;