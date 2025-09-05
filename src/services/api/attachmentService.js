import { toast } from 'react-toastify';

class AttachmentService {
  constructor() {
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

  async getByEntity(entityType, entityId) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const fieldName = `${entityType}_c_id_c`;
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name_c"}},
          {"field": {"Name": "file_path_c"}},
          {"field": {"Name": "upload_date_c"}},
          {"field": {"Name": "deal_c_id_c"}},
          {"field": {"Name": "contact_c_id_c"}},
          {"field": {"Name": "activity_c_id_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{
          "FieldName": fieldName,
          "Operator": "EqualTo", 
          "Values": [parseInt(entityId)]
        }],
        orderBy: [{"fieldName": "upload_date_c", "sorttype": "DESC"}]
      };

      const response = await this.apperClient.fetchRecords('attachment_c', params);
      
      if (!response?.data?.length) {
        return [];
      }

      return response.data.map(attachment => ({
        Id: attachment.Id,
        name: attachment.Name_c || '',
        filePath: attachment.file_path_c || '',
        uploadDate: attachment.upload_date_c || attachment.CreatedOn,
        dealId: attachment.deal_c_id_c?.Id || attachment.deal_c_id_c || null,
        contactId: attachment.contact_c_id_c?.Id || attachment.contact_c_id_c || null,
        activityId: attachment.activity_c_id_c?.Id || attachment.activity_c_id_c || null
      }));
    } catch (error) {
      console.error("Error fetching attachments:", error?.response?.data?.message || error);
      return [];
    }
  }

  async create(attachmentData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Name_c: attachmentData.name || '',
          file_path_c: attachmentData.filePath || '',
          upload_date_c: new Date().toISOString(),
          deal_c_id_c: attachmentData.dealId ? parseInt(attachmentData.dealId) : null,
          contact_c_id_c: attachmentData.contactId ? parseInt(attachmentData.contactId) : null,
          activity_c_id_c: attachmentData.activityId ? parseInt(attachmentData.activityId) : null
        }]
      };

      const response = await this.apperClient.createRecord('attachment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} attachments:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const createdAttachment = successful[0].data;
          return {
            Id: createdAttachment.Id,
            name: createdAttachment.Name_c || '',
            filePath: createdAttachment.file_path_c || '',
            uploadDate: createdAttachment.upload_date_c || createdAttachment.CreatedOn,
            dealId: createdAttachment.deal_c_id_c?.Id || createdAttachment.deal_c_id_c || null,
            contactId: createdAttachment.contact_c_id_c?.Id || createdAttachment.contact_c_id_c || null,
            activityId: createdAttachment.activity_c_id_c?.Id || createdAttachment.activity_c_id_c || null
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating attachment:", error?.response?.data?.message || error);
      toast.error("Failed to upload attachment");
      return null;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord('attachment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} attachments:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
      return false;
    } catch (error) {
      console.error("Error deleting attachment:", error?.response?.data?.message || error);
      toast.error("Failed to delete attachment");
      return false;
    }
  }
}

export const attachmentService = new AttachmentService();