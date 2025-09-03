import { toast } from 'react-toastify';

class DealService {
  constructor() {
    this.tableName = 'deal_c';
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "assigned_to_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to fetch deals: ${response.message}`);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(deal => ({
        Id: deal.Id,
        title: deal.title_c || '',
        value: deal.value_c || 0,
        stage: deal.stage_c || 'prospect',
        probability: deal.probability_c || 25,
        expectedCloseDate: deal.expected_close_date_c || '',
        assignedTo: deal.assigned_to_c || 'Sales Manager',
        contactId: deal.contact_id_c?.Id || deal.contact_id_c || null,
        createdAt: deal.CreatedOn
      }));
    } catch (error) {
      console.error("Error fetching deals:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "assigned_to_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.data) {
        return null;
      }

      const deal = response.data;
      return {
        Id: deal.Id,
        title: deal.title_c || '',
        value: deal.value_c || 0,
        stage: deal.stage_c || 'prospect',
        probability: deal.probability_c || 25,
        expectedCloseDate: deal.expected_close_date_c || '',
        assignedTo: deal.assigned_to_c || 'Sales Manager',
        contactId: deal.contact_id_c?.Id || deal.contact_id_c || null,
        createdAt: deal.CreatedOn
      };
    } catch (error) {
      console.error(`Error fetching deal ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(dealData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          title_c: dealData.title || '',
          value_c: parseFloat(dealData.value) || 0,
          stage_c: dealData.stage || 'prospect',
          probability_c: parseInt(dealData.probability) || 25,
          expected_close_date_c: dealData.expectedCloseDate || '',
          assigned_to_c: dealData.assignedTo || 'Sales Manager',
          contact_id_c: parseInt(dealData.contactId) || null
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to create deal: ${response.message}`);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} deals:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const createdDeal = successful[0].data;
          return {
            Id: createdDeal.Id,
            title: createdDeal.title_c || '',
            value: createdDeal.value_c || 0,
            stage: createdDeal.stage_c || 'prospect',
            probability: createdDeal.probability_c || 25,
            expectedCloseDate: createdDeal.expected_close_date_c || '',
            assignedTo: createdDeal.assigned_to_c || 'Sales Manager',
            contactId: createdDeal.contact_id_c?.Id || createdDeal.contact_id_c || null,
            createdAt: createdDeal.CreatedOn
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating deal:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, dealData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Id: parseInt(id),
          title_c: dealData.title || '',
          value_c: parseFloat(dealData.value) || 0,
          stage_c: dealData.stage || 'prospect',
          probability_c: parseInt(dealData.probability) || 25,
          expected_close_date_c: dealData.expectedCloseDate || '',
          assigned_to_c: dealData.assignedTo || 'Sales Manager',
          contact_id_c: parseInt(dealData.contactId) || null
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to update deal: ${response.message}`);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} deals:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updatedDeal = successful[0].data;
          return {
            Id: updatedDeal.Id,
            title: updatedDeal.title_c || '',
            value: updatedDeal.value_c || 0,
            stage: updatedDeal.stage_c || 'prospect',
            probability: updatedDeal.probability_c || 25,
            expectedCloseDate: updatedDeal.expected_close_date_c || '',
            assignedTo: updatedDeal.assigned_to_c || 'Sales Manager',
            contactId: updatedDeal.contact_id_c?.Id || updatedDeal.contact_id_c || null,
            createdAt: updatedDeal.CreatedOn
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating deal:", error?.response?.data?.message || error);
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
        console.error(`Failed to delete deal: ${response.message}`);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} deals:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length === 1;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting deal:", error?.response?.data?.message || error);
      return false;
    }
  }
}

export const dealService = new DealService();