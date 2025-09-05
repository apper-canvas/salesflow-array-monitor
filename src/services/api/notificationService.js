import { toast } from 'react-toastify';

// Initialize ApperClient for database operations
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

class NotificationService {
  constructor() {
    this.tableName = 'notification_c';
  }

  async getAll(params = {}) {
    try {
      const queryParams = {
        fields: [
          { "field": { "Name": "Id" } },
          { "field": { "Name": "message_c" } },
          { "field": { "Name": "recipient_id_c" } },
          { "field": { "Name": "is_read_c" } },
          { "field": { "Name": "type_c" } },
          { "field": { "Name": "related_entity_id_c" } },
          { "field": { "Name": "related_entity_type_c" } },
          { "field": { "Name": "CreatedOn" } },
          { "field": { "Name": "CreatedBy" } }
        ],
        orderBy: [{ "fieldName": "CreatedOn", "sorttype": "DESC" }],
        pagingInfo: { 
          limit: params.limit || 20, 
          offset: params.offset || 0 
        }
      };

      // Add filtering if specified
      if (params.recipientId) {
        queryParams.where = [{
          "FieldName": "recipient_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(params.recipientId)],
          "Include": true
        }];
      }

      if (params.type) {
        const whereCondition = {
          "FieldName": "type_c",
          "Operator": "EqualTo", 
          "Values": [params.type],
          "Include": true
        };
        
        if (queryParams.where) {
          queryParams.where.push(whereCondition);
        } else {
          queryParams.where = [whereCondition];
        }
      }

      if (params.isRead !== undefined) {
        const whereCondition = {
          "FieldName": "is_read_c",
          "Operator": "EqualTo",
          "Values": [params.isRead],
          "Include": true
        };
        
        if (queryParams.where) {
          queryParams.where.push(whereCondition);
        } else {
          queryParams.where = [whereCondition];
        }
      }

      const response = await apperClient.fetchRecords(this.tableName, queryParams);
      
      if (!response.success) {
        console.error("Failed to fetch notifications:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching notifications:", error?.response?.data?.message || error);
      toast.error("Failed to load notifications");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { "field": { "Name": "Id" } },
          { "field": { "Name": "message_c" } },
          { "field": { "Name": "recipient_id_c" } },
          { "field": { "Name": "is_read_c" } },
          { "field": { "Name": "type_c" } },
          { "field": { "Name": "related_entity_id_c" } },
          { "field": { "Name": "related_entity_type_c" } },
          { "field": { "Name": "CreatedOn" } },
          { "field": { "Name": "CreatedBy" } }
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(`Failed to fetch notification ${id}:`, response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching notification ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to load notification");
      return null;
    }
  }

  async create(notificationData) {
    try {
      // Only include Updateable fields for create operation
      const params = {
        records: [{
          message_c: notificationData.message_c,
          recipient_id_c: parseInt(notificationData.recipient_id_c),
          is_read_c: notificationData.is_read_c || false,
          type_c: notificationData.type_c || 'General',
          related_entity_id_c: notificationData.related_entity_id_c ? parseInt(notificationData.related_entity_id_c) : null,
          related_entity_type_c: notificationData.related_entity_type_c || null
        }]
      };

      const response = await apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to create notification:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} notification:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Notification created successfully');
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating notification:", error?.response?.data?.message || error);
      toast.error("Failed to create notification");
      return null;
    }
  }

  async update(id, notificationData) {
    try {
      // Only include Updateable fields for update operation
      const updateData = {
        Id: id
      };

      // Add only the fields that are being updated
      if (notificationData.message_c !== undefined) {
        updateData.message_c = notificationData.message_c;
      }
      if (notificationData.recipient_id_c !== undefined) {
        updateData.recipient_id_c = parseInt(notificationData.recipient_id_c);
      }
      if (notificationData.is_read_c !== undefined) {
        updateData.is_read_c = notificationData.is_read_c;
      }
      if (notificationData.type_c !== undefined) {
        updateData.type_c = notificationData.type_c;
      }
      if (notificationData.related_entity_id_c !== undefined) {
        updateData.related_entity_id_c = notificationData.related_entity_id_c ? parseInt(notificationData.related_entity_id_c) : null;
      }
      if (notificationData.related_entity_type_c !== undefined) {
        updateData.related_entity_type_c = notificationData.related_entity_type_c;
      }

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to update notification ${id}:`, response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} notification:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Notification updated successfully');
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error(`Error updating notification ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to update notification");
      return null;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to delete notification ${id}:`, response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} notification:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Notification deleted successfully');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error(`Error deleting notification ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to delete notification");
      return false;
    }
  }

  async getUnreadCount(recipientId) {
    try {
      const queryParams = {
        fields: [{ "field": { "Name": "Id" }, "Function": "Count" }],
        where: [
          {
            "FieldName": "recipient_id_c",
            "Operator": "EqualTo",
            "Values": [parseInt(recipientId)],
            "Include": true
          },
          {
            "FieldName": "is_read_c",
            "Operator": "EqualTo",
            "Values": [false],
            "Include": true
          }
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, queryParams);
      
      if (!response.success) {
        console.error("Failed to get unread count:", response.message);
        return 0;
      }

      return response.total || 0;
    } catch (error) {
      console.error("Error getting unread count:", error?.response?.data?.message || error);
      return 0;
    }
  }

  async markAsRead(notificationIds) {
    try {
      const records = notificationIds.map(id => ({
        Id: id,
        is_read_c: true
      }));

      const params = { records };
      const response = await apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to mark notifications as read:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to mark ${failed.length} notifications as read:`, failed);
        }

        if (successful.length > 0) {
          toast.success(`${successful.length} notifications marked as read`);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error marking notifications as read:", error?.response?.data?.message || error);
      toast.error("Failed to mark notifications as read");
      return false;
    }
  }

  async getByType(type, recipientId, params = {}) {
    try {
      const queryParams = {
        fields: [
          { "field": { "Name": "Id" } },
          { "field": { "Name": "message_c" } },
          { "field": { "Name": "recipient_id_c" } },
          { "field": { "Name": "is_read_c" } },
          { "field": { "Name": "type_c" } },
          { "field": { "Name": "related_entity_id_c" } },
          { "field": { "Name": "related_entity_type_c" } },
          { "field": { "Name": "CreatedOn" } },
          { "field": { "Name": "CreatedBy" } }
        ],
        where: [
          {
            "FieldName": "type_c",
            "Operator": "EqualTo",
            "Values": [type],
            "Include": true
          },
          {
            "FieldName": "recipient_id_c",
            "Operator": "EqualTo",
            "Values": [parseInt(recipientId)],
            "Include": true
          }
        ],
        orderBy: [{ "fieldName": "CreatedOn", "sorttype": "DESC" }],
        pagingInfo: { 
          limit: params.limit || 20, 
          offset: params.offset || 0 
        }
      };

      const response = await apperClient.fetchRecords(this.tableName, queryParams);
      
      if (!response.success) {
        console.error(`Failed to fetch ${type} notifications:`, response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching ${type} notifications:`, error?.response?.data?.message || error);
      toast.error(`Failed to load ${type} notifications`);
      return [];
    }
  }
}

export const notificationService = new NotificationService();