import { toast } from 'react-toastify';

class DealCommentService {
  constructor() {
    this.tableName = 'deal_comment_c';
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getCommentsByDealId(dealId) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "deal_c_id_c"}},
          {"field": {"Name": "comment_text_c"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [
          {"FieldName": "deal_c_id_c", "Operator": "EqualTo", "Values": [parseInt(dealId)]}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "ASC"}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to fetch deal comments: ${response.message}`);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(comment => ({
        Id: comment.Id,
        dealId: comment.deal_c_id_c?.Id || comment.deal_c_id_c || null,
        commentText: comment.comment_text_c || '',
        userId: comment.user_id_c?.Id || comment.user_id_c || null,
        userName: comment.user_id_c?.Name || 'Unknown User',
        createdAt: comment.CreatedOn,
        createdBy: comment.CreatedBy?.Name || 'System',
        modifiedAt: comment.ModifiedOn
      }));
    } catch (error) {
      console.error("Error fetching deal comments:", error?.response?.data?.message || error);
      return [];
    }
  }

  async create(commentData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          deal_c_id_c: parseInt(commentData.dealId),
          comment_text_c: commentData.commentText || '',
          user_id_c: parseInt(commentData.userId)
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to create deal comment: ${response.message}`);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} deal comments:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const createdComment = successful[0].data;
          return {
            Id: createdComment.Id,
            dealId: createdComment.deal_c_id_c?.Id || createdComment.deal_c_id_c || null,
            commentText: createdComment.comment_text_c || '',
            userId: createdComment.user_id_c?.Id || createdComment.user_id_c || null,
            userName: createdComment.user_id_c?.Name || 'Unknown User',
            createdAt: createdComment.CreatedOn,
            createdBy: createdComment.CreatedBy?.Name || 'System',
            modifiedAt: createdComment.ModifiedOn
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating deal comment:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, commentData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Id: parseInt(id),
          comment_text_c: commentData.commentText || ''
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to update deal comment: ${response.message}`);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} deal comments:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updatedComment = successful[0].data;
          return {
            Id: updatedComment.Id,
            dealId: updatedComment.deal_c_id_c?.Id || updatedComment.deal_c_id_c || null,
            commentText: updatedComment.comment_text_c || '',
            userId: updatedComment.user_id_c?.Id || updatedComment.user_id_c || null,
            userName: updatedComment.user_id_c?.Name || 'Unknown User',
            createdAt: updatedComment.CreatedOn,
            createdBy: updatedComment.CreatedBy?.Name || 'System',
            modifiedAt: updatedComment.ModifiedOn
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating deal comment:", error?.response?.data?.message || error);
      return null;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to delete deal comment: ${response.message}`);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} deal comments:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length === 1;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting deal comment:", error?.response?.data?.message || error);
      return false;
    }
  }
}

export const dealCommentService = new DealCommentService();