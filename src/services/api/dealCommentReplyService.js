import { toast } from 'react-toastify';

class DealCommentReplyService {
  constructor() {
    this.tableName = 'deal_comment_reply_c';
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

  async getRepliesByCommentId(commentId) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "deal_comment_c_id_c"}},
          {"field": {"Name": "reply_text_c"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [
          {"FieldName": "deal_comment_c_id_c", "Operator": "EqualTo", "Values": [parseInt(commentId)]}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "ASC"}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to fetch comment replies: ${response.message}`);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(reply => ({
        Id: reply.Id,
        commentId: reply.deal_comment_c_id_c?.Id || reply.deal_comment_c_id_c || null,
        replyText: reply.reply_text_c || '',
        userId: reply.user_id_c?.Id || reply.user_id_c || null,
        userName: reply.user_id_c?.Name || 'Unknown User',
        createdAt: reply.CreatedOn,
        createdBy: reply.CreatedBy?.Name || 'System',
        modifiedAt: reply.ModifiedOn
      }));
    } catch (error) {
      console.error("Error fetching comment replies:", error?.response?.data?.message || error);
      return [];
    }
  }

  async create(replyData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          deal_comment_c_id_c: parseInt(replyData.commentId),
          reply_text_c: replyData.replyText || '',
          user_id_c: parseInt(replyData.userId)
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to create comment reply: ${response.message}`);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} comment replies:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const createdReply = successful[0].data;
          return {
            Id: createdReply.Id,
            commentId: createdReply.deal_comment_c_id_c?.Id || createdReply.deal_comment_c_id_c || null,
            replyText: createdReply.reply_text_c || '',
            userId: createdReply.user_id_c?.Id || createdReply.user_id_c || null,
            userName: createdReply.user_id_c?.Name || 'Unknown User',
            createdAt: createdReply.CreatedOn,
            createdBy: createdReply.CreatedBy?.Name || 'System',
            modifiedAt: createdReply.ModifiedOn
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating comment reply:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, replyData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Id: parseInt(id),
          reply_text_c: replyData.replyText || ''
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to update comment reply: ${response.message}`);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} comment replies:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updatedReply = successful[0].data;
          return {
            Id: updatedReply.Id,
            commentId: updatedReply.deal_comment_c_id_c?.Id || updatedReply.deal_comment_c_id_c || null,
            replyText: updatedReply.reply_text_c || '',
            userId: updatedReply.user_id_c?.Id || updatedReply.user_id_c || null,
            userName: updatedReply.user_id_c?.Name || 'Unknown User',
            createdAt: updatedReply.CreatedOn,
            createdBy: updatedReply.CreatedBy?.Name || 'System',
            modifiedAt: updatedReply.ModifiedOn
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating comment reply:", error?.response?.data?.message || error);
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
        console.error(`Failed to delete comment reply: ${response.message}`);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} comment replies:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length === 1;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting comment reply:", error?.response?.data?.message || error);
      return false;
    }
  }
}

export const dealCommentReplyService = new DealCommentReplyService();