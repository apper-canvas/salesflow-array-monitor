import { toast } from 'react-toastify';

class ContactService {
  constructor() {
    this.tableName = 'contact_c';
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
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "last_contacted_at_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to fetch contacts: ${response.message}`);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(contact => ({
        Id: contact.Id,
name: contact.name_c || contact.Name || '',
        email: contact.email_c || '',
        phone: contact.phone_c || '',
        company: contact.company_c || null,
        tags: contact.tags_c ? contact.tags_c.split(',').map(tag => tag.trim()) : [],
        notes: contact.notes_c || '',
        lastContactedAt: contact.last_contacted_at_c || null,
        createdAt: contact.CreatedOn
      }));
    } catch (error) {
      console.error("Error fetching contacts:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "last_contacted_at_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.data) {
        return null;
      }

      const contact = response.data;
return {
        Id: contact.Id,
        name: contact.name_c || contact.Name || '',
        email: contact.email_c || '',
        phone: contact.phone_c || '',
        company: contact.company_c || null,
        tags: contact.tags_c ? contact.tags_c.split(',').map(tag => tag.trim()) : [],
        notes: contact.notes_c || '',
        lastContactedAt: contact.last_contacted_at_c || null,
        createdAt: contact.CreatedOn
      };
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(contactData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
const params = {
        records: [{
          Name: contactData.name || '',
          name_c: contactData.name || '',
          email_c: contactData.email || '',
          phone_c: contactData.phone || '',
          company_c: contactData.company?.Id || null,
          tags_c: Array.isArray(contactData.tags) ? contactData.tags.join(',') : (contactData.tags || ''),
          notes_c: contactData.notes || '',
          last_contacted_at_c: contactData.lastContactedAt || null
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to create contact: ${response.message}`);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} contacts:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const createdContact = successful[0].data;
          return {
            Id: createdContact.Id,
            name: createdContact.name_c || createdContact.Name || '',
email: createdContact.email_c || '',
            phone: createdContact.phone_c || '',
            company: createdContact.company_c || null,
            tags: createdContact.tags_c ? createdContact.tags_c.split(',').map(tag => tag.trim()) : [],
            notes: createdContact.notes_c || '',
            lastContactedAt: createdContact.last_contacted_at_c || null,
            createdAt: createdContact.CreatedOn
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating contact:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, contactData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
records: [{
          Id: parseInt(id),
          Name: contactData.name || '',
          name_c: contactData.name || '',
          email_c: contactData.email || '',
          phone_c: contactData.phone || '',
          company_c: contactData.company?.Id || null,
          tags_c: Array.isArray(contactData.tags) ? contactData.tags.join(',') : (contactData.tags || ''),
          notes_c: contactData.notes || '',
          last_contacted_at_c: contactData.lastContactedAt || null
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to update contact: ${response.message}`);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} contacts:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updatedContact = successful[0].data;
          return {
            Id: updatedContact.Id,
            name: updatedContact.name_c || updatedContact.Name || '',
email: updatedContact.email_c || '',
            phone: updatedContact.phone_c || '',
            company: updatedContact.company_c || null,
            tags: updatedContact.tags_c ? updatedContact.tags_c.split(',').map(tag => tag.trim()) : [],
            notes: updatedContact.notes_c || '',
            lastContactedAt: updatedContact.last_contacted_at_c || null,
            createdAt: updatedContact.CreatedOn
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating contact:", error?.response?.data?.message || error);
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
        console.error(`Failed to delete contact: ${response.message}`);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} contacts:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length === 1;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting contact:", error?.response?.data?.message || error);
      return false;
    }
  }
}

export const contactService = new ContactService();