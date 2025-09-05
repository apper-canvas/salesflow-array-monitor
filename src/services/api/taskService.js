import { toast } from "react-toastify";

// Initialize ApperClient for database operations
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TaskService {
  constructor() {
    this.tableName = 'task_c';
  }

async getAll() {
    await delay(300);
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "related_to_contact_c"}},
          {"field": {"Name": "related_to_lead_c"}},
          {"field": {"Name": "related_to_deal_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching tasks:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      toast.error("Failed to fetch tasks");
      return [];
    }
  }

async getById(id) {
    await delay(200);
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "related_to_contact_c"}},
          {"field": {"Name": "related_to_lead_c"}},
          {"field": {"Name": "related_to_deal_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.data) {
        throw new Error("Task not found");
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
      throw new Error("Task not found");
    }
  }

async create(taskData) {
    await delay(400);
    try {
      // Only include Updateable fields
      const taskRecord = {
        Name: taskData.Name || taskData.title || "",
        description_c: taskData.description_c || taskData.description || "",
        status_c: taskData.status_c || taskData.status || "Not Started",
        due_date_c: taskData.due_date_c || taskData.dueDate || null,
        Tags: taskData.Tags || ""
      };

      // Add related fields if provided
      if (taskData.related_to_contact_c) {
        taskRecord.related_to_contact_c = parseInt(taskData.related_to_contact_c);
      }
      if (taskData.related_to_lead_c) {
        taskRecord.related_to_lead_c = parseInt(taskData.related_to_lead_c);
      }
      if (taskData.related_to_deal_c) {
        taskRecord.related_to_deal_c = parseInt(taskData.related_to_deal_c);
      }

      const params = {
        records: [taskRecord]
      };

      const response = await apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error creating task:", response.message);
        toast.error(response.message);
        throw new Error("Failed to create task");
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create task:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create task");
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }

      throw new Error("Failed to create task");
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error);
      if (!error.message.includes("Failed to create task")) {
        toast.error("Failed to create task");
      }
      throw error;
    }
  }

async update(id, taskData) {
    await delay(400);
    try {
      // Only include Updateable fields
      const taskRecord = {
        Id: parseInt(id)
      };

      if (taskData.Name !== undefined || taskData.title !== undefined) {
        taskRecord.Name = taskData.Name || taskData.title;
      }
      if (taskData.description_c !== undefined || taskData.description !== undefined) {
        taskRecord.description_c = taskData.description_c || taskData.description;
      }
      if (taskData.status_c !== undefined || taskData.status !== undefined) {
        taskRecord.status_c = taskData.status_c || taskData.status;
      }
      if (taskData.due_date_c !== undefined || taskData.dueDate !== undefined) {
        taskRecord.due_date_c = taskData.due_date_c || taskData.dueDate;
      }
      if (taskData.Tags !== undefined) {
        taskRecord.Tags = taskData.Tags;
      }

      // Handle related fields
      if (taskData.related_to_contact_c !== undefined) {
        taskRecord.related_to_contact_c = taskData.related_to_contact_c ? parseInt(taskData.related_to_contact_c) : null;
      }
      if (taskData.related_to_lead_c !== undefined) {
        taskRecord.related_to_lead_c = taskData.related_to_lead_c ? parseInt(taskData.related_to_lead_c) : null;
      }
      if (taskData.related_to_deal_c !== undefined) {
        taskRecord.related_to_deal_c = taskData.related_to_deal_c ? parseInt(taskData.related_to_deal_c) : null;
      }

      const params = {
        records: [taskRecord]
      };

      const response = await apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error updating task:", response.message);
        toast.error(response.message);
        throw new Error("Failed to update task");
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update task:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update task");
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }

      throw new Error("Failed to update task");
    } catch (error) {
      console.error(`Error updating task ${id}:`, error?.response?.data?.message || error);
      if (!error.message.includes("Failed to update task")) {
        toast.error("Failed to update task");
      }
      throw error;
    }
  }

async delete(id) {
    await delay(300);
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error deleting task:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete task:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
        
        return successful.length > 0;
      }

      return true;
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to delete task");
      return false;
    }
  }

async getByStatus(status) {
    await delay(250);
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "related_to_contact_c"}},
          {"field": {"Name": "related_to_lead_c"}},
          {"field": {"Name": "related_to_deal_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [
          {
            "FieldName": "status_c",
            "Operator": "EqualTo", 
            "Values": [status],
            "Include": true
          }
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(`Error fetching tasks by status ${status}:`, response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching tasks by status ${status}:`, error?.response?.data?.message || error);
      toast.error("Failed to fetch tasks by status");
      return [];
    }
  }

async getByPriority(priority) {
    await delay(250);
    try {
      // Priority doesn't exist in database - return all tasks for UI compatibility
      // UI can filter by priority locally if needed
      return await this.getAll();
    } catch (error) {
      console.error(`Error fetching tasks by priority ${priority}:`, error?.response?.data?.message || error);
      toast.error("Failed to fetch tasks by priority");
      return [];
    }
  }
}

export const taskService = new TaskService();