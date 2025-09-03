import { toast } from 'react-toastify';

class LeadService {
  constructor() {
    this.tableName = 'lead_c';
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

  async getAll() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "source_c"}},
          {"field": {"Name": "assigned_to_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to fetch leads: ${response.message}`);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(lead => ({
        Id: lead.Id,
        status: lead.status_c || 'new',
        score: lead.score_c || 50,
        source: lead.source_c || '',
        assignedTo: lead.assigned_to_c || 'Sales Manager',
        contactId: lead.contact_id_c?.Id || lead.contact_id_c || null,
        createdAt: lead.CreatedOn
      }));
    } catch (error) {
      console.error("Error fetching leads:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "source_c"}},
          {"field": {"Name": "assigned_to_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.data) {
        return null;
      }

      const lead = response.data;
      return {
        Id: lead.Id,
        status: lead.status_c || 'new',
        score: lead.score_c || 50,
        source: lead.source_c || '',
        assignedTo: lead.assigned_to_c || 'Sales Manager',
        contactId: lead.contact_id_c?.Id || lead.contact_id_c || null,
        createdAt: lead.CreatedOn
      };
    } catch (error) {
      console.error(`Error fetching lead ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(leadData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          status_c: leadData.status || 'new',
          score_c: parseInt(leadData.score) || 50,
          source_c: leadData.source || '',
          assigned_to_c: leadData.assignedTo || 'Sales Manager',
          contact_id_c: parseInt(leadData.contactId) || null
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to create lead: ${response.message}`);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} leads:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const createdLead = successful[0].data;
          return {
            Id: createdLead.Id,
            status: createdLead.status_c || 'new',
            score: createdLead.score_c || 50,
            source: createdLead.source_c || '',
            assignedTo: createdLead.assigned_to_c || 'Sales Manager',
            contactId: createdLead.contact_id_c?.Id || createdLead.contact_id_c || null,
            createdAt: createdLead.CreatedOn
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating lead:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, leadData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Id: parseInt(id),
          status_c: leadData.status || 'new',
          score_c: parseInt(leadData.score) || 50,
          source_c: leadData.source || '',
          assigned_to_c: leadData.assignedTo || 'Sales Manager',
          contact_id_c: parseInt(leadData.contactId) || null
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to update lead: ${response.message}`);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} leads:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updatedLead = successful[0].data;
          return {
            Id: updatedLead.Id,
            status: updatedLead.status_c || 'new',
            score: updatedLead.score_c || 50,
            source: updatedLead.source_c || '',
            assignedTo: updatedLead.assigned_to_c || 'Sales Manager',
            contactId: updatedLead.contact_id_c?.Id || updatedLead.contact_id_c || null,
            createdAt: updatedLead.CreatedOn
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating lead:", error?.response?.data?.message || error);
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
        console.error(`Failed to delete lead: ${response.message}`);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} leads:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length === 1;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting lead:", error?.response?.data?.message || error);
      return false;
    }
  }
}

export const leadService = new LeadService();